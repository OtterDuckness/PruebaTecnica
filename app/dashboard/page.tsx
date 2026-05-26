import type { Metadata } from "next";
import Image from "next/image";
import { PageContainer } from "@/components/layout/page-container";
import { ButtonLink } from "@/components/ui/button-link";
import { auth0 } from "@/lib/auth0";
import { AUTH_ROUTES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Dashboard",
};

const placeholders = [
  { title: "Overview", description: "Summary metrics will appear here." },
  { title: "Activity", description: "Recent events and updates." },
  { title: "Settings", description: "Account preferences (future)." },
];

export default async function DashboardPage() {
  const session = await auth0.getSession();
  const user = session?.user;

  return (
    <PageContainer>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Dashboard
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            You are signed in. Gmail integration will be added in a later step.
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
              {user.sub ? (
                <p className="mt-1 truncate font-mono text-xs text-zinc-500">
                  {user.sub}
                </p>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

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
