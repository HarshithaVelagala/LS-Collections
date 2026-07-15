"use client";

import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import EditorialProductCard from "@/components/home/EditorialProductCard";
import { Button } from "@/components/ui/button";

export default function NewArrivalsCarousel({ products }: { products: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = direction === "left" ? -clientWidth : clientWidth;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="relative group">
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto gap-8 sm:gap-10 pb-8 snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {products.map((prod) => (
          <div key={prod._id} className="min-w-[280px] md:min-w-[320px] max-w-[320px] snap-start shrink-0">
            <EditorialProductCard product={{ ...prod, isNew: true }} theme="light" />
          </div>
        ))}
      </div>
      
      {/* Navigation Buttons */}
      {canScrollLeft && (
        <Button
          onClick={() => scroll("left")}
          size="icon"
          className="absolute left-0 top-1/3 -translate-y-1/2 -translate-x-1/2 bg-white text-zinc-900 shadow-md border border-zinc-200 hover:bg-gold hover:text-white rounded-full h-10 w-10 z-10 transition-all opacity-0 group-hover:opacity-100"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
      )}
      {canScrollRight && (
        <Button
          onClick={() => scroll("right")}
          size="icon"
          className="absolute right-0 top-1/3 -translate-y-1/2 translate-x-1/2 bg-white text-zinc-900 shadow-md border border-zinc-200 hover:bg-gold hover:text-white rounded-full h-10 w-10 z-10 transition-all opacity-0 group-hover:opacity-100"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}
