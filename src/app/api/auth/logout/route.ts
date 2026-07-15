import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("customer_session");

    return NextResponse.json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error: any) {
    console.error("Logout Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
