import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const category = formData.get("category") as string; // Optional category to return smart mockup URLs

    if (!file) {
      return NextResponse.json({ success: false, message: "No file uploaded." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // 1. Resilient Fallback: If Cloudinary keys are mock, return curated Unsplash placeholders
    const isMockCloudinary = 
      process.env.CLOUDINARY_API_KEY === "mock_key" || 
      !process.env.CLOUDINARY_API_KEY || 
      process.env.CLOUDINARY_API_KEY.includes("mock");

    if (isMockCloudinary) {
      // Return the base64 representation of the uploaded file
      const mimeType = file.type || "image/jpeg";
      const base64Data = buffer.toString("base64");
      const fallbackUrl = `data:${mimeType};base64,${base64Data}`;

      // Small artificial delay to simulate network latency
      await new Promise((resolve) => setTimeout(resolve, 500));

      return NextResponse.json({
        success: true,
        url: fallbackUrl,
        public_id: `mock_upload_${Date.now()}`,
      });
    }

    // 2. Real Cloudinary Upload Flow
    const uploadResult = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: "ls-collections" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    return NextResponse.json({
      success: true,
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
    });
  } catch (error: any) {
    console.error("Cloudinary Upload Error:", error);
    return NextResponse.json(
      { success: false, message: "Upload failed.", error: error.message },
      { status: 500 }
    );
  }
}
