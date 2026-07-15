"use client";

import { motion } from "framer-motion";
import Breadcrumb from "./Breadcrumb";

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: { label: string; href: string }[];
}

export default function PageHeader({ title, description, breadcrumbs }: PageHeaderProps) {
  return (
    <div className="relative py-24 bg-gradient-to-b from-muted to-background border-b border-border overflow-hidden">
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay"></div>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-gold/10 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center">
        {breadcrumbs && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <Breadcrumb items={breadcrumbs} />
          </motion.div>
        )}
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-4xl md:text-5xl font-serif text-foreground tracking-widest uppercase mb-4"
        >
          {title}
        </motion.h1>
        
        {description && (
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="text-muted-foreground font-light max-w-2xl text-base md:text-lg"
          >
            {description}
          </motion.p>
        )}
      </div>
    </div>
  );
}
