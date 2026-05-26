import { APP_NAME } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-zinc-200 py-6 dark:border-zinc-800">
      <div className="mx-auto max-w-5xl px-4 text-center text-sm text-zinc-500 sm:px-6 lg:px-8">
        <p>
          {APP_NAME} — technical assignment foundation. Auth and integrations
          coming later.
        </p>
      </div>
    </footer>
  );
}
