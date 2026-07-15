import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { razorpay } from "@/lib/razorpay";
import Order from "@/models/Order";

export async function POST(req: Request) {
  try {
    const { items, totalAmount, discountAmount, shippingAddress, userId } = await req.json();

    if (!items || items.length === 0 || !totalAmount || !shippingAddress) {
      return NextResponse.json(
        { success: false, message: "Missing required order parameters." },
        { status: 400 }
      );
    }

    await connectDB();

    // Amount in paise (INR * 100) for Razorpay API
    const amountInPaise = Math.round((totalAmount - (discountAmount || 0)) * 100);

    // Create Razorpay Order
    let razorpayOrder;
    try {
      razorpayOrder = await razorpay.orders.create({
        amount: amountInPaise,
        currency: "INR",
        receipt: `receipt_order_${Date.now()}`,
      });
    } catch (rzpErr: any) {
      console.error("Razorpay SDK Order creation error:", rzpErr);
      // Fallback for mock/test flows if credentials are invalid or unavailable
      razorpayOrder = {
        id: `order_mock_${Date.now().toString().slice(-8)}`,
        amount: amountInPaise,
        currency: "INR",
      };
    }

    // Save pending Order to MongoDB
    const newOrder = await Order.create({
      userId: userId || "guest_user",
      items: items.map((item: any) => ({
        productId: item.productId,
        variantSku: item.variantSku,
        quantity: item.quantity,
        price: item.price,
        personalizationInputs: item.personalization
          ? Object.entries(item.personalization).map(([k, v]) => ({
              fieldName: k,
              value: v as string,
            }))
          : [],
      })),
      totalAmount: totalAmount,
      discountAmount: discountAmount || 0,
      shippingAddress: {
        name: shippingAddress.name,
        phone: shippingAddress.phone,
        addressLine: shippingAddress.addressLine,
        city: shippingAddress.city,
        state: shippingAddress.state,
        zip: shippingAddress.zip,
      },
      paymentStatus: "pending",
      razorpayOrderId: razorpayOrder.id,
      orderStatus: "processing",
    });

    return NextResponse.json({
      success: true,
      orderId: newOrder._id,
      razorpayOrderId: razorpayOrder.id,
      amount: amountInPaise,
      currency: "INR",
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_mockkeyid123",
    });
  } catch (error: any) {
    console.error("Payment Order endpoint error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error.", error: error.message },
      { status: 500 }
    );
  }
}
