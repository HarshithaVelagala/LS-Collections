"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { ShieldCheck, Truck, RefreshCw, CheckCircle, CreditCard, Lock, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer({ hideNewsletter = false, minimal = false }: { hideNewsletter?: boolean, minimal?: boolean }) {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Hide the footer completely on the Home/Landing page
  if (pathname === "/") {
    return null;
  }

  // Determine visibility rules based on path
  const isShoppingPage =
    pathname.startsWith("/sarees") ||
    pathname.startsWith("/jewellery") ||
    pathname.startsWith("/featured") ||
    pathname.startsWith("/trending") ||
    pathname.startsWith("/products");

  const showFullFooter = isShoppingPage && !minimal;
  const showNewsletterSection = isShoppingPage && !hideNewsletter && !minimal;

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setEmail("");
      setTimeout(() => setIsSuccess(false), 3000);
    }, 1000);
  };

  return (
    <footer className={`w-full bg-[#FFFFFF] text-[#5A5A5A] border- border-[#EEEEEE] ${showFullFooter ? 'pt-20 pb-12' : 'py-8'}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Newsletter Section */}
        {showNewsletterSection && (
          <div
            className="flex flex-col lg:flex-row items-center justify-between border border-[#D8C3B2] rounded-xl p-8 lg:p-12 mb-16 gap-8 shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
            style={{ background: "linear-gradient(135deg, #d4b9a5ff 0%, #e3c7afff 100%)" }}
          >
            <div className="max-w-md text-center lg:text-left">
              <h3 className="font-serif text-2xl tracking-wider text-[#A37B53] mb-2">JOIN THE LS CLUB</h3>
              <p className="text-sm text-[#5A5A5A] font-light">
                Subscribe to receive exclusive access to limited-edition drops, VIP styling guides, and seasonal previews.
              </p>
            </div>
            <div className="w-full max-w-md">
              <form onSubmit={handleSubscribe} className="flex w-full gap-2 relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  disabled={isLoading || isSuccess}
                  className="flex-1 bg-[#F7F7F7] border border-[#ECECEC] text-[#5A5A5A] text-sm px-4 py-3 rounded-md focus:outline-none focus:border-[#C89B6D] focus:ring-1 focus:ring-[#C89B6D]/30 transition-all font-light disabled:opacity-50 placeholder:text-[#999999]"
                />
                <Button
                  type="submit"
                  disabled={isLoading || isSuccess}
                  className="bg-[#C89B6D] hover:bg-[#B3875B] text-white text-sm font-semibold tracking-wider px-6 uppercase rounded-sm transition-all duration-300 border-none min-w-[120px]"
                >
                  {isLoading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : isSuccess ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    "Subscribe"
                  )}
                </Button>
              </form>
              {isSuccess && (
                <p className="text-green-600 text-xs mt-2 absolute flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" /> Thank you for subscribing to our VIP newsletter!
                </p>
              )}
            </div>
          </div>
        )}

        {/* Footer Navigation Columns */}
        {showFullFooter && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 text-sm">
            <div>
              <h4 className="font-serif text-[#C89B6D] tracking-widest text-base mb-6 uppercase">SHOPPING</h4>
              <ul className="flex flex-col gap-3 font-light text-[#5A5A5A]">
                <li><Link href="/products?category=banarasi" className="hover:text-[#C89B6D] text-[#5A5A5A] transition-colors">Banarasi Sarees</Link></li>
                <li><Link href="/products?category=silk" className="hover:text-[#C89B6D] text-[#5A5A5A] transition-colors">Kanjeevaram Silk</Link></li>
                <li><Link href="/products?category=neck-set" className="hover:text-[#C89B6D] text-[#5A5A5A] transition-colors">Kundan Chokers</Link></li>
                <li><Link href="/products?category=jewellery" className="hover:text-[#C89B6D] text-[#5A5A5A] transition-colors">Temple Jewellery</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-serif text-[#C89B6D] tracking-widest text-base mb-6 uppercase">CUSTOMER CARE</h4>
              <ul className="flex flex-col gap-3 font-light text-[#5A5A5A]">
                <li><Link href="/shipping-policy" className="hover:text-[#C89B6D] text-[#5A5A5A] transition-colors">Shipping & Delivery</Link></li>
                <li><Link href="/return-policy" className="hover:text-[#C89B6D] text-[#5A5A5A] transition-colors">Returns & Exchanges</Link></li>
                <li><Link href="/order-tracking" className="hover:text-[#C89B6D] text-[#5A5A5A] transition-colors">Track Your Order</Link></li>
                <li><Link href="/care-guide" className="hover:text-[#C89B6D] text-[#5A5A5A] transition-colors">Care Guide</Link></li>
                <li><Link href="/faq" className="hover:text-[#C89B6D] text-[#5A5A5A] transition-colors">Payment Methods</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-serif text-[#C89B6D] tracking-widest text-base mb-6 uppercase">COMPANY</h4>
              <ul className="flex flex-col gap-3 font-light text-[#5A5A5A]">
                <li><Link href="/about" className="hover:text-[#C89B6D] text-[#5A5A5A] transition-colors">About Us</Link></li>
                <li><Link href="/about" className="hover:text-[#C89B6D] text-[#5A5A5A] transition-colors">Our Heritage</Link></li>
                <li><Link href="/categories" className="hover:text-[#C89B6D] text-[#5A5A5A] transition-colors">Collections</Link></li>
                <li><Link href="/contact" className="hover:text-[#C89B6D] text-[#5A5A5A] transition-colors">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-serif text-[#C89B6D] tracking-widest text-base mb-6 uppercase">ABOUT US</h4>
              <p className="font-light text-[#5A5A5A] leading-relaxed mb-6">
                LS Collections curates premium sarees and exquisite artificial jewellery designed to represent classic elegance and luxury for the modern woman.
              </p>
              <div className="flex gap-4">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-[#5A5A5A] hover:text-[#C89B6D] transition-colors">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01" />
                  </svg>
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-[#5A5A5A] hover:text-[#C89B6D] transition-colors">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-[#5A5A5A] hover:text-[#C89B6D] transition-colors">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                  </svg>
                </a>
                <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="text-[#5A5A5A] hover:text-[#C89B6D] transition-colors">
                  <MessageCircle className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Brand Guarantees / Trust Seals */}
        {showFullFooter && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border- border-[#EEEEEE] py-10 mb-10 text-center text-sm text-[#5A5A5A]">
            <div className="flex flex-col items-center gap-3">
              <ShieldCheck className="h-8 w-8 text-[#C89B6D]" />
              <h5 className="font-serif font-semibold tracking-wider text-[#C89B6D]">100% Authentic Quality</h5>
              <p className="text-xs text-[#5A5A5A] font-light max-w-xs">Directly sourced premium fabrics and handpicked handcrafted jewelry designs.</p>
            </div>
            <div className="flex flex-col items-center gap-3 border-y md:border-y-0 md:border- border-[#EEEEEE] py-6 md:py-0">
              <Truck className="h-8 w-8 text-[#C89B6D]" />
              <h5 className="font-serif font-semibold tracking-wider text-[#C89B6D]">Insured Fast Shipping</h5>
              <p className="text-xs text-[#5A5A5A] font-light max-w-xs">Safe, insured packing and express distribution straight to your doorstep.</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <RefreshCw className="h-8 w-8 text-[#C89B6D]" />
              <h5 className="font-serif font-semibold tracking-wider text-[#C89B6D]">7-Day Premium Return Policy</h5>
              <p className="text-xs text-[#5A5A5A] font-light max-w-xs">Hassle-free sizing exchanges or product returns under absolute care.</p>
            </div>
          </div>
        )}

        {/* Copyright and Secure Payments */}
        <div className="flex flex-col md:flex-row items-center justify-between text-xs text-[#5A5A5A] font-light gap-6">
          <p>© {currentYear} LS Collections. All Rights Reserved.</p>

          <div className="flex items-center gap-4 text-[#5A5A5A]">
            <span className="flex items-center gap-1.5"><Lock className="h-4 w-4 text-[#C89B6D]" /> Secure Checkout</span>
            <div className="h-4 w-[1px] bg-[#ECECEC]"></div>
            <div className="flex gap-2">
              <CreditCard className="h-5 w-5 text-[#C89B6D]" />
            </div>
          </div>

          <div className="flex gap-6 flex-wrap justify-center">
            <Link href="/privacy-policy" className="text-[#5A5A5A] hover:text-[#C89B6D] transition-colors">Privacy Policy</Link>
            <Link href="/terms-conditions" className="text-[#5A5A5A] hover:text-[#C89B6D] transition-colors">Terms & Conditions</Link>
            <Link href="/return-policy" className="text-[#5A5A5A] hover:text-[#C89B6D] transition-colors">Refund Policy</Link>
            <Link href="/cancellation-policy" className="text-[#5A5A5A] hover:text-[#C89B6D] transition-colors">Cancellation Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

