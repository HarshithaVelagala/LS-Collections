"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Truck, DollarSign, Search, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface OrdersManagerProps {
  orders: any[];
}

export default function OrdersManager({ orders: initialOrders }: OrdersManagerProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [orders, setOrders] = useState(initialOrders);
  const [searchQuery, setSearchQuery] = useState("");

  const formatRupee = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(value);
  };

  const handleUpdateOrderStatus = async (orderId: string, currentStatus: string) => {
    const nextStatuses: Record<string, string> = {
      processing: "shipped",
      shipped: "delivered",
      delivered: "processing",
    };
    const nextStatus = nextStatuses[currentStatus] || "processing";

    try {
      const res = await fetch("/api/admin/orders/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, orderStatus: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        toast({
          title: "Status Cycled",
          description: `Order successfully updated to: ${nextStatus.toUpperCase()}`,
          className: "bg-emerald-500 text-white border-emerald-400",
        });
        router.refresh();
      } else {
        toast({
          title: "Update Failed",
          description: data.message || "Unable to update order status.",
          className: "bg-rose-500 text-white border-rose-400"
        });
      }
    } catch (err) {
      toast({
        title: "Connection Error",
        description: "Failed to connect to order services.",
        className: "bg-rose-500 text-white border-rose-400"
      });
    }
  };

  // Filter orders by search query
  const filteredOrders = initialOrders.filter((o) => 
    o._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (o.shippingAddress?.name && o.shippingAddress.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (o.shippingAddress?.phone && o.shippingAddress.phone.includes(searchQuery))
  );

  return (
    <div className="space-y-6 select-none">
      
      {/* Search Bar */}
      <div className="flex items-center justify-between border-b border-purple-royal/10 pb-5">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search orders by ID, customer name or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-purple-royal/20 text-white placeholder-zinc-500 rounded-none pl-4 pr-10 py-2.5 text-xs font-semibold focus:outline-none focus:border-gold transition-all"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto border border-purple-royal/10 bg-[#0b0b0c] p-6 shadow-md">
        <table className="w-full text-left border-collapse text-xs text-zinc-300">
          <thead>
            <tr className="border-b border-purple-royal/20 text-[10px] tracking-widest uppercase text-zinc-500">
              <th className="pb-3 font-semibold">Order ID</th>
              <th className="pb-3 font-semibold">Timestamp</th>
              <th className="pb-3 font-semibold">Customer</th>
              <th className="pb-3 font-semibold">Line Items</th>
              <th className="pb-3 font-semibold">Amount Paid</th>
              <th className="pb-3 font-semibold">Payment Status</th>
              <th className="pb-3 font-semibold">Delivery Status</th>
              <th className="pb-3 font-semibold text-right">Cycle Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-royal/5">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-zinc-500 italic">No orders found matching search criteria.</td>
              </tr>
            ) : (
              filteredOrders.map((order) => {
                const finalAmount = order.totalAmount - (order.discountAmount || 0);
                const itemsDescription = order.items
                  .map((item: any) => `${item.productId?.name || "Product"} (x${item.quantity})`)
                  .join(", ");

                return (
                  <tr key={order._id} className="hover:bg-purple-royal/5 transition-colors">
                    <td className="py-4 font-mono text-[10px] text-zinc-400">
                      #{order._id.slice(-8).toUpperCase()}
                    </td>
                    <td className="py-4 font-light text-zinc-400">
                      {new Date(order.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="py-4 font-medium text-white">
                      <div>
                        <p>{order.shippingAddress?.name || "Guest User"}</p>
                        <p className="text-[10px] text-zinc-500 font-light mt-0.5">{order.shippingAddress?.phone}</p>
                      </div>
                    </td>
                    <td className="py-4 text-zinc-400 font-light max-w-xs truncate pr-4">
                      {itemsDescription}
                    </td>
                    <td className="py-4 font-bold text-gold">
                      {formatRupee(finalAmount)}
                    </td>
                    <td className="py-4">
                      <span className={`px-2 py-0.5 rounded-sm font-bold uppercase text-[9px] border ${
                        order.paymentStatus === "paid"
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                          : order.paymentStatus === "pending"
                          ? "bg-gold/10 border-gold/20 text-gold"
                          : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="py-4 capitalize font-medium">
                      <span className={`inline-flex items-center gap-1 text-[10px] uppercase tracking-wider ${
                        order.orderStatus === "delivered" 
                          ? "text-emerald-400 font-bold" 
                          : order.orderStatus === "shipped" 
                          ? "text-blue-400 font-bold" 
                          : order.orderStatus === "cancelled"
                          ? "text-rose-400 font-bold"
                          : "text-gold font-bold"
                      }`}>
                        <Truck className="h-4 w-4" /> {order.orderStatus}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      {order.orderStatus !== "cancelled" && (
                        <Button
                          onClick={() => handleUpdateOrderStatus(order._id, order.orderStatus)}
                          className="bg-transparent border border-zinc-800 hover:border-gold hover:bg-transparent text-zinc-500 hover:text-gold rounded-none text-[9px] uppercase tracking-wider py-1.5 h-auto font-bold px-3 transition-colors cursor-pointer"
                        >
                          Cycle Status
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
