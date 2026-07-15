import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import CartDrawer from "@/components/cart/CartDrawer";
import WhatsAppButton from "@/components/shared/WhatsAppButton";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LS Collections | Premium Sarees & Artificial Jewellery",
  description: "Experience premium dark luxury shopping with our curated collections of premium Sarees and elite Artificial Jewellery.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground" suppressHydrationWarning>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              {children}
              <CartDrawer />
              <WhatsAppButton />
              <Toaster />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

