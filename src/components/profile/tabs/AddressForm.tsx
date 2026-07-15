"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AddressFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

export default function AddressForm({ initialData, onSubmit, onCancel }: AddressFormProps) {
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    phone: initialData?.phone || "",
    addressLine: initialData?.addressLine || "",
    city: initialData?.city || "",
    state: initialData?.state || "",
    zip: initialData?.zip || "",
    isDefault: initialData?.isDefault || false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData((prev) => ({ ...prev, [e.target.name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(formData);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border p-6 sm:p-8 space-y-6 shadow-sm">
      <h4 className="font-serif text-foreground tracking-wider text-xl mb-4">
        {initialData ? "Edit Address" : "Add New Address"}
      </h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground font-semibold uppercase tracking-widest">Full Name</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full bg-background border border-border text-foreground rounded-md px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground font-semibold uppercase tracking-widest">Mobile Number</label>
          <input
            type="tel"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            className="w-full bg-background border border-border text-foreground rounded-md px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs text-muted-foreground font-semibold uppercase tracking-widest">Address Line</label>
        <input
          type="text"
          name="addressLine"
          required
          value={formData.addressLine}
          onChange={handleChange}
          className="w-full bg-background border border-border text-foreground rounded-md px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground font-semibold uppercase tracking-widest">City</label>
          <input
            type="text"
            name="city"
            required
            value={formData.city}
            onChange={handleChange}
            className="w-full bg-background border border-border text-foreground rounded-md px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground font-semibold uppercase tracking-widest">State</label>
          <input
            type="text"
            name="state"
            required
            value={formData.state}
            onChange={handleChange}
            className="w-full bg-background border border-border text-foreground rounded-md px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground font-semibold uppercase tracking-widest">PIN Code</label>
          <input
            type="text"
            name="zip"
            required
            value={formData.zip}
            onChange={handleChange}
            className="w-full bg-background border border-border text-foreground rounded-md px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 pt-2">
        <input
          type="checkbox"
          id="isDefault"
          name="isDefault"
          checked={formData.isDefault}
          onChange={handleChange}
          className="bg-card border-border accent-gold h-4 w-4 rounded-sm"
        />
        <label htmlFor="isDefault" className="text-xs text-muted-foreground">Set as default address</label>
      </div>

      <div className="flex gap-4 pt-4 border-t border-border">
        <Button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex-1 bg-card border border-primary text-primary hover:bg-section-bg font-bold tracking-widest uppercase rounded-none transition-colors h-12"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="flex-1 bg-primary hover:bg-gold-light text-white font-bold tracking-widest uppercase rounded-none transition-colors h-12 shadow-md hover:shadow-primary/20"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Address"}
        </Button>
      </div>
    </form>
  );
}
