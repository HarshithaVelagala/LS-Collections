"use client";

import Image from "next/image";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface FrequentlyBoughtTogetherProps {
  mainProduct: any;
  onAddAllToCart: (products: any[]) => void;
  isPreview?: boolean;
}

export default function FrequentlyBoughtTogether({ mainProduct, onAddAllToCart, isPreview = false }: FrequentlyBoughtTogetherProps) {
  const [selectedItems, setSelectedItems] = useState([true, true]); // Both selected by default

  const isSaree = mainProduct.category?.toLowerCase() === "saree";

  // Mock related accessory based on category
  const accessory = isSaree ? {
    _id: "mock-acc-1",
    name: "Kundan Temple Necklace Set",
    price: 3500,
    image: "/banners/jewelry_banner_1.png",
    category: "jewellery"
  } : {
    _id: "mock-acc-2",
    name: "Premium Silk Potli Bag",
    price: 1200,
    image: "/banners/saree_banner_1.png", // fallback image
    category: "accessories"
  };

  const mainPrice = mainProduct.discountPrice || mainProduct.basePrice;
  const totalPrice = (selectedItems[0] ? mainPrice : 0) + (selectedItems[1] ? accessory.price : 0);

  const handleAddSelected = () => {
    const itemsToAdd = [];
    if (selectedItems[0]) itemsToAdd.push({ ...mainProduct, price: mainPrice });
    if (selectedItems[1]) itemsToAdd.push(accessory);
    if (itemsToAdd.length > 0) {
      onAddAllToCart(itemsToAdd);
    }
  };

  return (
    <section className="mt-24 border-t border-border pt-16">
      <h2 className="text-2xl font-serif tracking-wider text-foreground uppercase mb-8">
        Frequently Bought Together
      </h2>

      <div className="bg-card border border-border p-6 flex flex-col lg:flex-row items-center gap-8 lg:gap-12 shadow-sm">
        {/* Images Flow */}
        <div className="flex items-center gap-4 lg:gap-8 flex-1 w-full overflow-x-auto pb-4 lg:pb-0">
          
          {/* Main Product */}
          <div className={`relative h-40 w-32 flex-shrink-0 border-2 transition-all ${selectedItems[0] ? "border-gold" : "border-transparent opacity-50"}`}>
            <Image 
              src={mainProduct.media[0]?.url || "/banners/saree_banner_1.png"}
              alt={mainProduct.name}
              fill
              className="object-cover"
            />
            <div className="absolute -top-2 -left-2 bg-card rounded-sm">
              <input 
                type="checkbox" 
                checked={selectedItems[0]}
                onChange={() => setSelectedItems([!selectedItems[0], selectedItems[1]])}
                className="h-4 w-4 accent-gold"
              />
            </div>
          </div>

          <Plus className="h-6 w-6 text-zinc-600 flex-shrink-0" />

          {/* Accessory */}
          <div className={`relative h-40 w-32 flex-shrink-0 border-2 transition-all ${selectedItems[1] ? "border-gold" : "border-transparent opacity-50"}`}>
            <Image 
              src={accessory.image}
              alt={accessory.name}
              fill
              className="object-cover"
            />
            <div className="absolute -top-2 -left-2 bg-card rounded-sm">
              <input 
                type="checkbox" 
                checked={selectedItems[1]}
                onChange={() => setSelectedItems([selectedItems[0], !selectedItems[1]])}
                className="h-4 w-4 accent-gold"
              />
            </div>
          </div>

        </div>

        {/* Pricing & CTA */}
        <div className="flex flex-col gap-4 min-w-[250px] w-full lg:w-auto border-t lg:border-t-0 lg:border-l border-purple-royal/10 pt-6 lg:pt-0 lg:pl-12">
          <div>
            <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mb-1">Total Price</p>
            <p className="text-3xl font-extrabold text-gold">₹{totalPrice.toLocaleString("en-IN")}</p>
          </div>
          
          <Button 
            onClick={handleAddSelected}
            disabled={isPreview || (!selectedItems[0] && !selectedItems[1])}
            className="w-full bg-purple-royal hover:bg-purple-light text-white font-semibold tracking-wider text-xs uppercase py-6 rounded-none transition-all shadow-lg"
          >
            Add Selected To Cart
          </Button>
          
          <div className="text-[10px] text-zinc-400 space-y-1">
            <p className="truncate">
              <span className={selectedItems[0] ? "text-white font-bold" : "line-through"}>This item:</span> {mainProduct.name} - ₹{mainPrice.toLocaleString("en-IN")}
            </p>
            <p className="truncate">
              <span className={selectedItems[1] ? "text-white font-bold" : "line-through"}>Accessory:</span> {accessory.name} - ₹{accessory.price.toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
