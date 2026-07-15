"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Check, ShoppingBag, UserPlus, AlertTriangle, Package } from "lucide-react";

export interface Notification {
  id: string;
  type: "customer" | "order" | "stock" | "product";
  message: string;
  timestamp: string;
  read: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "customer",
    message: "New customer Devyani Sharma registered.",
    timestamp: "2 minutes ago",
    read: false,
  },
  {
    id: "2",
    type: "order",
    message: "New order #ORD-1029 placed.",
    timestamp: "1 hour ago",
    read: false,
  },
  {
    id: "3",
    type: "stock",
    message: "Low stock alert: Classic Temple Necklace (2 left).",
    timestamp: "3 hours ago",
    read: false,
  },
  {
    id: "4",
    type: "product",
    message: "Product 'Bridal Choker' updated by admin.",
    timestamp: "1 day ago",
    read: true,
  },
];

export default function AdminNotifications() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const closeDropdown = () => setIsOpen(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeDropdown();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case "customer":
        return <UserPlus className="h-4 w-4 text-emerald-400" />;
      case "order":
        return <ShoppingBag className="h-4 w-4 text-blue-400" />;
      case "stock":
        return <AlertTriangle className="h-4 w-4 text-amber-400" />;
      case "product":
        return <Package className="h-4 w-4 text-purple-400" />;
      default:
        return <Bell className="h-4 w-4 text-gold" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={toggleDropdown}
        className="relative text-zinc-400 hover:text-gold transition-colors p-1.5 cursor-pointer focus:outline-none"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rose-500 text-[8px] font-bold text-white border-2 border-[#0b0b0c]">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <>
          {/* Backdrop for click outside */}
          <div
            className="fixed inset-0 z-40 cursor-default"
            onClick={closeDropdown}
          />
          <div className="absolute right-0 mt-3 w-80 sm:w-96 z-50 border border-purple-royal/20 bg-zinc-950 p-0 text-white shadow-2xl rounded-none animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-purple-royal/10 px-4 py-3">
              <h3 className="font-serif text-sm tracking-widest uppercase text-white">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-[10px] uppercase tracking-widest text-gold hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Check className="h-3 w-3" /> Mark all read
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <p className="text-xs text-zinc-500 uppercase tracking-widest">
                    You're all caught up.
                  </p>
                  <p className="text-xs text-zinc-600 mt-1">
                    No new notifications.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`relative flex gap-3 border-b border-purple-royal/5 p-4 transition-colors hover:bg-zinc-900/50 ${
                        !notification.read ? "bg-purple-royal/5" : ""
                      }`}
                    >
                      {/* Unread indicator dot */}
                      {!notification.read && (
                        <span className="absolute left-1.5 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-gold" />
                      )}
                      
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-900 border border-purple-royal/20">
                        {getIconForType(notification.type)}
                      </div>
                      
                      <div className="flex flex-1 flex-col gap-1">
                        <p className={`text-xs ${!notification.read ? "text-white font-medium" : "text-zinc-400"}`}>
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-zinc-500 uppercase tracking-wider">
                            {notification.timestamp}
                          </span>
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-[10px] text-gold hover:text-white transition-colors cursor-pointer"
                            >
                              Mark read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-purple-royal/10 p-2">
              <button
                onClick={closeDropdown}
                className="w-full rounded-none py-2 text-center text-xs font-bold uppercase tracking-widest text-zinc-400 hover:bg-zinc-900 hover:text-gold transition-colors cursor-pointer"
              >
                View all notifications
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
