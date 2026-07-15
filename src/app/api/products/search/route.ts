import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { serialize } from "@/lib/serialize";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.trim() === "") {
      return NextResponse.json({ success: true, products: [] });
    }

    await connectDB();

    // Regex for case-insensitive partial match
    const regex = new RegExp(query, "i");

    // Search in name, category, or subCategory
    const products = await Product.find({
      $or: [
        { name: regex },
        { category: regex },
        { subCategory: regex },
      ]
    })
    .select("_id name slug basePrice discountPrice media category") // limit data
    .limit(5)
    .lean();

    return NextResponse.json({ success: true, products: serialize(products) });
  } catch (error: any) {
    console.error("Search API Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
