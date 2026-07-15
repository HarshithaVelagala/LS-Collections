import { notFound } from "next/navigation";
import { Metadata } from "next";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import ProductDetailWrapper from "./ProductDetailWrapper";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { serialize, serializeProducts } from "@/lib/serialize";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

// 1. Dynamic SEO Metadata Generation for Product Detail Page
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  await connectDB();
  
  const product = await Product.findOne({ slug }).lean();
  if (!product) {
    return {
      title: "Product Not Found | LS Collections",
    };
  }

  const title = product.seo?.title || `${product.name} | LS Collections`;
  const description = product.seo?.metaDescription || product.description;
  const keywords = product.seo?.keywords || [product.name, product.category, "luxury shopping"];

  return {
    title,
    description,
    keywords,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.media && product.media[0] ? [{ url: product.media[0].url }] : [],
    },
  };
}

// 2. Main Page Render
export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  await connectDB();

  // Find product
  const rawProduct = await Product.findOne({ slug }).lean();
  if (!rawProduct) {
    notFound();
  }

  // Convert Mongoose Doc for client serialization
  const product = serialize(rawProduct);

  // Fetch related products (same category, excluding current product, up to 4 items)
  const rawRelated = await Product.find({
    category: product.category,
    _id: { $ne: rawProduct._id },
  })
    .limit(4)
    .lean();

  const relatedProducts = serializeProducts(rawRelated);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Sticky Navbar */}
      <Navbar />

      {/* Main product detail interactive module */}
      <main className="flex-grow">
        <ProductDetailWrapper product={product} relatedProducts={relatedProducts} />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
