"use client";

import { 
  DollarSign, 
  ShoppingBag, 
  Package, 
  Clock, 
  TrendingUp, 
  Users, 
  ArrowUpRight, 
  AlertTriangle,
  ChevronRight
} from "lucide-react";
import Link from "next/link";

interface DashboardHomeProps {
  stats: {
    totalRevenue: number;
    ordersCount: number;
    pendingOrdersCount: number;
    productsCount: number;
    customersCount: number;
  };
  recentOrders: any[];
  latestCustomers: any[];
  lowStockProducts: any[];
}

export default function DashboardHome({ stats, recentOrders, latestCustomers, lowStockProducts }: DashboardHomeProps) {
  
  // Format Indian Rupees
  const formatRupee = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="space-y-8 select-none">
      
      {/* 1. Statistics Row */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Revenue */}
        <div className="group relative overflow-hidden border border-purple-royal/10 bg-[#0b0b0c] p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-gold/30 hover:shadow-lg hover:shadow-gold/5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">Total Revenue</span>
              <h3 className="text-2xl font-serif font-bold text-gold transition-colors group-hover:text-gold-light">
                {formatRupee(stats.totalRevenue)}
              </h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center border border-gold/10 bg-zinc-900/50 text-gold group-hover:border-gold/30 transition-colors">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-[10px] text-zinc-500 font-medium">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-emerald-400 font-bold">+14.2%</span> from last month
          </div>
        </div>

        {/* Total Orders */}
        <div className="group relative overflow-hidden border border-purple-royal/10 bg-[#0b0b0c] p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-gold/30 hover:shadow-lg hover:shadow-gold/5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">Total Orders</span>
              <h3 className="text-2xl font-serif font-bold text-white group-hover:text-gold-light transition-colors">
                {stats.ordersCount}
              </h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center border border-purple-royal/15 bg-zinc-900/50 text-zinc-400 group-hover:border-gold/30 group-hover:text-gold transition-colors">
              <ShoppingBag className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-[10px] text-zinc-500 font-medium">
            <span className="text-emerald-400 font-bold">+5.8%</span> monthly transaction volume
          </div>
        </div>

        {/* Pending Orders */}
        <div className="group relative overflow-hidden border border-purple-royal/10 bg-[#0b0b0c] p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-gold/30 hover:shadow-lg hover:shadow-gold/5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">Pending Orders</span>
              <h3 className="text-2xl font-serif font-bold text-white group-hover:text-gold-light transition-colors">
                {stats.pendingOrdersCount}
              </h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center border border-purple-royal/15 bg-zinc-900/50 text-zinc-400 group-hover:border-gold/30 group-hover:text-gold transition-colors">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-[10px] text-zinc-500 font-medium">
            <span className="text-gold font-bold">Needs fulfillment</span> cycle execution
          </div>
        </div>

        {/* Total Products */}
        <div className="group relative overflow-hidden border border-purple-royal/10 bg-[#0b0b0c] p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-gold/30 hover:shadow-lg hover:shadow-gold/5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">Total Products</span>
              <h3 className="text-2xl font-serif font-bold text-white group-hover:text-gold-light transition-colors">
                {stats.productsCount}
              </h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center border border-purple-royal/15 bg-zinc-900/50 text-zinc-400 group-hover:border-gold/30 group-hover:text-gold transition-colors">
              <Package className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-[10px] text-zinc-500 font-medium">
            <span className="text-gold font-bold">Active Catalog</span> volume count
          </div>
        </div>
      </div>

      {/* 2. Chart Section */}
      <div className="border border-purple-royal/10 bg-[#0b0b0c] p-6 shadow-md">
        <div className="flex items-center justify-between border-b border-purple-royal/5 pb-4 mb-6">
          <div>
            <h4 className="font-serif text-sm font-bold tracking-widest text-gold uppercase">Sales Overview</h4>
            <p className="text-[10px] text-zinc-500 font-light mt-0.5">Transactional history analytics (Current Year)</p>
          </div>
          <span className="text-[10px] border border-purple-royal/20 bg-zinc-950 px-3 py-1 font-bold text-zinc-400 uppercase tracking-wider">
            Live Stream
          </span>
        </div>

        {/* Custom Premium Chart Render using SVG */}
        <div className="relative h-64 w-full">
          <svg className="h-full w-full" viewBox="0 0 1000 240" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.78 0.13 85)" stopOpacity="0.15" />
                <stop offset="100%" stopColor="oklch(0.78 0.13 85)" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Gridlines */}
            <line x1="0" y1="40" x2="1000" y2="40" stroke="rgba(111,63,169,0.06)" strokeDasharray="4" />
            <line x1="0" y1="100" x2="1000" y2="100" stroke="rgba(111,63,169,0.06)" strokeDasharray="4" />
            <line x1="0" y1="160" x2="1000" y2="160" stroke="rgba(111,63,169,0.06)" strokeDasharray="4" />
            <line x1="0" y1="220" x2="1000" y2="220" stroke="rgba(111,63,169,0.15)" />

            {/* Area under the chart curve */}
            <path
              d="M 50 220 L 50 180 Q 200 110, 350 130 T 650 70 T 950 50 L 950 220 Z"
              fill="url(#chartGrad)"
            />

            {/* Chart Line Path */}
            <path
              d="M 50 180 Q 200 110, 350 130 T 650 70 T 950 50"
              fill="none"
              stroke="oklch(0.78 0.13 85)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Interactive Nodes */}
            <circle cx="50" cy="180" r="4.5" fill="#000" stroke="oklch(0.78 0.13 85)" strokeWidth="2" />
            <circle cx="350" cy="130" r="4.5" fill="#000" stroke="oklch(0.78 0.13 85)" strokeWidth="2" />
            <circle cx="650" cy="70" r="4.5" fill="#000" stroke="oklch(0.78 0.13 85)" strokeWidth="2" />
            <circle cx="950" cy="50" r="4.5" fill="#000" stroke="oklch(0.78 0.13 85)" strokeWidth="2" />
          </svg>
        </div>

        {/* Chart Months Axis */}
        <div className="flex justify-between text-[9px] font-bold text-zinc-500 tracking-wider uppercase px-4 mt-2">
          <span>Q1 (Jan - Mar)</span>
          <span>Q2 (Apr - Jun)</span>
          <span>Q3 (Jul - Sep)</span>
          <span>Q4 (Oct - Dec)</span>
        </div>
      </div>

      {/* 3. Grid for Tables & Lists */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* Recent Orders Card */}
        <div className="border border-purple-royal/10 bg-[#0b0b0c] p-6 shadow-md lg:col-span-2">
          <div className="flex items-center justify-between border-b border-purple-royal/5 pb-3 mb-4">
            <h4 className="font-serif text-xs font-bold tracking-widest text-gold uppercase">Recent Orders</h4>
            <Link href="/admin/orders" className="text-[10px] text-zinc-400 hover:text-gold uppercase tracking-wider flex items-center gap-0.5 transition-colors font-bold">
              View All <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs text-zinc-300">
              <thead>
                <tr className="border-b border-purple-royal/10 text-[9px] tracking-widest uppercase text-zinc-500">
                  <th className="pb-2 font-semibold">Order</th>
                  <th className="pb-2 font-semibold">Customer</th>
                  <th className="pb-2 font-semibold">Amount</th>
                  <th className="pb-2 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-royal/5">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-zinc-500 italic">No transactions logged yet.</td>
                  </tr>
                ) : (
                  recentOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-purple-royal/5 transition-colors">
                      <td className="py-3 font-mono text-[10px] text-zinc-400">#{o.id.slice(-8).toUpperCase()}</td>
                      <td className="py-3 font-medium text-white">{o.customerName}</td>
                      <td className="py-3 font-bold text-gold">{formatRupee(o.totalAmount)}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-sm font-bold uppercase text-[9px] border ${
                          o.orderStatus === "delivered" 
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                            : o.orderStatus === "shipped"
                            ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
                            : o.orderStatus === "cancelled"
                            ? "bg-rose-500/10 border-rose-500/20 text-rose-400"
                            : "bg-gold/10 border-gold/20 text-gold"
                        }`}>
                          {o.orderStatus}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Latest Customers Card */}
        <div className="border border-purple-royal/10 bg-[#0b0b0c] p-6 shadow-md">
          <div className="flex items-center justify-between border-b border-purple-royal/5 pb-3 mb-4">
            <h4 className="font-serif text-xs font-bold tracking-widest text-gold uppercase">Latest Registrations</h4>
            <Link href="/admin/customers" className="text-[10px] text-zinc-400 hover:text-gold uppercase tracking-wider flex items-center gap-0.5 transition-colors font-bold">
              View All <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="space-y-4">
            {latestCustomers.length === 0 ? (
              <p className="text-center text-zinc-500 italic py-4 text-xs">No registered customer profiles found.</p>
            ) : (
              latestCustomers.map((c) => (
                <div key={c.id} className="flex items-center justify-between py-1">
                  <div>
                    <p className="text-xs font-semibold text-white">{c.name}</p>
                    <p className="text-[10px] text-zinc-500 font-light truncate max-w-[150px]">{c.email}</p>
                  </div>
                  <span className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest font-mono">
                    {new Date(c.createdAt).toLocaleDateString(undefined, {month: "short", day: "numeric"})}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 4. Low Stock Warning Section */}
      {lowStockProducts.length > 0 && (
        <div className="border border-rose-500/20 bg-rose-500/5 p-6 shadow-md">
          <div className="flex items-center gap-2 border-b border-rose-500/10 pb-3 mb-4">
            <AlertTriangle className="h-5 w-5 text-rose-400 animate-pulse" />
            <h4 className="font-serif text-xs font-bold tracking-widest text-rose-400 uppercase">Critical Inventory Shortage</h4>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs text-zinc-300">
              <thead>
                <tr className="border-b border-rose-500/10 text-[9px] tracking-widest uppercase text-zinc-500">
                  <th className="pb-2 font-semibold">Product Name</th>
                  <th className="pb-2 font-semibold">Category</th>
                  <th className="pb-2 font-semibold">Cumulative Stock</th>
                  <th className="pb-2 font-semibold">Lowest Variant Stock</th>
                  <th className="pb-2 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-500/5">
                {lowStockProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-rose-500/5 transition-colors">
                    <td className="py-3 font-serif font-bold text-white">{p.name}</td>
                    <td className="py-3 capitalize text-zinc-400">{p.category}</td>
                    <td className="py-3 font-semibold text-zinc-400">{p.stock} units</td>
                    <td className="py-3 font-extrabold text-rose-400">{p.minVariantStock} units</td>
                    <td className="py-3 text-right">
                      <Link href="/admin/products">
                        <span className="text-[10px] text-gold hover:text-white uppercase tracking-wider font-bold border-b border-gold/30 hover:border-white transition-all cursor-pointer">
                          Replenish
                        </span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
