"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, CheckCircle2 } from "lucide-react";

interface Review {
  name: string;
  location: string;
  rating: number;
  comment: string;
}

export default function CustomerReviewsCarousel({ reviews }: { reviews: Review[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [reviews.length]);

  return (
    <div className="relative overflow-hidden h-[300px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 max-w-2xl mx-auto w-full"
        >
          <div className="bg-white border border-zinc-150 p-8 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-[250px]">
            <div>
              <div className="flex gap-1 mb-4">
                {[...Array(reviews[currentIndex].rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                ))}
              </div>
              <p className="text-sm font-light text-zinc-700 italic leading-relaxed mb-6">
                "{reviews[currentIndex].comment}"
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-serif font-bold text-zinc-900 tracking-wide text-sm">{reviews[currentIndex].name}</h4>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-0.5">{reviews[currentIndex].location}</p>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-sm border border-green-200 uppercase tracking-wider">
                <CheckCircle2 className="h-3 w-3" />
                Verified Purchase
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2 mt-4 pb-2">
        {reviews.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === currentIndex ? "w-6 bg-gold" : "w-1.5 bg-zinc-300"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
