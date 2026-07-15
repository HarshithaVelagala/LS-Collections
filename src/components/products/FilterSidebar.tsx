"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import SortDropdown from "./SortDropdown";

export default function FilterSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const category = pathname.includes("/sarees")
    ? "saree"
    : pathname.includes("/jewellery")
    ? "jewellery"
    : (searchParams.get("category")?.toLowerCase() || "");

  // Selected filters state
  const [selectedSubs, setSelectedSubs] = useState<string[]>([]);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string[]>>({});
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");

  // Load state from URL parameters
  useEffect(() => {
    setSelectedSubs(searchParams.get("subCategory")?.split(",") || []);
    setMinPrice(searchParams.get("minPrice") || "");
    setMaxPrice(searchParams.get("maxPrice") || "");
    
    // Extract attribute filters from URL
    const attrs: Record<string, string[]> = {};
    searchParams.forEach((value, key) => {
      if (key.startsWith("attr_")) {
        const attrName = key.replace("attr_", "");
        attrs[attrName] = value.split(",");
      }
    });
    setSelectedAttributes(attrs);
  }, [searchParams]);

  // Apply filters to URL
  const applyFilters = (
    updatedSubs = selectedSubs,
    updatedAttrs = selectedAttributes,
    updatedMin = minPrice,
    updatedMax = maxPrice
  ) => {
    const params = new URLSearchParams(searchParams.toString());

    if (updatedSubs.length > 0) {
      params.set("subCategory", updatedSubs.join(","));
    } else {
      params.delete("subCategory");
    }

    // Clean up old attributes
    Array.from(params.keys()).forEach(key => {
      if (key.startsWith("attr_")) params.delete(key);
    });

    // Set new attributes
    Object.entries(updatedAttrs).forEach(([key, values]) => {
      if (values.length > 0) {
        params.set(`attr_${key}`, values.join(","));
      }
    });

    if (updatedMin) {
      params.set("minPrice", updatedMin);
    } else {
      params.delete("minPrice");
    }

    if (updatedMax) {
      params.set("maxPrice", updatedMax);
    } else {
      params.delete("maxPrice");
    }

    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSubToggle = (sub: string) => {
    const newSubs = selectedSubs.includes(sub)
      ? selectedSubs.filter((item) => item !== sub)
      : [...selectedSubs, sub];
    
    setSelectedSubs(newSubs);
    applyFilters(newSubs, selectedAttributes);
  };

  const handleAttributeToggle = (attrName: string, value: string) => {
    const currentValues = selectedAttributes[attrName] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];
    
    const newAttrs = { ...selectedAttributes, [attrName]: newValues };
    setSelectedAttributes(newAttrs);
    applyFilters(selectedSubs, newAttrs);
  };

  const handlePriceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters(selectedSubs, selectedAttributes, minPrice, maxPrice);
  };

  const clearAllFilters = () => {
    setSelectedSubs([]);
    setSelectedAttributes({});
    setMinPrice("");
    setMaxPrice("");
    
    const params = new URLSearchParams();
    if (category && !pathname.includes("/sarees") && !pathname.includes("/jewellery")) params.set("category", category);
    const search = searchParams.get("search");
    if (search) params.set("search", search);
    
    router.push(`${pathname}?${params.toString()}`);
  };

  // Mock static filter options based on category
  const getFilterSections = () => {
    if (category === "saree") {
      return [
        { id: "subCategory", title: "Types", options: ["Banarasi", "Silk", "Cotton", "Chiffon", "Georgette", "Wedding"] },
        { id: "attr_fabric", title: "Fabric", options: ["Pure Silk", "Cotton Silk", "Organza", "Linen"] },
        { id: "attr_occasion", title: "Occasion", options: ["Wedding", "Festive", "Party", "Casual"] },
        { id: "attr_color", title: "Color", options: ["Red", "Gold", "Green", "Blue", "Pink"] }
      ];
    } else if (category === "jewellery") {
      return [
        { id: "subCategory", title: "Types", options: ["Neck Sets", "Earrings", "Bangles", "Rings", "Bridal Sets"] },
        { id: "attr_material", title: "Material", options: ["Gold Plated", "Brass Alloy", "Silver"] },
        { id: "attr_color", title: "Color", options: ["Gold", "Rose Gold", "Silver", "Kundan"] }
      ];
    }
    // Fallback/Mixed
    return [
      { id: "subCategory", title: "Types", options: ["Sarees", "Jewellery"] }
    ];
  };

  const sections = getFilterSections();

  return (
    <div className="w-full text-foreground pr-2">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-6 mb-2">
        <h3 className="font-serif text-lg tracking-wider text-[#B88958] font-semibold">FILTERS</h3>
        <button
          onClick={clearAllFilters}
          className="text-[10px] text-[#5F6368] font-medium hover:text-[#C89B6D] hover:bg-[#C89B6D]/10 px-3 py-1.5 rounded-sm transition-all duration-[200ms] uppercase tracking-widest"
        >
          Clear All
        </button>
      </div>

      <Accordion type="multiple" defaultValue={["price", ...sections.map(s => s.id)]} className="w-full border-none space-y-2">
        
        {sections.map((section) => (
          <AccordionItem key={section.id} value={section.id} className="border-b border-[#E5E5E5] py-2">
            <AccordionTrigger className="font-serif text-[15px] tracking-widest font-semibold text-[#222222] py-4 hover:text-[#C89B6D] uppercase transition-all duration-200">
              {section.title}
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-6 space-y-5 animate-in fade-in slide-in-from-top-2 duration-200">
              {section.options.map((opt) => {
                const isSub = section.id === "subCategory";
                const attrName = section.id.replace("attr_", "");
                const isChecked = isSub 
                  ? selectedSubs.includes(opt)
                  : (selectedAttributes[attrName] || []).includes(opt);

                return (
                  <div key={opt} className="flex items-center gap-4 group/checkbox p-1.5 -ml-1.5 hover:bg-[#FAF8F6] rounded-md transition-colors duration-200 cursor-pointer" onClick={() => isSub ? handleSubToggle(opt) : handleAttributeToggle(attrName, opt)}>
                    <input
                      type="checkbox"
                      id={`filter-${section.id}-${opt}`}
                      checked={isChecked}
                      onChange={() => isSub ? handleSubToggle(opt) : handleAttributeToggle(attrName, opt)}
                      className="h-[18px] w-[18px] rounded-sm border border-[#8C8C8C] bg-[#FFFFFF] text-[#C89B6D] focus:ring-[#C89B6D] accent-[#C89B6D] cursor-pointer transition-all duration-200 opacity-100"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <label
                      htmlFor={`filter-${section.id}-${opt}`}
                      className="text-[13px] text-[#2C2C2C] font-medium opacity-100 cursor-pointer transition-colors leading-none"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {opt}
                    </label>
                  </div>
                );
              })}
            </AccordionContent>
          </AccordionItem>
        ))}

        {/* Price Accordion */}
        <AccordionItem value="price" className="border-b border-[#E5E5E5] py-2">
          <AccordionTrigger className="font-serif text-[15px] tracking-widest font-semibold text-[#222222] py-4 hover:text-[#C89B6D] uppercase transition-all duration-200">
            PRICE RANGE
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-6 animate-in fade-in slide-in-from-top-2 duration-200">
            <form onSubmit={handlePriceSubmit} className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <span className="text-[10px] text-[#5F6368] font-medium tracking-widest uppercase block mb-2">Min (₹)</span>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="0"
                    className="w-full bg-[#F7F7F7] border border-[#E5E5E5] text-[#2C2C2C] rounded-md px-3 py-2 text-[13px] font-medium focus:outline-none focus:border-[#C89B6D] focus:ring-1 focus:ring-[#C89B6D] transition-all"
                  />
                </div>
                <span className="text-[#9A9A9A] mt-6">-</span>
                <div className="flex-1">
                  <span className="text-[10px] text-[#5F6368] font-medium tracking-widest uppercase block mb-2">Max (₹)</span>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="10000+"
                    className="w-full bg-[#F7F7F7] border border-[#E5E5E5] text-[#2C2C2C] rounded-md px-3 py-2 text-[13px] font-medium focus:outline-none focus:border-[#C89B6D] focus:ring-1 focus:ring-[#C89B6D] transition-all"
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-[#F7F7F7] border border-[#E5E5E5] hover:border-[#C89B6D] hover:bg-[#FAF8F6] text-[#4A4A4A] hover:text-[#C89B6D] rounded-md uppercase text-[11px] tracking-widest font-semibold transition-all duration-200 py-6"
              >
                Apply Price
              </Button>
            </form>
          </AccordionContent>
        </AccordionItem>

      </Accordion>
    </div>
  );
}
