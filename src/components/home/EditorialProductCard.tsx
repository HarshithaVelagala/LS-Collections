"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Heart, Eye, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

interface EditorialProductCardProps {
  product: any;
  theme: "light" | "dark";
}

export default function EditorialProductCard({ product, theme }: EditorialProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const isLiked = isInWishlist(product._id);
  const activePrice = product.discountPrice || product.basePrice;
  const isDiscounted = !!product.discountPrice;
  const discountPercent = isDiscounted
    ? Math.round(((product.basePrice - product.discountPrice) / product.basePrice) * 100)
    : 0;

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const primaryImage = product.media?.[0]?.url || 
                         (product.images && product.images[0]) || 
                         (product.gallery && product.gallery[0]) || 
                         product.primaryImage || 
                         product.thumbnail || 
                         product.image || 
                         "/banners/saree_banner_1.png";
    toggleWishlist({
      productId: product._id,
      name: product.name,
      image: primaryImage,
      slug: product.slug,
      price: activePrice,
      category: product.category,
    });
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const primaryImage = product.media?.[0]?.url || 
                         (product.images && product.images[0]) || 
                         (product.gallery && product.gallery[0]) || 
                         product.primaryImage || 
                         product.thumbnail || 
                         product.image || 
                         "/banners/saree_banner_1.png";
    addToCart({
      productId: product._id,
      name: product.name,
      image: primaryImage,
      slug: product.slug,
      price: activePrice,
      quantity: 1,
      variantSku: product.variants?.[0]?.sku,
      personalization: {},
    });
  };

  const isLightTheme = theme === "light";

  return (
    <Link href={`/products/${product.slug}`} className="block group h-full">
      <div
        className="relative flex flex-col h-full overflow-hidden transition-all duration-300 border hover:-translate-y-1 bg-card border-[#ECECEC] shadow-sm hover:border-[#C89B6D]/60 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06),0_0_12px_rgba(200,155,109,0.15)] rounded-2xl"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 pointer-events-none">
          {product.isTrending && (
            <span className="bg-primary text-white text-[8px] font-bold tracking-widest px-2 py-0.5 uppercase rounded-none">
              Trending
            </span>
          )}
          {product.isNew && (
            <span className="bg-white text-black border border-zinc-200 text-[8px] font-bold tracking-widest px-2 py-0.5 uppercase rounded-none">
              New
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-gold text-black text-[8px] font-bold tracking-widest px-2 py-0.5 uppercase rounded-none">
              Best Seller
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-gold text-black text-[8px] font-extrabold tracking-widest px-2 py-0.5 uppercase rounded-none">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Action */}
        <button
          onClick={handleLike}
          className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full flex items-center justify-center backdrop-blur-sm border transition-all duration-300 bg-card/80 border-border text-foreground hover:text-gold hover:border-primary/50 hover:scale-110"
        >
          <Heart className={`h-3.5 w-3.5 transition-all duration-300 ${isLiked ? "fill-gold text-gold scale-110" : ""}`} />
        </button>

        {/* Product Image */}
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted">
          {product.media && product.media[0] ? (
            <motion.div
              animate={{ scale: isHovered ? 1.03 : 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="h-full w-full relative"
            >
              <Image
                src={product.media[0].url}
                alt={product.media[0].alt || product.name}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover"
                priority={false}
              />
            </motion.div>
          ) : (
            <div className="h-full w-full flex items-center justify-center text-zinc-400">
              No Image
            </div>
          )}

          {/* Quick Buy Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-background/40 flex items-center justify-center gap-3 backdrop-blur-[1px]"
          >
            <Button
              onClick={handleAddToCart}
              className="bg-primary hover:bg-gold-light text-white rounded-none px-6 py-5 transition-all tracking-wider text-xs uppercase flex items-center gap-2 shadow-md hover:shadow-primary/20"
              title="Add to Cart"
            >
              <ShoppingBag className="h-4 w-4" /> Add to Cart
            </Button>
          </motion.div>
        </div>

        {/* Details Footer */}
        <div className="p-5 flex flex-col flex-grow border- border-[#EEEEEE]">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[9px] tracking-widest uppercase font-light text-muted-foreground block">
              {product.subCategory || product.category}
            </span>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-3 h-3 text-gold fill-gold" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ))}
            </div>
          </div>
          
          <h3
            className="font-serif text-sm font-medium tracking-wide mt-1.5 leading-[1.45] text-[#2C2C2C] opacity-100 antialiased transition-colors duration-200 ease-in-out group-hover:text-[#C89B6D] line-clamp-2"
          >
            {product.name}
          </h3>
          
          <div className="flex items-center gap-2 mt-auto pt-4">
            <span className="text-sm font-bold text-gold">
              ₹{activePrice.toLocaleString("en-IN")}
            </span>
            {isDiscounted && (
              <span className="text-xs line-through text-muted-foreground">
                ₹{product.basePrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

// Utility class helper
import { cn } from "@/lib/utils";

