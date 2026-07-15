import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product"; // Ensure schema registry loads it
import { CheckCircle, Package, Truck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SuccessPageProps {
  searchParams: Promise<{ orderId?: string }>;
}

export const metadata = {
  title: "Order Success | LS Collections",
  description: "Thank you for your premium luxury purchase.",
};

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const { orderId } = await searchParams;

  if (!orderId) {
    notFound();
  }

  await connectDB();

  // Find order and populate item details
  const order = await Order.findById(orderId).populate("items.productId").lean();

  if (!order) {
    notFound();
  }

  const finalAmount = order.totalAmount - order.discountAmount;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <Navbar />

      <main className="flex-grow max-w-3xl w-full mx-auto px-4 py-16 text-foreground text-center">
        {/* Success Header */}
        <div className="flex flex-col items-center mb-8">
          <CheckCircle className="h-16 w-16 text-gold mb-4" />
          <span className="text-xs font-semibold tracking-[0.3em] text-gold uppercase">
            TRANSACTION AUTHORIZED
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif tracking-wider text-foreground mt-2">
            THANK YOU FOR YOUR PURCHASE
          </h1>
          <p className="text-xs text-muted-foreground font-light mt-1">
            Order Reference: {order._id.toString()}
          </p>
        </div>

        {/* Order Details box */}
        <div className="bg-card p-6 sm:p-8 border border-border text-left space-y-6 mb-8 shadow-sm">
          <h3 className="font-serif text-gold text-lg tracking-wider font-semibold border-b border-border pb-2 uppercase">
            Delivery Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            <div className="space-y-1">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider block font-semibold">
                Shipping Address
              </span>
              <p className="font-medium text-foreground">{order.shippingAddress.name}</p>
              <p className="text-muted-foreground font-light">{order.shippingAddress.addressLine}</p>
              <p className="text-muted-foreground font-light">
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
              </p>
              <p className="text-muted-foreground font-light">Phone: {order.shippingAddress.phone}</p>
            </div>

            <div className="space-y-2">
              <div className="space-y-0.5">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider block font-semibold">
                  Payment Status
                </span>
                <span className="text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 px-2 py-0.5 font-bold uppercase rounded-sm inline-block">
                  {order.paymentStatus === "paid" ? "SUCCESSFULLY PAID" : "PENDING AUTHORIZATION"}
                </span>
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider block font-semibold">
                  Estimated Delivery
                </span>
                <p className="font-medium text-foreground flex items-center gap-1.5">
                  <Truck className="h-4 w-4 text-gold" /> Within 3 - 5 Business Days
                </p>
              </div>
            </div>
          </div>

          {/* Items table */}
          <div className="border-t border-border pt-6">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">
              Items Purchased
            </h4>
            <div className="space-y-4">
              {(order.items as any[]).map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs sm:text-sm">
                  <div className="flex-1">
                    <h5 className="font-semibold text-foreground">{item.productId?.name || "Premium Catalog Item"}</h5>
                    {item.variantSku && (
                      <p className="text-[10px] text-muted-foreground mt-0.5">Option: {item.variantSku}</p>
                    )}
                    {item.personalizationInputs && item.personalizationInputs.length > 0 && (
                      <div className="text-[9px] text-gold mt-0.5 font-light">
                        {item.personalizationInputs.map((p: any) => `${p.fieldName}: ${p.value}`).join(", ")}
                      </div>
                    )}
                  </div>
                  <span className="text-muted-foreground font-light px-4">Qty: {item.quantity}</span>
                  <span className="font-bold text-gold">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Calculations */}
          <div className="border-t border-border pt-4 flex justify-between items-baseline">
            <span className="text-sm font-serif tracking-wider text-muted-foreground uppercase">
              Total Amount Charged
            </span>
            <span className="text-2xl font-extrabold text-gold">
              ₹{finalAmount.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/products">
            <Button className="w-full sm:w-auto bg-card border border-primary text-primary hover:bg-section-bg rounded-none tracking-widest text-xs uppercase px-8 py-5 font-semibold transition-all">
              Continue Shopping
            </Button>
          </Link>
          <Link href="/profile?tab=orders">
            <Button className="w-full sm:w-auto bg-primary hover:bg-gold-light text-white rounded-none tracking-widest text-xs uppercase px-8 py-5 font-semibold transition-all flex items-center justify-center gap-1.5">
              View Order History <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
