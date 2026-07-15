"use client";

import { usePathname, useRouter } from "next/navigation";
import { Menu, Search, User, LogOut } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import AdminNotifications from "@/components/admin/AdminNotifications";

interface HeaderProps {
  isCollapsed: boolean;
  setIsCollapsed: (c: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (o: boolean) => void;
}

export default function Header({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // Map route path to header title
  const getPageTitle = (path: string) => {
    if (path.includes("/admin/dashboard")) return "Dashboard Overview";
    if (path.includes("/admin/products")) return "Product Catalog";
    if (path.includes("/admin/categories")) return "Category Management";
    if (path.includes("/admin/orders")) return "Order Transaction Logs";
    if (path.includes("/admin/customers")) return "Customer Accounts";
    if (path.includes("/admin/banners")) return "Banner & Promotions";
    if (path.includes("/admin/settings")) return "System Settings";
    return "Administrative Console";
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/admin/auth/logout", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        toast({
          title: "Logged Out",
          description: "You have been securely logged out.",
          className: "bg-zinc-900 text-white border-purple-royal/20",
        });
        localStorage.removeItem("isAdminAuthenticated");
        router.push("/admin/login");
        router.refresh();
      } else {
        alert("Logout failed");
      }
    } catch (e) {
      console.error(e);
      alert("Logout failed");
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-purple-royal/10 bg-[#0b0b0c] px-6 text-white">
      {/* Page Title & Hamburger Menu */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="text-zinc-400 hover:text-gold md:hidden transition-colors"
        >
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="font-serif text-lg font-bold tracking-wider text-white uppercase hidden sm:block">
          {getPageTitle(pathname)}
        </h1>
      </div>

      {/* Global Actions */}
      <div className="flex items-center gap-6">
        {/* Search Bar */}
        <div className="relative max-w-xs hidden md:block">
          <input
            type="text"
            placeholder="Search records..."
            className="w-60 bg-zinc-900 border border-purple-royal/20 text-white placeholder-zinc-500 rounded-none pl-10 pr-4 py-2 text-xs font-semibold focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
          />
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500" />
        </div>

        {/* Notifications */}
        <AdminNotifications />

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="flex items-center gap-2 text-zinc-400 hover:text-gold transition-colors focus:outline-none cursor-pointer"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/40 bg-zinc-900 text-gold hover:border-gold">
              <User className="h-4.5 w-4.5" />
            </div>
            <span className="hidden md:inline text-xs tracking-wider uppercase font-semibold text-zinc-300 hover:text-white">Admin Console</span>
          </button>

          {showProfileDropdown && (
            <>
              {/* Backdrop to close dropdown */}
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowProfileDropdown(false)}
              />
              <div className="absolute right-0 mt-3 w-48 z-20 border border-purple-royal/20 bg-zinc-950 p-2 text-white shadow-2xl rounded-none">
                <div className="px-3 py-2 border-b border-purple-royal/5">
                  <p className="text-[10px] text-zinc-500 tracking-widest uppercase">Logged in as</p>
                  <p className="text-xs font-bold text-white truncate">admin@ls.com</p>
                </div>
                <button
                  onClick={() => {
                    setShowProfileDropdown(false);
                    router.push("/admin/settings");
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-zinc-400 hover:text-gold hover:bg-zinc-900 transition-colors rounded-none mt-1 cursor-pointer"
                >
                  Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-rose-400 hover:bg-rose-950/10 hover:text-rose-300 transition-colors rounded-none cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" /> Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
