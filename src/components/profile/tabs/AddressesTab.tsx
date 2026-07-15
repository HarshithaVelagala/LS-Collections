"use client";

import { useState } from "react";
import { MapPin, Plus } from "lucide-react";
import AddressCard from "./AddressCard";
import AddressForm from "./AddressForm";
import EmptyState from "../EmptyState";
import { Button } from "@/components/ui/button";

interface AddressesTabProps {
  initialAddresses: any[];
}

export default function AddressesTab({ initialAddresses }: AddressesTabProps) {
  const [addresses, setAddresses] = useState(initialAddresses);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setAddresses(addresses.filter(a => a.id !== id));
  };

  const handleSetDefault = (id: string) => {
    setAddresses(addresses.map(a => ({
      ...a,
      isDefault: a.id === id
    })));
  };

  const handleSave = async (data: any) => {
    if (editingId) {
      setAddresses(addresses.map(a => a.id === editingId ? { ...data, id: editingId } : (data.isDefault ? { ...a, isDefault: false } : a)));
      setEditingId(null);
    } else {
      const newAddress = { ...data, id: `addr_${Date.now()}` };
      const updated = data.isDefault ? addresses.map(a => ({ ...a, isDefault: false })) : addresses;
      setAddresses([...updated, newAddress]);
      setIsAdding(false);
    }
  };

  if (isAdding || editingId) {
    const editData = editingId ? addresses.find(a => a.id === editingId) : undefined;
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <AddressForm 
          initialData={editData} 
          onSubmit={handleSave} 
          onCancel={() => { setIsAdding(false); setEditingId(null); }} 
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between border-b border-border pb-2 mb-6">
        <h3 className="font-serif text-gold text-xl tracking-wider font-semibold uppercase">
          Saved Addresses ({addresses.length})
        </h3>
        {addresses.length > 0 && (
          <Button 
            onClick={() => setIsAdding(true)}
            variant="ghost" 
            className="text-gold hover:text-foreground hover:bg-muted text-xs tracking-widest uppercase font-bold"
          >
            <Plus className="h-4 w-4 mr-2" /> Add New
          </Button>
        )}
      </div>
      
      {addresses.length === 0 ? (
        <EmptyState 
          icon={MapPin}
          title="No Saved Addresses"
          description="Add a shipping address to checkout faster during your next luxury purchase."
          actionLabel="Add Address"
          onAction={() => setIsAdding(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((address) => (
            <AddressCard 
              key={address.id} 
              address={address} 
              onEdit={setEditingId}
              onDelete={handleDelete}
              onSetDefault={handleSetDefault}
            />
          ))}
        </div>
      )}
    </div>
  );
}
