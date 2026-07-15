import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { serialize } from "@/lib/serialize";
import OrdersManager from "@/components/admin/OrdersManager";

export const metadata = {
  title: "Order Logs | LS Collections Admin",
  description: "Track customer purchases, shipping details, and update statuses.",
};

export default async function AdminOrdersPage() {
  let orders: any[] = [];

  try {
    await connectDB();
    
    const rawOrders = await Order.find({})
      .populate("items.productId")
      .sort({ createdAt: -1 })
      .lean();

    orders = serialize(rawOrders);
  } catch (error) {
    console.error("Orders Admin Fetch Error:", error);
  }

  return <OrdersManager orders={orders} />;
}
