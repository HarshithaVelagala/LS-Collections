"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { 
  Search, 
  RefreshCw, 
  Trash2, 
  Edit3, 
  Eye, 
  ChevronLeft, 
  ChevronRight,
  TrendingUp,
  Star,
  Sparkles,
  Package,
  AlertCircle,
  XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductTableProps {
  products: any[];
  categories: any[];
  onEdit: (product: any) => void;
  onDelete: (product: any) => void;
  onPreview: (product: any) => void;
  onRefresh: () => void;
}

export default function ProductTable({ products, categories, onEdit, onDelete, onPreview, onRefresh }: ProductTableProps) {
  // Filter States
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Formatting currency
  const formatRupee = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(value);
  };

  // Safety sync: reset selected category to "all" if the selected category no longer exists in categories list
  useEffect(() => {
    if (selectedCategory !== "all" && categories.length > 0) {
      const exists = categories.some((c) => c._id === selectedCategory);
      if (!exists) {
        setSelectedCategory("all");
      }
    }
  }, [categories, selectedCategory]);

  // Compute dynamic human-readable labels for the custom select triggers
  const selectedCatObj = categories.find((c) => c._id === selectedCategory);
  const categoryLabel = selectedCategory === "all" ? "All Categories" : (selectedCatObj?.name || "All Categories");

  const statusLabel = selectedStatus === "active" 
    ? "Active On Storefront" 
    : selectedStatus === "inactive" 
      ? "Inactive / Hidden" 
      : selectedStatus === "low_stock" 
        ? "⚠️ Inventory Shortage" 
        : "All Statuses";

  const sortLabels: Record<string, string> = {
    newest: "Sort: Newest",
    oldest: "Sort: Oldest",
    price_asc: "Price: Low to High",
    price_desc: "Price: High to Low",
    name_asc: "Name: A to Z",
    name_desc: "Name: Z to A"
  };
  const sortLabel = sortLabels[sortBy] || "Sort: Newest";

  // Filter & Sort Logic
  const filteredProducts = products
    .filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                            (p.sku && p.sku.toLowerCase().includes(search.toLowerCase()));
      const matchesCategory = selectedCategory === "all" || p.category === selectedCategory || p.categoryId === selectedCategory;
      
      let matchesStatus = true;
      if (selectedStatus === "active") matchesStatus = p.isActive !== false;
      if (selectedStatus === "inactive") matchesStatus = p.isActive === false;
      if (selectedStatus === "low_stock") {
        const totalStock = p.variants?.reduce((sum: number, v: any) => sum + (v.stock || 0), 0) || p.stock || 0;
        matchesStatus = totalStock <= (p.lowStockThreshold || 10);
      }

      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortBy === "price_asc") return (a.discountPrice || a.basePrice) - (b.discountPrice || b.basePrice);
      if (sortBy === "price_desc") return (b.discountPrice || b.basePrice) - (a.discountPrice || a.basePrice);
      if (sortBy === "name_asc") return a.name.localeCompare(b.name);
      if (sortBy === "name_desc") return b.name.localeCompare(a.name);
      return 0;
    });

  // Pagination Logic
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="space-y-8 text-white select-none">
      
      {/* Search and Filters Action Bar */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5 items-center justify-between bg-gradient-to-b from-zinc-900/80 to-zinc-950/80 p-5 border border-purple-royal/10 rounded-2xl shadow-xl backdrop-blur-md mb-4">
        
        {/* Search Input */}
        <div className="relative lg:col-span-2">
          <input
            type="text"
            placeholder="Search catalog by name or SKU..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-zinc-955/60 border border-purple-royal/20 text-white placeholder-zinc-500 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all h-[38px]"
          />
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-zinc-500" />
        </div>

        {/* Category Filter using shadcn Select */}
        <div>
          <Select 
            value={selectedCategory} 
            onValueChange={(val) => {
              setSelectedCategory(val || "all");
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-full h-[38px] bg-zinc-950/60 border-purple-royal/20 hover:border-gold/40 focus:border-gold/60 focus:ring-1 focus:ring-gold/30 rounded-xl px-4 py-2.5 text-xs text-white">
              <SelectValue placeholder="All Categories">{categoryLabel}</SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-zinc-950 border border-purple-royal/30 rounded-xl shadow-2xl py-1.5 z-50">
              <SelectItem value="all" className="py-3 pr-8 pl-4 text-xs font-semibold text-zinc-400 focus:bg-purple-royal/15 focus:text-white data-[state=checked]:bg-gold/15 data-[state=checked]:text-gold-light data-[state=checked]:font-bold data-[state=checked]:border-l-2 data-[state=checked]:border-gold rounded-none cursor-pointer">
                All Categories
              </SelectItem>
              {categories.map((cat) => (
                <SelectItem 
                  key={cat._id} 
                  value={cat._id} 
                  className="py-3 pr-8 pl-4 text-xs font-semibold text-zinc-400 focus:bg-purple-royal/15 focus:text-white data-[state=checked]:bg-gold/15 data-[state=checked]:text-gold-light data-[state=checked]:font-bold data-[state=checked]:border-l-2 data-[state=checked]:border-gold rounded-none cursor-pointer"
                >
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter using shadcn Select */}
        <div>
          <Select 
            value={selectedStatus} 
            onValueChange={(val) => {
              setSelectedStatus(val || "all");
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-full h-[38px] bg-zinc-950/60 border-purple-royal/20 hover:border-gold/40 focus:border-gold/60 focus:ring-1 focus:ring-gold/30 rounded-xl px-4 py-2.5 text-xs text-white">
              <SelectValue placeholder="All Statuses">{statusLabel}</SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-zinc-950 border border-purple-royal/30 rounded-xl shadow-2xl py-1.5 z-50">
              <SelectItem value="all" className="py-3 pr-8 pl-4 text-xs font-semibold text-zinc-400 focus:bg-purple-royal/15 focus:text-white data-[state=checked]:bg-gold/15 data-[state=checked]:text-gold-light data-[state=checked]:font-bold data-[state=checked]:border-l-2 data-[state=checked]:border-gold rounded-none cursor-pointer">
                All Statuses
              </SelectItem>
              <SelectItem value="active" className="py-3 pr-8 pl-4 text-xs font-semibold text-zinc-400 focus:bg-purple-royal/15 focus:text-white data-[state=checked]:bg-gold/15 data-[state=checked]:text-gold-light data-[state=checked]:font-bold data-[state=checked]:border-l-2 data-[state=checked]:border-gold rounded-none cursor-pointer">
                Active On Storefront
              </SelectItem>
              <SelectItem value="inactive" className="py-3 pr-8 pl-4 text-xs font-semibold text-zinc-400 focus:bg-purple-royal/15 focus:text-white data-[state=checked]:bg-gold/15 data-[state=checked]:text-gold-light data-[state=checked]:font-bold data-[state=checked]:border-l-2 data-[state=checked]:border-gold rounded-none cursor-pointer">
                Inactive / Hidden
              </SelectItem>
              <SelectItem value="low_stock" className="py-3 pr-8 pl-4 text-xs font-semibold text-zinc-400 focus:bg-purple-royal/15 focus:text-white data-[state=checked]:bg-gold/15 data-[state=checked]:text-gold-light data-[state=checked]:font-bold data-[state=checked]:border-l-2 data-[state=checked]:border-gold rounded-none cursor-pointer">
                ⚠️ Inventory Shortage
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sorting selection & Refresh using shadcn Select */}
        <div className="flex gap-2">
          <div className="flex-grow">
            <Select value={sortBy} onValueChange={(val) => setSortBy(val || "newest")}>
              <SelectTrigger className="w-full h-[38px] bg-zinc-950/60 border-purple-royal/20 hover:border-gold/40 focus:border-gold/60 focus:ring-1 focus:ring-gold/30 rounded-xl px-4 py-2.5 text-xs text-white">
                <SelectValue placeholder="Sort: Newest">{sortLabel}</SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-zinc-950 border border-purple-royal/30 rounded-xl shadow-2xl py-1.5 z-50">
                <SelectItem value="newest" className="py-3 pr-8 pl-4 text-xs font-semibold text-zinc-400 focus:bg-purple-royal/15 focus:text-white data-[state=checked]:bg-gold/15 data-[state=checked]:text-gold-light data-[state=checked]:font-bold data-[state=checked]:border-l-2 data-[state=checked]:border-gold rounded-none cursor-pointer">
                  Sort: Newest
                </SelectItem>
                <SelectItem value="oldest" className="py-3 pr-8 pl-4 text-xs font-semibold text-zinc-400 focus:bg-purple-royal/15 focus:text-white data-[state=checked]:bg-gold/15 data-[state=checked]:text-gold-light data-[state=checked]:font-bold data-[state=checked]:border-l-2 data-[state=checked]:border-gold rounded-none cursor-pointer">
                  Sort: Oldest
                </SelectItem>
                <SelectItem value="price_asc" className="py-3 pr-8 pl-4 text-xs font-semibold text-zinc-400 focus:bg-purple-royal/15 focus:text-white data-[state=checked]:bg-gold/15 data-[state=checked]:text-gold-light data-[state=checked]:font-bold data-[state=checked]:border-l-2 data-[state=checked]:border-gold rounded-none cursor-pointer">
                  Price: Low to High
                </SelectItem>
                <SelectItem value="price_desc" className="py-3 pr-8 pl-4 text-xs font-semibold text-zinc-400 focus:bg-purple-royal/15 focus:text-white data-[state=checked]:bg-gold/15 data-[state=checked]:text-gold-light data-[state=checked]:font-bold data-[state=checked]:border-l-2 data-[state=checked]:border-gold rounded-none cursor-pointer">
                  Price: High to Low
                </SelectItem>
                <SelectItem value="name_asc" className="py-3 pr-8 pl-4 text-xs font-semibold text-zinc-400 focus:bg-purple-royal/15 focus:text-white data-[state=checked]:bg-gold/15 data-[state=checked]:text-gold-light data-[state=checked]:font-bold data-[state=checked]:border-l-2 data-[state=checked]:border-gold rounded-none cursor-pointer">
                  Name: A to Z
                </SelectItem>
                <SelectItem value="name_desc" className="py-3 pr-8 pl-4 text-xs font-semibold text-zinc-400 focus:bg-purple-royal/15 focus:text-white data-[state=checked]:bg-gold/15 data-[state=checked]:text-gold-light data-[state=checked]:font-bold data-[state=checked]:border-l-2 data-[state=checked]:border-gold rounded-none cursor-pointer">
                  Name: Z to A
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button
            type="button"
            variant="outline"
            onClick={onRefresh}
            className="border-purple-royal/25 bg-zinc-950/60 text-zinc-400 hover:text-gold hover:border-gold hover:bg-zinc-900 h-[38px] w-[38px] p-0 rounded-xl shrink-0 cursor-pointer transition-all duration-200"
            title="Refresh database entries"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto border border-purple-royal/10 bg-[#0b0b0c]/90 rounded-2xl shadow-xl backdrop-blur-md">
        <table className="w-full text-left border-collapse text-xs text-zinc-300">
          <thead>
            <tr className="border-b border-purple-royal/20 text-[10px] tracking-widest uppercase text-zinc-500">
              <th className="pt-5 pb-6 pl-8 font-semibold">Product</th>
              <th className="pt-5 pb-6 px-8 font-semibold">Category</th>
              <th className="pt-5 pb-6 px-8 font-semibold">Pricing</th>
              <th className="pt-5 pb-6 px-8 font-semibold">Inventory</th>
              <th className="pt-5 pb-6 px-8 font-semibold">Status</th>
              <th className="pt-5 pb-6 px-8 font-semibold">Promo Tags</th>
              <th className="pt-5 pb-6 px-8 font-semibold">Date Created</th>
              <th className="pt-5 pb-6 pr-8 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-royal/5">
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-16 text-center text-zinc-500 italic">No products match search criteria.</td>
              </tr>
            ) : (
              currentItems.map((prod) => {
                const totalStock = prod.variants?.reduce((sum: number, v: any) => sum + (v.stock || 0), 0) || prod.stock || 0;
                const isOutOfStock = totalStock === 0;
                const isLowStock = totalStock > 0 && totalStock <= (prod.lowStockThreshold || 10);
                const isActive = prod.isActive !== false;

                const primaryImage = prod.media && prod.media.length > 0
                  ? prod.media[0].url
                  : (prod.category === "saree" ? "/banners/saree_banner_1.png" : "/banners/jewelry_banner_1.png");

                // Inventory Badge Config
                let stockBadge = null;
                if (isOutOfStock) {
                  stockBadge = (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 border border-rose-500/20 text-rose-400">
                      <XCircle className="h-3.5 w-3.5" />
                      {totalStock} units
                    </span>
                  );
                } else if (isLowStock) {
                  stockBadge = (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 border border-amber-500/20 text-amber-400 animate-pulse">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {totalStock} units
                    </span>
                  );
                } else {
                  stockBadge = (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      <Package className="h-3.5 w-3.5" />
                      {totalStock} units
                    </span>
                  );
                }

                return (
                  <tr key={prod._id} className="hover:bg-purple-royal/10 even:bg-zinc-900/30 transition-all duration-200 h-[104px]">
                    {/* Combined Product details column */}
                    <td className="py-[12px] pl-8 align-middle">
                      <div className="flex items-center gap-6">
                        <div className="relative h-20 w-20 flex-shrink-0 rounded-[12px] border border-white/10 overflow-hidden bg-zinc-900 shadow-md shadow-black/40 mr-3">
                          <Image src={primaryImage} alt={prod.name} fill className="object-cover transition-transform duration-300 hover:scale-105" />
                        </div>
                        <div className="flex flex-col min-w-0 justify-center">
                          <span className="font-serif font-bold text-sm text-white tracking-wide truncate max-w-[220px]">
                            {prod.name}
                          </span>
                          <span className="font-mono text-[10px] text-zinc-400 font-semibold tracking-wider mt-1 uppercase">
                            {prod.sku || "N/A"}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category Column */}
                    <td className="py-[12px] px-8 align-middle">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-purple-royal/10 border border-purple-royal/20 text-purple-light">
                        {prod.subCategory || prod.category}
                      </span>
                    </td>

                    {/* Pricing Column */}
                    <td className="py-[12px] px-8 align-middle font-sans">
                      <div className="flex flex-col items-start gap-0.5">
                        <span className="font-bold text-sm text-gold">
                          {formatRupee(prod.discountPrice || prod.basePrice)}
                        </span>
                        {prod.discountPrice && prod.discountPrice < prod.basePrice ? (
                          <span className="text-[10px] text-zinc-500 line-through">
                            {formatRupee(prod.basePrice)}
                          </span>
                        ) : (
                          <span className="text-[10px] text-transparent select-none">-</span>
                        )}
                      </div>
                    </td>

                    {/* Inventory Stock Column */}
                    <td className="py-[12px] px-8 align-middle">
                      {stockBadge}
                    </td>

                    {/* Status Column */}
                    <td className="py-[12px] px-8 align-middle">
                      <span className={`inline-block w-20 text-center px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        isActive 
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                          : "bg-zinc-800/80 border border-zinc-700 text-zinc-400"
                      }`}>
                        {isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {/* Promo Tags Column */}
                    <td className="py-[12px] px-8 align-middle">
                      <div className="flex items-center gap-2">
                        {prod.isFeatured && (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-widest bg-gold/10 border border-gold/30 text-gold-light" title="Featured Item">
                            <Star className="h-2.5 w-2.5 fill-gold text-gold" /> Featured
                          </span>
                        )}
                        {prod.isTrending && (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-widest bg-purple-royal/20 border border-purple-royal/30 text-purple-light" title="Trending Item">
                            <TrendingUp className="h-2.5 w-2.5 text-purple-light" /> Trending
                          </span>
                        )}
                        {prod.isNewArrival && (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-widest bg-blue-500/10 border border-blue-500/30 text-blue-400" title="New Arrival">
                            <Sparkles className="h-2.5 w-2.5 text-blue-400" /> New
                          </span>
                        )}
                        {!prod.isFeatured && !prod.isTrending && !prod.isNewArrival && (
                          <span className="text-zinc-600 text-[10px] italic">-</span>
                        )}
                      </div>
                    </td>

                    {/* Date Column */}
                    <td className="py-[12px] px-8 align-middle font-light text-zinc-500 text-[10px] w-24 whitespace-nowrap">
                      {new Date(prod.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                      })}
                    </td>

                    {/* Actions Column */}
                    <td className="py-[12px] pr-8 align-middle text-right">
                      <div className="inline-flex items-center gap-1 bg-zinc-950 border border-purple-royal/10 p-1.5 rounded-full shadow-inner">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onPreview(prod)}
                          className="text-zinc-400 hover:text-gold hover:bg-zinc-800/80 h-8 w-8 rounded-full transition-all duration-200 cursor-pointer"
                          title="Preview details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(prod)}
                          className="text-zinc-400 hover:text-gold hover:bg-zinc-800/80 h-8 w-8 rounded-full transition-all duration-200 cursor-pointer"
                          title="Edit product"
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(prod)}
                          className="text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 h-8 w-8 rounded-full transition-all duration-200 cursor-pointer"
                          title="Delete product"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile & Tablet Card Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
        {currentItems.length === 0 ? (
          <div className="col-span-full py-12 text-center text-zinc-500 italic bg-[#0b0b0c]/90 border border-purple-royal/10 rounded-2xl shadow-xl">
            No products match search criteria.
          </div>
        ) : (
          currentItems.map((prod) => {
            const totalStock = prod.variants?.reduce((sum: number, v: any) => sum + (v.stock || 0), 0) || prod.stock || 0;
            const isOutOfStock = totalStock === 0;
            const isLowStock = totalStock > 0 && totalStock <= (prod.lowStockThreshold || 10);
            const isActive = prod.isActive !== false;

            const primaryImage = prod.media && prod.media.length > 0
              ? prod.media[0].url
              : (prod.category === "saree" ? "/banners/saree_banner_1.png" : "/banners/jewelry_banner_1.png");

            // Inventory Badge Config
            let stockBadge = null;
            if (isOutOfStock) {
              stockBadge = (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider bg-rose-500/10 border border-rose-500/20 text-rose-400">
                  <XCircle className="h-3.5 w-3.5" />
                  {totalStock} units
                </span>
              );
            } else if (isLowStock) {
              stockBadge = (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider bg-amber-500/10 border border-amber-500/20 text-amber-400 animate-pulse">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {totalStock} units
                </span>
              );
            } else {
              stockBadge = (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <Package className="h-3.5 w-3.5" />
                  {totalStock} units
                </span>
              );
            }

            return (
              <div 
                key={prod._id} 
                className="bg-[#0b0b0c]/90 border border-purple-royal/10 hover:border-gold/30 rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all duration-300 hover:shadow-lg hover:shadow-black/50 backdrop-blur-md"
              >
                {/* Top Section: Thumbnail + Title + SKU */}
                <div className="flex gap-4">
                  <div className="relative h-20 w-20 flex-shrink-0 rounded-[12px] border border-white/10 overflow-hidden bg-zinc-900 shadow-md">
                    <Image src={primaryImage} alt={prod.name} fill className="object-cover" />
                  </div>
                  <div className="flex flex-col min-w-0 justify-center">
                    <span className="font-serif font-bold text-sm text-white tracking-wide truncate">
                      {prod.name}
                    </span>
                    <span className="font-mono text-[9px] text-zinc-400 font-semibold tracking-wider mt-1 uppercase">
                      SKU: {prod.sku || "N/A"}
                    </span>
                    <div className="mt-2.5">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-semibold tracking-wider uppercase bg-purple-royal/10 border border-purple-royal/20 text-purple-light">
                        {prod.subCategory || prod.category}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Middle Section: Stock, Status, Promo Tags, Price */}
                <div className="border-t border-b border-purple-royal/5 py-4 space-y-3.5">
                  {/* Price & Status Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-zinc-500 uppercase tracking-wider">Price</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-bold text-sm text-gold">
                          {formatRupee(prod.discountPrice || prod.basePrice)}
                        </span>
                        {prod.discountPrice && prod.discountPrice < prod.basePrice && (
                          <span className="text-[10px] text-zinc-500 line-through">
                            {formatRupee(prod.basePrice)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[9px] text-zinc-500 uppercase tracking-wider mb-1">Status</span>
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                        isActive 
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                          : "bg-zinc-800/80 border border-zinc-700 text-zinc-400"
                      }`}>
                        {isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>

                  {/* Inventory Stock & Promo Tags */}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-zinc-500 uppercase tracking-wider mb-1">Inventory</span>
                      <div>
                        {stockBadge}
                      </div>
                    </div>

                    <div className="flex flex-col items-end">
                      <span className="text-[9px] text-zinc-500 uppercase tracking-wider mb-1">Promo Tags</span>
                      <div className="flex items-center gap-1.5">
                        {prod.isFeatured && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-widest bg-gold/10 border border-gold/30 text-gold-light" title="Featured">
                            <Star className="h-2.5 w-2.5 fill-gold text-gold" />
                          </span>
                        )}
                        {prod.isTrending && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-widest bg-purple-royal/20 border border-purple-royal/30 text-purple-light" title="Trending">
                            <TrendingUp className="h-2.5 w-2.5 text-purple-light" />
                          </span>
                        )}
                        {prod.isNewArrival && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-widest bg-blue-500/10 border border-blue-500/30 text-blue-400" title="New">
                            <Sparkles className="h-2.5 w-2.5 text-blue-400" />
                          </span>
                        )}
                        {!prod.isFeatured && !prod.isTrending && !prod.isNewArrival && (
                          <span className="text-zinc-600 text-[10px] italic">None</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Section: Date & Actions */}
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[10px] font-light text-zinc-500">
                    Added: {new Date(prod.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric"
                    })}
                  </span>
                  <div className="inline-flex items-center gap-1 bg-zinc-950 border border-purple-royal/10 p-1 rounded-full shadow-inner">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onPreview(prod)}
                      className="text-zinc-400 hover:text-gold hover:bg-zinc-800/80 h-7 w-7 rounded-full transition-all duration-200 cursor-pointer"
                      title="Preview details"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(prod)}
                      className="text-zinc-400 hover:text-gold hover:bg-zinc-800/80 h-7 w-7 rounded-full transition-all duration-200 cursor-pointer"
                      title="Edit product"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(prod)}
                      className="text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 h-7 w-7 rounded-full transition-all duration-200 cursor-pointer"
                      title="Delete product"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center bg-gradient-to-b from-zinc-900/80 to-zinc-950/80 p-4 border border-purple-royal/10 rounded-2xl shadow-xl gap-4 backdrop-blur-md">
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
            Showing {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, totalItems)} of {totalItems} items
          </span>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="bg-zinc-950/60 border border-purple-royal/10 text-zinc-400 hover:text-gold hover:bg-zinc-900 rounded-xl h-8 px-3.5 text-xs flex items-center gap-1 cursor-pointer disabled:opacity-30 transition-all duration-200"
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </Button>
            <span className="text-xs font-mono font-bold text-white px-2.5">
              Page {currentPage} / {totalPages}
            </span>
            <Button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="bg-zinc-950/60 border border-purple-royal/10 text-zinc-400 hover:text-gold hover:bg-zinc-900 rounded-xl h-8 px-3.5 text-xs flex items-center gap-1 cursor-pointer disabled:opacity-30 transition-all duration-200"
            >
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

    </div>
  );
}
