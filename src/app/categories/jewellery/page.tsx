"use client";

import PageHeader from "@/components/shared/PageHeader";
import CategoryCard from "@/components/shared/CategoryCard";

const jewelleryCategories = [
  { title: "Chandraharams", href: "/products?category=chandraharams" },
  { title: "Black Beads", href: "/products?category=black-beads" },
  { title: "Bridal Set", href: "/products?category=bridal-set" },
  { title: "Bangles", href: "/products?category=bangles" },
  { title: "Earrings", href: "/products?category=earrings" },
  { title: "Hair Accessories", href: "/products?category=hair-accessories" },
  { title: "Neck Set", href: "/products?category=neck-set" },
  { title: "Anklets", href: "/products?category=anklets" },
  { title: "Bracelets", href: "/products?category=bracelets" },
  { title: "Hip Belts", href: "/products?category=hip-belts" },
  { title: "Invisible Chains", href: "/products?category=invisible-chains" },
];

export default function JewelleryCategoriesPage() {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader 
        title="Jewellery Collections" 
        description="Explore our wide range of exquisitely crafted artificial jewellery."
        breadcrumbs={[
          { label: "Collections", href: "/categories" },
          { label: "Jewellery", href: "/categories/jewellery" }
        ]}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {jewelleryCategories.map((cat, idx) => (
            <CategoryCard 
              key={idx} 
              title={cat.title} 
              href={cat.href} 
              imageSrc="" 
              count={0}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
