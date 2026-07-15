"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/products/ProductCard";

interface RecentlyViewedProps {
  fallbackProducts: any[];
}

export default function RecentlyViewed({ fallbackProducts }: RecentlyViewedProps) {
  const [viewedProducts, setViewedProducts] = useState<any[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Ideally, we'd fetch full product details using IDs from localStorage.
    // For this UI enhancement, we'll display fallback related products 
    // to mock the carousel if we don't have a specific API endpoint ready.
    setViewedProducts(fallbackProducts);
  }, [fallbackProducts]);

  if (!isMounted || viewedProducts.length === 0) return null;

  return (
    <section className="mt-24 border-t border-border pt-16">
      <h2 className="text-2xl font-serif tracking-wider text-foreground uppercase mb-8">
        Recently Viewed
      </h2>
      
      <div className="flex overflow-x-auto gap-6 pb-6 scrollbar-hide snap-x">
        {viewedProducts.map((p, idx) => (
          <div key={`${p._id}-${idx}`} className="w-[280px] sm:w-[320px] flex-shrink-0 snap-start">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
