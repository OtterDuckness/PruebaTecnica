import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/page-container";

export const metadata: Metadata = {
  title: "Dashboard",
};

const placeholders = [
  { title: "Overview", description: "Summary metrics will appear here." },
  { title: "Activity", description: "Recent events and updates." },
  { title: "Settings", description: "Account preferences (future)." },
];

export default function DashboardPage() {
  return (
    <PageContainer>
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Dashboard
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Placeholder workspace. Authentication and data integrations are not
          wired up yet.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {placeholders.map((card) => (
          <article
            key={card.title}
            className="rounded-xl border border-dashed border-zinc-300 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900"
          >
            <h2 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {card.title}
            </h2>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              {card.description}
            </p>
          </article>
        ))}
      </div>
    </PageContainer>
  );
}
