import { GOOGLE_OAUTH2_PROVIDER } from "@/lib/constants";
import { debugLogManagementApiUser, isGmailDebugEnabled } from "@/lib/gmail-debug";

type ManagementIdentity = {
  provider?: string;
  connection?: string;
  access_token?: string;
};

export type ManagementUser = {
  user_id: string;
  identities?: ManagementIdentity[];
};

type ManagementConfig = {
  domain: string;
  clientId: string;
  clientSecret: string;
};

let cachedManagementToken: { token: string; expiresAt: number } | null = null;

function getManagementConfig(): ManagementConfig | null {
  const domain = process.env.AUTH0_DOMAIN;
  const clientId =
    process.env.AUTH0_MANAGEMENT_CLIENT_ID ?? process.env.AUTH0_CLIENT_ID;
  const clientSecret =
    process.env.AUTH0_MANAGEMENT_CLIENT_SECRET ??
    process.env.AUTH0_CLIENT_SECRET;

  if (!domain || !clientId || !clientSecret) {
    return null;
  }

  return { domain, clientId, clientSecret };
}

async function getManagementAccessToken(): Promise<string> {
  const config = getManagementConfig();
  if (!config) {
    throw new Error(
      "Auth0 Management API is not configured (AUTH0_DOMAIN and Management API credentials).",
    );
  }

  const now = Math.floor(Date.now() / 1000);
  if (cachedManagementToken && cachedManagementToken.expiresAt > now + 60) {
    return cachedManagementToken.token;
  }

  const tokenRes = await fetch(`https://${config.domain}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      audience: `https://${config.domain}/api/v2/`,
      grant_type: "client_credentials",
    }),
    cache: "no-store",
  });

  if (!tokenRes.ok) {
    if (isGmailDebugEnabled()) {
      console.log("[GmailDebug] Management API token request failed", {
        status: tokenRes.status,
      });
    }
    throw new Error(
      `Management API authentication failed (${tokenRes.status}). Use an M2M application with read:users and read:user_idp_tokens.`,
    );
  }

  const tokenData = (await tokenRes.json()) as {
    access_token: string;
    expires_in?: number;
  };

  cachedManagementToken = {
    token: tokenData.access_token,
    expiresAt: now + (tokenData.expires_in ?? 86400),
  };

  if (isGmailDebugEnabled()) {
    console.log("[GmailDebug] Management API token acquired", {
      success: true,
      expiresInSeconds: tokenData.expires_in ?? null,
    });
  }

  return cachedManagementToken.token;
}

export async function getAuth0UserById(userId: string): Promise<ManagementUser> {
  const config = getManagementConfig();
  if (!config) {
    throw new Error(
      "Auth0 Management API is not configured (AUTH0_DOMAIN and Management API credentials).",
    );
  }

  const managementToken = await getManagementAccessToken();
  const userRes = await fetch(
    `https://${config.domain}/api/v2/users/${encodeURIComponent(userId)}`,
    {
      headers: { Authorization: `Bearer ${managementToken}` },
      cache: "no-store",
    },
  );

  if (!userRes.ok) {
    if (isGmailDebugEnabled()) {
      const body = await userRes.clone().text();
      console.log("[GmailDebug] Management API get user failed", {
        status: userRes.status,
        userIdPresent: Boolean(userId),
        bodyPreview: body.slice(0, 200),
      });
    }
    throw new Error(`Management API user lookup failed (${userRes.status}).`);
  }

  const user = (await userRes.json()) as ManagementUser;

  if (isGmailDebugEnabled()) {
    console.log("[GmailDebug] Management API get user success", {
      success: true,
      userId: user.user_id,
    });
  }

  debugLogManagementApiUser(user);

  return user;
}

export async function getGoogleAccessTokenFromManagementApi(
  userId: string,
): Promise<string | null> {
  const user = await getAuth0UserById(userId);
  const identities = user.identities ?? [];

  const googleIdentity = identities.find(
    (identity) =>
      identity.provider === GOOGLE_OAUTH2_PROVIDER ||
      identity.connection === GOOGLE_OAUTH2_PROVIDER,
  );

  return googleIdentity?.access_token ?? null;
}
