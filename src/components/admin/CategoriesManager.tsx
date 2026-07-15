"use client";

import { useState } from "react";
import { FolderPlus, Trash2, Edit2, Plus, Sparkles, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

export default function CategoriesManager() {
  const [categories, setCategories] = useState([
    {
      id: "cat-1",
      name: "Sarees",
      slug: "sarees",
      subcategories: ["Kanjeevaram", "Banarasi", "Chiffon", "Georgette", "Organza", "Silk"],
      productCount: 24,
      desc: "Handcrafted pure mulberry silk and designer drapes."
    },
    {
      id: "cat-2",
      name: "Jewellery",
      slug: "jewellery",
      subcategories: ["Kundan Chokers", "Temple Jewellery", "Antique Haram", "Bangles", "Rings"],
      productCount: 16,
      desc: "Premium artificial bridal accessories and traditional sets."
    }
  ]);

  const [newSub, setNewSub] = useState("");
  const [activeCatId, setActiveCatId] = useState<string | null>("cat-1");

  // Edit Category State
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<any>(null);
  const [editForm, setEditForm] = useState({ name: "", desc: "" });
  
  // Delete Category State
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteCatId, setDeleteCatId] = useState<string | null>(null);

  // Create Category State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({ name: "", desc: "" });

  const { toast } = useToast();

  const handleAddSubcategory = (catId: string) => {
    if (!newSub.trim()) return;
    setCategories(prev => prev.map(cat => {
      if (cat.id === catId) {
        return {
          ...cat,
          subcategories: [...cat.subcategories, newSub.trim()]
        };
      }
      return cat;
    }));
    setNewSub("");
  };

  const handleRemoveSub = (catId: string, subName: string) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id === catId) {
        return {
          ...cat,
          subcategories: cat.subcategories.filter(s => s !== subName)
        };
      }
      return cat;
    }));
  };

  const handleSaveEdit = () => {
    if (!editForm.name.trim() || !editingCat) return;
    
    setCategories(prev => prev.map(cat => {
      if (cat.id === editingCat.id) {
        return {
          ...cat,
          name: editForm.name.trim(),
          desc: editForm.desc.trim()
        };
      }
      return cat;
    }));
    
    setIsEditOpen(false);
    setEditingCat(null);
    toast({
      title: "Category Updated",
      description: "Changes have been saved successfully.",
      className: "bg-emerald-500 text-white border-emerald-400"
    });
  };

  const confirmDelete = () => {
    if (!deleteCatId) return;
    
    setCategories(prev => {
      const updated = prev.filter(c => c.id !== deleteCatId);
      // Automatically select another category if the active one was deleted
      if (activeCatId === deleteCatId) {
        setActiveCatId(updated.length > 0 ? updated[0].id : null);
      }
      return updated;
    });

    setIsDeleteOpen(false);
    setDeleteCatId(null);
    toast({
      title: "Category Deleted",
      description: "The category has been removed.",
      className: "bg-zinc-900 text-white border-purple-royal/20"
    });
  };

  const handleSaveCreate = () => {
    if (!createForm.name.trim()) return;
    
    const newCat = {
      id: `cat-${Date.now()}`,
      name: createForm.name.trim(),
      slug: createForm.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      subcategories: [],
      productCount: 0,
      desc: createForm.desc.trim()
    };
    
    setCategories(prev => [...prev, newCat]);
    setActiveCatId(newCat.id);
    
    setIsCreateOpen(false);
    setCreateForm({ name: "", desc: "" });
    toast({
      title: "Category Created",
      description: "New category has been added successfully.",
      className: "bg-emerald-500 text-white border-emerald-400"
    });
  };

  return (
    <div className="space-y-6 select-none text-white">
      
      {/* Overview Intro */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between border-b border-purple-royal/10 pb-5">
        <div>
          <h4 className="font-serif text-sm font-bold tracking-widest text-gold uppercase">Catalog Taxonomy</h4>
          <p className="text-[10px] text-zinc-500 font-light mt-0.5">Organize sarees and jewellery category structures</p>
        </div>
        <Button 
          onClick={() => setIsCreateOpen(true)}
          className="bg-gradient-to-r from-gold via-gold-light to-gold-dark text-black font-extrabold text-xs uppercase tracking-widest px-6 py-5 rounded-none flex items-center gap-1.5 shadow-lg shadow-gold/10 hover:opacity-90 transition-all cursor-pointer"
        >
          <FolderPlus className="h-4.5 w-4.5" /> Create Category
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Categories List */}
        <div className="lg:col-span-1 space-y-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => setActiveCatId(cat.id)}
              className={`p-6 border transition-all cursor-pointer relative ${
                activeCatId === cat.id
                  ? "border-gold/40 bg-purple-royal/5"
                  : "border-purple-royal/10 bg-[#0b0b0c] hover:border-gold/20"
              }`}
            >
              {activeCatId === cat.id && (
                <div className="absolute top-0 left-0 bottom-0 w-[2px] bg-gold" />
              )}
              <div className="flex items-center justify-between">
                <h5 className="font-serif text-base font-bold text-white">{cat.name}</h5>
                <span className="text-[9px] border border-purple-royal/20 bg-zinc-950 px-2 py-0.5 font-bold text-gold uppercase tracking-wider">
                  {cat.productCount} Items
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 font-light mt-2 leading-relaxed">{cat.desc}</p>
              <div className="mt-4 flex gap-2 justify-end">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-zinc-500 hover:text-gold hover:bg-transparent"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingCat(cat);
                    setEditForm({ name: cat.name, desc: cat.desc });
                    setIsEditOpen(true);
                  }}
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-zinc-500 hover:text-rose-400 hover:bg-transparent"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteCatId(cat.id);
                    setIsDeleteOpen(true);
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Category Details / Subcategories Editor */}
        <div className="lg:col-span-2 border border-purple-royal/10 bg-[#0b0b0c] p-6 shadow-md">
          {activeCatId ? (
            (() => {
              const activeCat = categories.find(c => c.id === activeCatId)!;
              return (
                <div className="space-y-6">
                  <div className="border-b border-purple-royal/5 pb-3">
                    <h5 className="font-serif text-sm font-bold tracking-widest text-gold uppercase flex items-center gap-1.5">
                      <Sparkles className="h-4.5 w-4.5" /> Subcategories under {activeCat.name}
                    </h5>
                  </div>

                  {/* Add Subcategory Form */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter subcategory name (e.g. Banarasi)..."
                      value={newSub}
                      onChange={(e) => setNewSub(e.target.value)}
                      className="flex-1 bg-zinc-900 border border-purple-royal/20 text-white placeholder-zinc-500 rounded-none px-4 py-2 text-xs font-semibold focus:outline-none focus:border-gold transition-all"
                    />
                    <Button
                      onClick={() => handleAddSubcategory(activeCat.id)}
                      className="bg-transparent border border-gold text-gold hover:bg-gold hover:text-black font-extrabold text-xs uppercase tracking-widest px-5 py-2.5 rounded-none flex items-center gap-1 transition-all cursor-pointer h-auto"
                    >
                      <Plus className="h-4 w-4" /> Add
                    </Button>
                  </div>

                  {/* Subcategories list */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                    {activeCat.subcategories.map((sub) => (
                      <div
                        key={sub}
                        className="flex items-center justify-between bg-black p-3.5 border border-purple-royal/5"
                      >
                        <span className="text-xs font-semibold text-white">{sub}</span>
                        <Button
                          onClick={() => handleRemoveSub(activeCat.id, sub)}
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-zinc-500 hover:text-rose-400 hover:bg-transparent cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()
          ) : (
            <p className="text-center text-zinc-500 italic py-12">Select a category on the left to configure taxonomies.</p>
          )}
        </div>
      </div>

      {/* Edit Category Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="border border-purple-royal/20 bg-black text-white rounded-xl shadow-2xl max-w-md p-6">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl text-gold font-bold uppercase tracking-widest flex items-center gap-2">
              <Edit2 className="h-5 w-5" /> Edit Category
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Category Name</label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full bg-zinc-900 border border-purple-royal/20 text-white rounded-none px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors"
                placeholder="e.g. Sarees"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Description</label>
              <textarea
                value={editForm.desc}
                onChange={(e) => setEditForm({ ...editForm, desc: e.target.value })}
                rows={3}
                className="w-full bg-zinc-900 border border-purple-royal/20 text-white rounded-none px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors resize-none"
                placeholder="Brief description of the category..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-purple-royal/10">
            <Button
              variant="ghost"
              onClick={() => setIsEditOpen(false)}
              className="text-zinc-400 hover:text-white rounded-none"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              className="bg-gold text-black hover:bg-gold/90 font-extrabold uppercase tracking-widest text-xs px-6 rounded-none"
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Category Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="border border-rose-500/30 bg-black text-white rounded-xl shadow-2xl max-w-sm p-6">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl text-rose-500 font-bold uppercase tracking-widest flex items-center gap-2">
              <Trash2 className="h-5 w-5" /> Confirm Deletion
            </DialogTitle>
          </DialogHeader>

          <p className="text-zinc-400 text-sm py-4">
            Are you sure you want to delete this category? This action cannot be undone and will affect all products linked to it.
          </p>

          <div className="flex justify-end gap-3 mt-2">
            <Button
              variant="ghost"
              onClick={() => setIsDeleteOpen(false)}
              className="text-zinc-400 hover:text-white rounded-none"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDelete}
              className="bg-rose-600 text-white hover:bg-rose-700 font-extrabold uppercase tracking-widest text-xs px-6 rounded-none"
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Category Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="border border-purple-royal/20 bg-black text-white rounded-xl shadow-2xl max-w-md p-6">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl text-gold font-bold uppercase tracking-widest flex items-center gap-2">
              <FolderPlus className="h-5 w-5" /> Create Category
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Category Name</label>
              <input
                type="text"
                value={createForm.name}
                onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                className="w-full bg-zinc-900 border border-purple-royal/20 text-white rounded-none px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors"
                placeholder="e.g. Kurta Sets"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Description</label>
              <textarea
                value={createForm.desc}
                onChange={(e) => setCreateForm({ ...createForm, desc: e.target.value })}
                rows={3}
                className="w-full bg-zinc-900 border border-purple-royal/20 text-white rounded-none px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors resize-none"
                placeholder="Brief description of the category..."
              />
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
              Create Category
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
