import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";

export async function POST() {
  try {
    await connectDB();

    const slug = "peach-cotton-silk";

    // 1. Define media array
    const newMedia = [
      { url: "/products/peach_cotton_silk_primary.png", type: "image" as const, alt: "Premium Peach Cotton Silk Saree Primary" },
      { url: "/products/peach_cotton_silk_angle.png", type: "image" as const, alt: "Premium Peach Cotton Silk Saree Angle" },
      { url: "/products/peach_cotton_silk_texture.png", type: "image" as const, alt: "Premium Peach Cotton Silk Saree Texture" },
      { url: "/products/peach_cotton_silk_close_up.png", type: "image" as const, alt: "Premium Peach Cotton Silk Saree Close Up" },
    ];

    // 2. Check if product already exists
    const existingProduct = await Product.findOne({ slug });

    if (existingProduct) {
      // UPDATE SCENARIO
      existingProduct.media = newMedia;
      if (existingProduct.variants && existingProduct.variants.length > 0) {
        existingProduct.variants[0].mediaIndices = [0, 1, 2, 3];
      }
      await existingProduct.save();

      return NextResponse.json({
        success: true,
        message: "Product 'peach-cotton-silk' already existed. Successfully updated gallery.",
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
    
    let subCategory = await Category.findOne({ slug: "cotton-silk" });
    if (!subCategory) {
      subCategory = await Category.create({ name: "Cotton Silk", slug: "cotton-silk", parentCategory: sareeCategory._id });
    }

    const newProduct = {
      name: "Premium Peach Cotton Silk Saree",
      slug: "peach-cotton-silk",
      sku: "SAR-CTSLK-PCH-01",
      stock: 20,
      lowStockThreshold: 5,
      categoryId: sareeCategory._id,
      subcategoryId: subCategory._id,
      shortDescription: "Beautiful soft peach cotton silk saree with delicate floral motifs and a gold zari border.",
      description: "Experience the elegance of this premium peach cotton silk saree. Features an elegant antique gold zari border, delicate woven floral motifs and a refined premium fabric with a subtle silk sheen.",
      basePrice: 11500,
      discountPrice: 9500,
      brand: "LS Collections",
      weight: 500,
      dimensions: { length: 30, width: 22, height: 5 },
      seo: {
        title: "Premium Peach Cotton Silk Saree | LS Collections",
        metaDescription: "Beautiful soft peach cotton silk saree with delicate floral motifs and a gold zari border. Premium quality ethnic wear.",
        keywords: ["peach cotton silk saree", "cotton silk saree", "luxury ethnic wear", "floral motifs"],
      },
      media: newMedia,
      category: "saree" as const,
      subCategory: "Cotton Silk",
      tags: ["cotton-silk", "peach", "premium", "saree", "floral"],
      variants: [
        {
          sku: "SAR-CTSLK-PCH-01-STD",
          attributes: { size: "Standard", material: "Cotton Silk", color: "Soft Peach" },
          price: 9500,
          stock: 20,
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
      message: "Successfully created Premium Peach Cotton Silk Saree",
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
