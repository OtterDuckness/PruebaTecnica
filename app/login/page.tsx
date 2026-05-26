import type { Metadata } from "next";
import Link from "next/link";
import { AuthLayout } from "@/components/layout/auth-layout";
import { ButtonLink } from "@/components/ui/button-link";
import { authLoginUrl, ROUTES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Login",
};

type LoginPageProps = {
  searchParams: Promise<{ returnTo?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { returnTo } = await searchParams;
  const destination = returnTo ?? ROUTES.dashboard;
  const signInHref = authLoginUrl(destination);

  return (
    <AuthLayout
      title="Sign in"
      description="Continue with Google through Auth0 to access your dashboard."
    >
      <ButtonLink href={signInHref} className="w-full">
        Continue with Google
      </ButtonLink>

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
