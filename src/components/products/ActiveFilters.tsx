"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { X } from "lucide-react";

export default function ActiveFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const getActiveFilters = () => {
    const filters: { key: string; value: string; label: string }[] = [];
    
    // SubCategory
    const subCats = searchParams.get("subCategory");
    if (subCats) {
      subCats.split(",").forEach(cat => {
        filters.push({ key: "subCategory", value: cat, label: cat });
      });
    }

    // Attributes
    searchParams.forEach((value, key) => {
      if (key.startsWith("attr_")) {
        value.split(",").forEach(val => {
          filters.push({ key, value: val, label: val });
        });
      }
    });

    // Price
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    if (minPrice || maxPrice) {
      filters.push({ 
        key: "price", 
        value: "price", 
        label: `₹${minPrice || 0} - ${maxPrice ? `₹${maxPrice}` : "Max"}` 
      });
    }

    return filters;
  };

  const removeFilter = (filterKey: string, filterValue: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (filterKey === "price") {
      params.delete("minPrice");
      params.delete("maxPrice");
    } else {
      const currentVals = params.get(filterKey)?.split(",") || [];
      const newVals = currentVals.filter(v => v !== filterValue);
      if (newVals.length > 0) {
        params.set(filterKey, newVals.join(","));
      } else {
        params.delete(filterKey);
      }
    }
    
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  const activeFilters = getActiveFilters();

  if (activeFilters.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
      {activeFilters.map((filter) => (
        <span 
          key={`${filter.key}-${filter.value}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#C89B6D]/10 text-[#C89B6D] text-[11px] font-bold uppercase tracking-widest rounded-full border border-[#C89B6D]/30 transition-all hover:bg-[#C89B6D]/20 group shadow-sm"
        >
          {filter.label}
          <button 
            onClick={() => removeFilter(filter.key, filter.value)}
            className="hover:text-rose-500 hover:bg-white rounded-full transition-colors flex items-center justify-center h-4 w-4"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
    </div>
  );
}
