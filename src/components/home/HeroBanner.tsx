"use client";

import Link from "next/link";

export default function HeroBanner() {
  return (
    <section 
      className="relative h-screen w-full"
      style={{
        position: "relative",
        height: "100vh",
        width: "100%"
      }}
    >
      {/* Full-width Luxury Hero Background Image */}
      <img
        src="/banners/luxury_editorial_hero.png"
        alt="LS Collections Hero"
        className="absolute inset-0 w-full h-full object-cover object-[center_25%] z-0"
        style={{
          filter: "brightness(0.95) contrast(1.05) saturate(1.05)",
          objectPosition: "center 25%"
        }}
      />

      {/* Subtle top dark gradient for navbar legibility on first load */}
      <div className="absolute inset-x-0 top-0 h-[140px] bg-gradient-to-b from-black/45 via-black/10 to-transparent pointer-events-none z-10" />

      {/* Subtle luxury dark gradient overlay on the left side to improve button visibility */}
      <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-black/55 via-black/20 to-transparent pointer-events-none z-10" />

      {/* CTA Buttons positioned dynamically for Desktop, Tablet, and Mobile */}
      <div 
        className="absolute left-14 bottom-14 z-20 flex gap-5"
        style={{
          position: "absolute",
          left: "56px",
          bottom: "56px",
          zIndex: 20,
          display: "flex",
          gap: "20px"
        }}
      >
        <Link
          href="/sarees"
          className="h-[56px] rounded-full bg-[#C89B6D] text-white border-0 font-sans text-xs font-semibold uppercase tracking-[0.18em] transition-all duration-300 ease-out hover:bg-[#A77C53] cursor-pointer flex items-center justify-center no-underline whitespace-nowrap select-none"
          style={{
            width: "190px",
            boxShadow: "0 10px 28px rgba(0,0,0,0.18)"
          }}
        >
          DISCOVER SAREES
        </Link>

        <Link
          href="/jewellery"
          className="h-[56px] rounded-full bg-white/[0.04] backdrop-blur-[4px] text-white border-[1.5px] border-white/90 font-sans text-xs font-semibold uppercase tracking-[0.18em] transition-all duration-300 ease-out hover:bg-white/10 hover:border-white cursor-pointer flex items-center justify-center no-underline whitespace-nowrap select-none"
          style={{
            width: "190px",
            boxShadow: "0 10px 28px rgba(0,0,0,0.18)"
          }}
        >
          DISCOVER JEWELLERY
        </Link>
      </div>
    </section>
  );
}




