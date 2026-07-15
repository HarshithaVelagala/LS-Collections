"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    slug: string;
    basePrice: number;
    discountPrice?: number;
    media: { url: string; alt?: string }[];
    category: string;
    subCategory?: string;
    isTrending?: boolean;
    isFeatured?: boolean;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const { addToCart } = useCart();

  const calculateDiscount = () => {
    if (!product.discountPrice) return 0;
    return Math.round(((product.basePrice - product.discountPrice) / product.basePrice) * 100);
  };

  const discountPercent = calculateDiscount();

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
    // Real wishlist handling will be hooked up in Phase 4
  };

  return (
    <>
      <Link href={`/products/${product.slug}`} className="block group h-full">
      <div
        className="relative flex flex-col h-full bg-white border border-[#ECECEC] overflow-hidden transition-all duration-[250ms] ease-out shadow-[0_12px_30px_rgba(90,60,30,0.08)] hover:-translate-y-[4px] hover:border-[#C89B6D]/60 hover:shadow-[0_20px_40px_rgba(90,60,30,0.12)] rounded-2xl"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
          {product.isTrending && (
            <span className="bg-primary text-white text-[9px] font-bold tracking-wider px-2 py-0.5 uppercase rounded-sm shadow-md">
              Trending
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-gold text-black text-[9px] font-extrabold tracking-wider px-2 py-0.5 uppercase rounded-sm shadow-md">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Wishlist quick-action */}
        <button
          onClick={handleLike}
          className="absolute top-3 right-3 z-10 h-8 w-8 bg-white/85 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-white hover:text-gold hover:border-primary/50 transition-all duration-[250ms] group/wishlist backdrop-blur-sm shadow-sm hover:shadow-md"
        >
          <Heart className={`h-4 w-4 transition-transform duration-[250ms] group-hover/wishlist:scale-[1.05] ${isLiked ? "fill-gold text-gold scale-[1.05]" : ""}`} />
        </button>

        {/* Product Image Container */}
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted">
          {product.media && product.media[0] ? (
            <motion.div
              animate={{ scale: isHovered ? 1.02 : 1 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="h-full w-full relative"
            >
              <Image
                src={product.media[0].url}
                alt={product.media[0].alt || product.name}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover"
                priority={false}
              />
            </motion.div>
          ) : (
            <div className="h-full w-full flex items-center justify-center text-zinc-600">
              No Image
            </div>
          )}

          {/* Quick-action overlay panel */}
          <div
            className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-3 z-20 md:inset-0 md:bottom-0 md:bg-background/40 md:backdrop-blur-[1px] md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300"
          >
            <Button
              size="icon"
              className="bg-white hover:bg-hover-bg border border-border text-foreground hover:text-primary h-10 w-10 rounded-full transition-all duration-300 shadow-sm pointer-events-auto cursor-pointer"
              title="Quick View"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsQuickViewOpen(true);
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              className="bg-primary hover:bg-gold-light text-white border-none h-10 w-10 rounded-full transition-all duration-300 shadow-sm pointer-events-auto cursor-pointer"
              title="Add to Cart"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const prodAny = product as any;
                const primaryImage = product.media?.[0]?.url || 
                                     (prodAny.images && prodAny.images[0]) || 
                                     (prodAny.gallery && prodAny.gallery[0]) || 
                                     prodAny.primaryImage || 
                                     prodAny.thumbnail || 
                                     prodAny.image || 
                                     "/banners/saree_banner_1.png";
                addToCart({
                  productId: product._id,
                  name: product.name,
                  image: primaryImage,
                  slug: product.slug,
                  price: product.discountPrice || product.basePrice,
                  quantity: 1,
                  variantSku: (product as any).variants?.[0]?.sku,
                  personalization: {},
                });
              }}
            >
              <ShoppingBag className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Product Information Footer */}
        <div className="p-5 flex flex-col flex-grow border- border-[#EEEEEE]">
          <span className="text-[10px] tracking-widest text-muted-foreground uppercase font-light mb-1.5 block">
            {product.subCategory || product.category}
          </span>
          <h3 className="font-serif text-sm font-medium tracking-wide text-[#2C2C2C] opacity-100 antialiased leading-[1.45] group-hover:text-[#C89B6D] transition-colors duration-200 ease-in-out line-clamp-2">
            {product.name}
          </h3>
          
          {/* Price Container */}
          <div className="flex items-center gap-2 mt-auto pt-4">
            {product.discountPrice ? (
              <>
                <span className="text-sm font-bold text-gold">
                  ₹{product.discountPrice.toLocaleString("en-IN")}
                </span>
                <span className="text-xs text-zinc-500 line-through">
                  ₹{product.basePrice.toLocaleString("en-IN")}
                </span>
              </>
            ) : (
              <span className="text-sm font-bold text-foreground">
                ₹{product.basePrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>

    <Dialog open={isQuickViewOpen} onOpenChange={setIsQuickViewOpen}>
      <DialogContent className="max-w-2xl bg-white border border-border text-foreground p-6 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl font-bold tracking-wide uppercase">
            {product.name}
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* Left side: Image */}
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-muted border border-[#ECECEC]">
            {product.media && product.media[0] ? (
              <Image
                src={product.media[0].url}
                alt={product.media[0].alt || product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-zinc-600">
                No Image
              </div>
            )}
          </div>

          {/* Right side: Info */}
          <div className="flex flex-col justify-between">
            <div>
              <span className="text-[10px] tracking-widest text-muted-foreground uppercase font-light mb-2 block">
                {product.subCategory || product.category}
              </span>
              
              {/* Price */}
              <div className="flex items-center gap-3 my-4">
                {product.discountPrice ? (
                  <>
                    <span className="text-2xl font-extrabold text-gold">
                      ₹{product.discountPrice.toLocaleString("en-IN")}
                    </span>
                    <span className="text-sm text-zinc-500 line-through">
                      ₹{product.basePrice.toLocaleString("en-IN")}
                    </span>
                  </>
                ) : (
                  <span className="text-2xl font-extrabold text-foreground">
                    ₹{product.basePrice.toLocaleString("en-IN")}
                  </span>
                )}
              </div>

              <p className="text-sm font-light text-muted-foreground leading-relaxed">
                {(product as any).shortDescription || (product as any).description || "Experience elegance with this exclusive piece from our premium collections."}
              </p>
            </div>

            {/* Add to Cart in Modal */}
            <div className="mt-6">
              <Button
                className="w-full bg-primary hover:bg-gold-light text-white rounded-xl py-6 tracking-widest text-xs uppercase flex items-center justify-center gap-2 transition-all shadow-md"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const prodAny = product as any;
                  const primaryImage = product.media?.[0]?.url || 
                                       (prodAny.images && prodAny.images[0]) || 
                                       (prodAny.gallery && prodAny.gallery[0]) || 
                                       prodAny.primaryImage || 
                                       prodAny.thumbnail || 
                                       prodAny.image || 
                                       "/banners/saree_banner_1.png";
                  addToCart({
                    productId: product._id,
                    name: product.name,
                    image: primaryImage,
                    slug: product.slug,
                    price: product.discountPrice || product.basePrice,
                    quantity: 1,
                    variantSku: (product as any).variants?.[0]?.sku,
                    personalization: {},
                  });
                  setIsQuickViewOpen(false);
                }}
              >
                <ShoppingBag className="h-4 w-4" /> Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}

