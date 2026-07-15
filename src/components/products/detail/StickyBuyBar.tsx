"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface StickyBuyBarProps {
  product: any;
  activePrice: number;
  handleAddToCart: () => void;
  isOutOfStock: boolean;
  isPreview?: boolean;
}

export default function StickyBuyBar({ product, activePrice, handleAddToCart, isOutOfStock, isPreview = false }: StickyBuyBarProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show the sticky bar after scrolling past the main product section (~800px)
      if (window.scrollY > 800) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-md border-t border-border shadow-[0_-10px_30px_rgba(0,0,0,0.08)]"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
            
            {/* Left: Product Info (Hidden on very small mobile) */}
            <div className="hidden sm:flex items-center gap-4 flex-1 min-w-0">
              <div className="relative h-12 w-10 flex-shrink-0 border border-border">
                <Image
                  src={product.media[0]?.url || "/banners/saree_banner_1.png"}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="text-foreground font-serif font-bold tracking-wide text-sm truncate">
                  {product.name}
                </p>
                <p className="text-gold font-bold text-xs">
                  ₹{activePrice.toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Show price on mobile if info is hidden */}
              <div className="sm:hidden flex-1">
                <p className="text-gold font-bold text-sm">
                  ₹{activePrice.toLocaleString("en-IN")}
                </p>
              </div>
              
              <Button
                disabled={isPreview || isOutOfStock}
                onClick={handleAddToCart}
                className="flex-1 sm:flex-none bg-purple-royal hover:bg-purple-light text-white font-bold tracking-wider text-[10px] sm:text-xs uppercase px-4 sm:px-8 py-4 sm:py-5 rounded-none transition-all shadow-lg"
              >
                Add to Bag
              </Button>
              <Button
                disabled={isPreview || isOutOfStock}
                onClick={() => {
                  if (isPreview) return;
                  handleAddToCart();
                  // In real app, trigger checkout redirect here
                }}
                className="flex-1 sm:flex-none bg-gradient-to-r from-gold via-gold-light to-gold-dark text-black font-bold tracking-wider text-[10px] sm:text-xs uppercase px-4 sm:px-8 py-4 sm:py-5 rounded-none transition-all shadow-lg"
              >
                Buy Now
              </Button>
            </div>
            
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
