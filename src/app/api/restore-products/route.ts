import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";

const titleCase = (str: string) => {
  return str.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const getCategoryDetails = (baseName: string) => {
  const jewelleryKeywords = ['necklace', 'bangles', 'jewellery', 'ring', 'earrings', 'pendant', 'choker', 'haram'];
  const isJewellery = jewelleryKeywords.some(kw => baseName.includes(kw));
  return {
    categorySlug: isJewellery ? 'jewellery' : 'saree',
    categoryName: isJewellery ? 'Jewellery' : 'Saree',
    subCategorySlug: isJewellery ? 'temple' : 'linen', // Default subcategories if none match
    subCategoryName: isJewellery ? 'Temple' : 'Linen'
  };
};

const generateMockProduct = (baseName: string, images: string[], categoryMap: any) => {
  const { categorySlug, categoryName, subCategorySlug, subCategoryName } = getCategoryDetails(baseName);
  let name = titleCase(baseName);
  if (categorySlug === 'saree' && !name.toLowerCase().includes('saree')) {
    name += ' Saree';
  }

  return {
    name,
    slug: baseName.replace(/_/g, '-'),
    sku: `PROD-${baseName.substring(0, 8).toUpperCase()}-${Math.floor(Math.random() * 1000)}`,
    stock: 20,
    lowStockThreshold: 5,
    categoryId: categoryMap[categorySlug]?._id,
    subcategoryId: categoryMap[subCategorySlug]?._id,
    shortDescription: `Beautiful ${name.toLowerCase()} for your collection.`,
    description: `Experience the elegance of this ${name.toLowerCase()}. Handcrafted with premium materials and exquisite detailing.`,
    basePrice: 10000,
    discountPrice: 8500,
    brand: "LS Collections",
    weight: 500,
    dimensions: { length: 30, width: 20, height: 5 },
    seo: {
      title: `${name} | LS Collections`,
      metaDescription: `Buy ${name.toLowerCase()} online. Premium quality.`,
      keywords: [name.toLowerCase(), categoryName.toLowerCase()],
    },
    media: images.map(img => ({ url: `/products/${img}`, type: "image", alt: name })),
    category: categorySlug,
    subCategory: subCategoryName,
    tags: [categorySlug, subCategorySlug, "premium"],
    variants: [
      {
        sku: `VAR-${baseName.substring(0, 8).toUpperCase()}-STD`,
        attributes: { size: "Standard" },
        price: 8500,
        stock: 20,
        mediaIndices: images.map((_, i) => i),
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
};

export async function GET() {
  return await handleRequest(false);
}

export async function POST() {
  return await handleRequest(true);
}

async function handleRequest(isPost: boolean) {
  try {
    await connectDB();

    // 1. Read files from public/products
    const productsDir = path.join(process.cwd(), "public/products");
    const files = fs.existsSync(productsDir) ? fs.readdirSync(productsDir) : [];
    
    // Group images by base product name
    const productGroups: Record<string, string[]> = {};
    files.forEach(file => {
      if (!file.endsWith('.png') && !file.endsWith('.jpg') && !file.endsWith('.jpeg')) return;
      
      let baseName = file.replace(/\.(png|jpg|jpeg)$/, '');
      // Remove common suffixes like _primary, _angle, _close_up, _texture
      baseName = baseName.replace(/(_primary|_angle|_close_up|_texture)$/, '');
      
      if (!productGroups[baseName]) {
        productGroups[baseName] = [];
      }
      productGroups[baseName].push(file);
    });

    const baseNames = Object.keys(productGroups);
    
    // 2. Query existing products
    const existingProducts = await Product.find({}, { slug: 1, media: 1 }).lean();
    const existingSlugs = new Set(existingProducts.map((p: any) => p.slug));
    
    // Also check if products exist based on media URL (if slug is different)
    const existingMediaUrls = new Set(
      existingProducts.flatMap((p: any) => p.media.map((m: any) => m.url.replace('/products/', '')))
    );

    const missingProductsToInsert: any[] = [];
    const productsSkipped: string[] = [];
    
    // Fetch categories to link correctly
    const categories = await Category.find({}).lean();
    const categoryMap: any = {};
    categories.forEach((c: any) => {
      categoryMap[c.slug] = c;
    });

    for (const baseName of baseNames) {
      const slug = baseName.replace(/_/g, '-');
      const images = productGroups[baseName];
      
      // Check if product already exists by slug or if its main image is already in DB
      const existsBySlug = existingSlugs.has(slug);
      const existsByMedia = images.some(img => existingMediaUrls.has(img));
      
      if (existsBySlug || existsByMedia) {
        productsSkipped.push(slug);
      } else {
        missingProductsToInsert.push(generateMockProduct(baseName, images, categoryMap));
      }
    }

    let insertedCount = 0;
    if (isPost && missingProductsToInsert.length > 0) {
      const result = await Product.insertMany(missingProductsToInsert);
      insertedCount = result.length;
    }

    return NextResponse.json({
      success: true,
      mode: isPost ? "POST (Insert)" : "GET (Preview)",
      summary: {
        imagesFound: files.length,
        uniqueProductsFoundFromImages: baseNames.length,
        existingProductsInDb: existingProducts.length,
        missingProductsCount: missingProductsToInsert.length,
        productsToBeInserted: missingProductsToInsert.map(p => p.slug),
        productsSkipped: productsSkipped,
        actuallyInsertedCount: insertedCount
      }
    });

  } catch (error: any) {
    console.error("Restore products error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
