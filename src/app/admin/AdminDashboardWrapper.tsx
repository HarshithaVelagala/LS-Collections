"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Plus, Edit2, Trash2, DollarSign, ShoppingBag, Package, PlusCircle, Check, Loader2, ArrowRight, X, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface AdminDashboardWrapperProps {
  products: any[];
  orders: any[];
  stats: {
    totalRevenue: number;
    ordersCount: number;
    productsCount: number;
  };
}

export default function AdminDashboardWrapper({ products: initialProducts, orders: initialOrders, stats }: AdminDashboardWrapperProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [products, setProducts] = useState(initialProducts);
  const [orders, setOrders] = useState(initialOrders);

  // Dialog State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Form Field States
  const [productForm, setProductForm] = useState({
    name: "",
    slug: "",
    description: "",
    basePrice: "",
    discountPrice: "",
    category: "saree",
    subCategory: "",
    tags: "",
  });

  const [variants, setVariants] = useState<any[]>([]);
  const [personalizationFields, setPersonalizationFields] = useState<any[]>([]);
  const [personalizationEnabled, setPersonalizationEnabled] = useState(false);

  const resetForm = () => {
    setProductForm({
      name: "",
      slug: "",
      description: "",
      basePrice: "",
      discountPrice: "",
      category: "saree",
      subCategory: "",
      tags: "",
    });
    setVariants([]);
    setPersonalizationFields([]);
    setPersonalizationEnabled(false);
    setEditingProduct(null);
  };

  const handleEditClick = (product: any) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      slug: product.slug,
      description: product.description,
      basePrice: product.basePrice.toString(),
      discountPrice: product.discountPrice?.toString() || "",
      category: product.category,
      subCategory: product.subCategory || "",
      tags: product.tags?.join(", ") || "",
    });
    setVariants(product.variants || []);
    setPersonalizationEnabled(product.personalization?.isEnabled || false);
    setPersonalizationFields(product.personalization?.fields || []);
    setIsFormOpen(true);
  };

  const handleAddVariant = () => {
    setVariants((prev) => [
      ...prev,
      {
        sku: `SAR-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        attributes: { size: "Standard" },
        stock: 10,
        price: undefined,
      },
    ]);
  };

  const handleRemoveVariant = (idx: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleAddPersonalizationField = () => {
    setPersonalizationFields((prev) => [
      ...prev,
      { fieldName: "Custom Attribute", fieldType: "text", isRequired: false },
    ]);
  };

  const handleRemovePersonalizationField = (idx: number) => {
    setPersonalizationFields((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const payload = {
        _id: editingProduct?._id,
        ...productForm,
        variants,
        personalization: {
          isEnabled: personalizationEnabled,
          fields: personalizationFields,
        },
      };

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        alert(data.message);
        setIsFormOpen(false);
        resetForm();
        router.refresh(); // Reload server component data
      } else {
        alert("Failed to save product: " + data.message);
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`/api/admin/products?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        alert(data.message);
        router.refresh();
      } else {
        alert("Failed to delete product: " + data.message);
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  // Mock status updates for orders list
  const handleUpdateOrderStatus = async (orderId: string, currentStatus: string) => {
    const nextStatuses: Record<string, string> = {
      processing: "shipped",
      shipped: "delivered",
      delivered: "processing",
    };
    const nextStatus = nextStatuses[currentStatus] || "processing";

    try {
      const res = await fetch("/api/admin/orders/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, orderStatus: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Order status updated to: " + nextStatus);
        router.refresh();
      }
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-white">
      <div className="border-b border-purple-royal/20 pb-6 mb-10">
        <h1 className="text-3xl sm:text-4xl font-serif tracking-wider text-white font-bold uppercase">
          ADMIN DASHBOARD
        </h1>
        <p className="text-xs text-zinc-400 font-light mt-1 uppercase tracking-widest">
          SYSTEM CONTROLS & CATALOG MANAGEMENT (RBAC: Administrator)
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Navigation Tabs */}
        <aside className="w-full lg:w-1/5 flex flex-row lg:flex-col border-b lg:border-b-0 lg:border-r border-purple-royal/20 pb-4 lg:pb-0 lg:pr-8 gap-2 shrink-0">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-3 px-4 py-3 text-xs font-semibold tracking-wider uppercase rounded-none transition-all ${
              activeTab === "overview"
                ? "bg-purple-royal text-white border-l-2 border-gold"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <DollarSign className="h-4 w-4" /> Overview
          </button>
          <button
            onClick={() => setActiveTab("catalog")}
            className={`flex items-center gap-3 px-4 py-3 text-xs font-semibold tracking-wider uppercase rounded-none transition-all ${
              activeTab === "catalog"
                ? "bg-purple-royal text-white border-l-2 border-gold"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Package className="h-4 w-4" /> Manage Catalog
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-3 px-4 py-3 text-xs font-semibold tracking-wider uppercase rounded-none transition-all ${
              activeTab === "orders"
                ? "bg-purple-royal text-white border-l-2 border-gold"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <ShoppingBag className="h-4 w-4" /> Order Logs
          </button>
        </aside>

        {/* Dynamic Panels */}
        <div className="flex-grow min-w-0">
          
          {/* TAB: Overview */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-zinc-950 border border-purple-royal/10 p-6 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-1">TOTAL REVENUE</span>
                    <h3 className="text-3xl font-serif font-bold text-gold">₹{stats.totalRevenue.toLocaleString("en-IN")}</h3>
                  </div>
                  <DollarSign className="h-10 w-10 text-purple-royal/30" />
                </div>
                <div className="bg-zinc-950 border border-purple-royal/10 p-6 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-1">TOTAL TRANSACTIONS</span>
                    <h3 className="text-3xl font-serif font-bold text-white">{stats.ordersCount}</h3>
                  </div>
                  <ShoppingBag className="h-10 w-10 text-purple-royal/30" />
                </div>
                <div className="bg-zinc-950 border border-purple-royal/10 p-6 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-1">CATALOG VOLUME</span>
                    <h3 className="text-3xl font-serif font-bold text-white">{stats.productsCount} products</h3>
                  </div>
                  <Package className="h-10 w-10 text-purple-royal/30" />
                </div>
              </div>

              <div className="bg-zinc-950 border border-purple-royal/10 p-6 space-y-4">
                <h4 className="font-serif text-gold text-base tracking-wider uppercase font-semibold">System Diagnostics</h4>
                <p className="text-xs text-zinc-400 font-light leading-relaxed">
                  Database Connected (Mongoose / MongoDB Atlas Cluster). Cloudinary Media integrations active. Razorpay checkout gateway sandbox loaded. Roles and RBAC validation operational.
                </p>
              </div>
            </div>
          )}

          {/* TAB: Manage Catalog */}
          {activeTab === "catalog" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-purple-royal/10 pb-4 mb-6">
                <h3 className="font-serif text-gold text-xl tracking-wider font-semibold uppercase">PRODUCT CATALOG ({products.length})</h3>
                <Button
                  onClick={() => {
                    resetForm();
                    setIsFormOpen(true);
                  }}
                  className="bg-purple-royal hover:bg-purple-light text-white text-xs uppercase font-semibold tracking-wider flex items-center gap-1.5 rounded-none"
                >
                  <Plus className="h-4 w-4" /> Add Product
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm text-zinc-300">
                  <thead>
                    <tr className="border-b border-purple-royal/20 text-[10px] tracking-widest uppercase text-zinc-500">
                      <th className="pb-3 font-semibold">Image</th>
                      <th className="pb-3 font-semibold">Name</th>
                      <th className="pb-3 font-semibold">Category</th>
                      <th className="pb-3 font-semibold">Base Price</th>
                      <th className="pb-3 font-semibold">Stock</th>
                      <th className="pb-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-royal/5">
                    {products.map((prod) => {
                      const totalStock = prod.variants?.reduce((sum: number, v: any) => sum + (v.stock || 0), 0) || 0;
                      return (
                        <tr key={prod._id} className="hover:bg-purple-royal/5">
                          <td className="py-4">
                            <div className="relative h-12 w-10 border border-purple-royal/10 overflow-hidden">
                              <Image src={prod.media?.[0]?.url || "/banners/saree_banner_1.png"} alt={prod.name} fill className="object-cover" />
                            </div>
                          </td>
                          <td className="py-4 font-serif font-bold text-white max-w-xs truncate">{prod.name}</td>
                          <td className="py-4 capitalize font-light text-xs">{prod.subCategory || prod.category}</td>
                          <td className="py-4 font-bold text-gold">₹{prod.basePrice.toLocaleString("en-IN")}</td>
                          <td className="py-4 text-xs font-medium">
                            <span className={totalStock > 0 ? "text-emerald-400" : "text-rose-400"}>
                              {totalStock} in stock
                            </span>
                          </td>
                          <td className="py-4 text-right space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditClick(prod)}
                              className="text-zinc-400 hover:text-gold hover:bg-transparent h-8 w-8"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteProduct(prod._id)}
                              className="text-zinc-400 hover:text-rose-400 hover:bg-transparent h-8 w-8"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: Order Logs */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              <h3 className="font-serif text-gold text-xl tracking-wider font-semibold border-b border-purple-royal/5 pb-2 uppercase mb-6">
                ORDER TRANSACTIONS LOG ({orders.length})
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm text-zinc-300">
                  <thead>
                    <tr className="border-b border-purple-royal/20 text-[10px] tracking-widest uppercase text-zinc-500">
                      <th className="pb-3 font-semibold">Order ID</th>
                      <th className="pb-3 font-semibold">Date</th>
                      <th className="pb-3 font-semibold">Customer</th>
                      <th className="pb-3 font-semibold">Total Paid</th>
                      <th className="pb-3 font-semibold">Payment</th>
                      <th className="pb-3 font-semibold">Delivery Status</th>
                      <th className="pb-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-royal/5">
                    {orders.map((order) => {
                      const finalAmount = order.totalAmount - order.discountAmount;
                      return (
                        <tr key={order._id} className="hover:bg-purple-royal/5">
                          <td className="py-4 font-mono text-xs">{order._id.slice(-8)}</td>
                          <td className="py-4 text-xs font-light">{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td className="py-4 font-medium text-white">{order.shippingAddress?.name || "Guest User"}</td>
                          <td className="py-4 font-bold text-gold">₹{finalAmount.toLocaleString("en-IN")}</td>
                          <td className="py-4">
                            <span className="text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 font-bold uppercase rounded-sm">
                              {order.paymentStatus}
                            </span>
                          </td>
                          <td className="py-4 capitalize text-xs">
                            <span className="text-purple-light font-bold flex items-center gap-1.5">
                              <Truck className="h-4.5 w-4.5" /> {order.orderStatus}
                            </span>
                          </td>
                          <td className="py-4 text-right">
                            <Button
                              onClick={() => handleUpdateOrderStatus(order._id, order.orderStatus)}
                              className="bg-transparent border border-zinc-700 hover:border-gold hover:bg-transparent text-zinc-400 hover:text-gold rounded-none text-[10px] uppercase tracking-wider py-1.5 h-auto font-bold px-3 transition-colors"
                            >
                              Cycle Status
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* DIALOG SHEET: Product Add/Edit Form */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-3xl border border-purple-royal/30 bg-black text-white p-6 max-h-[85vh] overflow-y-auto">
          <DialogHeader className="border-b border-purple-royal/10 pb-4 flex justify-between items-center flex-row">
            <DialogTitle className="font-serif text-gold text-2xl font-bold tracking-wider uppercase">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            
            {/* Base Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">Product Name</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm((p) => ({ ...p, name: e.target.value }))}
                  className="w-full bg-zinc-900 border border-purple-royal/20 text-white rounded-none px-3 py-2 text-sm focus:outline-none focus:border-gold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">URL Slug</label>
                <input
                  type="text"
                  required
                  value={productForm.slug}
                  onChange={(e) => setProductForm((p) => ({ ...p, slug: e.target.value }))}
                  className="w-full bg-zinc-900 border border-purple-royal/20 text-white rounded-none px-3 py-2 text-sm focus:outline-none focus:border-gold"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">Description</label>
              <textarea
                required
                rows={3}
                value={productForm.description}
                onChange={(e) => setProductForm((p) => ({ ...p, description: e.target.value }))}
                className="w-full bg-zinc-900 border border-purple-royal/20 text-white rounded-none px-3 py-2 text-sm focus:outline-none focus:border-gold"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">Base Price (₹)</label>
                <input
                  type="number"
                  required
                  value={productForm.basePrice}
                  onChange={(e) => setProductForm((p) => ({ ...p, basePrice: e.target.value }))}
                  className="w-full bg-zinc-900 border border-purple-royal/20 text-white rounded-none px-3 py-2 text-sm focus:outline-none focus:border-gold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">Discount Price (₹)</label>
                <input
                  type="number"
                  value={productForm.discountPrice}
                  onChange={(e) => setProductForm((p) => ({ ...p, discountPrice: e.target.value }))}
                  className="w-full bg-zinc-900 border border-purple-royal/20 text-white rounded-none px-3 py-2 text-sm focus:outline-none focus:border-gold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">Category</label>
                <select
                  value={productForm.category}
                  onChange={(e) => setProductForm((p) => ({ ...p, category: e.target.value }))}
                  className="w-full bg-zinc-900 border border-purple-royal/20 text-white rounded-none px-3 py-2 text-sm focus:outline-none focus:border-gold h-[38px]"
                >
                  <option value="saree">Sarees</option>
                  <option value="jewellery">Jewellery</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">SubCategory</label>
                <input
                  type="text"
                  placeholder="e.g. Kanjeevaram"
                  value={productForm.subCategory}
                  onChange={(e) => setProductForm((p) => ({ ...p, subCategory: e.target.value }))}
                  className="w-full bg-zinc-900 border border-purple-royal/20 text-white rounded-none px-3 py-2 text-sm focus:outline-none focus:border-gold"
                />
              </div>
            </div>

            {/* Variants configuration */}
            <div className="bg-zinc-950 p-4 border border-purple-royal/10 space-y-4">
              <div className="flex justify-between items-center border-b border-purple-royal/5 pb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gold">Product Variants</h4>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleAddVariant}
                  className="text-gold hover:text-gold-light p-1 h-auto text-xs uppercase tracking-wider flex items-center gap-1 font-semibold"
                >
                  <PlusCircle className="h-4.5 w-4.5" /> Add Variant
                </Button>
              </div>

              {variants.length === 0 ? (
                <p className="text-xs text-zinc-500 italic">No variants configured. Click add to configure attributes.</p>
              ) : (
                <div className="space-y-3">
                  {variants.map((v, i) => (
                    <div key={i} className="flex gap-2 items-center bg-black p-3 border border-purple-royal/5">
                      <div className="grid grid-cols-3 gap-2 flex-1">
                        <input
                          type="text"
                          placeholder="SKU"
                          required
                          value={v.sku}
                          onChange={(e) => {
                            const newVariants = [...variants];
                            newVariants[i].sku = e.target.value;
                            setVariants(newVariants);
                          }}
                          className="bg-zinc-900 text-xs px-2 py-1.5 focus:outline-none text-white border border-purple-royal/5"
                        />
                        <input
                          type="text"
                          placeholder="Size (e.g. 7, 5.5m)"
                          value={v.attributes.size || ""}
                          onChange={(e) => {
                            const newVariants = [...variants];
                            newVariants[i].attributes = { ...newVariants[i].attributes, size: e.target.value };
                            setVariants(newVariants);
                          }}
                          className="bg-zinc-900 text-xs px-2 py-1.5 focus:outline-none text-white border border-purple-royal/5"
                        />
                        <input
                          type="number"
                          placeholder="Stock"
                          required
                          value={v.stock}
                          onChange={(e) => {
                            const newVariants = [...variants];
                            newVariants[i].stock = Number(e.target.value);
                            setVariants(newVariants);
                          }}
                          className="bg-zinc-900 text-xs px-2 py-1.5 focus:outline-none text-white border border-purple-royal/5"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => handleRemoveVariant(i)}
                        className="text-zinc-500 hover:text-rose-400 p-1 h-auto"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Custom Personalization Field Form */}
            <div className="bg-zinc-950 p-4 border border-purple-royal/10 space-y-4">
              <div className="flex justify-between items-center border-b border-purple-royal/5 pb-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="personalization-enable"
                    checked={personalizationEnabled}
                    onChange={(e) => setPersonalizationEnabled(e.target.checked)}
                    className="h-4 w-4 bg-zinc-900 border-purple-royal/30 rounded-none cursor-pointer accent-gold"
                  />
                  <label htmlFor="personalization-enable" className="text-xs font-bold uppercase tracking-wider text-gold cursor-pointer">
                    Enable Personalization Options
                  </label>
                </div>
                {personalizationEnabled && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleAddPersonalizationField}
                    className="text-gold hover:text-gold-light p-1 h-auto text-xs uppercase tracking-wider flex items-center gap-1 font-semibold"
                  >
                    <PlusCircle className="h-4.5 w-4.5" /> Add Field
                  </Button>
                )}
              </div>

              {personalizationEnabled && personalizationFields.length === 0 && (
                <p className="text-xs text-zinc-500 italic">No personalization fields configured. Click Add Field.</p>
              )}

              {personalizationEnabled && personalizationFields.length > 0 && (
                <div className="space-y-3">
                  {personalizationFields.map((f, i) => (
                    <div key={i} className="flex gap-2 items-center bg-black p-3 border border-purple-royal/5">
                      <div className="grid grid-cols-2 gap-2 flex-1">
                        <input
                          type="text"
                          placeholder="Field Label (e.g. Blouse Size)"
                          required
                          value={f.fieldName}
                          onChange={(e) => {
                            const newFields = [...personalizationFields];
                            newFields[i].fieldName = e.target.value;
                            setPersonalizationFields(newFields);
                          }}
                          className="bg-zinc-900 text-xs px-2 py-1.5 focus:outline-none text-white border border-purple-royal/5"
                        />
                        <select
                          value={f.fieldType}
                          onChange={(e) => {
                            const newFields = [...personalizationFields];
                            newFields[i].fieldType = e.target.value;
                            setPersonalizationFields(newFields);
                          }}
                          className="bg-zinc-900 text-xs px-2 py-1.5 focus:outline-none text-white border border-purple-royal/5 h-[28px]"
                        >
                          <option value="text">Text Input</option>
                          <option value="select">Dropdown Select</option>
                        </select>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => handleRemovePersonalizationField(i)}
                        className="text-zinc-500 hover:text-rose-400 p-1 h-auto"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Media Upload Simulation */}
            <div className="bg-zinc-950 p-4 border border-purple-royal/10 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gold">Media Assets (Mock Cloudinary Uploads)</h4>
              <p className="text-[10px] text-zinc-400 font-light">
                In this dashboard version, saving will default product pictures to optimized responsive models from Cloudinary.
              </p>
            </div>

            {/* Actions */}
            <div className="border-t border-purple-royal/10 pt-4 flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFormOpen(false)}
                className="flex-1 border-purple-royal/20 text-zinc-400 hover:bg-purple-royal/5 rounded-none tracking-widest text-xs uppercase py-5"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={formLoading}
                className="flex-1 bg-gradient-to-r from-gold via-gold-light to-gold-dark text-black font-extrabold tracking-widest text-xs uppercase py-5 rounded-none shadow-lg shadow-gold/15"
              >
                {formLoading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Save Product Details"}
              </Button>
            </div>

          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
