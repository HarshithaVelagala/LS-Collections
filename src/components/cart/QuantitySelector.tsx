"use client";

import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
}

export default function QuantitySelector({ quantity, onIncrease, onDecrease }: QuantitySelectorProps) {
  return (
    <div className="flex items-center bg-[#FFFFFF] border border-[#ECE6DF] w-fit rounded-[4px] overflow-hidden">
      <button
        onClick={onDecrease}
        className="text-[#2C2C2C] hover:bg-[#F5F5F5] transition-colors duration-200 ease-in-out focus:outline-none h-8 w-8 flex items-center justify-center"
        aria-label="Decrease quantity"
      >
        <Minus className="h-3 w-3" />
      </button>
      <span className="text-[13px] font-medium w-6 h-8 flex items-center justify-center text-[#2C2C2C] font-sans">{quantity}</span>
      <button
        onClick={onIncrease}
        className="text-[#2C2C2C] hover:bg-[#F5F5F5] transition-colors duration-200 ease-in-out focus:outline-none h-8 w-8 flex items-center justify-center"
        aria-label="Increase quantity"
      >
        <Plus className="h-3 w-3" />
      </button>
    </div>
  );
}

