"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, Share2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/products/ProductCard";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

// Modular Components
import ImageGallery from "@/components/products/detail/ImageGallery";
import ProductInfo from "@/components/products/detail/ProductInfo";
import ProductVariants from "@/components/products/detail/ProductVariants";
import DeliveryChecker from "@/components/products/detail/DeliveryChecker";
import ProductAccordion from "@/components/products/detail/ProductAccordion";
import RatingReviews from "@/components/products/detail/RatingReviews";
import StickyBuyBar from "@/components/products/detail/StickyBuyBar";
import WhyShopWithUs from "@/components/products/detail/WhyShopWithUs";

interface ProductDetailWrapperProps {
  product: any;
  relatedProducts: any[];
  isPreview?: boolean;
}

export default function ProductDetailWrapper({ product, relatedProducts, isPreview = false }: ProductDetailWrapperProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<any>(product?.variants?.[0] ?? null);
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const isLiked = isInWishlist(product._id);

  // Track recently viewed products in localStorage
  useEffect(() => {
    if (isPreview) return;
    try {
      const recentlyViewed = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
      const filtered = recentlyViewed.filter((id: string) => id !== product._id);
      filtered.unshift(product._id);
      localStorage.setItem("recentlyViewed", JSON.stringify(filtered.slice(0, 5)));
    } catch (e) {
      console.error("Failed to update recently viewed products", e);
    }
  }, [product._id, isPreview]);

  const activePrice = selectedVariant?.price || product.discountPrice || product.basePrice;
  const originalPrice = product.basePrice;

  const handleVariantSelect = (variant: any) => {
    setSelectedVariant(variant);
    if (variant.mediaIndices && variant.mediaIndices.length > 0) {
      setActiveImageIndex(variant.mediaIndices[0]);
    }
    // Reset quantity if stock limits it
    if (quantity > variant.stock) {
      setQuantity(Math.max(1, variant.stock));
    }
  };

  const handleAddToCart = () => {
    if (isPreview) return;
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
      quantity,
      variantSku: selectedVariant?.sku,
      variantName: selectedVariant
        ? Object.values(selectedVariant.attributes).filter(Boolean).join(" - ")
        : undefined,
    });
  };

  const handleAddAllToCart = (items: any[]) => {
    if (isPreview) return;
    items.forEach((item) => {
      const primaryImage = item.image || 
                           (item.media && item.media[0]?.url) || 
                           (item.images && item.images[0]) || 
                           (item.gallery && item.gallery[0]) || 
                           item.primaryImage || 
                           item.thumbnail || 
                           "/banners/saree_banner_1.png";
      addToCart({
        productId: item._id,
        name: item.name,
        image: primaryImage,
        slug: item.slug || item._id,
        price: item.price || item.discountPrice || item.basePrice,
        quantity: 1,
      });
    });
  };

  const totalReviews = product.reviews?.length || 0;
  const averageRating = totalReviews > 0
    ? (product.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / totalReviews).toFixed(1)
    : "5.0";

  const isOutOfStock = (selectedVariant?.stock || 0) <= 0;

  return (
    <div className={`mx-auto px-4 sm:px-6 lg:px-8 py-12 text-foreground ${isPreview ? 'w-full max-w-none' : 'max-w-7xl'}`}>
      
      {/* Product Detail Grid */}
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
        
        {/* Left 40%: Gallery Section */}
        <div className="w-full lg:w-2/5">
          <ImageGallery
            media={product.media}
            productName={product.name}
            activeImageIndex={activeImageIndex}
            setActiveImageIndex={setActiveImageIndex}
          />
          <RatingReviews reviews={product.reviews || []} averageRating={averageRating} totalReviews={totalReviews} />
        </div>

        {/* Right 60%: Description & Purchase Controls */}
        <div className="w-full lg:w-3/5 flex flex-col justify-start">

          <ProductInfo
            product={product}
            activePrice={activePrice}
            originalPrice={originalPrice}
            selectedVariant={selectedVariant}
            averageRating={averageRating}
            totalReviews={totalReviews}
          />

          {/* CTA action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Button
              disabled={isPreview || isOutOfStock}
              onClick={handleAddToCart}
              className="flex-1 bg-purple-royal hover:brightness-95 hover:shadow-[0_8px_20px_rgba(200,155,109,0.25)] text-white font-semibold tracking-wider text-xs uppercase py-7 rounded-sm transition-all duration-[250ms] ease-in-out shadow-sm"
            >
              Add to Bag
            </Button>
            <Button
              disabled={isPreview || isOutOfStock}
              onClick={() => {
                if (isPreview) return;
                handleAddToCart();
                // redirect to checkout will go here
              }}
              className="flex-1 bg-gradient-to-r from-gold via-gold-light to-gold-dark hover:brightness-95 hover:shadow-[0_8px_20px_rgba(200,155,109,0.3)] text-black font-bold tracking-wider text-xs uppercase py-7 rounded-sm transition-all duration-[250ms] ease-in-out shadow-sm"
            >
              Buy It Now
            </Button>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                disabled={isPreview}
                onClick={() =>
                  toggleWishlist({
                    productId: product._id,
                    name: product.name,
                    image: product.media[0]?.url || "/banners/saree_banner_1.png",
                    slug: product.slug,
                    price: activePrice,
                    category: product.category,
                  })
                }
                className={`h-14 w-14 border border-border rounded-none bg-card text-foreground flex-shrink-0 ${isLiked ? "text-gold border-gold/50" : "hover:text-gold hover:border-gold/30"
                  }`}
              >
                <Heart className={`h-5 w-5 ${isLiked ? "fill-gold text-gold" : ""}`} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                disabled={isPreview}
                onClick={() => {
                  if (isPreview) return;
                  if (navigator.share) {
                    navigator.share({
                      title: product.name,
                      url: window.location.href,
                    });
                  }
                }}
                className="h-14 w-14 border border-border rounded-none bg-card text-foreground hover:text-gold hover:border-gold/30 flex-shrink-0"
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2 mt-6">
            <div className={`px-2.5 py-1 border rounded-sm text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
              (selectedVariant?.stock ?? 0) > 5
                ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
                : (selectedVariant?.stock ?? 0) > 0
                ? "text-amber-400 bg-amber-400/10 border-amber-400/20"
                : "text-rose-400 bg-rose-400/10 border-rose-400/20"
            }`}>
              {(selectedVariant?.stock ?? 0) > 0 && (
                <span className={`h-1.5 w-1.5 rounded-full ${(selectedVariant?.stock ?? 0) > 5 ? "bg-emerald-400" : "bg-amber-400"} animate-pulse`} />
              )}
              {((selectedVariant?.stock ?? 0) > 5)
                ? "In Stock"
                : ((selectedVariant?.stock ?? 0) > 0)
                ? "Low Stock"
                : "Out of Stock"}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex flex-col gap-2 mt-6">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Quantity</span>
            <div className="flex items-center border border-border bg-card h-12 w-32 rounded-sm overflow-hidden">
              <button
                disabled={isPreview || quantity <= 1}
                onClick={() => setQuantity((q) => q - 1)}
                className="flex-1 h-full hover:bg-section-bg text-muted-foreground disabled:opacity-30 flex items-center justify-center text-lg transition-colors duration-[250ms] hover:text-gold"
              >
                -
              </button>
              <span className="flex-1 text-center text-sm font-semibold flex items-center justify-center h-full text-foreground">{quantity}</span>
              <button
                disabled={isPreview || isOutOfStock || quantity >= (selectedVariant?.stock || 0)}
                onClick={() => setQuantity((q) => q + 1)}
                className="flex-1 h-full hover:bg-section-bg text-muted-foreground disabled:opacity-30 flex items-center justify-center text-lg transition-colors duration-[250ms] hover:text-gold"
              >
                +
              </button>
            </div>
          </div>

          {/* Why Shop With Us Feature Strip */}
          <WhyShopWithUs />

          <ProductVariants
            variants={product.variants}
            selectedVariant={selectedVariant}
            handleVariantSelect={handleVariantSelect}
            basePrice={product.discountPrice || product.basePrice}
          />

          <div className="mt-8 space-y-6">
            <DeliveryChecker isPreview={isPreview} />
          </div>

          <ProductAccordion product={product} selectedVariant={selectedVariant} />

        </div>
      </div>



      {/* Related Products Grid (Using existing setup for seamless integration if viewed products are empty) */}
      {relatedProducts.length > 0 && (
        <section className="mt-24 border-t border-border pt-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-serif tracking-wider text-foreground uppercase">
              Similar Pieces
            </h2>
            <Link
              href={isPreview ? "#" : `/products?category=${product.category}`}
              onClick={(e) => isPreview && e.preventDefault()}
              className="text-xs font-semibold tracking-wider text-gold hover:text-gold-light flex gap-1 items-center uppercase"
            >
              See All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}



      <StickyBuyBar
        product={product}
        activePrice={activePrice}
        handleAddToCart={handleAddToCart}
        isOutOfStock={isOutOfStock}
        isPreview={isPreview}
      />

    </div>
  );
}
