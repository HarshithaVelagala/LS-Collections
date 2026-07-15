"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface CategoryCardProps {
  title: string;
  href: string;
  imageSrc: string;
  count?: number;
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
} as const;

export default function CategoryCard({ title, href, imageSrc, count = 0 }: CategoryCardProps) {
  return (
    <motion.div variants={itemVariants} className="h-full">
      <Link href={href} className="group block h-full">
        <div 
          className="relative overflow-hidden rounded-md aspect-[3/4] bg-muted border border-border group-hover:border-gold/40 transition-all duration-700 flex flex-col"
        >
          {/* Image */}
          <div className="absolute inset-0 z-0">
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt={title}
                fill
                className="object-cover opacity-70 group-hover:opacity-90 group-hover:scale-110 transition-all duration-1000 ease-out"
              />
            ) : (
              <div className="w-full h-full bg-card flex items-center justify-center">
                <span className="text-muted-foreground text-xs tracking-widest uppercase">Image Pending</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent pointer-events-none group-hover:from-background group-hover:via-background/70 transition-colors duration-700"></div>
          </div>
          
          {/* Content */}
          <div className="relative z-10 flex flex-col justify-end h-full p-6 text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
            <span className="text-gold text-xs tracking-widest font-light mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
              {count} PRODUCTS
            </span>
            <h3 className="font-serif text-2xl tracking-widest uppercase text-foreground mb-4 group-hover:text-gold transition-colors duration-500">
              {title}
            </h3>
            
            <div className="flex items-center justify-center gap-2 text-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-200">
              <span className="text-xs font-serif tracking-widest uppercase">Shop Now</span>
              <ArrowRight className="w-4 h-4 text-gold" />
            </div>
            
            {/* Animated Underline */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 h-[1px] w-0 bg-gold group-hover:w-16 transition-all duration-700 ease-out mt-4 opacity-0 group-hover:opacity-100 delay-300"></div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
