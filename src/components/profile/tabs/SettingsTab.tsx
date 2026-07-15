"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SettingsTab() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState<"profile" | "password">("profile");

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Profile Updated",
        description: "Your account details have been successfully saved.",
        className: "bg-emerald-500 text-white border-emerald-400",
      });
    }, 1000);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        className: "bg-rose-500 text-white border-rose-400",
      });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast({
        title: "Password Changed",
        description: "Your password has been updated securely.",
        className: "bg-emerald-500 text-white border-emerald-400",
      });
    }, 1000);
  };

  if (user?.role === "guest") {
    return (
      <div className="bg-card p-12 border border-border text-center animate-in fade-in slide-in-from-bottom-4 duration-500 shadow-sm">
        <h3 className="font-serif text-xl text-foreground tracking-wider mb-2">Create an Account</h3>
        <p className="text-sm font-light text-muted-foreground max-w-sm mx-auto">
          Please register or login to manage your account settings and preferences.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 border-b border-border pb-2 mb-6">
        <button 
          onClick={() => setActiveSection("profile")}
          className={`font-serif text-lg tracking-wider uppercase pb-2 px-2 transition-colors ${activeSection === "profile" ? "text-gold border-b-2 border-gold font-semibold" : "text-muted-foreground hover:text-foreground"}`}
        >
          Update Profile
        </button>
        <button 
          onClick={() => setActiveSection("password")}
          className={`font-serif text-lg tracking-wider uppercase pb-2 px-2 transition-colors ${activeSection === "password" ? "text-gold border-b-2 border-gold font-semibold" : "text-muted-foreground hover:text-foreground"}`}
        >
          Change Password
        </button>
      </div>
      
      {activeSection === "profile" ? (
        <form onSubmit={handleProfileSubmit} className="bg-card border border-border p-6 sm:p-8 space-y-6 max-w-2xl shadow-sm">
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground font-semibold uppercase tracking-widest">Full Name</label>
            <input
              type="text"
              value={profileData.name}
              onChange={(e) => setProfileData({...profileData, name: e.target.value})}
              required
              className="w-full bg-background border border-border text-foreground rounded-md px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground font-semibold uppercase tracking-widest">Email Address</label>
            <input
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData({...profileData, email: e.target.value})}
              required
              className="w-full bg-background border border-border text-foreground rounded-md px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground font-semibold uppercase tracking-widest">Mobile Number</label>
            <input
              type="tel"
              value={profileData.phone}
              onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
              className="w-full bg-background border border-border text-foreground rounded-md px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="bg-primary hover:bg-gold-light text-white font-bold tracking-widest uppercase rounded-none transition-colors h-12 shadow-md hover:shadow-primary/20 px-8"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
            </Button>
          </div>
        </form>
      ) : (
        <form onSubmit={handlePasswordSubmit} className="bg-card border border-border p-6 sm:p-8 space-y-6 max-w-2xl shadow-sm">
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground font-semibold uppercase tracking-widest">Current Password</label>
            <input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
              required
              className="w-full bg-background border border-border text-foreground rounded-md px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground font-semibold uppercase tracking-widest">New Password</label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
              required
              className="w-full bg-background border border-border text-foreground rounded-md px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground font-semibold uppercase tracking-widest">Confirm New Password</label>
            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
              required
              className="w-full bg-background border border-border text-foreground rounded-md px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="bg-primary hover:bg-gold-light text-white font-bold tracking-widest uppercase rounded-none transition-colors h-12 shadow-md hover:shadow-primary/20 px-8"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update Password"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
