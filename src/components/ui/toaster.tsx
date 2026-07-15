"use client";

import { useEffect, useState } from "react";
import { setToastListener } from "./use-toast";

type ToastProps = {
  id: number;
  title?: string;
  description?: string;
  className?: string;
};

export function Toaster() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  useEffect(() => {
    let idCounter = 0;
    setToastListener((toast) => {
      const id = idCounter++;
      setToasts((prev) => [...prev, { ...toast, id }]);
      
      // Auto dismiss
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3000);
    });
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div 
          key={toast.id} 
          className={`px-4 py-3 rounded-sm shadow-xl min-w-[300px] border flex flex-col gap-1 pointer-events-auto transform transition-all animate-in slide-in-from-bottom-5 ${toast.className || "bg-card border-border text-foreground"}`}
        >
          {toast.title && <span className="font-bold text-sm tracking-wider">{toast.title}</span>}
          {toast.description && <span className="text-xs font-light opacity-90">{toast.description}</span>}
        </div>
      ))}
    </div>
  );
}
