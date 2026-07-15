"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, Variants } from "framer-motion";

const subcategoryContainerVariants: Variants = {
  rest: { opacity: 0, height: 0, y: 10, pointerEvents: "none" },
  hover: { 
    opacity: 1, 
    height: "auto", 
    y: 0, 
    pointerEvents: "auto",
    transition: { 
      duration: 0.4, 
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.05
    } 
  }
};

const itemVariants: Variants = {
  rest: { opacity: 0, x: -10 },
  hover: { opacity: 1, x: 0, transition: { duration: 0.3 } }
};

export default function CategoryCard({ cat }: { cat: any }) {
  return (
    <motion.div 
      initial="rest"
      whileHover="hover"
      animate="rest"
      className="group relative h-[450px] overflow-hidden border border-border bg-card block shadow-sm"
    >
      {/* Background Main Link */}
      <Link href={cat.href} className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105 opacity-50"
          style={{ backgroundImage: `url(${cat.image})` }}
        />
        <div className="absolute inset-0 border-[0px] border-primary/0 transition-all duration-300 group-hover:border-[4px] group-hover:border-primary/20" />
        
        {/* Light overlay fade animation */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100 group-hover:bg-background/80" />
      </Link>

      <div className="absolute bottom-0 left-0 p-10 w-full flex flex-col justify-end z-10 pointer-events-none">
        
        {/* Subcategories */}
        {cat.subcategories && cat.subcategories.length > 0 && (
          <motion.div 
            variants={subcategoryContainerVariants}
            className="flex flex-wrap gap-2 mb-6 pointer-events-auto"
          >
            {cat.subcategories.map((sub: any, idx: number) => (
              <motion.div key={idx} variants={itemVariants}>
                <Link 
                  href={sub.href}
                  className="inline-block text-[10px] font-semibold tracking-widest uppercase border border-primary/30 text-primary bg-card/85 hover:bg-section-bg px-3 py-1.5 transition-all duration-300 backdrop-blur-sm"
                >
                  {sub.name}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}

        <div className="flex justify-between items-end pointer-events-auto">
          <Link href={cat.href} className="block">
            <h3 className="text-3xl font-serif font-bold text-foreground tracking-wider group-hover:text-gold transition-colors">{cat.name}</h3>
            <p className="text-xs text-muted-foreground font-light mt-1.5">{cat.desc}</p>
          </Link>
          
          {/* View Collection Button */}
          <Link href={cat.href} className="overflow-hidden flex items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              variants={{
                rest: { opacity: 0, x: -20 },
                hover: { opacity: 1, x: 0, transition: { duration: 0.3 } }
              }}
              className="hidden group-hover:flex items-center gap-2 mr-2"
            >
              <span className="text-gold text-xs font-bold tracking-widest uppercase">View Collection</span>
            </motion.div>
            <Button variant="ghost" className="text-gold group-hover:translate-x-1.5 transition-transform duration-300 pr-0 hover:bg-transparent hover:text-gold-light p-0">
              <ArrowRight className="h-6 w-6" />
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
