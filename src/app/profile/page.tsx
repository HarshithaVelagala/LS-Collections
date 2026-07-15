import { Suspense } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import ProfileWrapper from "./ProfileWrapper";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product"; // Ensure Mongoose loads schema
import { serialize } from "@/lib/serialize";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export const metadata = {
  title: "My Profile | LS Collections",
  description: "Manage your shopping orders and details.",
};

export default async function ProfilePage() {
  await connectDB();

  const cookieStore = await cookies();
  const token = cookieStore.get("customer_session")?.value;
  let userId = "guest_user";

  if (token) {
    try {
      const JWT_SECRET = process.env.NEXTAUTH_SECRET || "ls_collections_secret_fallback";
      const decoded: any = jwt.verify(token, JWT_SECRET);
      userId = decoded.userId;
    } catch (e) {
      console.error("JWT verification failed in profile page:", e);
    }
  }

  // Fetch orders for the logged-in customer or guest fallback
  const rawOrders = await Order.find({ userId })
    .populate("items.productId")
    .sort({ createdAt: -1 })
    .lean();

  const orders = serialize(rawOrders);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <Navbar />

      {/* Main user profile dashboard wrapper */}
      <main className="flex-grow">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[50vh] text-zinc-400 font-light">
            Loading profile information...
          </div>
        }>
          <ProfileWrapper orders={orders} />
        </Suspense>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
