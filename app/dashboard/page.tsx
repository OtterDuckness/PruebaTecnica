import type { Metadata } from "next";
import Image from "next/image";
import { PageContainer } from "@/components/layout/page-container";
import { ButtonLink } from "@/components/ui/button-link";
import type { SessionData } from "@auth0/nextjs-auth0/types";
import { auth0 } from "@/lib/auth0";
import {
  debugLogSessionForGmail,
  isGmailDebugEnabled,
} from "@/lib/gmail-debug";
import { fetchRecentEmails } from "@/lib/gmail";
import { getGoogleAccessTokenForGmail } from "@/lib/google-access-token";
import { AUTH_ROUTES } from "@/lib/constants";
import type { GmailFetchResult } from "@/types/gmail";

export const metadata: Metadata = {
  title: "Dashboard",
};

async function loadGmailPreviews(
  session: SessionData | null,
): Promise<GmailFetchResult> {
  if (isGmailDebugEnabled()) {
    console.log("[GmailDebug] loadGmailPreviews: starting (dashboard server)");
  }

  if (!session) {
    return {
      ok: false,
      error: "No active session. Please sign in again.",
    };
  }

  debugLogSessionForGmail(session);

  const tokenResult = await getGoogleAccessTokenForGmail(session);

  if (isGmailDebugEnabled()) {
    console.log("[GmailDebug] Google provider token resolution", {
      ok: tokenResult.ok,
      source: tokenResult.ok ? tokenResult.source : "none",
      tokenPresent: tokenResult.ok ? tokenResult.token.length > 0 : false,
      tokenLength: tokenResult.ok ? tokenResult.token.length : 0,
    });
  }

  if (!tokenResult.ok) {
    return { ok: false, error: tokenResult.error };
  }

  return fetchRecentEmails(tokenResult.token);
}

export default async function DashboardPage() {
  const session = await auth0.getSession();
  const user = session?.user;
  const gmail = await loadGmailPreviews(session);

  return (
    <PageContainer>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Dashboard
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Recent messages from your Gmail inbox.
          </p>
        </div>
        <ButtonLink href={AUTH_ROUTES.logout} variant="secondary">
          Log out
        </ButtonLink>
      </div>

      {user ? (
        <section className="mt-8 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
          <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Signed in as
          </h2>
          <div className="mt-4 flex items-center gap-4">
            {user.picture ? (
              <Image
                src={user.picture}
                alt=""
                width={48}
                height={48}
                className="h-12 w-12 rounded-full object-cover"
                unoptimized
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                {(user.name?.[0] ?? user.email?.[0] ?? "?").toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate font-medium text-zinc-900 dark:text-zinc-50">
                {user.name ?? "User"}
              </p>
              {user.email ? (
                <p className="truncate text-sm text-zinc-600 dark:text-zinc-400">
                  {user.email}
                </p>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      <section className="mt-8">
        <h2 className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
          Recent emails
        </h2>

        {!gmail.ok ? (
          <div
            role="alert"
            className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200"
          >
            <p className="font-medium">Unable to load Gmail messages</p>
            <p className="mt-1 text-amber-800 dark:text-amber-300">{gmail.error}</p>
          </div>
        ) : gmail.emails.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
            No messages found in your inbox.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-zinc-200 rounded-xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
            {gmail.emails.map((email) => (
              <li key={email.id} className="p-4 sm:p-5">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                  <p className="font-medium text-zinc-900 dark:text-zinc-50">
                    {email.subject}
                  </p>
                  {email.date ? (
                    <time className="shrink-0 text-xs text-zinc-500 dark:text-zinc-400">
                      {email.date}
                    </time>
                  ) : null}
                </div>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {email.sender}
                </p>
                {email.snippet ? (
                  <p className="mt-2 line-clamp-2 text-sm text-zinc-500 dark:text-zinc-500">
                    {email.snippet}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </PageContainer>
  );
}
