import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "ls_collections_secret_fallback";

// Strong password regex: 8+ chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
const STRENGTH_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { firstName, lastName, email, mobile, password, confirmPassword } = body;

    // Required fields check
    if (!firstName || !lastName || !email || !mobile || !password || !confirmPassword) {
      return NextResponse.json(
        { success: false, message: "All fields are required." },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    // Password matches confirmation
    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: "Passwords do not match." },
        { status: 400 }
      );
    }

    // Password strength check
    if (!STRENGTH_REGEX.test(password)) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
        },
        { status: 400 }
      );
    }

    // Check unique email
    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return NextResponse.json(
        { success: false, message: "An account with this email already exists." },
        { status: 400 }
      );
    }

    // Check unique mobile number
    const existingMobile = await User.findOne({ mobile });
    if (existingMobile) {
      return NextResponse.json(
        { success: false, message: "An account with this mobile number already exists." },
        { status: 400 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create User
    const name = `${firstName} ${lastName}`;
    const newUser = await User.create({
      name,
      firstName,
      lastName,
      email: email.toLowerCase(),
      mobile,
      passwordHash,
      role: "user", // Keep role = "user" for customers as requested
      status: "active",
    });

    // Create JWT token
    const token = jwt.sign(
      { userId: newUser._id.toString(), email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set("customer_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json({
      success: true,
      message: "Registration successful.",
      user: {
        id: newUser._id.toString(),
        name: newUser.name,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        mobile: newUser.mobile,
        role: newUser.role,
      },
    });
  } catch (error: any) {
    console.error("Registration Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
