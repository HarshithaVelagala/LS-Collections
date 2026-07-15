"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn } from "lucide-react";

interface ImageGalleryProps {
  media: { url: string; alt?: string }[];
  productName: string;
  activeImageIndex: number;
  setActiveImageIndex: (index: number) => void;
}

export default function ImageGallery({
  media,
  productName,
  activeImageIndex,
  setActiveImageIndex,
}: ImageGalleryProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [failedUrls, setFailedUrls] = useState<Set<string>>(new Set());
  
  const imgContainerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imgContainerRef.current) return;
    const { left, top, width, height } = imgContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePosition({ x, y });
  };

  const validMedia = (media || []).filter(
    (item) => item && typeof item.url === "string" && item.url.trim() !== ""
  );
  const displayedMedia = validMedia.filter((item) => !failedUrls.has(item.url));

  const activeMedia = displayedMedia[activeImageIndex] || displayedMedia[0];

  const handleImageError = (url: string) => {
    setFailedUrls((prev) => {
      const newSet = new Set(prev);
      newSet.add(url);
      return newSet;
    });
  };

  if (displayedMedia.length === 0) {
    return (
      <div className="w-full flex flex-col md:flex-row gap-4">
        <div className="flex-1 order-1 md:order-2 relative aspect-[4/5] bg-muted border border-border flex items-center justify-center text-muted-foreground">
          No image available
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full flex flex-col md:flex-row gap-4">
        {/* Vertical Thumbnails */}
        <div className="flex md:flex-col gap-3 order-2 md:order-1 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 scrollbar-hide">
          {displayedMedia.map((mediaItem, index) => {
            const isActive = 
              (activeMedia && activeMedia.url === mediaItem.url) || 
              (index === 0 && !activeMedia);

            return (
              <button
                key={mediaItem.url + index}
                onClick={() => {
                  // Find original index to pass to setActiveImageIndex, or just pass index if it's fine.
                  // Since the wrapper component uses activeImageIndex to select from original `media`, 
                  // passing the original index is better.
                  const originalIndex = media.findIndex(m => m?.url === mediaItem.url);
                  setActiveImageIndex(originalIndex !== -1 ? originalIndex : index);
                }}
                className={`relative h-24 w-20 flex-shrink-0 border-[1.5px] transition-all duration-[250ms] ease-in-out ${
                  isActive
                    ? "border-gold opacity-100 shadow-[0_4px_12px_rgba(200,155,109,0.2)]"
                    : "border-transparent opacity-60 hover:opacity-100 hover:border-[#ECECEC]"
                }`}
              >
                <Image
                  src={mediaItem.url}
                  alt={mediaItem.alt || `${productName} thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  onError={() => handleImageError(mediaItem.url)}
                />
              </button>
            );
          })}
        </div>

        {/* Main Focused Image with Frame */}
        <div 
          ref={imgContainerRef}
          className="flex-1 order-1 md:order-2 relative aspect-[4/5] bg-muted border border-border overflow-hidden group cursor-zoom-in"
          onMouseEnter={() => setIsZooming(true)}
          onMouseLeave={() => setIsZooming(false)}
          onMouseMove={handleMouseMove}
          onClick={() => setIsFullscreen(true)}
        >
          <AnimatePresence mode="wait">
            {activeMedia && (
              <motion.div
                key={activeMedia.url}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute inset-0 h-full w-full"
              >
                <Image
                  src={activeMedia.url}
                  alt={activeMedia.alt || productName}
                  fill
                  className="object-cover transition-transform duration-200"
                  style={{
                    transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                    transform: isZooming ? "scale(2)" : "scale(1)",
                  }}
                  onError={() => handleImageError(activeMedia.url)}
                  priority
                />
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="absolute bottom-4 right-4 bg-background/70 p-2 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <ZoomIn className="h-5 w-5 text-white" />
          </div>
        </div>
      </div>

      {/* Fullscreen Viewer */}
      <AnimatePresence>
        {isFullscreen && activeMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm"
          >
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-6 right-6 z-50 text-white/70 hover:text-white transition-colors"
            >
              <X className="h-10 w-10" />
            </button>
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-[90vw] h-[90vh]"
            >
              <Image
                src={activeMedia.url}
                alt={activeMedia.alt || productName}
                fill
                className="object-contain"
                quality={100}
                priority
              />
            </motion.div>

            {/* Thumbnails in Fullscreen */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 p-4 bg-background/70 backdrop-blur-md rounded-lg max-w-full overflow-x-auto">
              {displayedMedia.map((mediaItem, index) => {
                const isActive = activeMedia.url === mediaItem.url;
                return (
                  <button
                    key={mediaItem.url + index}
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      const originalIndex = media.findIndex(m => m?.url === mediaItem.url);
                      setActiveImageIndex(originalIndex !== -1 ? originalIndex : index);
                    }}
                    className={`relative h-16 w-12 flex-shrink-0 border-[1.5px] transition-all duration-[250ms] ease-in-out ${
                      isActive ? "border-gold scale-110 shadow-[0_4px_12px_rgba(200,155,109,0.3)]" : "border-transparent opacity-50 hover:opacity-100 hover:border-[#ECECEC]"
                    }`}
                  >
                    <Image
                      src={mediaItem.url}
                      alt="thumbnail"
                      fill
                      className="object-cover"
                    />
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
