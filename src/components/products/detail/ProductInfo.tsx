"use client";

import Link from "next/link";
import { Star, ChevronRight } from "lucide-react";

interface ProductInfoProps {
  product: any;
  activePrice: number;
  originalPrice: number;
  selectedVariant: any;
  averageRating: string;
  totalReviews: number;
}

export default function ProductInfo({
  product,
  activePrice,
  originalPrice,
  selectedVariant,
  averageRating,
  totalReviews,
}: ProductInfoProps) {
  const isDiscounted = activePrice < originalPrice;
  const discountPercent = isDiscounted 
    ? Math.round(((originalPrice - activePrice) / originalPrice) * 100)
    : 0;

  return (
    <div className="space-y-4">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-[10px] font-semibold tracking-wider text-zinc-500 uppercase overflow-x-auto whitespace-nowrap pb-1">
        <Link href="/" className="hover:text-gold transition-colors">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={`/products?category=${product.category}`} className="hover:text-gold transition-colors">{product.category}</Link>
        {product.subCategory && (
          <>
            <ChevronRight className="h-3 w-3" />
            <Link href={`/products?category=${product.category}&subcategory=${product.subCategory.toLowerCase().replace(/ /g, '-')}`} className="hover:text-gold transition-colors">
              {product.subCategory}
            </Link>
          </>
        )}
        <ChevronRight className="h-3 w-3" />
        <span className="text-zinc-300 truncate">{product.name}</span>
      </nav>

      {/* Brand & Rating */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-[0.3em] text-gold uppercase">
          LS Collections
        </span>
        <div className="flex items-center gap-1.5 bg-card border border-border px-2.5 py-1 text-xs">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-3 w-3 ${i < Math.round(Number(averageRating)) ? "fill-gold text-gold" : "fill-zinc-800 text-zinc-800"}`} />
            ))}
          </div>
          <span className="text-foreground font-bold ml-1">{averageRating}</span>
          <span className="text-muted-foreground">({totalReviews})</span>
        </div>
      </div>

      {/* Product Name */}
      <div className="flex flex-col gap-1 mt-2">
        <h1 className="font-serif text-2xl sm:text-3xl lg:text-[42px] font-bold tracking-wide text-foreground leading-tight">
          {product.name}
        </h1>
        {/* SKU */}
        <p className="text-[10px] text-zinc-500 tracking-widest uppercase">
          SKU: {selectedVariant?.sku || product._id}
        </p>
      </div>

      {/* Pricing Section */}
      <div className="flex flex-col gap-1.5 py-5 border-y border-border">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-3xl sm:text-4xl font-extrabold text-foreground">
            ₹{activePrice.toLocaleString("en-IN")}
          </span>
          {isDiscounted && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-zinc-400 line-through decoration-zinc-300 font-light">
                ₹{originalPrice.toLocaleString("en-IN")}
              </span>
              <span className="text-[10px] bg-gold/10 border border-gold/30 text-gold px-2 py-1 font-bold uppercase tracking-wider rounded-sm shadow-sm">
                {discountPercent}% OFF
              </span>
            </div>
          )}
        </div>
        <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-light">Inclusive of all taxes</span>
      </div>
    </div>
  );
}
