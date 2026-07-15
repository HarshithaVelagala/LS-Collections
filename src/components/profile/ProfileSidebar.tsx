"use client";

import { useAuth } from "@/context/AuthContext";
import { Package, Heart, MapPin, User as UserIcon, LayoutDashboard, Bell, Settings, LogOut } from "lucide-react";

export type ProfileTab = "dashboard" | "orders" | "wishlist" | "addresses" | "notifications" | "settings";

interface ProfileSidebarProps {
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
}

export default function ProfileSidebar({ activeTab, onTabChange }: ProfileSidebarProps) {
  const { logout } = useAuth();
  
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "orders", label: "My Orders", icon: Package },
    { id: "wishlist", label: "My Wishlist", icon: Heart },
    { id: "addresses", label: "Saved Addresses", icon: MapPin },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "settings", label: "Account Settings", icon: Settings },
  ] as const;

  return (
    <aside className="w-full lg:w-1/4 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible border-b lg:border-b-0 lg:border-r border-border pb-4 lg:pb-0 lg:pr-8 gap-2 shrink-0">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold tracking-wider uppercase rounded-none transition-all whitespace-nowrap lg:w-full ${
              isActive
                ? "bg-primary text-primary-foreground border-l-2 border-gold shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-section-bg"
            }`}
          >
            <Icon className="h-4 w-4" />
            {tab.label}
          </button>
        );
      })}
      
      {/* Logout Button */}
      <button
        onClick={() => logout()}
        className="flex items-center gap-3 px-4 py-3 text-sm font-semibold tracking-wider uppercase rounded-none transition-all whitespace-nowrap lg:w-full text-rose-500 hover:bg-rose-500/10 lg:mt-6"
      >
        <LogOut className="h-4 w-4" />
        Log Out
      </button>
    </aside>
  );
}
