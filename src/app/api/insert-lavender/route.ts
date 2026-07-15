import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";

export async function POST() {
  try {
    await connectDB();

    const slug = "lavender-organza";

    // Check if it already exists
    const existingProduct = await Product.findOne({ slug });
    if (existingProduct) {
      return NextResponse.json({
        success: true,
        message: "Product with slug 'lavender-organza' already exists. Skipping insertion to prevent duplicates and modifications.",
        productId: existingProduct._id
      });
    }

    // Fetch categories
    let sareeCategory = await Category.findOne({ slug: "saree" });
    if (!sareeCategory) {
      sareeCategory = await Category.create({ name: "Sarees", slug: "saree", parentCategory: null });
    }
    
    // We don't have an exact "organza" subcategory in seed maybe, but we can create one if missing
    let organzaSub = await Category.findOne({ slug: "organza" });
    if (!organzaSub) {
      organzaSub = await Category.create({ name: "Organza", slug: "organza", parentCategory: sareeCategory._id });
    }

    const newProduct = {
      name: "Premium Lavender Organza Saree",
      slug: "lavender-organza",
      sku: "SAR-ORG-LAV-01",
      stock: 15,
      lowStockThreshold: 5,
      categoryId: sareeCategory._id,
      subcategoryId: organzaSub._id,
      shortDescription: "Beautiful soft lavender organza saree with delicate floral embroidery and a zari border.",
      description: "Experience the elegance of this premium lavender organza saree. Handcrafted with lightweight translucent organza fabric, subtle floral embroidery, and a refined zari border. Perfect for luxury ethnic wear.",
      basePrice: 12500,
      discountPrice: 10500,
      brand: "LS Collections",
      weight: 450,
      dimensions: { length: 30, width: 22, height: 5 },
      seo: {
        title: "Premium Lavender Organza Saree | LS Collections",
        metaDescription: "Beautiful soft lavender organza saree with delicate floral embroidery and a zari border. Perfect for luxury ethnic wear.",
        keywords: ["lavender organza saree", "organza saree", "luxury ethnic wear", "floral embroidery"],
      },
      media: [
        { url: "/products/lavender_organza_primary.png", type: "image" as const, alt: "Premium Lavender Organza Saree Primary" },
        { url: "/products/lavender_organza_angle.png", type: "image" as const, alt: "Premium Lavender Organza Saree Angle" },
        { url: "/products/lavender_organza_texture.png", type: "image" as const, alt: "Premium Lavender Organza Saree Texture" },
        { url: "/products/lavender_organza_close_up.png", type: "image" as const, alt: "Premium Lavender Organza Saree Close Up" },
      ],
      category: "saree" as const,
      subCategory: "Organza",
      tags: ["organza", "lavender", "premium", "saree", "floral"],
      variants: [
        {
          sku: "SAR-ORG-LAV-01-STD",
          attributes: { size: "Standard", material: "Translucent Organza", color: "Soft Lavender" },
          price: 10500,
          stock: 15,
          mediaIndices: [0, 1, 2, 3],
        }
      ],
      personalization: { isEnabled: false, fields: [] },
      reviews: [],
      isTrending: true,
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: false,
      isActive: true,
    };

    const insertedProduct = await Product.create(newProduct);

    return NextResponse.json({
      success: true,
      message: "Successfully inserted Premium Lavender Organza Saree",
      productId: insertedProduct._id
    });

  } catch (error: any) {
    console.error("Insert product error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
