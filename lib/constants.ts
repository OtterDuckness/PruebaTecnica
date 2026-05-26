export const APP_NAME = "ImpactIQ";

export const GOOGLE_OAUTH2_PROVIDER = "google-oauth2";

export const ROUTES = {
  home: "/",
  dashboard: "/dashboard",
  summaryHistory: "/dashboard/history",
  login: "/login",
} as const;

export const AUTH_ROUTES = {
  login: "/auth/login",
  logout: "/auth/logout",
} as const;

export function authLoginUrl(returnTo: string = ROUTES.dashboard): string {
  return `${AUTH_ROUTES.login}?returnTo=${encodeURIComponent(returnTo)}`;
}
