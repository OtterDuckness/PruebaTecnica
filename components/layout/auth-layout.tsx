import Link from "next/link";
import { APP_NAME, ROUTES } from "@/lib/constants";
import { PageContainer } from "@/components/layout/page-container";

type AuthLayoutProps = {
  children: React.ReactNode;
  title: string;
  description?: string;
};

export function AuthLayout({ children, title, description }: AuthLayoutProps) {
  return (
    <div className="flex min-h-full flex-col items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-zinc-950">
      <PageContainer narrow className="py-0">
        <div className="mb-8 text-center">
          <Link
            href={ROUTES.home}
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
          >
            {APP_NAME}
          </Link>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {title}
          </h1>
          {description ? (
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              {description}
            </p>
          ) : null}
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
          {children}
        </div>
      </PageContainer>
    </div>
  );
}
