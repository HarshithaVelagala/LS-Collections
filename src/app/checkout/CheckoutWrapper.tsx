"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, ShieldCheck, Tag } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

import CheckoutStepper from "@/components/checkout/CheckoutStepper";
import AddressForm from "@/components/checkout/AddressForm";
import PaymentSection from "@/components/checkout/PaymentSection";
import CouponInput from "@/components/cart/CouponInput";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutWrapper() {
  const router = useRouter();
  const { cart, cartTotal, clearCart } = useCart();

  const [currentStep, setCurrentStep] = useState(1);
  const [shippingAddress, setShippingAddress] = useState({
    name: "", phone: "", addressLine: "", city: "", state: "", zip: "",
  });

  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Load Razorpay
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    
    // Check if coupon exists in session storage (passed from CartDrawer)
    if (typeof window !== "undefined") {
      const savedCoupon = sessionStorage.getItem("ls_applied_coupon");
      if (savedCoupon) {
        try {
          const { code, discount } = JSON.parse(savedCoupon);
          setAppliedCoupon({ code });
          setDiscountAmount(discount);
          sessionStorage.removeItem("ls_applied_coupon"); // consume it
        } catch (e) {}
      }
    }

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const finalAmount = cartTotal - discountAmount;

  const handlePlaceOrder = async () => {
    setPaymentLoading(true);

    try {
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((item) => ({
            productId: item.productId,
            variantSku: item.variantSku,
            quantity: item.quantity,
            price: item.price,
          })),
          totalAmount: cartTotal,
          discountAmount,
          shippingAddress,
          userId: "guest_user",
        }),
      });
      const orderData = await res.json();

      if (!orderData.success) {
        throw new Error(orderData.message || "Failed to initialize order.");
      }

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "LS Collections",
        description: "Luxury Shopping Purchase",
        order_id: orderData.razorpayOrderId,
        handler: async function (response: any) {
          try {
            setPaymentLoading(true);
            const verifyRes = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: orderData.orderId,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              clearCart();
              router.push(`/checkout/success?orderId=${orderData.orderId}`);
            } else {
              alert("Payment verification failed.");
            }
          } catch (err: any) {
            alert("Verification error");
          } finally {
            setPaymentLoading(false);
          }
        },
        prefill: {
          name: shippingAddress.name,
          contact: shippingAddress.phone,
        },
        theme: { color: "#5A189A" },
        modal: { ondismiss: () => setPaymentLoading(false) },
      };

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        setTimeout(async () => {
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: orderData.orderId,
              razorpayOrderId: orderData.razorpayOrderId,
              razorpayPaymentId: `pay_mock_${Date.now().toString().slice(-8)}`,
              razorpaySignature: "mock_signature",
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            clearCart();
            router.push(`/checkout/success?orderId=${orderData.orderId}`);
          }
          setPaymentLoading(false);
        }, 1500);
      }
    } catch (error: any) {
      alert("Checkout error: " + error.message);
      setPaymentLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-foreground">
        <Loader2 className="h-10 w-10 animate-spin text-gold mx-auto mb-6" />
        <h2 className="text-2xl font-serif tracking-wider mb-4">No Items to Checkout</h2>
        <Link href="/products" className="text-gold underline text-sm tracking-wider uppercase">
          Go back to store
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-foreground">
      <Link href="/products" className="text-muted-foreground hover:text-gold transition-colors flex items-center gap-1.5 text-xs uppercase tracking-wider mb-8 w-fit">
        <ArrowLeft className="h-4 w-4" /> Back to Store
      </Link>
      
      <CheckoutStepper currentStep={currentStep} />

      <div className="mt-8 relative overflow-hidden">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: ADDRESS */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AddressForm 
                shippingAddress={shippingAddress} 
                handleInputChange={handleInputChange} 
                onSubmit={(e) => {
                  e.preventDefault();
                  setCurrentStep(2);
                }} 
              />
            </motion.div>
          )}

          {/* STEP 2: SUMMARY */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-card p-6 sm:p-8 border border-border space-y-6 shadow-sm"
            >
              <h2 className="font-serif text-xl tracking-wider text-gold uppercase border-b border-border pb-4">
                Review Your Order
              </h2>

              <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2">
                {cart.map((item) => (
                  <div key={`${item.productId}-${item.variantSku}`} className="flex gap-4 border-b border-border pb-4">
                    <div className="relative h-20 w-16 bg-muted border border-border flex-shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <h4 className="text-sm font-semibold text-foreground truncate">{item.name}</h4>
                      <p className="text-[10px] text-muted-foreground font-light mt-1 uppercase tracking-wider">
                        Qty: {item.quantity} {item.variantSku && `| Variant: ${item.variantSku}`}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-foreground self-center">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>

              <div className="max-w-md pt-4">
                <CouponInput
                  cartTotal={cartTotal}
                  appliedCoupon={appliedCoupon}
                  onApplyCoupon={(discount, code) => {
                    setAppliedCoupon({ code });
                    setDiscountAmount(discount);
                  }}
                  onRemoveCoupon={() => {
                    setAppliedCoupon(null);
                    setDiscountAmount(0);
                  }}
                />
              </div>

              <div className="border-t border-border pt-4 space-y-3 text-sm text-muted-foreground">
                <div className="flex justify-between font-light">
                  <span>Items Subtotal</span>
                  <span>₹{cartTotal.toLocaleString("en-IN")}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-gold font-medium">
                    <span>Coupon Discount</span>
                    <span>- ₹{discountAmount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between font-light">
                  <span>Shipping Fees</span>
                  <span className="text-emerald-600 font-bold uppercase text-xs">FREE</span>
                </div>
                <div className="border-t border-border pt-4 flex justify-between items-baseline text-foreground">
                  <span className="font-serif tracking-wider">TOTAL PAYABLE</span>
                  <span className="text-2xl font-extrabold text-gold">
                    ₹{finalAmount.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-border">
                <Button variant="ghost" onClick={() => setCurrentStep(1)} className="text-muted-foreground hover:text-foreground uppercase tracking-widest text-xs rounded-none">
                  Back
                </Button>
                <Button onClick={() => setCurrentStep(3)} className="bg-primary hover:bg-gold-light text-white rounded-none tracking-widest uppercase font-bold px-8 h-12 transition-colors shadow-md hover:shadow-primary/20">
                  Proceed to Payment
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: PAYMENT */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <PaymentSection
                total={finalAmount}
                loading={paymentLoading}
                onPay={handlePlaceOrder}
                onBack={() => setCurrentStep(2)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
