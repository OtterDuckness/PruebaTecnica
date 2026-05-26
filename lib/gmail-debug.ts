/** TEMP: enable with GMAIL_DEBUG=true in .env.local — remove before production. */

const PREFIX = "[GmailDebug]";

export function isGmailDebugEnabled(): boolean {
  return process.env.GMAIL_DEBUG === "true";
}

function log(label: string, data: Record<string, unknown>): void {
  if (!isGmailDebugEnabled()) return;
  console.log(`${PREFIX} ${label}`, data);
}

function redactValue(key: string, value: unknown): unknown {
  const lower = key.toLowerCase();
  if (
    lower.includes("token") ||
    lower.includes("secret") ||
    lower.includes("authorization")
  ) {
    if (typeof value === "string") {
      return value ? `[redacted, length=${value.length}]` : value;
    }
    return "[redacted]";
  }
  return value;
}

function sanitizeForLog(value: unknown): unknown {
  if (value === null || value === undefined) return value;
  if (typeof value === "string") {
    return value.length > 800 ? `${value.slice(0, 800)}…` : value;
  }
  if (Array.isArray(value)) {
    return value.map(sanitizeForLog);
  }
  if (typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = sanitizeForLog(redactValue(k, v));
    }
    return out;
  }
  return value;
}

type IdentityLike = {
  provider?: string;
  connection?: string;
  access_token?: string;
  accessToken?: string;
};

export function debugLogSessionForGmail(session: unknown): void {
  if (!isGmailDebugEnabled()) return;

  if (!session || typeof session !== "object") {
    log("session inspect", { sessionPresent: false });
    return;
  }

  const data = session as Record<string, unknown>;
  const user =
    data.user && typeof data.user === "object"
      ? (data.user as Record<string, unknown>)
      : null;

  const userKeys = user ? Object.keys(user) : [];
  const identities = user?.identities;

  const identitySummary = Array.isArray(identities)
    ? (identities as IdentityLike[]).map((identity) => {
        const token = identity.access_token ?? identity.accessToken;
        return {
          provider: identity.provider ?? null,
          connection: identity.connection ?? null,
          accessTokenPresent: Boolean(token?.length),
          accessTokenLength: token?.length ?? 0,
        };
      })
    : null;

  const connectionTokenSets = data.connectionTokenSets;
  const connectionSummary = Array.isArray(connectionTokenSets)
    ? connectionTokenSets.map((entry) => {
        const row = entry as Record<string, unknown>;
        const token = row.accessToken;
        const tokenStr = typeof token === "string" ? token : undefined;
        return {
          connection: row.connection ?? null,
          accessTokenPresent: Boolean(tokenStr?.length),
          accessTokenLength: tokenStr?.length ?? 0,
          scope: row.scope ?? null,
          expiresAt: row.expiresAt ?? null,
        };
      })
    : null;

  const primaryTokenSet =
    data.tokenSet && typeof data.tokenSet === "object"
      ? (data.tokenSet as Record<string, unknown>)
      : null;

  log("session inspect", {
    sessionTopLevelKeys: Object.keys(data),
    userKeys,
    userSub: user?.sub ?? null,
    identitiesIsArray: Array.isArray(identities),
    identityCount: Array.isArray(identities) ? identities.length : 0,
    identities: identitySummary,
    connectionTokenSetCount: Array.isArray(connectionTokenSets)
      ? connectionTokenSets.length
      : 0,
    connectionTokenSets: connectionSummary,
    primaryTokenSetAudience: primaryTokenSet?.audience ?? null,
    primaryTokenSetScope: primaryTokenSet?.scope ?? null,
    primaryAccessTokenPresent: Boolean(
      typeof primaryTokenSet?.accessToken === "string" &&
        primaryTokenSet.accessToken.length > 0,
    ),
    primaryAccessTokenLength:
      typeof primaryTokenSet?.accessToken === "string"
        ? primaryTokenSet.accessToken.length
        : 0,
  });
}

type ManagementIdentityLike = {
  provider?: string;
  connection?: string;
  access_token?: string;
};

export function debugLogManagementApiUser(user: {
  user_id?: string;
  identities?: ManagementIdentityLike[];
}): void {
  if (!isGmailDebugEnabled()) return;

  const identities = user.identities ?? [];

  log("Management API user identities", {
    success: true,
    userId: user.user_id ?? null,
    identityCount: identities.length,
    providers: identities.map((identity) => ({
      provider: identity.provider ?? null,
      connection: identity.connection ?? null,
      accessTokenPresent: Boolean(identity.access_token?.length),
      accessTokenLength: identity.access_token?.length ?? 0,
    })),
    googleAccessTokenPresent: identities.some(
      (identity) =>
        (identity.provider === "google-oauth2" ||
          identity.connection === "google-oauth2") &&
        Boolean(identity.access_token?.length),
    ),
  });
}

export async function debugLogGmailApiResponse(
  step: string,
  res: Response,
): Promise<void> {
  if (!isGmailDebugEnabled()) return;

  const bodyText = await res.clone().text();
  let body: unknown = bodyText;

  try {
    body = JSON.parse(bodyText);
  } catch {
    // keep truncated text
  }

  log(`Gmail API: ${step}`, {
    status: res.status,
    statusText: res.statusText,
    ok: res.ok,
    is401: res.status === 401,
    is403: res.status === 403,
    body: sanitizeForLog(body),
  });
}
