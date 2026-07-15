"use client";

import { Check, Edit2, Trash2 } from "lucide-react";

interface Address {
  id: string;
  name: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  zip: string;
  isDefault: boolean;
}

interface AddressCardProps {
  address: Address;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
}

export default function AddressCard({ address, onEdit, onDelete, onSetDefault }: AddressCardProps) {
  return (
    <div className="bg-card border border-border p-6 rounded-sm space-y-4 hover:border-gold/40 transition-colors duration-300 relative group shadow-sm">
      <div className="flex justify-between items-start">
        <h4 className="font-serif font-bold text-foreground tracking-wider text-base">
          {address.name}
        </h4>
        {address.isDefault && (
          <span className="text-[9px] bg-gold/15 border border-gold/30 text-gold px-2 py-0.5 font-bold uppercase rounded-sm flex items-center gap-1">
            <Check className="h-3 w-3" /> Default
          </span>
        )}
      </div>
      <div className="text-sm font-light text-muted-foreground space-y-1">
        <p>{address.addressLine}</p>
        <p>
          {address.city}, {address.state} {address.zip}
        </p>
        <p>Phone: {address.phone}</p>
      </div>

      <div className="pt-4 mt-4 border-t border-border flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={() => onEdit(address.id)}
          className="text-xs uppercase tracking-widest font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
        >
          <Edit2 className="h-3 w-3" /> Edit
        </button>
        <button 
          onClick={() => onDelete(address.id)}
          className="text-xs uppercase tracking-widest font-semibold text-muted-foreground hover:text-rose-500 flex items-center gap-1 transition-colors"
        >
          <Trash2 className="h-3 w-3" /> Delete
        </button>
        {!address.isDefault && (
          <button 
            onClick={() => onSetDefault(address.id)}
            className="text-xs uppercase tracking-widest font-semibold text-muted-foreground hover:text-gold flex items-center gap-1 transition-colors ml-auto"
          >
            Set Default
          </button>
        )}
      </div>
    </div>
  );
}
