import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";

export async function POST() {
  try {
    await connectDB();

    const slug = "royal-ivory-silk";

    // 1. Define media array
    const newMedia = [
      { url: "/products/royal_ivory_silk_primary.png", type: "image" as const, alt: "Premium Royal Ivory Silk Saree Primary" },
      { url: "/products/royal_ivory_silk_angle.png", type: "image" as const, alt: "Premium Royal Ivory Silk Saree Angle" },
      { url: "/products/royal_ivory_silk_texture.png", type: "image" as const, alt: "Premium Royal Ivory Silk Saree Texture" },
      { url: "/products/royal_ivory_silk_close_up.png", type: "image" as const, alt: "Premium Royal Ivory Silk Saree Close Up" },
    ];

    // 2. Check if product already exists
    const existingProduct = await Product.findOne({ slug });

    if (existingProduct) {
      // UPDATE SCENARIO - Update gallery and primary image link in variants
      existingProduct.media = newMedia;
      if (existingProduct.variants && existingProduct.variants.length > 0) {
        existingProduct.variants[0].mediaIndices = [0, 1, 2, 3];
      }
      
      // Ensure visibility
      existingProduct.isActive = true;

      await existingProduct.save();

      return NextResponse.json({
        success: true,
        message: "Product 'royal-ivory-silk' already existed. Successfully updated gallery.",
        productId: existingProduct._id,
        action: "UPDATE"
      });
    }

    // INSERT SCENARIO
    // Fetch categories
    let sareeCategory = await Category.findOne({ slug: "saree" });
    if (!sareeCategory) {
      sareeCategory = await Category.create({ name: "Sarees", slug: "saree", parentCategory: null });
    }
    
    let subCategory = await Category.findOne({ slug: "pure-silk" });
    if (!subCategory) {
      subCategory = await Category.create({ name: "Pure Silk", slug: "pure-silk", parentCategory: sareeCategory._id });
    }

    const newProduct = {
      name: "Premium Royal Ivory Silk Saree",
      slug: "royal-ivory-silk",
      sku: "SAR-SILK-RIV-01",
      stock: 12,
      lowStockThreshold: 3,
      categoryId: sareeCategory._id,
      subcategoryId: subCategory._id,
      shortDescription: "Luxurious Royal Ivory Pure Silk saree with intricate traditional woven motifs and an antique gold zari border.",
      description: "Experience the grandeur of this premium Royal Ivory Pure Silk saree. Handcrafted with fine pure silk weave, rich natural sheen, intricate traditional woven motifs, and a grand antique gold zari border. The perfect royal drape.",
      basePrice: 18500,
      discountPrice: 15500,
      brand: "LS Collections",
      weight: 600,
      dimensions: { length: 32, width: 22, height: 6 },
      seo: {
        title: "Premium Royal Ivory Silk Saree | LS Collections",
        metaDescription: "Luxurious Royal Ivory Pure Silk saree with intricate traditional woven motifs and an antique gold zari border. Premium quality ethnic wear.",
        keywords: ["royal ivory silk saree", "pure silk saree", "luxury ethnic wear", "zari border"],
      },
      media: newMedia,
      category: "saree" as const,
      subCategory: "Pure Silk",
      tags: ["pure-silk", "royal-ivory", "premium", "saree", "zari"],
      variants: [
        {
          sku: "SAR-SILK-RIV-01-STD",
          attributes: { size: "Standard", material: "Pure Silk", color: "Royal Ivory" },
          price: 15500,
          stock: 12,
          mediaIndices: [0, 1, 2, 3],
        }
      ],
      personalization: { isEnabled: false, fields: [] },
      reviews: [],
      isTrending: true,
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: true,
      isActive: true, // Visible in Admin and Storefront
    };

    const insertedProduct = await Product.create(newProduct);

    return NextResponse.json({
      success: true,
      message: "Successfully created Premium Royal Ivory Silk Saree",
      productId: insertedProduct._id,
      action: "INSERT"
    });

  } catch (error: any) {
    console.error("Upsert product error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
