"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  ShoppingBag, 
  Users, 
  Image as ImageIcon, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  X
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (c: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (o: boolean) => void;
}

export default function Sidebar({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  const menuItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Categories", href: "/admin/categories", icon: Layers },
    { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { name: "Customers", href: "/admin/customers", icon: Users },
    { name: "Banners", href: "/admin/banners", icon: ImageIcon },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

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

  const sidebarContent = (
    <div className="flex h-full flex-col bg-[#0b0b0c] border-r border-purple-royal/10 text-white justify-between">
      <div>
        {/* Logo Section */}
        <div className="flex h-20 items-center justify-between px-6 border-b border-purple-royal/10">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <span className="font-serif text-2xl font-bold tracking-widest text-gold">
              LS {!isCollapsed && <span className="font-sans font-light text-sm text-white border-l border-white/20 pl-2 ml-1">ADMIN</span>}
            </span>
          </Link>
          {/* Mobile Close Button */}
          <button 
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden text-zinc-400 hover:text-gold transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5 px-3 py-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={`group flex items-center gap-4 rounded-none px-4 py-3.5 text-xs font-semibold tracking-widest uppercase transition-all duration-300 ${
                  isActive
                    ? "bg-purple-royal/20 text-gold border-l-2 border-gold shadow-[inset_1px_0_0_rgba(199,161,90,0.1)]"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                }`}
                title={isCollapsed ? item.name : undefined}
              >
                <Icon className={`h-4.5 w-4.5 shrink-0 transition-transform group-hover:scale-110 ${isActive ? "text-gold" : "text-zinc-400 group-hover:text-white"}`} />
                {!isCollapsed && <span className="transition-opacity duration-300">{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Section (Logout & Toggle) */}
      <div className="border-t border-purple-royal/10 p-3 space-y-1.5">
        <button
          onClick={handleLogout}
          className="group flex w-full items-center gap-4 rounded-none px-4 py-3.5 text-xs font-semibold tracking-widest uppercase text-rose-400 hover:bg-rose-950/10 hover:text-rose-300 transition-all duration-300 cursor-pointer"
          title={isCollapsed ? "Logout" : undefined}
        >
          <LogOut className="h-4.5 w-4.5 shrink-0 transition-transform group-hover:translate-x-1" />
          {!isCollapsed && <span>Logout</span>}
        </button>

        {/* Collapse Button (Desktop Only) */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex w-full items-center justify-center rounded-none py-2 text-zinc-500 hover:text-gold hover:bg-zinc-900/50 transition-colors duration-200 cursor-pointer"
        >
          {isCollapsed ? <ChevronRight className="h-4.5 w-4.5" /> : <ChevronLeft className="h-4.5 w-4.5" />}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden md:block h-screen sticky top-0 shrink-0 transition-all duration-300 ${isCollapsed ? "w-20" : "w-64"}`}>
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div 
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer Sidebar */}
      <aside className={`md:hidden fixed top-0 bottom-0 left-0 z-50 w-64 transition-transform duration-300 ease-in-out transform ${
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        {sidebarContent}
      </aside>
    </>
  );
}
