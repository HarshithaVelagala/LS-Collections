"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { ShoppingBag, X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";
import CouponInput from "./CouponInput";
import DeliveryChecker from "../products/detail/DeliveryChecker";

export default function CartDrawer() {
  const router = useRouter();
  const { cart, isCartOpen, setIsCartOpen, cartTotal } = useCart();
  
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Explicitly lock body scroll when drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  const handleApplyCoupon = (discount: number, code: string) => {
    setAppliedCoupon({ code });
    setDiscountAmount(discount);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
  };

  const finalTotal = cartTotal - discountAmount;

  const handleCheckout = () => {
    if (typeof window !== "undefined" && appliedCoupon) {
      sessionStorage.setItem("ls_applied_coupon", JSON.stringify({ code: appliedCoupon.code, discount: discountAmount }));
    }
    setIsCartOpen(false);
    router.push("/checkout");
  };

  if (!mounted || !isCartOpen) return null;

  return createPortal(
    <>
      {/* Overlay */}
      <div 
        className="animate-in fade-in duration-300"
        style={{ 
          position: "fixed", 
          inset: 0, 
          background: "rgba(0,0,0,0.45)", 
          zIndex: 9998 
        }}
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div 
        className="animate-in slide-in-from-right duration-300"
        style={{ 
          position: "fixed", 
          top: 0, 
          right: 0, 
          width: "460px",
          maxWidth: "100vw",
          height: "100vh", 
          background: "#FFFFFF", 
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          boxShadow: "-12px 0 40px rgba(0,0,0,0.12)",
          borderLeft: "1px solid #ECE6DF"
        }}
      >
        {/* Drawer Header */}
        <div className="px-8 py-6 border-b border-[#ECE6DF] flex flex-row items-center justify-between flex-shrink-0 bg-[#FFFFFF] z-10">
          <div className="flex items-center gap-2">
            <h2 className="text-left font-sans text-[#2C2C2C] text-[18px] font-medium tracking-wide m-0">
              Your Cart 
            </h2>
            {cart.length > 0 && (
              <span className="text-[14px] text-[#2C2C2C] tracking-wide mt-1">({cart.length} items)</span>
            )}
          </div>
          <button 
            onClick={() => setIsCartOpen(false)} 
            className="p-1 text-[#2C2C2C] hover:text-[#C89B6D] transition-colors focus:outline-none bg-transparent border-none cursor-pointer"
          >
            <X className="h-6 w-6 stroke-[1.2px]" />
          </button>
        </div>

        {/* Scrollable Content (Products + Promo + Delivery + Summary) */}
        <div className="flex-1 overflow-y-auto scrollbar-hide bg-[#FFFFFF] flex flex-col relative">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 space-y-6">
              <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-[#FFFFFF] border border-[#ECECEC] mb-2 animate-pulse">
                <div className="absolute inset-2 rounded-full border border-[#C89B6D]/20 flex items-center justify-center">
                  <ShoppingBag className="h-10 w-10 text-[#C89B6D] stroke-[1px]" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-serif text-xl tracking-wider text-[#2C2C2C] uppercase font-bold">Your Bag is Empty</h3>
                <p className="text-xs text-[#6F6F6F] font-light max-w-[280px] leading-relaxed">
                  Experience true elegance. Curated selection of premium sarees and luxury jewellery pieces await your discovery.
                </p>
              </div>
              <Button
                onClick={() => {
                  setIsCartOpen(false);
                  router.push("/products");
                }}
                className="w-full bg-[#C89B6D] hover:bg-[#b08558] text-white tracking-widest text-xs uppercase h-[52px] rounded-[10px] font-bold transition-all duration-300 mt-4"
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            <>
              {/* Product List */}
              <div className="flex flex-col px-8 pt-4 pb-2">
                {cart.map((item, idx) => (
                  <CartItem key={`${item.productId}-${item.variantSku || idx}`} item={item} />
                ))}
              </div>

              <div className="px-8 pb-8 flex flex-col gap-6">
                <CouponInput 
                  cartTotal={cartTotal}
                  appliedCoupon={appliedCoupon}
                  onApplyCoupon={handleApplyCoupon}
                  onRemoveCoupon={handleRemoveCoupon}
                />

                <DeliveryChecker />
                
                <CartSummary subtotal={finalTotal} />
              </div>
            </>
          )}
        </div>

        {/* Footer actions - Fixed at bottom */}
        {cart.length > 0 && (
          <div className="p-8 bg-[#FFFFFF] flex-shrink-0 z-10 border-t border-[#ECE6DF] mt-auto">
            <div className="flex flex-col gap-4">
              <Button
                onClick={handleCheckout}
                className="w-full bg-[#C89B6D] hover:bg-[#b08558] text-white font-bold tracking-widest uppercase rounded-[10px] transition-all duration-300 h-[52px]"
              >
                PROCEED TO CHECKOUT
              </Button>
              <Button
                onClick={() => { setIsCartOpen(false); router.push("/cart"); }}
                className="w-full bg-[#FFFFFF] border border-[#C89B6D] hover:bg-[#C89B6D]/5 text-[#C89B6D] font-bold tracking-widest uppercase rounded-[10px] transition-all duration-300 h-[52px]"
              >
                VIEW CART
              </Button>
            </div>

            <div className="mt-6 flex flex-col items-center gap-3">
              <p className="text-[10px] text-[#2C2C2C] font-medium tracking-wide text-center">
                By clicking on checkout you are agreeing to <a href="#" className="text-blue-600 hover:underline">Return Policy</a>.
              </p>
              <div className="w-full text-left">
                 <p className="text-[13px] text-[#2C2C2C] font-medium mb-3">We Accept</p>
                 <div className="flex flex-wrap items-center gap-2">
                    <div className="h-6 w-10 flex items-center justify-center bg-[#F7F7F7] rounded shadow-sm border border-[#ECECEC]">
                      <span className="text-[#1A1F71] font-bold text-[9px] italic">VISA</span>
                    </div>
                    <div className="h-6 w-10 flex items-center justify-center bg-[#F7F7F7] rounded shadow-sm border border-[#ECECEC]">
                      <div className="flex -space-x-1">
                        <div className="w-3 h-3 rounded-full bg-[#EB001B] z-10"></div>
                        <div className="w-3 h-3 rounded-full bg-[#F79E1B]"></div>
                      </div>
                    </div>
                    <div className="h-6 w-10 flex items-center justify-center bg-[#F7F7F7] rounded shadow-sm border border-[#ECECEC]">
                      <span className="text-[#016FD0] font-bold text-[8px]">AMEX</span>
                    </div>
                    <div className="h-6 px-1 flex items-center justify-center bg-[#422C23] rounded shadow-sm border border-[#422C23]">
                      <span className="text-white font-bold text-[7px] text-center leading-[1.1]">Cash on<br/>Delivery</span>
                    </div>
                    <div className="h-6 px-1.5 flex items-center justify-center bg-[#F7F7F7] rounded shadow-sm border border-[#ECECEC]">
                      <span className="text-[#2C2C2C] font-bold text-[8px]">BHIM<br/>UPI</span>
                    </div>
                    <div className="h-6 px-1 flex items-center justify-center bg-[#F7F7F7] rounded shadow-sm border border-[#ECECEC]">
                      <span className="text-[#016FD0] font-bold text-[9px] italic">RuPay</span>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>,
    document.body
  );
}
