"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface ContactCardProps {
  icon: LucideIcon;
  title: string;
  details: React.ReactNode;
  delay?: number;
}

export default function ContactCard({ icon: Icon, title, details, delay = 0 }: ContactCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-card/80 border border-border p-8 rounded-sm text-center hover:border-gold/30 transition-colors duration-300"
    >
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-royal/10 text-gold mb-4">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="font-serif text-lg tracking-wider text-white uppercase mb-4">{title}</h3>
      <div className="text-zinc-400 font-light space-y-1">
        {details}
      </div>
    </motion.div>
  );
}
