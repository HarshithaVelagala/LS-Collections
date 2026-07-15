"use client";

import { Package, Percent, CreditCard, Bell } from "lucide-react";

interface Notification {
  id: string;
  type: "order" | "offer" | "payment" | "alert";
  title: string;
  message: string;
  date: string;
  isRead: boolean;
}

interface NotificationCardProps {
  notification: Notification;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function NotificationCard({ notification, onMarkRead, onDelete }: NotificationCardProps) {
  const Icon = notification.type === "order" ? Package :
               notification.type === "offer" ? Percent :
               notification.type === "payment" ? CreditCard : Bell;

  return (
    <div className={`p-6 border-b border-border flex gap-4 transition-colors hover:bg-muted/30 group ${!notification.isRead ? 'bg-muted/50' : 'bg-transparent'}`}>
      <div className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center ${
        !notification.isRead ? 'bg-gold/15 text-gold border border-gold/20' : 'bg-muted text-muted-foreground border border-border'
      }`}>
        <Icon className="h-4 w-4" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-1">
          <h4 className={`text-sm tracking-wider ${!notification.isRead ? 'text-foreground font-bold' : 'text-muted-foreground font-semibold'}`}>
            {notification.title}
          </h4>
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest whitespace-nowrap ml-4">
            {notification.date}
          </span>
        </div>
        <p className={`text-xs ${!notification.isRead ? 'text-foreground/90 font-medium' : 'text-muted-foreground font-light'}`}>
          {notification.message}
        </p>
      </div>

      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center gap-2 shrink-0">
        {!notification.isRead && (
          <button 
            onClick={() => onMarkRead(notification.id)}
            className="text-[10px] uppercase font-bold tracking-widest text-gold hover:text-foreground transition-colors text-right"
          >
            Mark Read
          </button>
        )}
        <button 
          onClick={() => onDelete(notification.id)}
          className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground hover:text-rose-500 transition-colors text-right"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
