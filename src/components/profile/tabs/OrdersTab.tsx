"use client";

import { Package } from "lucide-react";
import OrderCard from "./OrderCard";
import EmptyState from "../EmptyState";

interface OrdersTabProps {
  orders: any[];
  onNavigateToProducts: () => void;
}

export default function OrdersTab({ orders, onNavigateToProducts }: OrdersTabProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between border-b border-border pb-2 mb-6">
        <h3 className="font-serif text-gold text-xl tracking-wider font-semibold uppercase">
          Order History ({orders.length})
        </h3>
      </div>
      
      {orders.length === 0 ? (
        <EmptyState 
          icon={Package}
          title="No Orders Yet"
          description="You haven't placed any orders. Discover our exclusive luxury collection."
          actionLabel="Start Shopping"
          onAction={onNavigateToProducts}
        />
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
