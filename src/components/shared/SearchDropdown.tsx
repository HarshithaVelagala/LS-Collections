"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";

interface SearchDropdownProps {
  isOpen: boolean;
  query: string;
  results: any[];
  isLoading: boolean;
  onClose: () => void;
}

export default function SearchDropdown({ isOpen, query, results, isLoading, onClose }: SearchDropdownProps) {
  if (!isOpen || query.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="absolute top-full left-0 md:right-0 md:left-auto mt-4 w-[90vw] md:w-[400px] bg-card/95 backdrop-blur-xl border border-border shadow-[0_10px_40px_rgba(0,0,0,0.15)] z-50 rounded-sm overflow-hidden"
      >
        <div className="p-4 border-b border-border bg-muted/40">
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold flex items-center gap-2">
            <Search className="h-3 w-3 text-gold" />
            {isLoading ? "Searching..." : "Search Results"}
          </p>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <div className="p-8 flex justify-center">
              <div className="h-6 w-6 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : results.length > 0 ? (
            <div className="flex flex-col">
              {results.map((product) => (
                <Link
                  key={product._id}
                  href={`/products/${product.slug || product._id}`}
                  onClick={onClose}
                  className="flex items-center gap-4 p-4 hover:bg-muted transition-colors border-b border-border last:border-0 group"
                >
                  <div className="relative h-16 w-12 flex-shrink-0 border border-border group-hover:border-gold/50 transition-colors">
                    <Image
                      src={product.media?.[0]?.url || "/banners/saree_banner_1.png"}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-serif font-bold text-foreground truncate group-hover:text-gold transition-colors">
                      {product.name}
                    </h4>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">
                      {product.category} {product.subCategory && `| ${product.subCategory}`}
                    </p>
                    <p className="text-xs text-gold font-bold mt-1">
                      ₹{(product.discountPrice || product.basePrice).toLocaleString("en-IN")}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center flex flex-col items-center justify-center">
              <Search className="h-8 w-8 text-zinc-400 mb-3" />
              <p className="text-sm text-foreground font-medium">No results found for "{query}"</p>
              <p className="text-xs text-muted-foreground mt-2 font-light">Try checking your spelling or use more general terms</p>
            </div>
          )}
        </div>

        {results.length > 0 && !isLoading && (
          <div className="p-4 bg-muted/40 border-t border-border">
            <Link
              href={`/products?search=${encodeURIComponent(query)}`}
              onClick={onClose}
              className="block w-full text-center text-xs font-bold uppercase tracking-widest text-gold hover:text-foreground transition-colors"
            >
              View All Results →
            </Link>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
