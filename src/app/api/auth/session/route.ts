import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "ls_collections_secret_fallback";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("customer_session")?.value;

    if (!token) {
      return NextResponse.json({ success: false, user: null });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      // Invalid or expired token
      return NextResponse.json({ success: false, user: null });
    }

    await connectDB();
    const user = await User.findById(decoded.userId).lean();

    if (!user || user.status !== "active") {
      return NextResponse.json({ success: false, user: null });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        firstName: user.firstName || user.name.split(" ")[0],
        lastName: user.lastName || user.name.split(" ").slice(1).join(" "),
        email: user.email,
        mobile: user.mobile,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error("Session fetch error:", error);
    return NextResponse.json({ success: false, user: null });
  }
}
