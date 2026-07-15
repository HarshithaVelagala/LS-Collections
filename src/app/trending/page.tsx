import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import FilterSidebar from "@/components/products/FilterSidebar";
import ProductGrid from "@/components/products/ProductGrid";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { serializeProducts } from "@/lib/serialize";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

interface SearchParams {
  [key: string]: string | undefined;
}

interface TrendingPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function TrendingPage({ searchParams }: TrendingPageProps) {
  const query = await searchParams;
  await connectDB();

  // 1. Build DB Query filter
  const filterQuery: any = { isTrending: true };

  if (query.category) {
    filterQuery.category = query.category;
  }

  if (query.subCategory) {
    const subCategoriesArray = query.subCategory.split(",").map(s => s.trim());
    const orQueries = subCategoriesArray.map((sub) => {
      const exactRegex = new RegExp(`^${sub}$`, "i");
      const spaceRegex = new RegExp(`^${sub.replace(/[-_]+/g, " ")}$`, "i");
      const hyphenatedRegex = new RegExp(`^${sub.replace(/\s+/g, "-")}$`, "i");
      return {
        $or: [
          { subCategory: exactRegex },
          { subCategory: spaceRegex },
          { subCategory: hyphenatedRegex },
          { type: exactRegex },
          { type: spaceRegex },
          { type: hyphenatedRegex },
          { tags: exactRegex },
          { tags: spaceRegex },
          { tags: hyphenatedRegex }
        ],
      };
    });
    filterQuery.$and = filterQuery.$and || [];
    filterQuery.$and.push({ $or: orQueries.flatMap((o) => o.$or) });
  }

  if (query.minPrice || query.maxPrice) {
    filterQuery.basePrice = {};
    if (query.minPrice) filterQuery.basePrice.$gte = Number(query.minPrice);
    if (query.maxPrice) filterQuery.basePrice.$lte = Number(query.maxPrice);
  }

  // Handle dynamic attributes (e.g. attr_fabric, attr_color)
  Object.keys(query).forEach((key) => {
    if (key.startsWith("attr_") && query[key]) {
      const attrName = key.replace("attr_", "");
      const attrValues = query[key]!.split(",").map(val => val.trim());
      const valueRegexes = attrValues.map(val => new RegExp(`^${val}$`, "i"));
      
      filterQuery.$and = filterQuery.$and || [];
      const attributeOr: any[] = [
        { [attrName]: { $in: valueRegexes } },
        { [`attributes.${attrName}`]: { $in: attrValues } },
        { [`variants.attributes.${attrName}`]: { $in: attrValues } }
      ];

      // Cross-compatibility mappings
      if (attrName === "fabric") {
        attributeOr.push(
          { material: { $in: valueRegexes } },
          { [`attributes.material`]: { $in: attrValues } },
          { [`variants.attributes.material`]: { $in: attrValues } }
        );
      } else if (attrName === "material") {
        attributeOr.push(
          { fabric: { $in: valueRegexes } },
          { [`attributes.fabric`]: { $in: attrValues } },
          { [`variants.attributes.fabric`]: { $in: attrValues } }
        );
      }

      filterQuery.$and.push({ $or: attributeOr });
    }
  });

  // 2. Sorting
  let sortQuery: any = { createdAt: -1 }; // default Newest
  if (query.sort) {
    switch (query.sort) {
      case "price-asc":
        sortQuery = { basePrice: 1 };
        break;
      case "price-desc":
        sortQuery = { basePrice: -1 };
        break;
      case "newest":
        sortQuery = { createdAt: -1 };
        break;
      case "popular":
      default:
        sortQuery = { createdAt: -1 };
        break;
    }
  }

  // 3. Execute Query
  const rawProducts = await Product.find(filterQuery)
    .sort(sortQuery)
    .lean();

  const products = serializeProducts(rawProducts);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        
        {/* Page Header */}
        <div className="flex items-center justify-between border-b border-border pb-6 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-serif tracking-wider text-foreground font-bold uppercase">
              Trending Collection
            </h1>
            <p className="text-xs text-muted-foreground font-light mt-2 uppercase tracking-widest">
              {products.length} {products.length === 1 ? "Product" : "Products"} found
            </p>
          </div>
          
          {/* Mobile Filter Button */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger render={<Button variant="outline" className="bg-card border-primary text-primary hover:bg-section-bg uppercase text-xs tracking-widest font-bold transition-all">
                  <Filter className="mr-2 h-4 w-4" /> Filters
                </Button>}>
                <span className="sr-only">Open filters</span>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] border-r border-border bg-card p-0 text-foreground overflow-y-auto">
                <SheetHeader className="p-6 border-b border-border">
                  <SheetTitle className="text-left font-serif text-gold text-xl font-bold tracking-widest uppercase">
                    Refine By
                  </SheetTitle>
                </SheetHeader>
                <div className="p-6">
                  <FilterSidebar />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-28 border border-border bg-card p-6 rounded-sm shadow-sm">
              <FilterSidebar />
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            <ProductGrid products={products} />
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
