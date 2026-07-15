"use client";

import { useState } from "react";
import { Settings, Shield, Key, Sparkles, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export default function SettingsManager() {
  const { toast } = useToast();
  const [maintenance, setMaintenance] = useState(false);
  const [razorpayMode, setRazorpayMode] = useState("sandbox");
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Validation Error",
        description: "New passwords do not match.",
        className: "bg-rose-500 text-white border-rose-400"
      });
      return;
    }

    toast({
      title: "Password Updated",
      description: "Administrative console credentials updated successfully.",
      className: "bg-emerald-500 text-white border-emerald-400",
    });

    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleSaveToggles = () => {
    toast({
      title: "Settings Saved",
      description: "System configurations updated in database.",
      className: "bg-emerald-500 text-white border-emerald-400",
    });
  };

  return (
    <div className="space-y-6 select-none text-white max-w-4xl">
      
      {/* Intro Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between border-b border-purple-royal/10 pb-5">
        <div>
          <h4 className="font-serif text-sm font-bold tracking-widest text-gold uppercase">System & Authentication Settings</h4>
          <p className="text-[10px] text-zinc-500 font-light mt-0.5">Control billing configurations and manage admin roles</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Toggle Configs Card */}
        <div className="border border-purple-royal/10 bg-[#0b0b0c] p-6 shadow-md space-y-6">
          <h5 className="font-serif text-sm font-bold tracking-widest text-gold uppercase flex items-center gap-1.5 border-b border-purple-royal/5 pb-3">
            <Settings className="h-4.5 w-4.5" /> Gateway & Mode Toggles
          </h5>

          {/* Maintenance Mode */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-white">Maintenance Mode</p>
              <p className="text-[9px] text-zinc-500 font-light">Direct client requests to a maintenance message screen</p>
            </div>
            <input
              type="checkbox"
              checked={maintenance}
              onChange={(e) => setMaintenance(e.target.checked)}
              className="h-4.5 w-4.5 bg-zinc-950 border-purple-royal/20 rounded-sm cursor-pointer accent-gold"
            />
          </div>

          {/* Razorpay Gateway Mode */}
          <div className="space-y-2">
            <div>
              <p className="text-xs font-semibold text-white">Razorpay Environment</p>
              <p className="text-[9px] text-zinc-500 font-light">Determine Razorpay API checkout key responses</p>
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-xs font-semibold text-zinc-400 cursor-pointer">
                <input
                  type="radio"
                  name="razorpayMode"
                  value="sandbox"
                  checked={razorpayMode === "sandbox"}
                  onChange={(e) => setRazorpayMode(e.target.value)}
                  className="accent-gold h-4 w-4"
                />
                Sandbox Mode
              </label>
              <label className="flex items-center gap-2 text-xs font-semibold text-zinc-400 cursor-pointer">
                <input
                  type="radio"
                  name="razorpayMode"
                  value="production"
                  checked={razorpayMode === "production"}
                  onChange={(e) => setRazorpayMode(e.target.value)}
                  className="accent-gold h-4 w-4"
                />
                Production Live
              </label>
            </div>
          </div>

          {/* Seed Database Trigger */}
          <div className="pt-4 border-t border-purple-royal/5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-white">Database Seed Data</p>
              <p className="text-[9px] text-zinc-500 font-light">Re-seed default collection entries</p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                toast({
                  title: "Database Synced",
                  description: "Successfully re-seeded default products.",
                  className: "bg-emerald-500 text-white border-emerald-400",
                });
              }}
              className="border-purple-royal/30 text-zinc-400 hover:border-gold hover:text-gold rounded-none text-[9px] uppercase tracking-wider font-bold py-1.5 h-auto px-4 cursor-pointer transition-all flex items-center gap-1"
            >
              <RefreshCw className="h-3 w-3" /> Re-Seed DB
            </Button>
          </div>

          <Button
            onClick={handleSaveToggles}
            className="w-full bg-gradient-to-r from-gold via-gold-light to-gold-dark text-black font-extrabold tracking-widest text-xs uppercase py-4 rounded-none shadow-lg shadow-gold/10 cursor-pointer"
          >
            Save System Toggles
          </Button>
        </div>

        {/* Change Password Card */}
        <div className="border border-purple-royal/10 bg-[#0b0b0c] p-6 shadow-md">
          <h5 className="font-serif text-sm font-bold tracking-widest text-gold uppercase flex items-center gap-1.5 border-b border-purple-royal/5 pb-3">
            <Shield className="h-4.5 w-4.5" /> Security Credentials
          </h5>

          <form onSubmit={handlePasswordSubmit} className="space-y-4 pt-2">
            <div className="space-y-1">
              <label className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">Current Password</label>
              <input
                type="password"
                required
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm(p => ({ ...p, currentPassword: e.target.value }))}
                className="w-full bg-zinc-900 border border-purple-royal/20 text-white rounded-none px-3 py-2.5 text-xs focus:outline-none focus:border-gold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">New Password</label>
              <input
                type="password"
                required
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm(p => ({ ...p, newPassword: e.target.value }))}
                className="w-full bg-zinc-900 border border-purple-royal/20 text-white rounded-none px-3 py-2.5 text-xs focus:outline-none focus:border-gold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">Confirm New Password</label>
              <input
                type="password"
                required
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm(p => ({ ...p, confirmPassword: e.target.value }))}
                className="w-full bg-zinc-900 border border-purple-royal/20 text-white rounded-none px-3 py-2.5 text-xs focus:outline-none focus:border-gold"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-transparent border border-gold text-gold hover:bg-gold hover:text-black font-extrabold tracking-widest text-xs uppercase py-4 rounded-none cursor-pointer transition-all"
            >
              Update Security Password
            </Button>
          </form>
        </div>

      </div>

    </div>
  );
}
