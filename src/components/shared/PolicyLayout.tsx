"use client";

import { motion } from "framer-motion";
import PageHeader from "./PageHeader";
import { ReactNode } from "react";

interface PolicyLayoutProps {
  title: string;
  lastUpdated: string;
  children: ReactNode;
  breadcrumbs: { label: string; href: string }[];
}

export default function PolicyLayout({ title, lastUpdated, children, breadcrumbs }: PolicyLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader 
        title={title} 
        description={`Last Updated: ${lastUpdated}`} 
        breadcrumbs={breadcrumbs} 
      />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="prose prose-zinc max-w-none font-light text-muted-foreground
                     prose-h2:font-serif prose-h2:text-foreground prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6
                     prose-h3:font-serif prose-h3:text-gold prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
                     prose-p:leading-relaxed prose-p:mb-6
                     prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-6
                     prose-li:mb-2"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
