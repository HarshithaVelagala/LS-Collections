"use client";

interface ProductVariantsProps {
  variants: any[];
  selectedVariant: any;
  handleVariantSelect: (variant: any) => void;
  basePrice: number;
}

export default function ProductVariants({
  variants,
  selectedVariant,
  handleVariantSelect,
  basePrice,
}: ProductVariantsProps) {
  if (!variants || variants.length <= 1) return null;

  // Group variants by attributes for a better UI
  // Since attributes might vary, we extract unique keys first
  const attributeKeys = Array.from(
    new Set(variants.flatMap((v) => Object.keys(v.attributes || {})))
  );

  return (
    <div className="space-y-4 pt-1">
      {attributeKeys.map((key) => {
        // Find unique values for this attribute
        const uniqueValues = Array.from(
          new Set(variants.map((v) => v.attributes[key]).filter(Boolean))
        );

        if (uniqueValues.length === 0) return null;

        return (
          <div key={key} className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              Select {key}
            </label>
            <div className="flex flex-wrap gap-3">
              {uniqueValues.map((value) => {
                // Determine if this exact attribute value is selected
                const isSelected = selectedVariant?.attributes?.[key] === value;
                
                // Find a variant that matches this specific attribute choice
                // This is a simplified matching just to find a price difference if applicable
                const matchingVariant = variants.find(
                  (v) => v.attributes[key] === value
                );
                
                const priceDiff = matchingVariant 
                  ? matchingVariant.price - basePrice 
                  : 0;

                return (
                  <button
                    key={value}
                    onClick={() => {
                      // Attempt to find the best variant matching current selections + new selection
                      const newSelections = {
                        ...selectedVariant?.attributes,
                        [key]: value,
                      };
                      
                      const exactMatch = variants.find((variantItem) => {
                        return Object.entries(newSelections).every(
                          ([attrKey, attrVal]) => !attrVal || attrVal === variantItem.attributes[attrKey]
                        );
                      });

                      handleVariantSelect(exactMatch || matchingVariant);
                    }}
                    className={`px-4 py-2.5 text-xs font-medium border transition-all rounded-sm backdrop-blur-sm ${
                      isSelected
                        ? "bg-primary border-gold text-primary-foreground shadow-[0_0_15px_rgba(200,164,93,0.15)]"
                        : "bg-card border-border text-foreground hover:border-gold/50 hover:text-gold"
                    }`}
                  >
                    {value}
                    {priceDiff > 0 && (
                      <span className="ml-2 text-[10px] text-muted-foreground">
                        (+₹{priceDiff.toLocaleString("en-IN")})
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
