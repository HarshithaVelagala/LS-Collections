import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export async function POST() {
  try {
    await connectDB();

    const slug = "lavender-organza";

    // 1. Find the product
    const product = await Product.findOne({ slug });

    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    // 2. Update media gallery
    const newMedia = [
      { url: "/products/lavender_organza_primary.png", type: "image" as const, alt: "Premium Lavender Organza Saree Primary" },
      { url: "/products/lavender_organza_angle.png", type: "image" as const, alt: "Premium Lavender Organza Saree Angle" },
      { url: "/products/lavender_organza_texture.png", type: "image" as const, alt: "Premium Lavender Organza Saree Texture" },
      { url: "/products/lavender_organza_close_up.png", type: "image" as const, alt: "Premium Lavender Organza Saree Close Up" },
    ];

    product.media = newMedia;

    // 3. Update variant indices to point to all media
    if (product.variants && product.variants.length > 0) {
      product.variants[0].mediaIndices = [0, 1, 2, 3];
    }

    await product.save();

    return NextResponse.json({
      success: true,
      message: "Successfully updated Lavender Organza gallery",
      productId: product._id
    });

  } catch (error: any) {
    console.error("Update product error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
