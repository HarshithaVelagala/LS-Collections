import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Search } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center border- border-[#EEEEEE] pb-6 mb-8">
          <div className="space-y-3 w-1/3">
            <div className="h-8 bg-[#FAFAFA] animate-pulse rounded-sm w-3/4"></div>
            <div className="h-4 bg-[#FAFAFA] animate-pulse rounded-sm w-1/4"></div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-4">
              <div className="h-10 w-56 bg-[#FAFAFA] animate-pulse rounded-sm"></div>
            </div>
            <div className="lg:hidden h-12 w-24 bg-[#FAFAFA] animate-pulse rounded-sm"></div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Skeleton */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="bg-card border border-[#ECECEC] p-6 rounded-sm shadow-sm space-y-6 sticky top-28">
              <div className="h-6 bg-[#FAFAFA] animate-pulse rounded-sm w-1/2 mb-4"></div>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-4 border- border-[#EEEEEE] pt-5">
                  <div className="h-5 bg-[#FAFAFA] animate-pulse rounded-sm w-2/3"></div>
                  <div className="flex gap-3"><div className="h-4 w-4 bg-[#FAFAFA] animate-pulse"></div><div className="h-4 bg-[#FAFAFA] animate-pulse rounded-sm w-full"></div></div>
                  <div className="flex gap-3"><div className="h-4 w-4 bg-[#FAFAFA] animate-pulse"></div><div className="h-4 bg-[#FAFAFA] animate-pulse rounded-sm w-4/5"></div></div>
                  <div className="flex gap-3"><div className="h-4 w-4 bg-[#FAFAFA] animate-pulse"></div><div className="h-4 bg-[#FAFAFA] animate-pulse rounded-sm w-5/6"></div></div>
                </div>
              ))}
            </div>
          </aside>

          {/* Grid Skeleton */}
          <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-10">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-card border border-[#ECECEC] flex flex-col h-full overflow-hidden rounded-2xl">
                <div className="aspect-[4/5] w-full bg-[#FAFAFA] animate-pulse">
                  <div className="w-full h-full flex items-center justify-center opacity-20">
                    <Search className="h-8 w-8 text-[#C89B6D]" />
                  </div>
                </div>
                <div className="p-5 flex flex-col gap-3">
                  <div className="h-3 bg-[#FAFAFA] animate-pulse rounded-sm w-1/3"></div>
                  <div className="h-4 bg-[#FAFAFA] animate-pulse rounded-sm w-full"></div>
                  <div className="h-5 bg-[#FAFAFA] animate-pulse rounded-sm w-1/3 mt-2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
