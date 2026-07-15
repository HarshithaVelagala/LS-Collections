"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ProductTable from "./products/ProductTable";
import ProductForm from "./products/ProductForm";
import ProductPreview from "./products/ProductPreview";
import DeleteConfirmationModal from "./products/DeleteConfirmationModal";
import { useToast } from "@/components/ui/use-toast";

interface ProductsManagerProps {
  products: any[];
  categories: any[];
}

export default function ProductsManager({ products, categories }: ProductsManagerProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Modal Toggles & Targets
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewProduct, setPreviewProduct] = useState<any>(null);
  
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteProduct, setDeleteProduct] = useState<any>(null);

  const handleRefresh = () => {
    setLoading(true);
    router.refresh();
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Catalog Refreshed",
        description: "Latest inventory levels and items loaded from database.",
        className: "bg-emerald-500 text-white border-emerald-400",
      });
    }, 500);
  };

  const handleCreateSubmit = async (payload: any) => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        toast({
          title: "Database Synced",
          description: payload._id ? "Product catalog asset updated." : "New product listed in database.",
          className: "bg-emerald-500 text-white border-emerald-400",
        });
        setIsFormOpen(false);
        setEditingProduct(null);
        router.refresh();
      } else {
        toast({
          title: "Synchronization Error",
          description: data.message,
          className: "bg-rose-500 text-white border-rose-400"
        });
      }
    } catch (err: any) {
      toast({
        title: "Connection Error",
        description: err.message || "Failed to submit product details.",
        className: "bg-rose-500 text-white border-rose-400"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteProduct) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/products?id=${deleteProduct._id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        toast({
          title: "Asset Deleted",
          description: `"${deleteProduct.name}" removed from the catalog.`,
          className: "bg-zinc-900 text-white border-purple-royal/20",
        });
        setIsDeleteOpen(false);
        setDeleteProduct(null);
        router.refresh();
      } else {
        toast({
          title: "Deletion Failed",
          description: data.message,
          className: "bg-rose-500 text-white border-rose-400"
        });
      }
    } catch (err: any) {
      toast({
        title: "Connection Error",
        description: err.message || "Failed to remove product from catalog.",
        className: "bg-rose-500 text-white border-rose-400"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-white select-none">
      
      {/* Top Title Action Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between border-b border-purple-royal/10 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif tracking-wider text-white font-bold uppercase">
            PRODUCT MANAGEMENT
          </h1>
          <p className="text-[10px] text-zinc-400 font-light mt-1 uppercase tracking-widest">
            Manage your sarees, jewellery, stocks and dynamic features
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingProduct(null);
            setIsFormOpen(true);
          }}
          className="bg-gradient-to-r from-gold via-gold-light to-gold-dark text-black font-extrabold text-xs uppercase tracking-widest px-6 py-5 rounded-none flex items-center gap-1.5 shadow-lg shadow-gold/15 hover:opacity-90 transition-all cursor-pointer"
        >
          <Plus className="h-4.5 w-4.5" /> List New Product
        </Button>
      </div>

      {/* Product Table Container */}
      <ProductTable
        products={products}
        categories={categories}
        onRefresh={handleRefresh}
        onPreview={(p) => {
          setPreviewProduct(p);
          setIsPreviewOpen(true);
        }}
        onEdit={(p) => {
          setEditingProduct(p);
          setIsFormOpen(true);
        }}
        onDelete={(p) => {
          setDeleteProduct(p);
          setIsDeleteOpen(true);
        }}
      />

      {/* 1. Add / Edit Dialog Form */}
      <ProductForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingProduct(null);
        }}
        onSubmit={handleCreateSubmit}
        editingProduct={editingProduct}
        categories={categories}
        loading={loading}
      />

      {/* 2. Product Spec Details Drawer */}
      <ProductPreview
        isOpen={isPreviewOpen}
        onClose={() => {
          setIsPreviewOpen(false);
          setPreviewProduct(null);
        }}
        product={previewProduct}
      />

      {/* 3. Safety Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeleteProduct(null);
        }}
        onConfirm={handleDeleteConfirm}
        productName={deleteProduct?.name || ""}
        loading={loading}
      />

    </div>
  );
}
