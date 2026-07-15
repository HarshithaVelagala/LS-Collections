"use client";

import { useState } from "react";
import { Search, UserCheck, ShieldAlert, Award, User, MapPin, Package, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface CustomersManagerProps {
  customers: any[];
}

export default function CustomersManager({ customers: initialCustomers }: CustomersManagerProps) {
  const [customers, setCustomers] = useState(initialCustomers);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 select-none text-white">
      
      {/* Overview Intro */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between border-b border-purple-royal/10 pb-5">
        <div>
          <h4 className="font-serif text-sm font-bold tracking-widest text-gold uppercase">Customer Base</h4>
          <p className="text-[10px] text-zinc-500 font-light mt-0.5">Manage and inspect registered customer accounts</p>
        </div>
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search accounts by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-purple-royal/20 text-white placeholder-zinc-500 rounded-none pl-4 pr-10 py-2.5 text-xs font-semibold focus:outline-none focus:border-gold transition-all"
          />
          <Search className="absolute right-3 top-3 h-4 w-4 text-zinc-500" />
        </div>
      </div>

      {/* Customers Table */}
      <div className="overflow-x-auto border border-purple-royal/10 bg-[#0b0b0c] p-6 shadow-md">
        <table className="w-full text-left border-collapse text-xs text-zinc-300">
          <thead>
            <tr className="border-b border-purple-royal/20 text-[10px] tracking-widest uppercase text-zinc-500">
              <th className="pb-3 font-semibold">Customer Identity</th>
              <th className="pb-3 font-semibold">Email</th>
              <th className="pb-3 font-semibold">Registered On</th>
              <th className="pb-3 font-semibold">Saved Addresses</th>
              <th className="pb-3 font-semibold">Authorization Role</th>
              <th className="pb-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-royal/5">
            {filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-zinc-500 italic">No customer profiles found.</td>
              </tr>
            ) : (
              filteredCustomers.map((cust) => (
                <tr key={cust.id} className="hover:bg-purple-royal/5 transition-colors">
                  <td className="py-4 font-serif font-bold text-white flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full border border-gold/25 bg-zinc-900 text-gold text-[10px] font-bold">
                      {cust.name.slice(0, 2).toUpperCase()}
                    </div>
                    <span>{cust.name}</span>
                  </td>
                  <td className="py-4 font-light text-zinc-400">
                    {cust.email}
                  </td>
                  <td className="py-4 font-light text-zinc-400">
                    {new Date(cust.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                  <td className="py-4 font-semibold text-gold">
                    {cust.addressesCount} Saved
                  </td>
                  <td className="py-4">
                    <span className={`inline-flex items-center gap-1 text-[9px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 border ${
                      cust.role === "admin" || cust.role === "superadmin"
                        ? "bg-rose-500/10 border-rose-500/20 text-rose-400"
                        : "bg-gold/10 border-gold/20 text-gold"
                    }`}>
                      <Award className="h-3.5 w-3.5" /> {cust.role}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <Button
                      onClick={() => {
                        setSelectedCustomer(cust);
                        setIsProfileOpen(true);
                      }}
                      className="bg-transparent border border-zinc-800 hover:border-gold hover:bg-transparent text-zinc-500 hover:text-gold rounded-none text-[9px] uppercase tracking-wider py-1.5 h-auto font-bold px-3 transition-colors cursor-pointer"
                    >
                      Inspect Profile
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Customer Profile Dialog */}
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="border border-purple-royal/20 bg-black text-white rounded-xl shadow-2xl max-w-lg p-0 overflow-hidden">
          {selectedCustomer && (
            <>
              <div className="bg-zinc-950 p-6 border-b border-purple-royal/10 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 bg-zinc-900 text-gold text-lg font-bold shrink-0">
                  {selectedCustomer.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <DialogTitle className="font-serif text-xl font-bold text-white tracking-wide">
                    {selectedCustomer.name}
                  </DialogTitle>
                  <p className="text-xs text-zinc-400 mt-1">{selectedCustomer.email}</p>
                </div>
                <div className="ml-auto">
                  <span className={`inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-extrabold px-3 py-1.5 border ${
                    selectedCustomer.role === "admin" || selectedCustomer.role === "superadmin"
                      ? "bg-rose-500/10 border-rose-500/20 text-rose-400"
                      : "bg-gold/10 border-gold/20 text-gold"
                  }`}>
                    <Award className="h-3.5 w-3.5" /> {selectedCustomer.role}
                  </span>
                </div>
              </div>

              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                <div className="space-y-4">
                  <div>
                    <h5 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Contact Info</h5>
                    <p className="text-sm text-zinc-300 flex items-center gap-2.5"><User className="h-4 w-4 text-gold/80"/> {selectedCustomer.phone || "Not Provided"}</p>
                  </div>
                  <div>
                    <h5 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Registration Date</h5>
                    <p className="text-sm text-zinc-300 ml-6.5">
                      {new Date(selectedCustomer.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric', month: 'long', day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <h5 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Account Status</h5>
                    <p className="text-sm text-emerald-400 font-bold ml-6.5">{selectedCustomer.status || "Active"}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h5 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Saved Addresses</h5>
                    <p className="text-sm text-zinc-300 flex items-center gap-2.5"><MapPin className="h-4 w-4 text-gold/80"/> {selectedCustomer.addressesCount || 0} Locations</p>
                  </div>
                  <div>
                    <h5 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Order History</h5>
                    <p className="text-sm text-zinc-300 flex items-center gap-2.5"><Package className="h-4 w-4 text-gold/80"/> {selectedCustomer.ordersCount || 0} Orders</p>
                  </div>
                  <div>
                    <h5 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Wishlist</h5>
                    <p className="text-sm text-zinc-300 flex items-center gap-2.5"><Heart className="h-4 w-4 text-gold/80"/> {selectedCustomer.wishlistCount || 0} Items</p>
                  </div>
                </div>

              </div>
              
              <div className="bg-zinc-950 p-4 border-t border-purple-royal/10 flex justify-end">
                <Button
                  variant="ghost"
                  onClick={() => setIsProfileOpen(false)}
                  className="text-zinc-400 hover:text-white rounded-none text-xs font-bold uppercase tracking-wider"
                >
                  Close Profile
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}
