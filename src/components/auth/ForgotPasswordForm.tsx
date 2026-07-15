"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, ArrowLeft, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate sending email
    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
    }, 1500);
  };

  if (success) {
    return (
      <div className="text-center space-y-6 animate-in fade-in zoom-in duration-500">
        <div className="h-16 w-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400">
          <MailCheck className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-serif text-foreground tracking-wider">Check Your Email</h3>
          <p className="text-sm text-muted-foreground font-light">
            We've sent password reset instructions to <strong className="text-foreground">{email}</strong>.
          </p>
        </div>
        <div className="pt-4">
          <Link href="/auth/login" className="text-gold uppercase tracking-widest text-xs font-bold hover:text-foreground transition-colors flex items-center justify-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-xs text-muted-foreground font-semibold uppercase tracking-widest">Registered Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-background border border-border text-foreground rounded-md px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          placeholder="Enter your email address"
        />
      </div>

      <Button
        type="submit"
        disabled={loading || !email}
        className="w-full bg-primary hover:bg-gold-light text-white font-bold tracking-widest uppercase rounded-none transition-colors h-12 shadow-md hover:shadow-primary/20 disabled:opacity-50"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send Reset Link"}
      </Button>

      <div className="text-center mt-6">
        <Link href="/auth/login" className="text-muted-foreground uppercase tracking-widest text-xs font-bold hover:text-foreground transition-colors flex items-center justify-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Login
        </Link>
      </div>
    </form>
  );
}
