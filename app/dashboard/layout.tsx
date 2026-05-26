import { AppShell } from "@/components/layout/app-shell";
import { ROUTES } from "@/lib/constants";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AppShell activePath={ROUTES.dashboard}>{children}</AppShell>;
}
