"use client";

import { useState } from "react";
import { Tag, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CouponInputProps {
  cartTotal: number;
  onApplyCoupon: (discount: number, code: string) => void;
  onRemoveCoupon: () => void;
  appliedCoupon: any;
}

export default function CouponInput({ cartTotal, onApplyCoupon, onRemoveCoupon, appliedCoupon }: CouponInputProps) {
  const [couponCode, setCouponCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/coupon/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode.trim(), cartTotal }),
      });
      const data = await res.json();

      if (data.success) {
        onApplyCoupon(data.discountAmount, data.code);
        setCouponCode("");
      } else {
        setError(data.message || "Invalid coupon code.");
      }
    } catch (err) {
      setError("Failed to verify coupon.");
    } finally {
      setLoading(false);
    }
  };

  if (appliedCoupon) {
    return (
      <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 flex justify-between items-center rounded-sm">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">{appliedCoupon.code} Applied</span>
        </div>
        <button 
          onClick={onRemoveCoupon}
          className="text-[10px] text-muted-foreground hover:text-foreground uppercase tracking-widest transition-colors"
        >
          Remove
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleApply} className="space-y-2">
      <div className="flex gap-3 items-center">
        <div className="relative flex-1">
          <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#C89B6D]" />
          <input
            type="text"
            placeholder="Enter promo code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            className="w-full h-11 bg-[#FFFFFF] border border-[#ECE6DF] text-[#2C2C2C] rounded-[4px] pl-10 pr-3 text-[13px] font-medium focus:outline-none focus:border-[#C89B6D] uppercase transition-all placeholder:text-[#9A9A9A] placeholder:normal-case"
          />
        </div>
        <Button
          type="submit"
          disabled={loading || !couponCode.trim()}
          className="h-11 bg-[#F5F5F5] border border-[#ECE6DF] hover:border-[#C89B6D] hover:bg-[#EAEAEA] text-[#2C2C2C] rounded-[4px] uppercase text-[12px] tracking-widest font-semibold transition-all disabled:opacity-50 px-6 flex items-center justify-center shrink-0 min-w-[100px]"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
        </Button>
      </div>
      {error && <p className="text-[10px] text-rose-500 font-light mt-1 pl-1">{error}</p>}
    </form>
  );
}

