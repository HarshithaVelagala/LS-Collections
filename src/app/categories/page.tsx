"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import PageHeader from "@/components/shared/PageHeader";
import CategoryCard from "@/components/shared/CategoryCard";
import { Search } from "lucide-react";

const sareeCategories = [
  { title: "Banarasi", href: "/products?category=banarasi", imageSrc: "/images/categories/saree.png", count: 124 },
  { title: "Silk", href: "/products?category=silk", imageSrc: "/images/categories/saree.png", count: 98 },
  { title: "Cotton", href: "/products?category=cotton", imageSrc: "/images/categories/saree.png", count: 156 },
  { title: "Chiffon", href: "/products?category=chiffon", imageSrc: "/images/categories/saree.png", count: 45 },
  { title: "Georgette", href: "/products?category=georgette", imageSrc: "/images/categories/saree.png", count: 67 },
  { title: "Wedding", href: "/products?category=wedding", imageSrc: "/images/categories/saree.png", count: 210 },
  { title: "Party Wear", href: "/products?category=party-wear", imageSrc: "/images/categories/saree.png", count: 134 },
].map(c => ({ ...c, type: 'saree' }));

const jewelleryCategories = [
  { title: "Chandraharams", href: "/products?category=chandraharams", imageSrc: "/images/categories/jewellery.png", count: 45 },
  { title: "Black Beads", href: "/products?category=black-beads", imageSrc: "/images/categories/jewellery.png", count: 89 },
  { title: "Bridal Sets", href: "/products?category=bridal-set", imageSrc: "/images/categories/jewellery.png", count: 56 },
  { title: "Bangles", href: "/products?category=bangles", imageSrc: "/images/categories/jewellery.png", count: 112 },
  { title: "Earrings", href: "/products?category=earrings", imageSrc: "/images/categories/jewellery.png", count: 234 },
  { title: "Hair Accessories", href: "/products?category=hair-accessories", imageSrc: "/images/categories/jewellery.png", count: 34 },
  { title: "Neck Sets", href: "/products?category=neck-sets", imageSrc: "/images/categories/jewellery.png", count: 167 },
  { title: "Anklets", href: "/products?category=anklets", imageSrc: "/images/categories/jewellery.png", count: 78 },
  { title: "Bracelets", href: "/products?category=bracelets", imageSrc: "/images/categories/jewellery.png", count: 92 },
  { title: "Hip Belts", href: "/products?category=hip-belts", imageSrc: "/images/categories/jewellery.png", count: 41 },
  { title: "Invisible Chains", href: "/products?category=invisible-chains", imageSrc: "/images/categories/jewellery.png", count: 23 },
].map(c => ({ ...c, type: 'jewellery' }));

const allCategories = [...sareeCategories, ...jewelleryCategories];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function CategoriesPage() {
  const [activeFilter, setActiveFilter] = useState<'All' | 'Sarees' | 'Jewellery'>('All');
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = allCategories.filter(cat => {
    const matchesFilter =
      activeFilter === 'All' ||
      (activeFilter === 'Sarees' && cat.type === 'saree') ||
      (activeFilter === 'Jewellery' && cat.type === 'jewellery');

    const matchesSearch = cat.title.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Our Collections"
        description="Discover our meticulously curated collections of premium sarees and luxury jewellery."
        breadcrumbs={[
          { label: "Collections", href: "/categories" }
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 space-y-16">

        {/* Controls: Search and Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-purple-royal/20 pb-8">

          <div className="flex flex-wrap gap-4 justify-center">
            {['All', 'Sarees', 'Jewellery'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter as any)}
                className={`px-8 py-3 rounded-full text-xs font-serif tracking-widest uppercase transition-all duration-300 ${activeFilter === filter
                    ? 'bg-gold text-black font-semibold'
                    : 'bg-card text-muted-foreground hover:text-gold border border-border hover:border-gold/50'
                  }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80 group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-zinc-500 group-focus-within:text-gold transition-colors" />
            </div>
            <input
              type="text"
              placeholder="SEARCH CATEGORIES..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-card/80 border border-border text-foreground placeholder:text-muted-foreground text-xs font-serif tracking-widest uppercase py-3.5 pl-12 pr-4 rounded-full focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-all"
            />
          </div>

        </div>

        {/* Categories Grid */}
        {filteredCategories.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8"
          >
            {filteredCategories.map((cat, idx) => (
              <CategoryCard
                key={`${cat.title}-${idx}`}
                title={cat.title}
                href={cat.href}
                imageSrc={cat.imageSrc}
                count={cat.count}
              />
            ))}
          </motion.div>
        ) : (
          <div className="py-32 text-center">
            <h3 className="font-serif text-2xl text-gold tracking-widest uppercase mb-4">No Collections Found</h3>
            <p className="text-zinc-500 font-light">Please try adjusting your search terms or filters.</p>
          </div>
        )}

      </div>
    </div>
  );
}
