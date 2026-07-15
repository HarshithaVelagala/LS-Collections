import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import OrderTimeline from "@/components/orders/OrderTimeline";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { serialize } from "@/lib/serialize";
import Link from "next/link";
import { ArrowLeft, PackageSearch } from "lucide-react";
import Image from "next/image";

interface OrderTrackingPageProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function OrderTrackingPage({ searchParams }: OrderTrackingPageProps) {
  const { id } = await searchParams;
  
  let order = null;
  let error = "";

  if (id) {
    try {
      await connectDB();
      const rawOrder = await Order.findById(id).populate("items.productId", "name media slug").lean();
      if (!rawOrder) {
        error = "Order not found. Please check your tracking ID.";
      } else {
        order = serialize(rawOrder);
      }
    } catch (err) {
      error = "Invalid order ID format.";
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="mb-12 text-center space-y-4">
          <PackageSearch className="h-12 w-12 text-gold mx-auto mb-4" />
          <h1 className="text-3xl sm:text-4xl font-serif tracking-wider text-foreground font-bold uppercase">
            Track Your Order
          </h1>
          <p className="text-muted-foreground font-light max-w-md mx-auto">
            Enter your order reference ID below to see real-time updates on your luxury purchase.
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-card border border-border p-6 max-w-xl mx-auto mb-12 shadow-sm rounded-xl">
          <form action="/order-tracking" method="GET" className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              name="id"
              defaultValue={id || ""}
              placeholder="Enter Order ID (e.g. 64b7f...)"
              required
              className="flex-1 bg-background border border-border text-foreground px-4 py-3 text-sm focus:outline-none focus:border-gold rounded-md focus:ring-1 focus:ring-primary"
            />
            <button
              type="submit"
              className="bg-primary hover:bg-gold-light text-white font-bold tracking-widest uppercase px-8 py-3 transition-all rounded-md shadow-md hover:shadow-primary/20"
            >
              Track
            </button>
          </form>
          {error && <p className="text-rose-600 text-xs mt-4 text-center">{error}</p>}
        </div>

        {/* Order Details & Timeline */}
        {order && (
          <div className="space-y-12">
            <div className="bg-card border border-border p-8 rounded-xl shadow-sm">
              <div className="flex flex-col md:flex-row justify-between gap-6 mb-12 pb-8 border-b border-border">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-1">Order Reference</p>
                  <p className="text-foreground font-mono text-lg">{order._id.toString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-1">Total Amount</p>
                  <p className="text-gold font-bold text-lg">₹{(order.totalAmount - order.discountAmount).toLocaleString("en-IN")}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-1">Payment Status</p>
                  <p className="text-emerald-600 font-bold uppercase">{order.paymentStatus}</p>
                </div>
              </div>

              <OrderTimeline 
                status={order.orderStatus} 
                date={new Date(order.createdAt).toLocaleDateString("en-IN", {
                  year: "numeric", month: "short", day: "numeric"
                })} 
              />
            </div>

            {/* Items Summary */}
            <div className="bg-card border border-border p-8 rounded-xl shadow-sm">
              <h3 className="font-serif text-lg text-gold tracking-wider uppercase mb-6 border-b border-border pb-4">
                Items in this Order
              </h3>
              <div className="space-y-6">
                {order.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex gap-6 items-center">
                    <div className="relative h-24 w-16 bg-muted border border-border flex-shrink-0 rounded-lg overflow-hidden">
                      {item.productId?.media?.[0]?.url && (
                        <Image src={item.productId.media[0].url} alt="Product" fill className="object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link href={`/products/${item.productId?.slug || item.productId?._id}`}>
                        <h4 className="text-foreground font-bold hover:text-gold transition-colors">{item.productId?.name || "Premium Item"}</h4>
                      </Link>
                      <p className="text-muted-foreground text-xs mt-1">Qty: {item.quantity} {item.variantSku && `| ${item.variantSku}`}</p>
                    </div>
                    <p className="text-foreground font-bold">₹{item.price.toLocaleString("en-IN")}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
