"use client";

interface CartSummaryProps {
  subtotal: number;
  discountAmount?: number;
}

export default function CartSummary({ subtotal, discountAmount = 0 }: CartSummaryProps) {
  const shipping = subtotal > 5000 ? 0 : 250;
  const total = subtotal + shipping - discountAmount;

  return (
    <div className="space-y-4 mt-2">
      <div className="flex justify-between items-center text-[12px] tracking-widest text-[#2C2C2C] uppercase font-semibold">
        <span>Subtotal</span>
        <span className="font-sans">₹{subtotal.toLocaleString("en-IN")}</span>
      </div>
      
      {discountAmount > 0 && (
        <div className="flex justify-between items-center text-[12px] tracking-widest text-[#2C2C2C] uppercase font-semibold">
          <span>Discount on MRP</span>
          <span className="text-[#D32F2F] font-sans">- ₹{discountAmount.toLocaleString("en-IN")}</span>
        </div>
      )}

      <div className="flex justify-between items-center text-[12px] tracking-widest text-[#2C2C2C] uppercase font-semibold">
        <span>Estimated Shipping</span>
        <span className={shipping === 0 ? "text-[#4CAF50] font-sans" : "font-sans"}>
          {shipping === 0 ? "FREE" : `₹${shipping.toLocaleString("en-IN")}`}
        </span>
      </div>
      
      <div className="border border-[#ECE6DF] bg-[#FCFCFC] p-4 mt-4 flex justify-between items-center rounded-[4px]">
        <span className="font-sans font-bold text-[#2C2C2C] uppercase tracking-widest text-[14px]">Estimated Total</span>
        <span className="font-sans font-bold text-[#2C2C2C] text-[18px]">₹{total.toLocaleString("en-IN")}</span>
      </div>
    </div>
  );
}
