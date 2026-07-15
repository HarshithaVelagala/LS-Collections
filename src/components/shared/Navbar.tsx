"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Heart, ShoppingBag, User, Menu, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import SearchBar from "./SearchBar";

export default function Navbar() {
  const { cartCount, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAuthenticated, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (!isLandingPage) return;

    // Set initial scroll state
    setIsScrolled(window.scrollY > 20);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLandingPage]);

  const navLinks = [
    { name: "Sarees", href: "/sarees", hasDropdown: true },
    { name: "Jewellery", href: "/jewellery", hasDropdown: true },
    { name: "About Us", href: "/about" },
  ];

  const isTransparent = isLandingPage && !isScrolled;

  const headerClass = `${isLandingPage ? 'fixed' : 'sticky'} top-0 z-50 w-full transition-all duration-300 ${
    isTransparent
      ? 'bg-transparent border-b border-transparent shadow-none'
      : 'bg-white border-b border-[#EEEEEE] shadow-[0_4px_20px_rgba(0,0,0,0.03)]'
  }`;

  const iconClass = `relative hover:bg-transparent transition-colors duration-300 group flex items-center justify-center ${
    isTransparent ? "text-white hover:text-gold" : "text-foreground hover:text-gold"
  }`;

  return (
    <header className={headerClass}>
      <div className="relative mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-[76px]">
        
        {/* Mobile Navigation Menu */}
        <div className="flex md:hidden">
          <Sheet>
            <SheetTrigger render={<Button variant="ghost" size="icon" className={isTransparent ? "text-white hover:text-gold hover:bg-transparent" : "text-foreground hover:text-gold hover:bg-transparent"} />}>
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] border-r border-border bg-card p-6 text-foreground">
              <SheetTitle className="text-left font-serif text-[21px] font-bold tracking-widest text-gold mb-8">
                LS COLLECTIONS
              </SheetTitle>
              <nav className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="font-serif text-lg tracking-wider text-foreground/80 hover:text-gold transition-colors duration-200 flex items-center justify-between"
                  >
                    <span>{link.name}</span>
                    {link.hasDropdown && <ChevronDown className="h-4 w-4 text-zinc-400" />}
                  </Link>
                ))}
                <hr className="border-border my-2" />
                {!isAuthenticated ? (
                  <>
                    <Link
                      href="/login"
                      className="flex items-center gap-3 font-sans text-foreground/80 hover:text-gold transition-colors duration-200"
                    >
                      <User className="h-5 w-5" /> Login
                    </Link>
                    <Link
                      href="/register"
                      className="flex items-center gap-3 font-sans text-foreground/80 hover:text-gold transition-colors duration-200"
                    >
                      <User className="h-5 w-5" /> Register
                    </Link>
                  </>
                ) : (
                  <>
                    <div className="px-1 py-1 mb-2">
                      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Welcome,</p>
                      <p className="text-sm font-semibold text-gold truncate">{user?.name || "Customer"}</p>
                    </div>
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 font-sans text-foreground/80 hover:text-gold transition-colors duration-200"
                    >
                      <User className="h-5 w-5" /> Account Profile
                    </Link>
                    <Link
                      href="/profile?tab=orders"
                      className="flex items-center gap-3 font-sans text-foreground/80 hover:text-gold transition-colors duration-200"
                    >
                      <User className="h-5 w-5" /> My Orders
                    </Link>
                    <Link
                      href="/profile?tab=wishlist"
                      className="flex items-center gap-3 font-sans text-foreground/80 hover:text-gold transition-colors duration-200"
                    >
                      <User className="h-5 w-5" /> My Wishlist
                    </Link>
                    <button
                      onClick={() => logout()}
                      className="flex items-center gap-3 font-sans text-rose-600 hover:text-rose-700 transition-colors duration-200 uppercase text-sm font-semibold mt-4 text-left"
                    >
                      Log Out
                    </button>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
 
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-[18px] select-none pl-7">
          <span className="font-serif font-bold tracking-[0.15em] text-gold text-[28px] transition-colors duration-300">
            LS
          </span>
          <span className={`h-5 w-[1px] transition-colors duration-300 ${isTransparent ? 'bg-white/30' : 'bg-[#EEEEEE]'}`} />
          <span className={`font-sans font-light tracking-[0.25em] text-[15px] sm:text-[16px] uppercase transition-colors duration-300 ${
            isTransparent ? 'text-white' : 'text-[#2B2B2B]'
          }`}>
            COLLECTIONS
          </span>
        </Link>
 
        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-[52px] absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`relative font-sans text-xs font-semibold tracking-[0.25em] uppercase transition-all duration-300 group py-2 flex items-center gap-1 ${
                isTransparent ? "text-white/90 hover:text-white" : "text-[#2B2B2B]/80 hover:text-gold"
              }`}
            >
              {link.name}
              {link.hasDropdown && (
                <ChevronDown className="h-3 w-3 transition-transform group-hover:rotate-180 duration-300 text-current opacity-80" />
              )}
              <span className={`absolute bottom-0 left-0 h-[1.5px] w-0 transition-all duration-300 group-hover:w-full ${
                isTransparent ? "bg-white" : "bg-gold"
              }`} />
            </Link>
          ))}
        </nav>


        {/* Action Icons */}
        <div className="flex items-center gap-1 sm:gap-2">
          
          <SearchBar iconClassName={isTransparent ? "text-white hover:text-gold hover:bg-transparent" : "text-foreground hover:text-gold hover:bg-transparent"} />

          {/* Wishlist Link */}
          <Link href="/profile?tab=wishlist">
            <Button
              variant="ghost"
              size="icon"
              className={iconClass}
            >
              <Heart className="h-5 w-5 transition-transform group-hover:scale-110 duration-300" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white ring-1 ring-card">
                  {wishlistCount}
                </span>
              )}
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className={iconClass}
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingBag className="h-5 w-5 transition-transform group-hover:scale-110 duration-300" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white ring-1 ring-card">
                {cartCount}
              </span>
            )}
          </Button>

          {/* User Profile Link & Popover Menu */}
          <div className="relative hidden sm:block">
            <Button
              variant="ghost"
              size="icon"
              className={iconClass}
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            >
              <User className="h-5 w-5 transition-transform group-hover:scale-110 duration-300" />
            </Button>
            {isUserMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsUserMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-48 border border-border bg-card/95 backdrop-blur-md p-2 shadow-2xl z-50 text-left animate-in fade-in slide-in-from-top-2 duration-200 rounded-md">
                  {!isAuthenticated ? (
                    <div className="flex flex-col">
                      <Link
                        href="/login"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="px-4 py-2.5 text-xs font-semibold tracking-wider text-foreground/80 hover:text-gold hover:bg-section-bg/50 uppercase transition-all duration-200 rounded-md"
                      >
                        Login
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="px-4 py-2.5 text-xs font-semibold tracking-wider text-foreground/80 hover:text-gold hover:bg-section-bg/50 uppercase transition-all duration-200 rounded-md"
                      >
                        Register
                      </Link>
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      <div className="px-4 py-2 border-b border-border mb-1">
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Logged In As</p>
                        <p className="text-xs font-semibold text-foreground truncate max-w-full">{user?.name || "Customer"}</p>
                      </div>
                      <Link
                        href="/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="px-4 py-2 text-xs font-semibold tracking-wider text-foreground/80 hover:text-gold hover:bg-section-bg/50 uppercase transition-all duration-200 rounded-md"
                      >
                        Profile
                      </Link>
                      <Link
                        href="/profile?tab=orders"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="px-4 py-2 text-xs font-semibold tracking-wider text-foreground/80 hover:text-gold hover:bg-section-bg/50 uppercase transition-all duration-200 rounded-md"
                      >
                        Orders
                      </Link>
                      <Link
                        href="/profile?tab=wishlist"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="px-4 py-2 text-xs font-semibold tracking-wider text-foreground/80 hover:text-gold hover:bg-section-bg/50 uppercase transition-all duration-200 rounded-md"
                      >
                        Wishlist
                      </Link>
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-4 py-2.5 mt-1 border-t border-border text-xs font-bold tracking-wider text-rose-600 hover:text-rose-700 hover:bg-rose-500/10 uppercase transition-all duration-200 rounded-md"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
