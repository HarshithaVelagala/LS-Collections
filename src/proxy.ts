import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin routes (excluding /admin/login)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const adminSession = request.cookies.get("admin_session")?.value;

    if (adminSession !== "authenticated") {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect Admin APIs (excluding the auth login API)
  if (pathname.startsWith("/api/admin") && pathname !== "/api/admin/auth/login") {
    const adminSession = request.cookies.get("admin_session")?.value;
    if (adminSession !== "authenticated") {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Unauthorized administrative access required." }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  // Protect Customer Profile route
  if (pathname === "/profile") {
    const customerSession = request.cookies.get("customer_session")?.value;
    if (!customerSession) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect authenticated customers away from login/register pages
  if (pathname === "/login" || pathname === "/register") {
    const customerSession = request.cookies.get("customer_session")?.value;
    if (customerSession) {
      const profileUrl = new URL("/profile", request.url);
      return NextResponse.redirect(profileUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/profile", "/login", "/register"],
};
