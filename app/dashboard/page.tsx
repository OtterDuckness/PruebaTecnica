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
import { buildGmailDateSearchQuery, fetchRecentEmails } from "@/lib/gmail";
import {
  formatEmailSummaryForStorage,
  generateEmailSummary,
} from "@/lib/anthropic";
import { getGoogleAccessTokenForGmail } from "@/lib/google-access-token";
import { prisma } from "@/lib/prisma";
import { AUTH_ROUTES, ROUTES } from "@/lib/constants";
import type { GmailFetchResult } from "@/types/gmail";

export const metadata: Metadata = {
  title: "Dashboard",
};

async function loadGmailPreviews(
  session: SessionData | null,
  from?: string,
  to?: string,
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

  const q = buildGmailDateSearchQuery(from, to);
  return fetchRecentEmails(tokenResult.token, undefined, q);
}

type DashboardPageProps = {
  searchParams: Promise<{
    from?: string | string[];
    to?: string | string[];
  }>;
};

function queryParam(value: string | string[] | undefined): string | undefined {
  return typeof value === "string" ? value : value?.[0];
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = await searchParams;
  const from = queryParam(params.from);
  const to = queryParam(params.to);
  const session = await auth0.getSession();
  const user = session?.user;
  const gmail = await loadGmailPreviews(session, from, to);
  const emailSummary =
    gmail.ok && gmail.emails.length > 0
      ? await generateEmailSummary(gmail.emails)
      : null;

  if (emailSummary) {
    try {
      await prisma.summaryHistory.create({
        data: {
          summary: formatEmailSummaryForStorage(emailSummary),
          fromDate: from ?? null,
          toDate: to ?? null,
        },
      });
    } catch (error) {
      console.error(
        "[SummaryHistory] save failed:",
        error instanceof Error ? error.message : error,
      );
    }
  }

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
        <div className="flex flex-wrap gap-2">
          <ButtonLink href={ROUTES.summaryHistory} variant="ghost">
            View Summary History
          </ButtonLink>
          <ButtonLink href={AUTH_ROUTES.logout} variant="secondary">
            Log out
          </ButtonLink>
        </div>
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

        <form
          method="get"
          className="mt-4 flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 sm:flex-row sm:flex-wrap sm:items-end sm:gap-4 sm:p-5"
        >
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">From</span>
            <input
              type="date"
              name="from"
              defaultValue={from ?? ""}
              className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">To</span>
            <input
              type="date"
              name="to"
              defaultValue={to ?? ""}
              className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
            />
          </label>
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400"
          >
            Filter
          </button>
        </form>

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
          <>
            <section className="mt-4 rounded-xl border border-indigo-200 bg-indigo-50/80 p-4 dark:border-indigo-900/50 dark:bg-indigo-950/30 sm:p-5">
              <h3 className="text-sm font-medium text-indigo-900 dark:text-indigo-200">
                AI summary
              </h3>
              {emailSummary ? (
                <>
                  <p className="mt-2 text-sm leading-relaxed text-indigo-950 dark:text-indigo-100">
                    {emailSummary.summary}
                  </p>
                  {emailSummary.actionItems ? (
                    <div className="mt-4 border-t border-indigo-200/80 pt-4 dark:border-indigo-800/50">
                      <h4 className="text-sm font-medium text-indigo-900 dark:text-indigo-200">
                        Action items
                      </h4>
                      <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-indigo-950 dark:text-indigo-100">
                        {emailSummary.actionItems}
                      </p>
                    </div>
                  ) : null}
                </>
              ) : (
                <p className="mt-2 text-sm text-indigo-800/70 dark:text-indigo-300/70">
                  AI summary is temporarily unavailable.
                </p>
              )}
            </section>

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
          </>
        )}
      </section>
    </PageContainer>
  );
}
