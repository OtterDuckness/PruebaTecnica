import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/page-container";
import { ButtonLink } from "@/components/ui/button-link";
import { prisma } from "@/lib/prisma";
import { ROUTES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Summary history",
};

const SUMMARY_PREVIEW_MAX = 240;

function formatTimestamp(date: Date): string {
  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatDateRange(fromDate: string | null, toDate: string | null): string {
  if (fromDate && toDate) {
    return `${fromDate} to ${toDate}`;
  }
  if (fromDate) {
    return `From ${fromDate}`;
  }
  if (toDate) {
    return `Until ${toDate}`;
  }
  return "Recent inbox (no date filter)";
}

function truncateSummary(text: string): string {
  if (text.length <= SUMMARY_PREVIEW_MAX) {
    return text;
  }
  return `${text.slice(0, SUMMARY_PREVIEW_MAX).trimEnd()}…`;
}

export default async function SummaryHistoryPage() {
  let entries: Awaited<
    ReturnType<typeof prisma.summaryHistory.findMany>
  > = [];
  let loadError: string | null = null;

  try {
    entries = await prisma.summaryHistory.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error(
      "[SummaryHistory] load failed:",
      error instanceof Error ? error.message : error,
    );
    loadError = "Unable to load saved summaries. Please try again later.";
  }

  return (
    <PageContainer>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Summary history
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Saved AI summaries from your inbox reviews.
          </p>
        </div>
        <ButtonLink href={ROUTES.dashboard} variant="secondary">
          Back to dashboard
        </ButtonLink>
      </div>

      <section className="mt-8">
        {loadError ? (
          <div
            role="alert"
            className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200"
          >
            <p className="font-medium">Unable to load summary history</p>
            <p className="mt-1 text-amber-800 dark:text-amber-300">{loadError}</p>
          </div>
        ) : entries.length === 0 ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            No summaries saved yet.
          </p>
        ) : (
          <ul className="space-y-4">
            {entries.map((entry) => (
              <li
                key={entry.id}
                className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 sm:p-5"
              >
                <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                  <time
                    dateTime={entry.createdAt.toISOString()}
                    className="text-sm font-medium text-zinc-900 dark:text-zinc-50"
                  >
                    {formatTimestamp(entry.createdAt)}
                  </time>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {formatDateRange(entry.fromDate, entry.toDate)}
                  </p>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                  {truncateSummary(entry.summary)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </PageContainer>
  );
}
