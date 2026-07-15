"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Sparkles, Flower } from "lucide-react";

const sareeCategories = [
  { name: "Banarasi", desc: "Opulent Brocades", query: "Banarasi" },
  { name: "Kanjeevaram", desc: "Gilded Silk Borders", query: "Kanjeevaram" },
  { name: "Silk", desc: "Pure Mulberry Silks", query: "Silk" },
  { name: "Cotton", desc: "Lightweight Elegance", query: "Cotton" },
  { name: "Bridal", desc: "Wedding Grandeur", query: "Bridal" },
  { name: "Party Wear", desc: "Contemporary Styles", query: "Party Wear" },
];

export default function SareeCategories() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedSubs = searchParams.get("subCategory")?.split(",") || [];

  const handleCategoryClick = (query: string) => {
    const params = new URLSearchParams(searchParams.toString());
    let newSubs: string[];

    if (selectedSubs.includes(query)) {
      newSubs = selectedSubs.filter((s) => s !== query);
    } else {
      newSubs = [query]; // Single select feel for shop by category
    }

    if (newSubs.length > 0) {
      params.set("subCategory", newSubs.join(","));
    } else {
      params.delete("subCategory");
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}#saree-collection-section`, { scroll: false });
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card border-b border-border">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold tracking-[0.3em] text-gold uppercase flex items-center justify-center gap-2">
            <Sparkles className="h-3 w-3 text-gold fill-gold" /> HERITAGE & DESIGN
          </span>
          <h2 className="text-3xl md:text-4xl font-bold font-serif tracking-wider text-foreground mt-2">
            SHOP BY SAREE CATEGORY
          </h2>
          <div className="h-[1px] w-16 bg-gold mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {sareeCategories.map((cat) => {
            const isActive = selectedSubs.includes(cat.query);
            return (
              <button
                key={cat.name}
                onClick={() => handleCategoryClick(cat.query)}
                className={`relative group flex flex-col items-center justify-center p-6 text-center border transition-all duration-300 rounded-lg min-h-[140px] ${
                  isActive
                    ? "bg-[#2C221C] border-gold text-white shadow-lg shadow-gold/10"
                    : "bg-background border-border text-foreground hover:border-gold/50"
                }`}
              >
                <div className="mb-3 text-gold group-hover:scale-110 transition-transform duration-300">
                  <Flower className={`h-6 w-6 ${isActive ? "fill-gold text-gold" : "text-gold/70"}`} />
                </div>
                <h3 className="font-serif text-sm font-semibold tracking-wider uppercase mb-1">
                  {cat.name}
                </h3>
                <p className={`text-[10px] font-light ${isActive ? "text-zinc-300" : "text-muted-foreground"}`}>
                  {cat.desc}
                </p>
                
                {/* Visual active decorator */}
                {isActive && (
                  <span className="absolute bottom-2 w-2 h-2 rounded-full bg-gold animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
