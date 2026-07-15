"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, PlusCircle, Trash2, Sliders, ClipboardList, Info, Image as ImageIcon, Star } from "lucide-react";
import ProductImageUploader from "./ProductImageUploader";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MediaAsset {
  url: string;
  public_id?: string;
  type?: "image" | "video";
}

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: any) => Promise<void>;
  editingProduct: any;
  categories: any[];
  loading: boolean;
}

export default function ProductForm({ isOpen, onClose, onSubmit, editingProduct, categories, loading }: ProductFormProps) {
  const { toast } = useToast();

  // Fields state
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [sku, setSku] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("saree");
  const [subCategory, setSubCategory] = useState("");
  const [brand, setBrand] = useState("LS Heritage");

  // Price and Inventory
  const [mrp, setMrp] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [stock, setStock] = useState("10");
  const [lowStockThreshold, setLowStockThreshold] = useState("10");

  // Specs
  const [weight, setWeight] = useState("");
  const [dimensions, setDimensions] = useState({ length: "", width: "", height: "" });
  const [tags, setTags] = useState("");

  // Toggles
  const [isFeatured, setIsFeatured] = useState(false);
  const [isTrending, setIsTrending] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isActive, setIsActive] = useState(true);

  // Lists
  const [media, setMedia] = useState<MediaAsset[]>([]);
  const [variants, setVariants] = useState<any[]>([]);
  const [personalizationEnabled, setPersonalizationEnabled] = useState(false);
  const [personalizationFields, setPersonalizationFields] = useState<any[]>([]);

  // Automatically generate slug from Name when adding a product
  useEffect(() => {
    if (!editingProduct) {
      setSlug(name.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-"));
    }
  }, [name, editingProduct]);

  // Load editing product details
  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name || "");
      setSlug(editingProduct.slug || "");
      setSku(editingProduct.sku || "");
      setShortDescription(editingProduct.shortDescription || "");
      setDescription(editingProduct.description || "");
      setCategory(editingProduct.category || "saree");
      setSubCategory(editingProduct.subCategory || "");
      setBrand(editingProduct.brand || "LS Heritage");
      setMrp(editingProduct.basePrice?.toString() || "");
      setSellingPrice(editingProduct.discountPrice?.toString() || editingProduct.basePrice?.toString() || "");
      setStock(editingProduct.stock?.toString() || "0");
      setLowStockThreshold(editingProduct.lowStockThreshold?.toString() || "10");
      setWeight(editingProduct.weight?.toString() || "");
      setDimensions({
        length: editingProduct.dimensions?.length?.toString() || "",
        width: editingProduct.dimensions?.width?.toString() || "",
        height: editingProduct.dimensions?.height?.toString() || "",
      });
      setTags(editingProduct.tags?.join(", ") || "");
      setIsFeatured(!!editingProduct.isFeatured);
      setIsTrending(!!editingProduct.isTrending);
      setIsNewArrival(!!editingProduct.isNewArrival);
      setIsBestSeller(!!editingProduct.isBestSeller);
      setIsActive(editingProduct.isActive !== false);
      setMedia(editingProduct.media || []);
      setVariants(editingProduct.variants || []);
      setPersonalizationEnabled(!!editingProduct.personalization?.isEnabled);
      setPersonalizationFields(editingProduct.personalization?.fields || []);
    } else {
      // Reset to defaults
      setName("");
      setSlug("");
      setSku("");
      setShortDescription("");
      setDescription("");
      setCategory("saree");
      setSubCategory("");
      setBrand("LS Heritage");
      setMrp("");
      setSellingPrice("");
      setStock("10");
      setLowStockThreshold("10");
      setWeight("");
      setDimensions({ length: "", width: "", height: "" });
      setTags("");
      setIsFeatured(false);
      setIsTrending(false);
      setIsNewArrival(false);
      setIsBestSeller(false);
      setIsActive(true);
      setMedia([]);
      setVariants([]);
      setPersonalizationEnabled(false);
      setPersonalizationFields([]);
    }
  }, [editingProduct, isOpen]);

  // Find linked categoryId based on category string
  const getCategoryDetails = () => {
    const matched = categories.find(c => c.slug === category);
    return {
      categoryId: matched ? matched._id : null,
      subcategoryId: null // Can map if needed
    };
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Required fields client validation
    if (!name.trim()) return alert("Product Name is required.");
    if (!sku.trim()) return alert("SKU is required.");
    if (!sellingPrice) return alert("Selling Price is required.");
    if (!stock) return alert("Stock Quantity is required.");

    const { categoryId } = getCategoryDetails();

    // Map Price logic
    const baseVal = Number(mrp || sellingPrice);
    const sellingVal = Number(sellingPrice);
    const finalDiscountPrice = sellingVal < baseVal ? sellingVal : undefined;

    const payload = {
      _id: editingProduct?._id,
      name,
      slug,
      sku: sku.toUpperCase().trim(),
      shortDescription,
      description,
      category,
      subCategory,
      brand,
      basePrice: baseVal,
      discountPrice: finalDiscountPrice,
      stock: Number(stock),
      lowStockThreshold: Number(lowStockThreshold),
      weight: weight ? Number(weight) : undefined,
      dimensions: {
        length: dimensions.length ? Number(dimensions.length) : undefined,
        width: dimensions.width ? Number(dimensions.width) : undefined,
        height: dimensions.height ? Number(dimensions.height) : undefined,
      },
      tags,
      isFeatured,
      isTrending,
      isNewArrival,
      isBestSeller,
      isActive,
      media,
      variants,
      personalization: {
        isEnabled: personalizationEnabled,
        fields: personalizationFields
      },
      categoryId
    };

    onSubmit(payload);
  };

  // Manage variants
  const handleAddVariant = () => {
    setVariants((prev) => [
      ...prev,
      {
        sku: `${sku || "SAR"}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        attributes: { size: "Standard" },
        stock: 5,
        price: undefined,
      },
    ]);
  };

  const handleRemoveVariant = (idx: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[95vw] sm:max-w-[95vw] md:max-w-[95vw] lg:max-w-[1100px] xl:max-w-[1300px] w-full border border-purple-royal/30 bg-black text-white p-0 overflow-hidden rounded-2xl select-none flex flex-col h-[90vh] md:h-[85vh]">
        
        {/* Sticky Header */}
        <DialogHeader className="border-b border-purple-royal/10 p-6 flex-shrink-0 bg-black z-10 w-full">
          <DialogTitle className="font-serif text-gold text-2xl font-bold tracking-wider uppercase">
            {editingProduct ? "Edit Luxury Catalog Asset" : "List New Luxury Catalog Asset"}
          </DialogTitle>
        </DialogHeader>

        {/* Form Container wrapping scrollable body and sticky actions */}
        <form onSubmit={handleFormSubmit} className="flex flex-col flex-1 overflow-hidden w-full">
          
          {/* Scrollable Form Body */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8 custom-scrollbar w-full">
            
            <div className="flex flex-col space-y-10 w-full">
              
              {/* Vertical Sections */}
                
                {/* Section A: Core Information */}
                <div className="bg-zinc-950/60 border border-purple-royal/10 rounded-3xl p-6 md:p-10 space-y-7 shadow-xl backdrop-blur-md hover:border-purple-royal/20 transition-all duration-300">
                  <h5 className="font-serif text-base text-gold uppercase tracking-widest flex items-center gap-3 border-b border-purple-royal/10 pb-4 mb-2">
                    <Info className="h-4 w-4 text-gold" /> Core Information
                  </h5>

                  {/* Product Name */}
                  <div className="space-y-2">
                    <label className="text-xs text-zinc-400 font-semibold tracking-wide block">Product Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full min-w-[200px] bg-zinc-900 border border-purple-royal/20 text-white rounded-xl px-4 h-11 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all"
                      placeholder="e.g. Royal Silk Kanjeevaram Saree"
                    />
                  </div>

                  {/* Slug & SKU */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs text-zinc-400 font-semibold tracking-wide block">URL Slug *</label>
                      <input
                        type="text"
                        required
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        className="w-full min-w-[140px] bg-zinc-900 border border-purple-royal/20 text-white rounded-xl px-4 h-11 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-zinc-400 font-semibold tracking-wide block">SKU Code *</label>
                      <input
                        type="text"
                        required
                        value={sku}
                        onChange={(e) => setSku(e.target.value)}
                        className="w-full min-w-[140px] bg-zinc-900 border border-purple-royal/20 text-white rounded-xl px-4 h-11 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all font-mono uppercase"
                        placeholder="SAR-KANJ-PUR"
                      />
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs text-zinc-400 font-semibold tracking-wide block">Category *</label>
                      <Select value={category} onValueChange={(val) => setCategory(val || "saree")}>
                        <SelectTrigger className="w-full min-w-[140px] h-11 bg-zinc-900 border-purple-royal/20 hover:border-gold/40 focus:border-gold/60 focus:ring-1 focus:ring-gold/30 rounded-xl px-4 text-sm text-white">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-950 border border-purple-royal/30 rounded-xl shadow-2xl py-1.5 z-[150]">
                          <SelectItem value="saree" className="py-3 pr-8 pl-4 text-xs font-semibold text-zinc-400 focus:bg-purple-royal/15 focus:text-white data-[state=checked]:bg-gold/15 data-[state=checked]:text-gold-light data-[state=checked]:font-bold data-[state=checked]:border-l-2 data-[state=checked]:border-gold rounded-none cursor-pointer">
                            Sarees
                          </SelectItem>
                          <SelectItem value="jewellery" className="py-3 pr-8 pl-4 text-xs font-semibold text-zinc-400 focus:bg-purple-royal/15 focus:text-white data-[state=checked]:bg-gold/15 data-[state=checked]:text-gold-light data-[state=checked]:font-bold data-[state=checked]:border-l-2 data-[state=checked]:border-gold rounded-none cursor-pointer">
                            Jewellery
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-zinc-400 font-semibold tracking-wide block">Subcategory</label>
                      <input
                        type="text"
                        value={subCategory}
                        onChange={(e) => setSubCategory(e.target.value)}
                        className="w-full min-w-[140px] bg-zinc-900 border border-purple-royal/20 text-white rounded-xl px-4 h-11 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all"
                        placeholder="e.g. Kanjeevaram"
                      />
                    </div>
                  </div>

                  {/* Brand */}
                  <div className="space-y-2">
                    <label className="text-xs text-zinc-400 font-semibold tracking-wide block">Brand / Artisan Label</label>
                    <input
                      type="text"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="w-full min-w-[200px] bg-zinc-900 border border-purple-royal/20 text-white rounded-xl px-4 h-11 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all"
                    />
                  </div>
                </div>

                {/* Section B: Product Descriptions */}
                <div className="bg-zinc-950/60 border border-purple-royal/10 rounded-3xl p-6 md:p-10 space-y-7 shadow-xl backdrop-blur-md hover:border-purple-royal/20 transition-all duration-300">
                  <h5 className="font-serif text-base text-gold uppercase tracking-widest flex items-center gap-3 border-b border-purple-royal/10 pb-4 mb-2">
                    <Sliders className="h-4 w-4 text-gold" /> Product Descriptions
                  </h5>

                  {/* Short Description */}
                  <div className="space-y-2">
                    <label className="text-xs text-zinc-400 font-semibold tracking-wide block">Short Excerpt Description</label>
                    <input
                      type="text"
                      value={shortDescription}
                      onChange={(e) => setShortDescription(e.target.value)}
                      className="w-full min-w-[200px] bg-zinc-900 border border-purple-royal/20 text-white rounded-xl px-4 h-11 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all"
                      placeholder="Summarize the product craft details in a short sentence."
                    />
                  </div>

                  {/* Full Description */}
                  <div className="space-y-2">
                    <label className="text-xs text-zinc-400 font-semibold tracking-wide block">Full Editorial Description</label>
                    <textarea
                      required
                      rows={6}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full min-w-[200px] bg-zinc-900 border border-purple-royal/20 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all min-h-[150px] custom-scrollbar"
                      placeholder="Enter detailed description..."
                    />
                  </div>
                </div>

                {/* Section C: Media Gallery */}
                <div className="bg-zinc-950/60 border border-purple-royal/10 rounded-3xl p-6 md:p-10 space-y-7 shadow-xl backdrop-blur-md hover:border-purple-royal/20 transition-all duration-300">
                  <h5 className="font-serif text-base text-gold uppercase tracking-widest flex items-center gap-3 border-b border-purple-royal/10 pb-4 mb-2">
                    <ImageIcon className="h-4 w-4 text-gold" /> Product Media Gallery
                  </h5>
                  <div className="p-2 border border-purple-royal/5 rounded-xl bg-black/40">
                    <ProductImageUploader media={media} onChange={setMedia} category={category} />
                  </div>
                </div>
                
                {/* Section D: Pricing & Inventory */}
                <div className="bg-zinc-950/60 border border-purple-royal/10 rounded-3xl p-6 md:p-10 space-y-7 shadow-xl backdrop-blur-md hover:border-purple-royal/20 transition-all duration-300">
                  <h5 className="font-serif text-base text-gold uppercase tracking-widest flex items-center gap-3 border-b border-purple-royal/10 pb-4 mb-2">
                    <ClipboardList className="h-4 w-4 text-gold" /> Pricing & Inventory
                  </h5>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs text-zinc-400 font-semibold tracking-wide block">MRP (Price) (₹)</label>
                      <input
                        type="number"
                        value={mrp}
                        onChange={(e) => setMrp(e.target.value)}
                        className="w-full min-w-[140px] bg-zinc-900 border border-purple-royal/20 text-white rounded-xl px-4 h-11 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all"
                        placeholder="15000"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-zinc-400 font-semibold tracking-wide block">Selling Price * (₹)</label>
                      <input
                        type="number"
                        required
                        value={sellingPrice}
                        onChange={(e) => setSellingPrice(e.target.value)}
                        className="w-full min-w-[140px] bg-zinc-900 border border-purple-royal/20 text-white rounded-xl px-4 h-11 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all"
                        placeholder="13999"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs text-zinc-400 font-semibold tracking-wide block">Stock Quantity *</label>
                      <input
                        type="number"
                        required
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        className="w-full min-w-[140px] bg-zinc-900 border border-purple-royal/20 text-white rounded-xl px-4 h-11 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-zinc-400 font-semibold tracking-wide block">Low Stock Warn Threshold</label>
                      <input
                        type="number"
                        required
                        value={lowStockThreshold}
                        onChange={(e) => setLowStockThreshold(e.target.value)}
                        className="w-full min-w-[140px] bg-zinc-900 border border-purple-royal/20 text-white rounded-xl px-4 h-11 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Section E: Physical Specifications */}
                <div className="bg-zinc-950/60 border border-purple-royal/10 rounded-3xl p-6 md:p-10 space-y-7 shadow-xl backdrop-blur-md hover:border-purple-royal/20 transition-all duration-300">
                  <h5 className="font-serif text-base text-gold uppercase tracking-widest flex items-center gap-3 border-b border-purple-royal/10 pb-4 mb-2">
                    <Sliders className="h-4 w-4 text-gold" /> Product Specifications
                  </h5>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs text-zinc-400 font-semibold tracking-wide block">Product Weight (grams)</label>
                      <input
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="w-full min-w-[140px] bg-zinc-900 border border-purple-royal/20 text-white rounded-xl px-4 h-11 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all"
                        placeholder="e.g. 750"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-zinc-400 font-semibold tracking-wide block">Tags (comma separated)</label>
                      <input
                        type="text"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        className="w-full min-w-[140px] bg-zinc-900 border border-purple-royal/20 text-white rounded-xl px-4 h-11 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all font-mono"
                        placeholder="silk, bridal, red"
                      />
                    </div>
                  </div>

                  {/* Dimensions */}
                  <div className="space-y-2">
                    <label className="text-xs text-zinc-400 font-semibold tracking-wide block mb-1">Dimensions (L × W × H in cm)</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <input
                          type="number"
                          placeholder="Length"
                          value={dimensions.length}
                          onChange={(e) => setDimensions(d => ({ ...d, length: e.target.value }))}
                          className="w-full min-w-[80px] bg-zinc-900 border border-purple-royal/20 text-white rounded-xl px-3 h-11 text-sm text-center focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all"
                        />
                      </div>
                      <div className="space-y-1">
                        <input
                          type="number"
                          placeholder="Width"
                          value={dimensions.width}
                          onChange={(e) => setDimensions(d => ({ ...d, width: e.target.value }))}
                          className="w-full min-w-[80px] bg-zinc-900 border border-purple-royal/20 text-white rounded-xl px-3 h-11 text-sm text-center focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all"
                        />
                      </div>
                      <div className="space-y-1">
                        <input
                          type="number"
                          placeholder="Height"
                          value={dimensions.height}
                          onChange={(e) => setDimensions(d => ({ ...d, height: e.target.value }))}
                          className="w-full min-w-[80px] bg-zinc-900 border border-purple-royal/20 text-white rounded-xl px-3 h-11 text-sm text-center focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section F: Storefront Status & Highlights */}
                <div className="bg-zinc-950/60 border border-purple-royal/10 rounded-3xl p-6 md:p-10 space-y-7 shadow-xl backdrop-blur-md hover:border-purple-royal/20 transition-all duration-300">
                  <h5 className="font-serif text-base text-gold uppercase tracking-widest flex items-center gap-3 border-b border-purple-royal/10 pb-4 mb-2">
                    <Star className="h-4 w-4 text-gold" /> Storefront Status & Highlights
                  </h5>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                    <label className="flex items-center gap-3.5 text-xs text-zinc-300 font-medium cursor-pointer hover:text-white transition-colors duration-150 py-1">
                      <input
                        type="checkbox"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                        className="h-5 w-5 bg-zinc-900 border border-purple-royal/20 rounded-lg accent-gold cursor-pointer transition-all focus:ring-1 focus:ring-gold/30"
                      />
                      <span>Active Listing</span>
                    </label>
                    <label className="flex items-center gap-3.5 text-xs text-zinc-300 font-medium cursor-pointer hover:text-white transition-colors duration-150 py-1">
                      <input
                        type="checkbox"
                        checked={isFeatured}
                        onChange={(e) => setIsFeatured(e.target.checked)}
                        className="h-5 w-5 bg-zinc-900 border border-purple-royal/20 rounded-lg accent-gold cursor-pointer transition-all focus:ring-1 focus:ring-gold/30"
                      />
                      <span>Featured Promo</span>
                    </label>
                    <label className="flex items-center gap-3.5 text-xs text-zinc-300 font-medium cursor-pointer hover:text-white transition-colors duration-150 py-1">
                      <input
                        type="checkbox"
                        checked={isTrending}
                        onChange={(e) => setIsTrending(e.target.checked)}
                        className="h-5 w-5 bg-zinc-900 border border-purple-royal/20 rounded-lg accent-gold cursor-pointer transition-all focus:ring-1 focus:ring-gold/30"
                      />
                      <span>Trending Item</span>
                    </label>
                    <label className="flex items-center gap-3.5 text-xs text-zinc-300 font-medium cursor-pointer hover:text-white transition-colors duration-150 py-1">
                      <input
                        type="checkbox"
                        checked={isNewArrival}
                        onChange={(e) => setIsNewArrival(e.target.checked)}
                        className="h-5 w-5 bg-zinc-900 border border-purple-royal/20 rounded-lg accent-gold cursor-pointer transition-all focus:ring-1 focus:ring-gold/30"
                      />
                      <span>New Arrival</span>
                    </label>
                    <label className="flex items-center gap-3.5 text-xs text-zinc-300 font-medium cursor-pointer hover:text-white transition-colors duration-150 py-1 sm:col-span-2">
                      <input
                        type="checkbox"
                        checked={isBestSeller}
                        onChange={(e) => setIsBestSeller(e.target.checked)}
                        className="h-5 w-5 bg-zinc-900 border border-purple-royal/20 rounded-lg accent-gold cursor-pointer transition-all focus:ring-1 focus:ring-gold/30"
                      />
                      <span>Best Seller</span>
                    </label>
                  </div>
                </div>

                {/* Section G: Custom Variants */}
                <div className="bg-zinc-950/60 border border-purple-royal/10 rounded-3xl p-6 md:p-10 space-y-7 shadow-xl backdrop-blur-md hover:border-purple-royal/20 transition-all duration-300">
                  <div className="flex justify-between items-center border-b border-purple-royal/10 pb-4 mb-2">
                    <h5 className="font-serif text-base text-gold uppercase tracking-widest">Product Variants</h5>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleAddVariant}
                      className="text-gold hover:text-gold-light p-1 h-auto text-xs uppercase tracking-widest flex items-center gap-1 font-semibold cursor-pointer"
                    >
                      + Add Option
                    </Button>
                  </div>

                  {variants.length === 0 ? (
                    <p className="text-xs text-zinc-500 italic py-2">No variants configured. Defaults to main SKU and stock.</p>
                  ) : (
                    <div className="space-y-4 max-h-[250px] overflow-y-auto custom-scrollbar pr-2">
                      {variants.map((v, i) => (
                        <div key={i} className="flex gap-3 items-center bg-black/60 p-4 border border-purple-royal/10 rounded-xl hover:border-purple-royal/20 transition-all">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
                            <div className="space-y-1">
                              <label className="text-[9px] text-zinc-500 uppercase font-bold">SKU</label>
                              <input
                                type="text"
                                placeholder="SKU"
                                required
                                value={v.sku}
                                onChange={(e) => {
                                  const newVariants = [...variants];
                                  newVariants[i].sku = e.target.value;
                                  setVariants(newVariants);
                                }}
                                className="w-full min-w-[100px] bg-zinc-900 text-sm px-3 h-10 rounded-lg focus:outline-none text-white border border-purple-royal/15 font-mono"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] text-zinc-500 uppercase font-bold">Attribute Value</label>
                              <input
                                type="text"
                                placeholder="e.g. Standard, Red"
                                value={v.attributes.size || ""}
                                onChange={(e) => {
                                  const newVariants = [...variants];
                                  newVariants[i].attributes = { ...newVariants[i].attributes, size: e.target.value };
                                  setVariants(newVariants);
                                }}
                                className="w-full min-w-[100px] bg-zinc-900 text-sm px-3 h-10 rounded-lg focus:outline-none text-white border border-purple-royal/15"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] text-zinc-500 uppercase font-bold">Stock Qty</label>
                              <input
                                type="number"
                                placeholder="Stock"
                                required
                                value={v.stock}
                                onChange={(e) => {
                                  const newVariants = [...variants];
                                  newVariants[i].stock = Number(e.target.value);
                                  setVariants(newVariants);
                                }}
                                className="w-full min-w-[100px] bg-zinc-900 text-sm px-3 h-10 rounded-lg focus:outline-none text-white border border-purple-royal/15"
                              />
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => handleRemoveVariant(i)}
                            className="text-zinc-500 hover:text-rose-400 p-1.5 h-auto cursor-pointer rounded-lg hover:bg-rose-500/10 self-end mb-0.5"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

            </div>

          </div>

          {/* Sticky Form Actions (Footer) */}
          <div className="border-t border-purple-royal/10 p-6 flex gap-4 bg-zinc-950 flex-shrink-0 z-10">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-purple-royal/20 text-zinc-400 hover:text-white hover:bg-purple-royal/5 rounded-xl tracking-widest text-xs uppercase h-12 cursor-pointer transition-all duration-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-gold via-gold-light to-gold-dark text-black font-extrabold tracking-widest text-xs uppercase h-12 rounded-xl shadow-lg shadow-gold/15 cursor-pointer hover:opacity-90 transition-all"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mx-auto text-black" /> : "Save Catalog Asset"}
            </Button>
          </div>

        </form>
      </DialogContent>
    </Dialog>
  );
}
