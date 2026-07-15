"use client";

import { Check, Clock, Package, Truck, Home } from "lucide-react";

interface OrderTimelineProps {
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  date: string;
}

export default function OrderTimeline({ status, date }: OrderTimelineProps) {
  const steps = [
    { id: "pending", label: "Order Placed", icon: Clock },
    { id: "processing", label: "Confirmed & Packed", icon: Package },
    { id: "shipped", label: "Shipped", icon: Truck },
    { id: "delivered", label: "Delivered", icon: Home },
  ];

  const getStepIndex = () => {
    switch (status) {
      case "pending": return 0;
      case "processing": return 1;
      case "shipped": return 2;
      case "delivered": return 3;
      case "cancelled": return -1;
      default: return 0;
    }
  };

  const currentIndex = getStepIndex();

  if (status === "cancelled") {
    return (
      <div className="bg-rose-500/10 border border-rose-500/20 p-6 text-center rounded-sm">
        <h4 className="text-rose-400 font-serif text-xl tracking-wider uppercase mb-2">Order Cancelled</h4>
        <p className="text-zinc-400 text-sm font-light">This order has been cancelled and cannot be tracked.</p>
      </div>
    );
  }

  return (
    <div className="relative py-8">
      {/* Background track */}
      <div className="absolute left-6 top-0 bottom-0 w-px bg-purple-royal/20 md:left-1/2 md:-ml-px md:w-full md:h-px md:top-1/2 md:bottom-auto"></div>
      
      {/* Active track */}
      <div 
        className="absolute left-6 top-0 w-px bg-gold transition-all duration-1000 md:left-0 md:top-1/2 md:-ml-px md:h-px"
        style={{ 
          height: currentIndex >= 0 ? `${(currentIndex / 3) * 100}%` : "0%",
          width: typeof window !== 'undefined' && window.innerWidth >= 768 ? `${(currentIndex / 3) * 100}%` : "1px" 
        }}
      ></div>

      <div className="relative flex flex-col gap-12 md:flex-row md:justify-between md:gap-0 z-10">
        {steps.map((step, idx) => {
          const isCompleted = idx <= currentIndex;
          const isActive = idx === currentIndex;
          const Icon = step.icon;

          return (
            <div key={step.id} className={`flex md:flex-col items-center gap-6 md:gap-4 group ${isCompleted ? 'text-gold' : 'text-zinc-600'}`}>
              <div 
                className={`h-12 w-12 rounded-full border-2 flex items-center justify-center bg-card transition-all duration-500 ${
                  isActive 
                    ? "border-gold text-gold shadow-[0_0_20px_rgba(212,175,55,0.4)]" 
                    : isCompleted 
                      ? "border-gold text-gold bg-gold/10" 
                      : "border-purple-royal/20 text-zinc-600"
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="md:text-center">
                <h4 className={`text-sm font-bold tracking-widest uppercase transition-colors ${isCompleted ? 'text-white' : 'text-zinc-500'}`}>
                  {step.label}
                </h4>
                {idx === 0 && <p className="text-[10px] text-zinc-400 mt-1">{date}</p>}
                {isActive && idx !== 0 && idx !== 3 && <p className="text-[10px] text-gold mt-1 animate-pulse">In Progress</p>}
                {isActive && idx === 3 && <p className="text-[10px] text-emerald-400 mt-1">Successfully Delivered</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
