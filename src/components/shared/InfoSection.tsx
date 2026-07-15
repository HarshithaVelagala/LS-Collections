"use client";

import { motion } from "framer-motion";

interface InfoSectionProps {
  title: string;
  content: string | React.ReactNode;
  imageOnRight?: boolean;
  imageSrc?: string;
  delay?: number;
}

export default function InfoSection({ title, content, imageOnRight = false, imageSrc, delay = 0 }: InfoSectionProps) {
  return (
    <div className={`flex flex-col ${imageOnRight ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 items-center py-16 border-b border-purple-royal/5 last:border-0`}>
      {imageSrc && (
        <motion.div 
          initial={{ opacity: 0, x: imageOnRight ? -30 : 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay }}
          className="w-full md:w-1/2 aspect-square relative bg-muted border border-border rounded-sm overflow-hidden"
        >
          {/* Use standard img or Next/Image here. We use placeholder text for now */}
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground font-serif tracking-widest text-sm uppercase">
            Image: {title}
          </div>
        </motion.div>
      )}
      
      <motion.div 
        initial={{ opacity: 0, x: imageOnRight ? 30 : -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, delay: delay + 0.2 }}
        className={`w-full ${imageSrc ? 'md:w-1/2' : 'max-w-4xl mx-auto text-center'}`}
      >
        <h2 className="font-serif text-3xl text-foreground tracking-widest uppercase mb-6 flex flex-col gap-2">
          {title}
          <span className={`h-[1px] w-12 bg-gold ${!imageSrc && 'mx-auto'}`}></span>
        </h2>
        <div className="text-muted-foreground font-light leading-relaxed space-y-4">
          {content}
        </div>
      </motion.div>
    </div>
  );
}
