"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import NotificationCard from "./NotificationCard";
import EmptyState from "../EmptyState";
import { Button } from "@/components/ui/button";

const MOCK_NOTIFICATIONS = [
  {
    id: "notif_1",
    type: "order" as const,
    title: "Order Delivered",
    message: "Your luxury Saree order #ORD-8829 has been delivered successfully.",
    date: "2 hours ago",
    isRead: false,
  },
  {
    id: "notif_2",
    type: "offer" as const,
    title: "Exclusive Diwali Offer",
    message: "Enjoy flat 20% off on all Banarasi Sarees. Use code FESTIVE20.",
    date: "1 day ago",
    isRead: false,
  },
  {
    id: "notif_3",
    type: "payment" as const,
    title: "Payment Received",
    message: "We have received your payment of ₹24,500 for order #ORD-8829.",
    date: "3 days ago",
    isRead: true,
  },
];

export default function NotificationsTab() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const handleMarkRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between border-b border-border pb-2 mb-6">
        <h3 className="font-serif text-gold text-xl tracking-wider font-semibold uppercase flex items-center gap-2">
          Notifications 
          {unreadCount > 0 && (
            <span className="bg-gold text-black text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center justify-center">
              {unreadCount} NEW
            </span>
          )}
        </h3>
        
        {unreadCount > 0 && (
          <Button 
            onClick={handleMarkAllRead}
            variant="ghost" 
            className="text-muted-foreground hover:text-foreground hover:bg-muted text-xs tracking-widest uppercase font-bold h-8"
          >
            Mark All Read
          </Button>
        )}
      </div>
      
      {notifications.length === 0 ? (
        <EmptyState 
          icon={Bell}
          title="All Caught Up"
          description="You don't have any notifications at the moment."
        />
      ) : (
        <div className="bg-card border border-border rounded-sm overflow-hidden shadow-sm">
          {notifications.map((notification) => (
            <NotificationCard 
              key={notification.id} 
              notification={notification} 
              onMarkRead={handleMarkRead}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
