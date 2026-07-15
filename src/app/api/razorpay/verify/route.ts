import { NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

export async function POST(req: Request) {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = await req.json();

    if (!orderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json(
        { success: false, message: "Missing cryptographic signature parameters." },
        { status: 400 }
      );
    }

    await connectDB();

    // 1. Signature verification logic
    const secret = process.env.RAZORPAY_KEY_SECRET || "mock_razorpay_secret_key_456";
    
    // Check if it's a mock payment (to allow easy local verification)
    const isMock = razorpayOrderId.startsWith("order_mock_") || secret === "mock_razorpay_secret_key_456";
    let isValid = false;

    if (isMock) {
      isValid = true; // Automatically validate mock/sandbox inputs
    } else {
      // Standard Razorpay Cryptographic Verification
      const text = `${razorpayOrderId}|${razorpayPaymentId}`;
      const generatedSignature = crypto
        .createHmac("sha256", secret)
        .update(text)
        .digest("hex");
      
      isValid = generatedSignature === razorpaySignature;
    }

    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "Payment verification failed. Cryptographic signature mismatch." },
        { status: 400 }
      );
    }

    // 2. Update order payment record in MongoDB
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        paymentStatus: "paid",
        razorpayPaymentId: razorpayPaymentId,
        orderStatus: "processing", // Ready for shipping
      },
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json(
        { success: false, message: "Associated order record not found in database." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully!",
      orderId: updatedOrder._id,
    });
  } catch (error: any) {
    console.error("Payment Verification endpoint error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error.", error: error.message },
      { status: 500 }
    );
  }
}
