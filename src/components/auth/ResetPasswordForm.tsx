"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ResetPasswordForm() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    setLoading(true);
    
    // Simulate reset
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Password Reset Successful",
        description: "Your password has been changed successfully. You can now log in.",
        className: "bg-emerald-500 text-white border-emerald-400",
      });
      router.push("/auth/login");
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-3 text-xs font-semibold text-center rounded-sm">
          {error}
        </div>
      )}

      <div className="space-y-2 relative">
        <label className="text-xs text-muted-foreground font-semibold uppercase tracking-widest">New Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full bg-background border border-border text-foreground rounded-md px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all pr-12"
            placeholder="Enter new password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-gold transition-colors"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="space-y-2 relative">
        <label className="text-xs text-muted-foreground font-semibold uppercase tracking-widest">Confirm New Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full bg-background border border-border text-foreground rounded-md px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all pr-12"
            placeholder="Confirm your new password"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-primary hover:bg-gold-light text-white font-bold tracking-widest uppercase rounded-none transition-colors h-12 shadow-md hover:shadow-primary/20"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Reset Password"}
      </Button>
    </form>
  );
}
