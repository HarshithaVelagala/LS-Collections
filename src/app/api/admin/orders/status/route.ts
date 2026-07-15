import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

export async function POST(req: Request) {
  try {
    const { orderId, orderStatus } = await req.json();

    if (!orderId || !orderStatus) {
      return NextResponse.json(
        { success: false, message: "Missing required order status update attributes." },
        { status: 400 }
      );
    }

    await connectDB();

    const updated = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Order transaction record not found in database." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Order status updated successfully!",
      order: updated,
    });
  } catch (error: any) {
    console.error("Admin Order Update Status Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error.", error: error.message },
      { status: 500 }
    );
  }
}
