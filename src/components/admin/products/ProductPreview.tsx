"use client";

import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { X } from "lucide-react";
import ProductDetailWrapper from "@/app/products/[slug]/ProductDetailWrapper";

interface ProductPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
}

export default function ProductPreview({ isOpen, onClose, product }: ProductPreviewProps) {
  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[90vw] h-[90vh] max-h-[900px] max-w-[1500px] sm:max-w-[1500px] md:max-w-[1500px] lg:max-w-[1500px] flex flex-col bg-background text-foreground p-0 overflow-hidden rounded-2xl select-none shadow-2xl">

        {/* Custom Close Button for Admin Preview Modal */}
        <DialogClose className="absolute right-6 top-6 z-50 rounded-full p-2 bg-zinc-100 dark:bg-zinc-900/50 text-zinc-500 hover:text-foreground hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-1 focus:ring-gold/50 shadow-sm">
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </DialogClose>

        <div className="flex-1 w-full overflow-hidden relative">
          <div className="w-full pointer-events-auto">
            {/* 
              We reuse the exact same component from the storefront here.
              isPreview=true hides customer checkout actions, sticky buy bar, related products etc.
            */}
            <ProductDetailWrapper
              product={product}
              relatedProducts={[]}
              isPreview={true}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
