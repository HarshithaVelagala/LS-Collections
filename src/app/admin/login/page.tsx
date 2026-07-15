"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Lock, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export default function AdminLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        toast({
          title: "Access Granted",
          description: "Administrative console loaded successfully.",
          className: "bg-emerald-500 text-white border-emerald-400",
        });
        localStorage.setItem("isAdminAuthenticated", "true");
        router.push("/admin/dashboard");
        router.refresh();
      } else {
        setErrorMsg(data.message || "Invalid credentials.");
      }
    } catch (err: any) {
      setErrorMsg("Failed to connect to authentication services.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4 py-12 select-none">
      <div className="w-full max-w-md border border-purple-royal/20 bg-[#0b0b0c] p-8 md:p-10 shadow-2xl relative">
        {/* Decorative Gold Header Bar */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-gold via-gold-light to-gold-dark" />
        
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center border border-gold/30 bg-zinc-900 text-gold mb-4 rounded-none">
            <Lock className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-serif text-white tracking-widest uppercase mb-1">Admin Console</h1>
          <p className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-light">LS Collections Secure Administrative access</p>
        </div>

        {errorMsg && (
          <div className="mb-6 flex items-center gap-2 border border-rose-500/20 bg-rose-500/5 p-3.5 text-xs text-rose-400">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Email Address</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-zinc-900 border border-purple-royal/20 text-white rounded-none px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors"
              placeholder="admin@ls.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-zinc-900 border border-purple-royal/20 text-white rounded-none px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors pr-12"
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-gold transition-colors"
              >
                {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-gold via-gold-light to-gold-dark hover:from-gold hover:to-gold text-black font-extrabold tracking-widest uppercase rounded-none transition-all h-12 shadow-lg shadow-gold/15 mt-2 cursor-pointer"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin mx-auto text-black" /> : "Access Dashboard"}
          </Button>

          {/* Credentials Hint Card */}
          <div className="mt-8 border border-purple-royal/10 bg-zinc-950 p-4 text-center">
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Development Demo Credentials</p>
            <p className="text-xs font-mono text-gold-light font-semibold">
              admin@ls.com / admin123
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
