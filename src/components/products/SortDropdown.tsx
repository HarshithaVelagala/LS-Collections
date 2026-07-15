"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

export default function SortDropdown() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get("sort") || "popular";

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sort = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    
    if (sort && sort !== "popular") {
      params.set("sort", sort);
    } else {
      params.delete("sort");
    }
    
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground block mb-1">
        Sort By
      </label>
      <select
        value={currentSort}
        onChange={handleSortChange}
        className="w-full bg-card border border-[#ECECEC] text-foreground rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-[#C89B6D] focus:ring-1 focus:ring-[#C89B6D]/30 transition-all duration-[250ms] ease-in-out hover:border-[#C89B6D]/50 shadow-sm hover:shadow-md cursor-pointer"
      >
        <option value="popular">Popularity</option>
        <option value="newest">Newest Arrivals</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="rating">Highest Rated</option>
        <option value="sales">Best Selling</option>
      </select>
    </div>
  );
}
