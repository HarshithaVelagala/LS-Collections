import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    const adminEmail = process.env.ADMIN_EMAIL || "admin@ls.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

    if (email === adminEmail && password === adminPassword) {
      const cookieStore = await cookies();
      cookieStore.set("admin_session", "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24, // 1 day
      });

      return NextResponse.json({ success: true, message: "Authentication successful." });
    }

    return NextResponse.json(
      { success: false, message: "Invalid email or password." },
      { status: 401 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Server error.", error: error.message },
      { status: 500 }
    );
  }
}
