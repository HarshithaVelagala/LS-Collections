"use client";

import { useAuth } from "@/context/AuthContext";
import DashboardCard from "../DashboardCard";
import { Package, Heart, MapPin, Bell } from "lucide-react";

interface DashboardTabProps {
  ordersCount: number;
  wishlistCount: number;
  onNavigate: (tab: string) => void;
}

export default function DashboardTab({ ordersCount, wishlistCount, onNavigate }: DashboardTabProps) {
  const { user } = useAuth();
  
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-card border border-border p-8 rounded-sm shadow-sm">
        <h3 className="text-xl font-serif text-foreground tracking-wider mb-2">
          Welcome back, {user?.name || "Guest"}
        </h3>
        <p className="text-sm font-light text-muted-foreground">
          From your account dashboard you can view your recent orders, manage your shipping and billing addresses, and edit your password and account details.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard 
          title="Total Orders" 
          value={ordersCount} 
          icon={Package} 
          description="View History"
          onClick={() => onNavigate("orders")}
        />
        <DashboardCard 
          title="Wishlist" 
          value={wishlistCount} 
          icon={Heart} 
          description="Saved Items"
          onClick={() => onNavigate("wishlist")}
        />
        <DashboardCard 
          title="Addresses" 
          value={user?.role === "guest" ? 0 : 1} 
          icon={MapPin} 
          description="Manage"
          onClick={() => onNavigate("addresses")}
        />
        <DashboardCard 
          title="Notifications" 
          value={0} 
          icon={Bell} 
          description="Updates"
          onClick={() => onNavigate("notifications")}
        />
      </div>
    </div>
  );
}
