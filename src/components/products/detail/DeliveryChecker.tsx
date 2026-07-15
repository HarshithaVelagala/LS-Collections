"use client";

import { useState } from "react";
import { Truck, MapPin, CheckCircle, Package } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DeliveryChecker({ isPreview = false }: { isPreview?: boolean }) {
  const [pincode, setPincode] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "checked">("idle");
  const [error, setError] = useState("");

  const handleCheck = () => {
    if (!pincode || pincode.length !== 6 || isNaN(Number(pincode))) {
      setError("Please enter a valid 6-digit PIN code");
      return;
    }
    
    setError("");
    setStatus("loading");
    
    // Simulate API call
    setTimeout(() => {
      setStatus("checked");
    }, 800);
  };

  // Generate a mock estimated date (3-5 days from now)
  const today = new Date();
  const estimatedDate = new Date(today.getTime() + 4 * 24 * 60 * 60 * 1000);
  const formattedDate = estimatedDate.toLocaleDateString("en-US", {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="bg-[#FFFFFF] border-none">
      <h3 className="text-[12px] font-bold uppercase tracking-widest text-[#6F6F6F] flex items-center gap-2 mb-3">
        <Truck className="h-4 w-4" />
        Delivery Options
      </h3>
      
      <div className="flex gap-3 items-center">
        <div className="relative flex-1">
          <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#C89B6D]" />
          <input
            type="text"
            maxLength={6}
            placeholder="Enter Pincode"
            value={pincode}
            onChange={(e) => {
              setPincode(e.target.value.replace(/\D/g, ""));
              if (status === "checked") setStatus("idle");
              if (error) setError("");
            }}
            disabled={isPreview}
            className="w-full h-11 bg-[#FFFFFF] border border-[#ECE6DF] text-[#2C2C2C] pl-10 pr-4 text-[13px] font-medium focus:outline-none focus:border-[#C89B6D] transition-all placeholder:text-[#9A9A9A] rounded-[4px] disabled:opacity-50 font-sans"
          />
        </div>
        <Button 
          onClick={handleCheck}
          disabled={isPreview || status === "loading" || pincode.length !== 6}
          className="h-11 bg-[#F5F5F5] border border-[#ECE6DF] hover:border-[#C89B6D] hover:bg-[#EAEAEA] text-[#2C2C2C] rounded-[4px] uppercase text-[12px] font-semibold tracking-widest transition-all w-[100px] flex items-center justify-center shrink-0"
        >
          {status === "loading" ? "..." : "Check"}
        </Button>
      </div>
      
      {error && <p className="text-rose-400 text-[10px] mt-2">{error}</p>}

      {status === "checked" && (
        <div className="mt-4 space-y-3 pt-4 border-t border-purple-royal/10 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-start gap-3">
            <Package className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-[#5A5A5A] font-semibold">Get it by {formattedDate}</p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wide">Standard Delivery</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 pl-8 pt-1">
            <div className="flex items-center gap-2 text-xs text-zinc-600">
              <CheckCircle className="h-3.5 w-3.5 text-[#C89B6D]" />
              <span>Free Shipping available</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-600">
              <CheckCircle className="h-3.5 w-3.5 text-[#C89B6D]" />
              <span>Cash on Delivery available</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

