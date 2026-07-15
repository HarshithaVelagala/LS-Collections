"use client";

import { useState } from "react";
import Image from "next/image";
import { Sliders, Edit2, Trash2, Plus, Sparkles, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

export default function BannersManager() {
  const [banners, setBanners] = useState([
    {
      id: 1,
      title: "BRIDAL KANJEEVARAMS",
      subtitle: "Gilded Pure Silk Borders",
      cta: "Discover Sarees",
      href: "/sarees",
      image: "/banners/saree_banner_3.png",
      isActive: true,
      side: "left"
    },
    {
      id: 2,
      title: "TEMPLE MAJESTY",
      subtitle: "Traditional Antique Gold Art",
      cta: "Discover Jewellery",
      href: "/jewellery",
      image: "/banners/jewelry_banner_3.png",
      isActive: true,
      side: "right"
    }
  ]);

  const [editingBanner, setEditingBanner] = useState<any>(null);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: "",
    subtitle: "",
    cta: "",
    href: "",
    image: "",
    side: "left",
    isActive: true
  });

  const { toast } = useToast();

  const handleSaveCreate = () => {
    if (!createForm.title.trim() || !createForm.image.trim()) {
      toast({
        title: "Validation Error",
        description: "Title and Image URL are required.",
        className: "bg-rose-500 text-white border-rose-400"
      });
      return;
    }

    const newBanner = {
      id: Date.now(),
      title: createForm.title.trim(),
      subtitle: createForm.subtitle.trim(),
      cta: createForm.cta.trim() || "Discover",
      href: createForm.href.trim() || "/",
      image: createForm.image.trim(),
      side: createForm.side,
      isActive: createForm.isActive
    };

    setBanners(prev => [...prev, newBanner]);
    setIsCreateOpen(false);
    setCreateForm({
      title: "",
      subtitle: "",
      cta: "",
      href: "",
      image: "",
      side: "left",
      isActive: true
    });

    toast({
      title: "Banner Created",
      description: "New promotional slide has been published.",
      className: "bg-emerald-500 text-white border-emerald-400"
    });
  };

  return (
    <div className="space-y-6 select-none text-white">
      
      {/* Intro header */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between border-b border-purple-royal/10 pb-5">
        <div>
          <h4 className="font-serif text-sm font-bold tracking-widest text-gold uppercase">Promotion Slides & Banners</h4>
          <p className="text-[10px] text-zinc-500 font-light mt-0.5">Control visual slides rendered on the homepage hero banner</p>
        </div>
        <Button 
          onClick={() => setIsCreateOpen(true)}
          className="bg-gradient-to-r from-gold via-gold-light to-gold-dark text-black font-extrabold text-xs uppercase tracking-widest px-6 py-5 rounded-none flex items-center gap-1.5 shadow-lg shadow-gold/10 hover:opacity-90 transition-all cursor-pointer"
        >
          <Plus className="h-4.5 w-4.5" /> Add Banner Slide
        </Button>
      </div>

      {/* Grid of Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.map((ban) => (
          <div key={ban.id} className="border border-purple-royal/10 bg-[#0b0b0c] p-6 shadow-md space-y-4">
            {/* Image Preview Container */}
            <div className="relative h-48 w-full border border-purple-royal/15 bg-zinc-950 overflow-hidden group">
              <Image src={ban.image} alt={ban.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="text-[9px] border border-gold/40 bg-black/90 px-3 py-1 font-bold text-gold uppercase tracking-widest">
                  Slide {ban.id} ({ban.side.toUpperCase()})
                </span>
              </div>
            </div>

            {/* Info details */}
            <div className="space-y-1.5 pt-2">
              <span className="text-[9px] font-bold text-gold uppercase tracking-widest block">{ban.subtitle}</span>
              <h5 className="font-serif text-base font-bold text-white uppercase">{ban.title}</h5>
              <p className="text-[10px] text-zinc-400 font-mono">Link URL: <span className="text-zinc-300">{ban.href}</span></p>
              <p className="text-[10px] text-zinc-400 font-mono">Button CTA: <span className="text-zinc-300">{ban.cta}</span></p>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center border-t border-purple-royal/5 pt-4">
              <div className="flex items-center gap-1.5 text-[9px] text-emerald-400 font-bold uppercase tracking-wider">
                <Check className="h-4 w-4" /> Active on storefront
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-gold hover:bg-transparent">
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-rose-400 hover:bg-transparent">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Banner Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="border border-purple-royal/20 bg-black text-white rounded-xl shadow-2xl max-w-lg p-6">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl text-gold font-bold uppercase tracking-widest flex items-center gap-2">
              <Plus className="h-5 w-5" /> Add Banner Slide
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Image URL</label>
              <input
                type="text"
                value={createForm.image}
                onChange={(e) => setCreateForm({ ...createForm, image: e.target.value })}
                className="w-full bg-zinc-900 border border-purple-royal/20 text-white rounded-none px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors"
                placeholder="/banners/new_image.png"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Title</label>
                <input
                  type="text"
                  value={createForm.title}
                  onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                  className="w-full bg-zinc-900 border border-purple-royal/20 text-white rounded-none px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors"
                  placeholder="e.g. BRIDAL FESTIVAL"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Subtitle</label>
                <input
                  type="text"
                  value={createForm.subtitle}
                  onChange={(e) => setCreateForm({ ...createForm, subtitle: e.target.value })}
                  className="w-full bg-zinc-900 border border-purple-royal/20 text-white rounded-none px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors"
                  placeholder="e.g. Elegant Drapes"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Button Text</label>
                <input
                  type="text"
                  value={createForm.cta}
                  onChange={(e) => setCreateForm({ ...createForm, cta: e.target.value })}
                  className="w-full bg-zinc-900 border border-purple-royal/20 text-white rounded-none px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors"
                  placeholder="e.g. Shop Now"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Link URL</label>
                <input
                  type="text"
                  value={createForm.href}
                  onChange={(e) => setCreateForm({ ...createForm, href: e.target.value })}
                  className="w-full bg-zinc-900 border border-purple-royal/20 text-white rounded-none px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors"
                  placeholder="e.g. /sarees"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Display Side</label>
                <select
                  value={createForm.side}
                  onChange={(e) => setCreateForm({ ...createForm, side: e.target.value })}
                  className="w-full bg-zinc-900 border border-purple-royal/20 text-white rounded-none px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors appearance-none"
                >
                  <option value="left">Left</option>
                  <option value="right">Right</option>
                  <option value="center">Center</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Status</label>
                <select
                  value={createForm.isActive ? "true" : "false"}
                  onChange={(e) => setCreateForm({ ...createForm, isActive: e.target.value === "true" })}
                  className="w-full bg-zinc-900 border border-purple-royal/20 text-white rounded-none px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors appearance-none"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-purple-royal/10">
            <Button
              variant="ghost"
              onClick={() => setIsCreateOpen(false)}
              className="text-zinc-400 hover:text-white rounded-none"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveCreate}
              className="bg-gold text-black hover:bg-gold/90 font-extrabold uppercase tracking-widest text-xs px-6 rounded-none"
            >
              Save Slide
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
