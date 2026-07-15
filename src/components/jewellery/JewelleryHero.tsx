"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function JewelleryHero() {
  const scrollToCollection = () => {
    const el = document.getElementById("jewellery-collection-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative h-[70vh] w-full overflow-hidden bg-[#2C221C] select-none flex items-center justify-center">
      {/* Background Image with luxury filter */}
      <div
        className="absolute inset-0 h-full w-full bg-cover bg-center"
        style={{
          backgroundImage: `url(/banners/jewelry_banner_1.png)`,
          filter: "brightness(0.55) contrast(1.05) saturate(0.95)",
        }}
      />

      {/* Luxury Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#2C221C]/25 via-background/40 to-background opacity-90" />

      {/* Text content */}
      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 0.9, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-xs sm:text-sm font-semibold tracking-[0.4em] text-gold uppercase mb-4"
        >
          ROYAL SPARKLE & HEIRLOOMS
        </motion.p>
        
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
          className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-wider text-white mb-6 uppercase leading-tight"
        >
          PREMIUM JEWELLERY
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 0.8, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
          className="text-sm sm:text-base font-light text-zinc-200 mb-8 max-w-xl mx-auto leading-relaxed"
        >
          Intricately crafted Kundan, Temple, and premium gold-plated masterpieces. 
          Discover adornments that reflect the grandeur of heritage.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
        >
          <Button
            onClick={scrollToCollection}
            className="bg-gold hover:bg-gold-light text-black border-none rounded-none tracking-widest text-xs uppercase px-8 py-6 font-bold transition-all duration-300 shadow-lg shadow-gold/20"
          >
            Explore Collection
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
