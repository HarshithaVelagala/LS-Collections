"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

interface WishlistCardProps {
  item: any;
}

export default function WishlistCard({ item }: WishlistCardProps) {
  const { addToCart } = useCart();
  const { toggleWishlist } = useWishlist();

  const handleMoveToCart = () => {
    const primaryImage = item.image || 
                         (item.media && item.media[0]?.url) || 
                         (item.images && item.images[0]) || 
                         (item.gallery && item.gallery[0]) || 
                         item.primaryImage || 
                         item.thumbnail || 
                         "/banners/saree_banner_1.png";
    addToCart({
      productId: item.productId,
      name: item.name,
      image: primaryImage,
      slug: item.slug,
      price: item.price,
      quantity: 1,
    });
    toggleWishlist(item);
  };

  return (
    <div className="bg-card border border-[#ECECEC] flex flex-col group hover:border-[#C89B6D]/50 transition-all duration-[250ms] ease-out shadow-[0_8px_24px_rgba(90,60,30,0.06)] hover:shadow-[0_16px_32px_rgba(90,60,30,0.12)] hover:-translate-y-1 rounded-xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted rounded-t-xl">
        <Link href={`/products/${item.slug}`}>
          <Image
            src={item.image || "/banners/saree_banner_1.png"}
            alt={item.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        </Link>
      </div>
      <div className="p-4 flex flex-col gap-1.5">
        <Link href={`/products/${item.slug}`}>
          <h4 className="font-serif text-sm font-medium text-[#2C2C2C] opacity-100 antialiased leading-[1.45] truncate hover:text-[#C89B6D] transition-colors duration-200 ease-in-out">
            {item.name}
          </h4>
        </Link>
        <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{item.category}</p>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-[#C89B6D] font-bold text-sm">
            ₹{item.price.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="flex gap-2 mt-3 items-center">
          <Button
            onClick={handleMoveToCart}
            className="flex-1 bg-[#C89B6D] text-white font-bold tracking-wider text-[10px] uppercase h-10 rounded-sm transition-all duration-[250ms] ease-in-out hover:brightness-95 hover:shadow-[0_4px_12px_rgba(200,155,109,0.3)] shadow-sm"
          >
            Add to Bag
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => toggleWishlist(item)}
            className="h-10 w-10 border border-[#ECECEC] bg-card text-zinc-400 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50 rounded-sm shrink-0 transition-colors duration-[250ms] ease-in-out"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
