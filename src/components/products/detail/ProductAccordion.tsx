"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface ProductAccordionProps {
  product: any;
  selectedVariant: any;
}

export default function ProductAccordion({ product, selectedVariant }: ProductAccordionProps) {
  const isSaree = product.category?.toLowerCase() === "saree";

  return (
    <div className="mt-8 border- border-[#EEEEEE] pt-4">
      <Accordion type="single" collapsible className="w-full">
        {/* Description */}
        <AccordionItem value="description" className="border- border-[#EEEEEE]">
          <AccordionTrigger className="font-serif text-sm tracking-wide text-foreground hover:text-gold uppercase py-5 transition-all duration-300">
            Description
          </AccordionTrigger>
          <AccordionContent className="text-xs font-light text-muted-foreground leading-relaxed pt-2 pb-5 transition-all duration-300">
            {product.description}
          </AccordionContent>
        </AccordionItem>

        {/* Specifications */}
        <AccordionItem value="specifications" className="border- border-[#EEEEEE]">
          <AccordionTrigger className="font-serif text-sm tracking-wide text-foreground hover:text-gold uppercase py-5 transition-all duration-300">
            Specifications
          </AccordionTrigger>
          <AccordionContent className="text-xs font-light text-muted-foreground leading-relaxed pt-2 pb-5 transition-all duration-300">
            <div className="space-y-0">
              <div className="grid grid-cols-2 py-2 border-b border-border/50">
                <span className="font-medium text-foreground/80">Category</span>
                <span className="capitalize">{product.category}</span>
              </div>
              <div className="grid grid-cols-2 py-2 border-b border-border/50">
                <span className="font-medium text-foreground/80">Style</span>
                <span>{product.subCategory || "Classical Design"}</span>
              </div>
              {isSaree ? (
                <>
                  <div className="grid grid-cols-2 py-2 border-b border-border/50">
                    <span className="font-medium text-foreground/80">Fabric</span>
                    <span>{selectedVariant?.attributes?.fabric || selectedVariant?.attributes?.material || "Premium Silk"}</span>
                  </div>
                  <div className="grid grid-cols-2 py-2 border-b border-border/50">
                    <span className="font-medium text-foreground/80">Length</span>
                    <span>{selectedVariant?.attributes?.length || "5.5 Meters + 0.8m Blouse Piece"}</span>
                  </div>
                  <div className="grid grid-cols-2 py-2 border-b border-border/50">
                    <span className="font-medium text-foreground/80">Weave</span>
                    <span>{product.attributes?.weave || "Handwoven Zari"}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 py-2 border-b border-border/50">
                    <span className="font-medium text-foreground/80">Material</span>
                    <span>{selectedVariant?.attributes?.material || "Brass Alloy"}</span>
                  </div>
                  <div className="grid grid-cols-2 py-2 border-b border-border/50">
                    <span className="font-medium text-foreground/80">Finish / Plating</span>
                    <span>{selectedVariant?.attributes?.finish || "22k Gold Plated"}</span>
                  </div>
                  <div className="grid grid-cols-2 py-2 border-b border-border/50">
                    <span className="font-medium text-foreground/80">Stone</span>
                    <span>{product.attributes?.stone || "Kundan / CZ"}</span>
                  </div>
                </>
              )}
              <div className="grid grid-cols-2 py-2">
                <span className="font-medium text-foreground/80">Occasion</span>
                <span>{product.attributes?.occasion || "Wedding, Festival, Party"}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Shipping Information */}
        <AccordionItem value="shipping" className="border- border-[#EEEEEE]">
          <AccordionTrigger className="font-serif text-sm tracking-wide text-foreground hover:text-gold uppercase py-5 transition-all duration-300">
            Shipping Information
          </AccordionTrigger>
          <AccordionContent className="text-xs font-light text-muted-foreground leading-relaxed pt-2 pb-5 space-y-2 transition-all duration-300">
            <p>We offer premium insured shipping on all orders.</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Domestic orders (India): 3-5 business days.</li>
              <li>International orders: 7-14 business days.</li>
              <li>All packages are securely packed in our signature LS Collections velvet boxes.</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        {/* Return Policy */}
        <AccordionItem value="returns" className="border- border-[#EEEEEE]">
          <AccordionTrigger className="font-serif text-sm tracking-wide text-foreground hover:text-gold uppercase py-5 transition-all duration-300">
            Return Policy
          </AccordionTrigger>
          <AccordionContent className="text-xs font-light text-muted-foreground leading-relaxed pt-2 pb-5 space-y-2 transition-all duration-300">
            <p>Your satisfaction is our utmost priority.</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Returns are accepted within 7 days of delivery.</li>
              <li>Items must be unused, unwashed, and in their original packaging with all tags attached.</li>
              <li>Customized or personalized items are non-refundable.</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        {/* Care Instructions */}
        <AccordionItem value="care" className="border- border-[#EEEEEE]">
          <AccordionTrigger className="font-serif text-sm tracking-wide text-foreground hover:text-gold uppercase py-5 transition-all duration-300">
            Care Instructions
          </AccordionTrigger>
          <AccordionContent className="text-xs font-light text-muted-foreground leading-relaxed pt-2 pb-5 space-y-2 transition-all duration-300">
            <p className="font-bold text-gold">For Longevity of your Luxury Pieces:</p>
            {isSaree ? (
              <ul className="list-disc pl-4 space-y-1">
                <li>Dry Clean exclusively.</li>
                <li>Store folded in a clean, breathable muslin cloth.</li>
                <li>Avoid hanging heavy silk sarees to prevent stretching.</li>
              </ul>
            ) : (
              <ul className="list-disc pl-4 space-y-1">
                <li>Keep away from moisture, perfumes, and harsh chemicals.</li>
                <li>Wipe gently with a soft cotton cloth after every use.</li>
                <li>Store in the provided airtight LS Collections box.</li>
              </ul>
            )}
          </AccordionContent>
        </AccordionItem>

      </Accordion>
    </div>
  );
}
