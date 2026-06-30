import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const protectedPrefixes = ["/dashboard", "/settings", "/admin"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = getSessionCookie(request);

  const isProtected = protectedPrefixes.some((p) => pathname.startsWith(p));

  // Not signed in → bounce to sign-in
  if (isProtected && !sessionCookie) {
    const url = new URL("/sign-in", request.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // Already signed in → keep away from auth pages
  if (sessionCookie && ["/sign-in", "/sign-up"].includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/settings/:path*", "/admin/:path*", "/sign-in", "/sign-up"],
};
