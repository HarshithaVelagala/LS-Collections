import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import CheckoutWrapper from "./CheckoutWrapper";

export const metadata = {
  title: "Checkout | LS Collections",
  description: "Secure payment gateway for your premium luxury items.",
};

export default function CheckoutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Sticky Navbar */}
      <Navbar />

      {/* Main interactive checkout panel */}
      <main className="flex-grow">
        <CheckoutWrapper />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
