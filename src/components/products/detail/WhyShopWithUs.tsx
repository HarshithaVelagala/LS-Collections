"use client";

import { ShieldCheck, Lock, RotateCcw, Zap } from "lucide-react";

export default function WhyShopWithUs() {
  const features = [
    {
      icon: ShieldCheck,
      title: "Premium Quality",
      description: "Fine luxury silk & fabrics",
    },
    {
      icon: Lock,
      title: "Secure Payments",
      description: "100% safe & encrypted",
    },
    {
      icon: RotateCcw,
      title: "Easy Returns",
      description: "Hassle-free exchange policy",
    },
    {
      icon: Zap,
      title: "Fast Delivery",
      description: "Express worldwide shipping",
    },
  ];

  return (
    <div className="my-8 py-2 w-full border-t border-b border-border/50">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-4 w-full">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div key={index} className="flex flex-col items-center text-center">
              {/* Circular Icon with Soft Shadow */}
              <div className="w-[56px] h-[56px] rounded-full bg-white flex items-center justify-center shadow-[0_6px_16px_rgba(0,0,0,0.06)] border border-zinc-100/30 transition-transform duration-300 hover:scale-105">
                <Icon className="h-5.5 w-5.5 text-gold" style={{ color: "#C89B6D" }} />
              </div>
              
              {/* Title */}
              <span className="text-[10px] font-bold tracking-[0.15em] text-foreground uppercase mt-4">
                {feature.title}
              </span>
              
              {/* Description */}
              <span className="text-[10px] text-zinc-400 font-light mt-1 max-w-[120px] leading-relaxed">
                {feature.description}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
