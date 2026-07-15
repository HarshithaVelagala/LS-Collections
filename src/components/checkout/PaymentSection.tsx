"use client";

import { Loader2, ShieldCheck, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaymentSectionProps {
  onPay: () => void;
  loading: boolean;
  total: number;
  onBack: () => void;
}

export default function PaymentSection({ onPay, loading, total, onBack }: PaymentSectionProps) {
  return (
    <div className="bg-card p-6 sm:p-8 border border-border space-y-6 shadow-sm">
      <h2 className="font-serif text-xl tracking-wider text-gold uppercase border-b border-border pb-4 flex items-center gap-2">
        <CreditCard className="h-5 w-5" /> Secure Payment
      </h2>
      
      <div className="bg-muted/40 p-6 border border-border text-center space-y-4">
        <ShieldCheck className="h-12 w-12 text-emerald-600 mx-auto" />
        <h3 className="font-serif text-lg text-foreground tracking-widest uppercase">
          Pay Securely via Razorpay
        </h3>
        <p className="text-xs text-muted-foreground font-light max-w-sm mx-auto">
          You will be redirected to Razorpay's secure checkout to complete your payment of <strong className="text-gold">₹{total.toLocaleString("en-IN")}</strong>. We accept all major Credit Cards, UPI, and Netbanking.
        </p>
      </div>

      <div className="flex justify-between pt-4 border-t border-border">
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          className="text-muted-foreground hover:text-foreground uppercase tracking-widest text-xs rounded-none"
        >
          Back to Summary
        </Button>
        <Button
          onClick={onPay}
          disabled={loading}
          className="bg-primary hover:bg-gold-light text-white rounded-none tracking-widest uppercase font-bold px-8 h-12 transition-colors disabled:opacity-50 min-w-[200px] shadow-md hover:shadow-primary/20"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Processing...
            </span>
          ) : (
            `Pay ₹${total.toLocaleString("en-IN")}`
          )}
        </Button>
      </div>
    </div>
  );
}
