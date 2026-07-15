import { ShieldCheck, Lock, RefreshCw, Zap } from "lucide-react";

export default function TrustBadges() {
  const badges = [
    { icon: ShieldCheck, label: "Premium Quality" },
    { icon: Lock, label: "Secure Payments" },
    { icon: RefreshCw, label: "Easy Returns" },
    { icon: Zap, label: "Fast Delivery" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y border-border mt-8">
      {badges.map((badge, idx) => (
        <div key={idx} className="flex flex-col items-center justify-center gap-3 text-center p-2">
          <div className="h-12 w-12 rounded-full bg-card border border-border flex items-center justify-center shadow-sm">
            <badge.icon className="h-5 w-5 text-gold" />
          </div>
          <span className="text-[10px] uppercase tracking-widest font-bold text-foreground">
            {badge.label}
          </span>
        </div>
      ))}
    </div>
  );
}
