import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Coupon from "@/models/Coupon";

export async function POST(req: Request) {
  try {
    const { code, cartTotal } = await req.json();

    if (!code || !cartTotal) {
      return NextResponse.json(
        { success: false, message: "Missing required verification fields." },
        { status: 400 }
      );
    }

    await connectDB();

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      isActive: true,
    });

    if (!coupon) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired coupon code." },
        { status: 404 }
      );
    }

    // Check expiry
    if (new Date() > new Date(coupon.expiryDate)) {
      return NextResponse.json(
        { success: false, message: "This coupon code has expired." },
        { status: 400 }
      );
    }

    // Check usage limits
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return NextResponse.json(
        { success: false, message: "This coupon limit has been fully utilized." },
        { status: 400 }
      );
    }

    // Check minimum purchase requirements
    if (cartTotal < coupon.minPurchase) {
      return NextResponse.json(
        {
          success: false,
          message: `Minimum purchase of ₹${coupon.minPurchase.toLocaleString("en-IN")} is required.`,
        },
        { status: 400 }
      );
    }

    // Calculate discount value
    let discountAmount = 0;
    if (coupon.discountType === "percentage") {
      discountAmount = (cartTotal * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else {
      discountAmount = coupon.discountValue;
    }

    return NextResponse.json({
      success: true,
      message: "Coupon applied successfully!",
      couponId: coupon._id,
      discountAmount: Math.round(discountAmount),
      code: coupon.code,
    });
  } catch (error: any) {
    console.error("Coupon verification error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error.", error: error.message },
      { status: 500 }
    );
  }
}
