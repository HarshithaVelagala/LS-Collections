"use client";

import { Truck } from "lucide-react";

interface OrderCardProps {
  order: any;
}

export default function OrderCard({ order }: OrderCardProps) {
  const finalAmount = order.totalAmount - (order.discountAmount || 0);

  return (
    <div className="bg-card border border-border rounded-sm overflow-hidden hover:border-gold/40 transition-colors duration-300 shadow-sm">
      {/* Order Header Summary */}
      <div className="bg-muted/40 p-4 border-b border-border flex flex-col sm:flex-row justify-between gap-4 text-xs tracking-wider text-muted-foreground">
        <div>
          <span className="block font-semibold">ORDER REFERENCE</span>
          <span className="text-foreground font-mono">{order._id}</span>
        </div>
        <div>
          <span className="block font-semibold">DATE</span>
          <span className="text-foreground">{new Date(order.createdAt).toLocaleDateString()}</span>
        </div>
        <div>
          <span className="block font-semibold">TOTAL PAID</span>
          <span className="text-gold font-bold">₹{finalAmount.toLocaleString("en-IN")}</span>
        </div>
        <div className="flex flex-row sm:flex-col gap-2 items-center sm:items-end">
          <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 px-2 py-0.5 font-bold uppercase rounded-sm">
            {order.paymentStatus}
          </span>
          <span className="text-[10px] bg-primary/10 border border-primary/20 text-primary px-2 py-0.5 font-bold uppercase rounded-sm flex items-center gap-1">
            <Truck className="h-3 w-3" /> {order.orderStatus}
          </span>
        </div>
      </div>

      {/* Order Items list */}
      <div className="p-6 space-y-4">
        {order.items.map((item: any, idx: number) => (
          <div key={idx} className="flex gap-4 items-center">
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-foreground truncate">
                {item.productId?.name || "Premium Catalog Item"}
              </h4>
              {item.variantSku && (
                <p className="text-[10px] text-muted-foreground mt-0.5">Option: {item.variantSku}</p>
              )}
              {item.personalizationInputs && item.personalizationInputs.length > 0 && (
                <div className="text-[9px] text-gold font-light mt-0.5">
                  {item.personalizationInputs.map((p: any) => `${p.fieldName}: ${p.value}`).join(", ")}
                </div>
              )}
            </div>
            <span className="text-xs text-muted-foreground px-4 whitespace-nowrap">Qty: {item.quantity}</span>
            <span className="text-sm font-bold text-foreground whitespace-nowrap">
              ₹{(item.price * item.quantity).toLocaleString("en-IN")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
