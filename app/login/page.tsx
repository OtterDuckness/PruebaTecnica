import type { Metadata } from "next";
import Link from "next/link";
import { AuthLayout } from "@/components/layout/auth-layout";
import { ROUTES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <AuthLayout
      title="Sign in"
      description="Placeholder login screen. Auth0 will be added in a later step."
    >
      <div
        role="status"
        className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200"
      >
        Authentication is not implemented yet.
      </div>

      <form className="space-y-4" aria-label="Sign in (placeholder)">
        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            disabled
            placeholder="you@example.com"
            className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800"
          />
        </div>
        <div className="space-y-1.5">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            disabled
            placeholder="••••••••"
            className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800"
          />
        </div>
        <button
          type="button"
          disabled
          className="w-full cursor-not-allowed rounded-lg bg-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400"
        >
          Sign in (coming soon)
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-500">
        <Link
          href={ROUTES.home}
          className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
        >
          Back to home
        </Link>
      </p>
    </AuthLayout>
  );
}
