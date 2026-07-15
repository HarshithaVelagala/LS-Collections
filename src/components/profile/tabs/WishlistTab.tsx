"use client";

import { Heart } from "lucide-react";
import WishlistCard from "../../profile/WishlistCard";
import EmptyState from "../EmptyState";
import { useWishlist } from "@/context/WishlistContext";

interface WishlistTabProps {
  onNavigateToProducts: () => void;
}

export default function WishlistTab({ onNavigateToProducts }: WishlistTabProps) {
  const { wishlist } = useWishlist();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between border-b border-border pb-2 mb-6">
        <h3 className="font-serif text-gold text-xl tracking-wider font-semibold uppercase">
          My Wishlist ({wishlist.length})
        </h3>
      </div>
      
      {wishlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8 space-y-6">
          <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-[#FFFFFF] border border-[#ECECEC] mb-2 animate-pulse">
            <div className="absolute inset-2 rounded-full border border-[#C89B6D]/20 flex items-center justify-center">
              <Heart className="h-10 w-10 text-[#C89B6D] stroke-[1px]" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="font-serif text-xl tracking-wider text-foreground uppercase font-bold">Your Wishlist is Waiting</h3>
            <p className="text-xs text-muted-foreground font-light max-w-[280px] leading-relaxed">
              Save your favorite styles and revisit them anytime.
            </p>
          </div>
          <button
            onClick={onNavigateToProducts}
            className="bg-[#C89B6D] text-white tracking-widest text-xs uppercase h-12 px-8 rounded-sm font-bold transition-all duration-[250ms] ease-in-out hover:brightness-95 hover:shadow-[0_8px_20px_rgba(200,155,109,0.3)] shadow-sm mt-4"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <WishlistCard key={item.productId} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
