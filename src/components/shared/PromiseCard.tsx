"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface PromiseCardProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  delay?: number;
}

export default function PromiseCard({ icon: Icon, title, description, delay = 0 }: PromiseCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5 }}
      className="flex flex-col items-center text-center p-6 bg-card border border-border hover:border-gold/20 rounded-lg transition-all duration-300 group"
    >
      <div className="w-16 h-16 rounded-full bg-purple-royal/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-purple-royal/20 transition-all duration-500">
        <Icon className="w-8 h-8 text-gold" />
      </div>
      <h3 className="font-serif text-lg tracking-wider text-foreground uppercase mb-2 group-hover:text-gold transition-colors duration-300">
        {title}
      </h3>
      {description && (
        <p className="text-muted-foreground font-light text-sm max-w-[200px]">
          {description}
        </p>
      )}
    </motion.div>
  );
}
