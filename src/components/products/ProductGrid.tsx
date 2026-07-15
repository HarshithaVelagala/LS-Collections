"use client";

import ProductCard from "./ProductCard";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";

interface ProductGridProps {
  products: any[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  const router = useRouter();
  const pathname = usePathname();

  if (products.length === 0) {
    return (
      <div className="bg-[#FFFFFF]/30 p-12 border border-[#ECECEC] text-center flex flex-col items-center justify-center min-h-[400px] animate-in fade-in duration-500 rounded-sm">
        <SearchX className="h-12 w-12 text-[#C89B6D] mb-4 stroke-[1.5px]" />
        <h3 className="font-serif text-xl tracking-wider text-foreground uppercase mb-2">
          No Products Found
        </h3>
        <p className="text-sm font-light text-zinc-500 max-w-md mb-8">
          We couldn't find any pieces matching your current filters. Try adjusting or clearing some filters to explore more of our collection.
        </p>
        <Button
          onClick={() => router.push(pathname)}
          className="bg-[#C89B6D] text-white tracking-widest text-xs uppercase h-12 px-8 rounded-sm font-bold transition-all duration-[250ms] ease-in-out hover:brightness-95 hover:shadow-[0_4px_12px_rgba(200,155,109,0.3)] shadow-sm"
        >
          Clear All Filters
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
