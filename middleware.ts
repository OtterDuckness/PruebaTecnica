import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { ROUTES } from "@/lib/constants";

export async function middleware(request: NextRequest) {
  const authRes = await auth0.middleware(request);

  if (request.nextUrl.pathname.startsWith("/auth")) {
    return authRes;
  }

  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    const session = await auth0.getSession(request);

    if (!session) {
      const loginUrl = new URL(ROUTES.login, request.url);
      loginUrl.searchParams.set("returnTo", request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return authRes;
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
};
