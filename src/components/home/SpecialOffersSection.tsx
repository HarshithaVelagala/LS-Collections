"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SpecialOffersSection() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 48,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[500px] w-full overflow-hidden flex items-center justify-center">
      {/* Background Image with Light Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
        style={{ backgroundImage: "url('/banners/saree_banner_1.png')" }}
      >
        <div className="absolute inset-0 bg-background/85 backdrop-blur-[2px]"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto flex flex-col items-center">
        <span className="text-gold font-bold tracking-[0.4em] text-xs uppercase mb-4 flex items-center gap-4 before:h-[1px] before:w-8 before:bg-gold after:h-[1px] after:w-8 after:bg-gold">
          Exclusive Privilege
        </span>
        
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-foreground tracking-wider mb-6 leading-tight">
          LIMITED TIME OFFER
        </h2>
        
        <p className="text-muted-foreground font-light text-sm md:text-base mb-10 max-w-xl mx-auto leading-relaxed">
          Experience the pinnacle of luxury with an exclusive 20% privilege on our signature Kanjeevaram and Bridal Jewellery collections. Valid for a limited time only.
        </p>
        
        {/* Countdown Timer */}
        <div className="flex gap-4 md:gap-8 mb-10 text-foreground font-serif">
          <div className="flex flex-col items-center">
            <span className="text-3xl md:text-4xl font-bold tracking-widest">{timeLeft.hours.toString().padStart(2, "0")}</span>
            <span className="text-[10px] text-gold tracking-[0.2em] uppercase mt-1">Hours</span>
          </div>
          <span className="text-3xl md:text-4xl font-light text-gold/50">:</span>
          <div className="flex flex-col items-center">
            <span className="text-3xl md:text-4xl font-bold tracking-widest">{timeLeft.minutes.toString().padStart(2, "0")}</span>
            <span className="text-[10px] text-gold tracking-[0.2em] uppercase mt-1">Minutes</span>
          </div>
          <span className="text-3xl md:text-4xl font-light text-gold/50">:</span>
          <div className="flex flex-col items-center">
            <span className="text-3xl md:text-4xl font-bold tracking-widest">{timeLeft.seconds.toString().padStart(2, "0")}</span>
            <span className="text-[10px] text-gold tracking-[0.2em] uppercase mt-1">Seconds</span>
          </div>
        </div>
        
        <Link href="/products?offers=true">
          <Button className="bg-primary hover:bg-gold-light text-white rounded-none px-10 py-6 tracking-widest text-xs font-bold uppercase transition-all duration-300 hover:scale-105">
            Shop Now
          </Button>
        </Link>
      </div>
    </section>
  );
}
