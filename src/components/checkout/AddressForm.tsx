"use client";

import { Button } from "@/components/ui/button";

interface AddressFormProps {
  shippingAddress: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function AddressForm({ shippingAddress, handleInputChange, onSubmit }: AddressFormProps) {
  return (
    <form onSubmit={onSubmit} className="bg-card p-6 sm:p-8 border border-border space-y-6 shadow-sm">
      <h2 className="font-serif text-xl tracking-wider text-gold uppercase border-b border-border pb-4">
        Shipping Details
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground font-semibold uppercase tracking-widest">Full Name</label>
          <input
            type="text"
            name="name"
            required
            value={shippingAddress.name}
            onChange={handleInputChange}
            className="w-full bg-background border border-border text-foreground rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground font-semibold uppercase tracking-widest">Phone Number</label>
          <input
            type="tel"
            name="phone"
            required
            value={shippingAddress.phone}
            onChange={handleInputChange}
            className="w-full bg-background border border-border text-foreground rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <label className="text-xs text-muted-foreground font-semibold uppercase tracking-widest">Address Line</label>
          <input
            type="text"
            name="addressLine"
            required
            value={shippingAddress.addressLine}
            onChange={handleInputChange}
            className="w-full bg-background border border-border text-foreground rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground font-semibold uppercase tracking-widest">City</label>
          <input
            type="text"
            name="city"
            required
            value={shippingAddress.city}
            onChange={handleInputChange}
            className="w-full bg-background border border-border text-foreground rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground font-semibold uppercase tracking-widest">State</label>
          <input
            type="text"
            name="state"
            required
            value={shippingAddress.state}
            onChange={handleInputChange}
            className="w-full bg-background border border-border text-foreground rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <label className="text-xs text-muted-foreground font-semibold uppercase tracking-widest">PIN Code</label>
          <input
            type="text"
            name="zip"
            required
            value={shippingAddress.zip}
            onChange={handleInputChange}
            className="w-full bg-background border border-border text-foreground rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
      </div>
      <div className="pt-4 flex justify-end">
        <Button
          type="submit"
          className="bg-primary hover:bg-gold-light text-white rounded-none tracking-widest uppercase font-bold px-8 h-12 transition-colors shadow-md hover:shadow-primary/20"
        >
          Continue to Summary
        </Button>
      </div>
    </form>
  );
}
