import { Auth0Client } from "@auth0/nextjs-auth0/server";

/** Preserved for future Gmail API integration via Google access token. */
const GMAIL_READONLY_SCOPE =
  "https://www.googleapis.com/auth/gmail.readonly";

export const auth0 = new Auth0Client({
  authorizationParameters: {
    scope: `openid profile email ${GMAIL_READONLY_SCOPE}`,
  },
});
