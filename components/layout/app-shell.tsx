import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

type AppShellProps = {
  children: React.ReactNode;
  activePath?: string;
};

export function AppShell({ children, activePath }: AppShellProps) {
  return (
    <>
      <SiteHeader activePath={activePath} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}
