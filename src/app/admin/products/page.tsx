import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { serialize, serializeProducts } from "@/lib/serialize";
import ProductsManager from "@/components/admin/ProductsManager";

export const metadata = {
  title: "Catalog Management | LS Collections Admin",
  description: "Manage sarees, jewellery, stock levels, and customization inputs.",
};

export default async function AdminProductsPage() {
  let products: any[] = [];
  let categories: any[] = [];

  try {
    await connectDB();
    
    // Fetch Products
    const rawProducts = await Product.find({}).sort({ createdAt: -1 }).lean();
    products = serializeProducts(rawProducts);

    // Fetch Categories (only parent categories)
    const rawCategories = await Category.find({ parentCategory: null }).lean();
    categories = serialize(rawCategories);
  } catch (error) {
    console.error("Products Admin Fetch Error:", error);
  }

  return <ProductsManager products={products} categories={categories} />;
}
