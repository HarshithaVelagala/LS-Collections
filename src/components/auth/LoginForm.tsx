"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LoginForm() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(formData);
    } catch (err: any) {
      setError(err.message || "Invalid email or password.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-3 text-xs font-semibold text-center rounded-sm">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label className="text-xs text-muted-foreground font-semibold uppercase tracking-widest">Email or Mobile</label>
        <input
          type="text"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
          className="w-full bg-background border border-border text-foreground rounded-md px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          placeholder="Enter your email or mobile"
        />
      </div>

      <div className="space-y-2 relative">
        <div className="flex justify-between items-center">
          <label className="text-xs text-muted-foreground font-semibold uppercase tracking-widest">Password</label>
          <Link href="/auth/forgot-password" className="text-[10px] text-gold hover:text-foreground transition-colors uppercase tracking-wider">
            Forgot Password?
          </Link>
        </div>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full bg-background border border-border text-foreground rounded-md px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all pr-12"
            placeholder="Enter your password"
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

      <div className="flex items-center gap-2">
        <input type="checkbox" id="remember" className="bg-card border-border accent-gold h-4 w-4 rounded-sm" />
        <label htmlFor="remember" className="text-xs text-muted-foreground">Remember me</label>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-primary hover:bg-gold-light text-white font-bold tracking-widest uppercase rounded-none transition-colors h-12 shadow-md hover:shadow-primary/20"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In to Your Account"}
      </Button>

      <div className="text-center mt-6">
        <p className="text-xs text-muted-foreground">
          Don't have an account?{" "}
          <Link href="/register" className="text-gold uppercase tracking-wider font-bold hover:text-foreground transition-colors">
            Register Now
          </Link>
        </p>
      </div>
    </form>
  );
}
