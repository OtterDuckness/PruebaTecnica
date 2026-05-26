import { AppShell } from "@/components/layout/app-shell";
import { PageContainer } from "@/components/layout/page-container";
import { ButtonLink } from "@/components/ui/button-link";
import { APP_NAME, ROUTES } from "@/lib/constants";

export default function Home() {
  return (
    <AppShell activePath={ROUTES.home}>
      <PageContainer className="flex flex-col items-center py-16 text-center sm:py-24">
        <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
          Internship technical assignment
        </p>
        <h1 className="mt-3 max-w-xl text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
          Welcome to {APP_NAME}
        </h1>
        <p className="mt-4 max-w-lg text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          A minimal Next.js foundation with placeholder pages and shared layout
          components. Ready for Auth0, Gmail API, and business logic in later
          steps.
        </p>
        <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <ButtonLink href={ROUTES.dashboard}>Go to dashboard</ButtonLink>
          <ButtonLink href={ROUTES.login} variant="secondary">
            Sign in
          </ButtonLink>
        </div>
      </PageContainer>
    </AppShell>
  );
}
