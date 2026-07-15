"use client";

import { MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";

export default function WhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show after scrolling a bit or small delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    const message = encodeURIComponent("Hello LS Collections, I have an inquiry.");
    const whatsappUrl = `https://wa.me/919876543210?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 h-14 w-14 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-[0_4px_20px_rgba(16,185,129,0.5)] hover:scale-110 hover:bg-emerald-400 transition-all duration-300 group"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="h-7 w-7" />
      
      {/* Tooltip */}
      <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-card border border-emerald-500/30 text-foreground px-3 py-1.5 rounded-sm text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        Need help? Chat with us
      </div>
    </button>
  );
}
