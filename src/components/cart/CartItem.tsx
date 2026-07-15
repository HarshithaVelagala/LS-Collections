"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2, Bookmark } from "lucide-react";
import QuantitySelector from "./QuantitySelector";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

interface CartItemProps {
  item: any;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();
  const { addToWishlist } = useWishlist();

  // Find a valid image path from all possible locations in the cart item
  const getCartItemImage = (item: any): string => {
    if (typeof item.image === "string" && item.image && !item.image.includes("placeholder")) {
      return item.image;
    }
    if (Array.isArray(item.media) && item.media.length > 0) {
      const first = item.media[0];
      if (typeof first === "string" && first) return first;
      if (first && typeof first.url === "string" && first.url) return first.url;
    }
    if (typeof item.media === "string" && item.media) return item.media;
    if (Array.isArray(item.gallery) && item.gallery.length > 0) {
      const first = item.gallery[0];
      if (typeof first === "string" && first) return first;
      if (first && typeof first.url === "string" && first.url) return first.url;
    }
    if (typeof item.gallery === "string" && item.gallery) return item.gallery;
    if (Array.isArray(item.images) && item.images.length > 0) {
      const first = item.images[0];
      if (typeof first === "string" && first) return first;
      if (first && typeof first.url === "string" && first.url) return first.url;
    }
    if (typeof item.images === "string" && item.images) return item.images;
    if (typeof item.primaryImage === "string" && item.primaryImage) return item.primaryImage;
    if (typeof item.thumbnail === "string" && item.thumbnail) return item.thumbnail;
    if (typeof item.image === "string" && item.image) return item.image;
    return "";
  };

  const imageUrl = getCartItemImage(item) || "/products/beige_linen.png";

  const handleSaveForLater = () => {
    addToWishlist({
      productId: item.productId,
      name: item.name,
      image: imageUrl,
      slug: item.slug,
      price: item.price,
      category: item.category || "General",
    });
    removeFromCart(item.productId, item.variantSku);
  };

  return (
    <div className="flex gap-4 py-6 border-b border-[#ECE6DF] last:border-b-0 items-start relative group animate-in fade-in duration-300">
      {/* Product Image */}
      <div className="relative h-[120px] w-[100px] flex-shrink-0 overflow-hidden rounded-[2px] flex items-center justify-center border border-[#ECE6DF]/50">
        <div className="absolute inset-0 bg-[#F7F7F7] animate-pulse z-0" />
        <Image
          src={imageUrl}
          alt={item.name}
          fill
          className="object-cover z-10"
          sizes="100px"
          priority
        />
      </div>
      
      {/* Product Details & Actions */}
      <div className="flex-grow flex justify-between min-w-0 min-h-[120px] pt-0.5">
        
        {/* Left Side: Product Info */}
        <div className="flex flex-col gap-1 pr-2">
          <Link href={`/products/${item.slug}`}>
            <h4 className="font-sans font-medium text-[15px] text-[#2C2C2C] hover:text-[#C89B6D] transition-colors line-clamp-2 leading-[1.4]">
              {item.name}
            </h4>
          </Link>
          
          {item.variantSku && (
            <p className="text-[12px] text-[#6F6F6F] font-normal">
              Variant: {item.variantSku}
            </p>
          )}
          
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-[#C89B6D] font-sans font-semibold text-[14px]">
              ₹{item.price.toLocaleString("en-IN")}
            </p>
            {item.originalPrice && item.originalPrice > item.price && (
              <p className="text-[#9A9A9A] text-[12px] line-through font-light">
                ₹{item.originalPrice.toLocaleString("en-IN")}
              </p>
            )}
          </div>

          <p className="text-[12px] text-[#2C2C2C] font-normal mt-0.5">
            Size: Free Size
          </p>
          
          <div className="mt-3">
            <QuantitySelector
              quantity={item.quantity}
              onIncrease={() => updateQuantity(item.productId, item.quantity + 1, item.variantSku)}
              onDecrease={() => updateQuantity(item.productId, item.quantity - 1, item.variantSku)}
            />
          </div>
        </div>
        
        {/* Right Side: Actions (Icons) */}
        <div className="flex flex-col items-center gap-4 shrink-0 pt-1">
          <button
            onClick={handleSaveForLater}
            className="text-[#2C2C2C] hover:text-[#C89B6D] transition-colors duration-200"
            aria-label="Save for later"
          >
            <Bookmark className="h-[18px] w-[18px] stroke-[1.5px]" />
          </button>
          
          <button
            onClick={() => removeFromCart(item.productId, item.variantSku)}
            className="text-[#2C2C2C] hover:text-[#D32F2F] transition-colors duration-200"
            aria-label="Remove item"
          >
            <Trash2 className="h-[18px] w-[18px] stroke-[1.5px]" />
          </button>
        </div>
      </div>
    </div>
  );
}
