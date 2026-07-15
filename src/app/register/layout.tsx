import { ReactNode } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import Image from "next/image";

export default function RegisterLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-20 px-4 sm:px-6 relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
          <Image
            src="/banners/saree_banner_1.png"
            alt="Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background"></div>
        </div>
        
        <div className="w-full max-w-lg relative z-10">
          <div className="bg-card/80 backdrop-blur-md border border-border p-8 sm:p-10 shadow-2xl">
            {children}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
