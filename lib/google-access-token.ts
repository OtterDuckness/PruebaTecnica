import type { SessionData } from "@auth0/nextjs-auth0/types";
import { getGoogleAccessTokenFromManagementApi } from "@/lib/auth0-management";
import { GOOGLE_OAUTH2_PROVIDER } from "@/lib/constants";
import { isGmailDebugEnabled } from "@/lib/gmail-debug";

export { GOOGLE_OAUTH2_PROVIDER };

type Auth0Identity = {
  provider?: string;
  connection?: string;
  access_token?: string;
  accessToken?: string;
};

export type GoogleAccessTokenResult =
  | { ok: true; token: string; source: "session" | "management-api" }
  | { ok: false; error: string };

/** Fast path when App Router session exposes provider tokens (often unavailable). */
export function getGoogleAccessTokenFromSession(
  session: SessionData,
): string | null {
  const fromConnection = session.connectionTokenSets?.find(
    (entry) => entry.connection === GOOGLE_OAUTH2_PROVIDER,
  )?.accessToken;

  if (fromConnection) {
    return fromConnection;
  }

  const identities = session.user?.identities as Auth0Identity[] | undefined;

  if (Array.isArray(identities)) {
    const googleIdentity = identities.find(
      (identity) =>
        identity.provider === GOOGLE_OAUTH2_PROVIDER ||
        identity.connection === GOOGLE_OAUTH2_PROVIDER,
    );

    const token =
      googleIdentity?.access_token ?? googleIdentity?.accessToken ?? null;

    if (token) {
      return token;
    }
  }

  return null;
}

/**
 * Resolves the Google OAuth access token for Gmail API calls.
 * Falls back to Auth0 Management API (user identities) when the session omits provider tokens.
 */
export async function getGoogleAccessTokenForGmail(
  session: SessionData,
): Promise<GoogleAccessTokenResult> {
  const fromSession = getGoogleAccessTokenFromSession(session);
  if (fromSession) {
    return { ok: true, token: fromSession, source: "session" };
  }

  const userId = session.user?.sub;
  if (!userId) {
    return { ok: false, error: "No user id in session. Please sign in again." };
  }

  try {
    const fromManagement = await getGoogleAccessTokenFromManagementApi(userId);

    if (isGmailDebugEnabled()) {
      console.log("[GmailDebug] Google token via Management API", {
        tokenPresent: Boolean(fromManagement?.length),
        tokenLength: fromManagement?.length ?? 0,
      });
    }

    if (!fromManagement) {
      return {
        ok: false,
        error:
          "No Google access token on Auth0 user profile. Sign out, sign in with Google again, and ensure Auth0 stores provider tokens.",
      };
    }

    return { ok: true, token: fromManagement, source: "management-api" };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to retrieve Google token from Auth0 Management API.";

    if (isGmailDebugEnabled()) {
      console.log("[GmailDebug] Management API error", { message });
    }

    return { ok: false, error: message };
  }
}
