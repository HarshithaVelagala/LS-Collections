"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";

import ProfileSidebar, { ProfileTab } from "@/components/profile/ProfileSidebar";
import DashboardTab from "@/components/profile/tabs/DashboardTab";
import OrdersTab from "@/components/profile/tabs/OrdersTab";
import WishlistTab from "@/components/profile/tabs/WishlistTab";
import AddressesTab from "@/components/profile/tabs/AddressesTab";
import NotificationsTab from "@/components/profile/tabs/NotificationsTab";
import SettingsTab from "@/components/profile/tabs/SettingsTab";

interface ProfileWrapperProps {
  orders: any[];
}

export default function ProfileWrapper({ orders }: ProfileWrapperProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();
  const { wishlist } = useWishlist();
  
  const [activeTab, setActiveTab] = useState<ProfileTab>("dashboard");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const tab = searchParams.get("tab") as ProfileTab;
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tab: ProfileTab) => {
    setActiveTab(tab);
    router.push(`/profile?tab=${tab}`);
  };

  const handleNavigateToProducts = () => {
    router.push("/products");
  };

  // Mock addresses since backend is stubbed
  const mockAddresses = user?.role === "guest" ? [] : [
    {
      id: "addr_1",
      name: user?.name || "User",
      phone: user?.phone || "+91 98765 43210",
      addressLine: "Flat 402, Royal Palms Residency, MG Road",
      city: "Mumbai",
      state: "Maharashtra",
      zip: "400001",
      isDefault: true,
    }
  ];

  if (!mounted || loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gold"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-foreground">
      <div className="border-b border-border pb-6 mb-10">
        <h1 className="text-3xl sm:text-4xl font-serif tracking-wider text-foreground font-bold uppercase">
          MY ACCOUNT
        </h1>
        <p className="text-xs text-muted-foreground font-light mt-1 uppercase tracking-widest">
          {user?.role === "guest" ? "Manage your temporary session or login to sync" : "Manage your orders, profile details, and preferences"}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left Side: Navigation Sidebar */}
        <ProfileSidebar activeTab={activeTab} onTabChange={handleTabChange} />

        {/* Right Side: Render Tab Content Component */}
        <div className="flex-1 min-w-0">
          {activeTab === "dashboard" && (
            <DashboardTab 
              ordersCount={orders.length}
              wishlistCount={wishlist.length}
              onNavigate={(tab) => handleTabChange(tab as ProfileTab)}
            />
          )}
          
          {activeTab === "orders" && (
            <OrdersTab 
              orders={orders}
              onNavigateToProducts={handleNavigateToProducts}
            />
          )}
          
          {activeTab === "wishlist" && (
            <WishlistTab 
              onNavigateToProducts={handleNavigateToProducts}
            />
          )}
          
          {activeTab === "addresses" && (
            <AddressesTab 
              initialAddresses={mockAddresses}
            />
          )}
          
          {activeTab === "notifications" && (
            <NotificationsTab />
          )}

          {activeTab === "settings" && (
            <SettingsTab />
          )}
        </div>
      </div>
    </div>
  );
}
