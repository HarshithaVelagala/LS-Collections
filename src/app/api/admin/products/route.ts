import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { normalizeProductFields } from "@/lib/constants";

// Admin Product CRUD API
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      _id, 
      name, 
      slug, 
      sku, 
      stock, 
      lowStockThreshold, 
      categoryId, 
      subcategoryId, 
      shortDescription, 
      brand, 
      weight, 
      dimensions, 
      isNewArrival, 
      isBestSeller, 
      isActive,
      description, 
      basePrice, 
      discountPrice, 
      category, 
      subCategory, 
      tags, 
      variants, 
      personalization, 
      media 
    } = body;

    // Validate Required Fields
    if (!name || !category || !basePrice || !sku) {
      return NextResponse.json(
        { success: false, message: "Missing required fields: Product Name, Category, Selling Price, and SKU are mandatory." },
        { status: 400 }
      );
    }

    await connectDB();

    // Validate Unique SKU
    if (sku) {
      const existingProduct = await Product.findOne({ sku, _id: { $ne: _id } });
      if (existingProduct) {
        return NextResponse.json(
          { success: false, message: `SKU "${sku}" is already assigned to another product. SKU must be unique.` },
          { status: 400 }
        );
      }
    }

    const productData = normalizeProductFields({
      name,
      slug: slug ? slug.toLowerCase().trim().replace(/\s+/g, "-") : name.toLowerCase().trim().replace(/\s+/g, "-"),
      sku: sku.trim().toUpperCase(),
      stock: stock !== undefined ? Number(stock) : 0,
      lowStockThreshold: lowStockThreshold !== undefined ? Number(lowStockThreshold) : 10,
      categoryId: categoryId || null,
      subcategoryId: subcategoryId || null,
      shortDescription: shortDescription || "",
      brand: brand || "",
      weight: weight ? Number(weight) : undefined,
      dimensions: dimensions ? {
        length: dimensions.length ? Number(dimensions.length) : undefined,
        width: dimensions.width ? Number(dimensions.width) : undefined,
        height: dimensions.height ? Number(dimensions.height) : undefined,
      } : undefined,
      description: description || "",
      basePrice: Number(basePrice),
      discountPrice: discountPrice ? Number(discountPrice) : undefined,
      category,
      subCategory: subCategory || "",
      tags: typeof tags === "string" ? tags.split(",").map((t: string) => t.trim()).filter(Boolean) : tags || [],
      variants: variants || [],
      personalization: personalization || { isEnabled: false, fields: [] },
      media: media && media.length > 0 ? media : [{ url: category === "saree" ? "/banners/saree_banner_1.png" : "/banners/jewelry_banner_1.png", type: "image" }],
      isNewArrival: !!isNewArrival,
      isBestSeller: !!isBestSeller,
      isActive: isActive !== undefined ? !!isActive : true,
    });

    let product;
    if (_id) {
      // Update
      product = await Product.findByIdAndUpdate(_id, productData, { new: true });
    } else {
      // Create
      product = await Product.create(productData);
    }

    return NextResponse.json({
      success: true,
      message: _id ? "Product updated successfully!" : "Product created successfully!",
      product,
    });
  } catch (error: any) {
    console.error("Admin Product CRUD Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error.", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Missing product identifier ID parameter." },
        { status: 400 }
      );
    }

    await connectDB();

    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Product record not found in database." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully!",
    });
  } catch (error: any) {
    console.error("Admin Product Delete Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error.", error: error.message },
      { status: 500 }
    );
  }
}
