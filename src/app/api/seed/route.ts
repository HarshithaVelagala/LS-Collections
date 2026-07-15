import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Coupon from "@/models/Coupon";
import Category from "@/models/Category";
import { normalizeProductFields } from "@/lib/constants";

const mockCoupons = [
  {
    code: "LSRoyalty",
    discountType: "percentage" as const,
    discountValue: 15,
    minPurchase: 5000,
    maxDiscount: 2000,
    expiryDate: new Date("2027-12-31"),
    isActive: true,
  },
  {
    code: "GOLDENDEAL",
    discountType: "fixed" as const,
    discountValue: 1000,
    minPurchase: 8000,
    expiryDate: new Date("2027-12-31"),
    isActive: true,
  },
];

export async function GET() {
  try {
    await connectDB();

    // 1. Check existing counts
    const productCount = await Product.countDocuments();
    const couponCount = await Coupon.countDocuments();

    // 2. Seed Categories (Upsert strategy)
    let sareeParent = await Category.findOne({ slug: "saree" });
    if (!sareeParent) {
      sareeParent = await Category.create({
        name: "Sarees",
        slug: "saree",
        description: "Kanjeevaram, Banarasi & Luxury Silks",
        parentCategory: null
      });
    }

    let jewelleryParent = await Category.findOne({ slug: "jewellery" });
    if (!jewelleryParent) {
      jewelleryParent = await Category.create({
        name: "Jewellery",
        slug: "jewellery",
        description: "Kundan, Temple & Premium Chokers",
        parentCategory: null
      });
    }

    let kanjeevaramSub = await Category.findOne({ slug: "kanjeevaram" });
    if (!kanjeevaramSub) {
      kanjeevaramSub = await Category.create({
        name: "Kanjeevaram",
        slug: "kanjeevaram",
        parentCategory: sareeParent._id
      });
    }

    let banarasiSub = await Category.findOne({ slug: "banarasi" });
    if (!banarasiSub) {
      banarasiSub = await Category.create({
        name: "Banarasi",
        slug: "banarasi",
        parentCategory: sareeParent._id
      });
    }

    let kundanSub = await Category.findOne({ slug: "kundan" });
    if (!kundanSub) {
      kundanSub = await Category.create({
        name: "Kundan",
        slug: "kundan",
        parentCategory: jewelleryParent._id
      });
    }

    let templeSub = await Category.findOne({ slug: "temple" });
    if (!templeSub) {
      templeSub = await Category.create({
        name: "Temple",
        slug: "temple",
        parentCategory: jewelleryParent._id
      });
    }

    let linenSub = await Category.findOne({ slug: "linen" });
    if (!linenSub) {
      linenSub = await Category.create({
        name: "Linen",
        slug: "linen",
        parentCategory: sareeParent._id
      });
    }

    // 3. Define products with category and subcategory linked refs
    const mockProducts = [
      {
        name: "Elegant Beige Linen Saree",
        slug: "elegant-beige-linen-saree",
        sku: "SAR-LIN-BGE",
        stock: 15,
        lowStockThreshold: 5,
        categoryId: sareeParent._id,
        subcategoryId: linenSub._id,
        shortDescription: "Premium beige linen saree with minimal luxury design.",
        description: "Handcrafted from high-quality premium linen fabric, this elegant beige saree features a subtle minimal luxury design, clean drape, and detailed weaving. Perfect for an editorial luxury look.",
        basePrice: 8500,
        discountPrice: 7200,
        brand: "LS Heritage",
        weight: 600,
        dimensions: { length: 30, width: 22, height: 5 },
        seo: {
          title: "Elegant Beige Linen Saree | LS Collections",
          metaDescription: "Discover our premium linen saree in elegant beige with minimal luxury detailing. High-quality editorial design.",
          keywords: ["linen saree", "beige saree", "minimal luxury", "handloom saree"],
        },
        media: [
          { url: "/products/beige_linen_primary.png", type: "image" as const, alt: "Elegant Beige Linen Saree front hero shot" },
          { url: "/products/beige_linen_angle.png", type: "image" as const, alt: "Elegant Beige Linen Saree side draping angle" },
          { url: "/products/beige_linen_close_up.png", type: "image" as const, alt: "Elegant Beige Linen Saree weaving detail close-up" },
          { url: "/products/beige_linen_texture.png", type: "image" as const, alt: "Elegant Beige Linen Saree fabric texture and pleats" },
        ],
        category: "saree" as const,
        subCategory: "Linen",
        tags: ["linen", "minimal", "beige", "saree", "luxury"],
        variants: [
          {
            sku: "SAR-LIN-BGE-UNST",
            attributes: { size: "Standard (5.5m)", material: "Premium Linen", color: "Elegant Beige" },
            price: 7200,
            stock: 10,
            mediaIndices: [0, 1, 2, 3],
          },
          {
            sku: "SAR-LIN-BGE-STCH",
            attributes: { size: "Standard + Blouse Stitched", material: "Premium Linen", color: "Elegant Beige" },
            price: 8500,
            stock: 5,
            mediaIndices: [0, 1, 2, 3],
          },
        ],
        personalization: {
          isEnabled: true,
          fields: [
            {
              fieldName: "Custom Blouse Measurement (Chest Size)",
              fieldType: "select" as const,
              isRequired: false,
              options: ["34 inches", "36 inches", "38 inches", "40 inches", "42 inches"],
              additionalCost: 0,
            },
          ],
        },
        reviews: [
          {
            rating: 5,
            comment: "The linen is incredibly soft, and the beige shade is perfectly elegant. The subtle details are stunning.",
            user: "Meera Sen",
            date: new Date("2026-07-01"),
          },
        ],
        isTrending: true,
        isFeatured: true,
        isNewArrival: true,
        isBestSeller: true,
        isActive: true,
      },
      {
        name: "Royal Velvet Purple Kanjeevaram Saree",
        slug: "royal-velvet-purple-kanjeevaram-saree",
        sku: "SAR-KANJ-PUR",
        stock: 20,
        lowStockThreshold: 10,
        categoryId: sareeParent._id,
        subcategoryId: kanjeevaramSub._id,
        shortDescription: "Pure Mulberry silk royal purple Kanjeevaram saree with heavy antique gold zari.",
        description: "Handcrafted from pure Mulberry silk, this royal purple Kanjeevaram saree features a heavy antique gold zari border. Designed for traditional bridal grace and luxury aesthetics.",
        basePrice: 12500,
        discountPrice: 10999,
        brand: "LS Heritage",
        weight: 850,
        dimensions: { length: 32, width: 24, height: 6 },
        seo: {
          title: "Royal Purple Kanjeevaram Silk Saree | LS Collections",
          metaDescription: "Shop handcrafted pure Mulberry silk royal purple Kanjeevaram saree with heavy gold zari border. Absolute luxury wedding wear.",
          keywords: ["kanjeevaram saree", "silk saree", "purple saree", "wedding saree", "bridal silk"],
        },
        media: [
          { url: "/products/purple_kanjeevaram.png", type: "image" as const, alt: "Royal Kanjeevaram Saree model view" },
          { url: "/products/purple_kanjeevaram.png", type: "image" as const, alt: "Close-up of gold zari border details" },
        ],
        category: "saree" as const,
        subCategory: "Kanjeevaram",
        tags: ["bridal", "traditional", "silk", "heavy-zari", "purple"],
        variants: [
          {
            sku: "SAR-KANJ-PUR-UNST",
            attributes: { size: "Standard (5.5m)", material: "Mulberry Silk", color: "Royal Purple" },
            price: 10999,
            stock: 15,
            mediaIndices: [0],
          },
          {
            sku: "SAR-KANJ-PUR-STCH",
            attributes: { size: "Standard + Blouse Stitched", material: "Mulberry Silk", color: "Royal Purple" },
            price: 12499,
            stock: 5,
            mediaIndices: [0, 1],
          },
        ],
        personalization: {
          isEnabled: true,
          fields: [
            {
              fieldName: "Custom Blouse Measurement (Chest Size)",
              fieldType: "select" as const,
              isRequired: false,
              options: ["34 inches", "36 inches", "38 inches", "40 inches", "42 inches"],
              additionalCost: 0,
            },
            {
              fieldName: "Special Border Notes / Gift Wrapping Text",
              fieldType: "text" as const,
              isRequired: false,
              additionalCost: 150,
            },
          ],
        },
        reviews: [
          {
            rating: 5,
            comment: "Stunning craftsmanship. The royal purple has a beautiful sheen, and the gold border feels heavy and authentic.",
            user: "Amrita Dev",
            date: new Date("2026-06-15"),
          },
        ],
        isTrending: true,
        isFeatured: true,
        isNewArrival: true,
        isBestSeller: true,
        isActive: true,
      },
      {
        name: "Gilded Emerald Banarasi Silk Saree",
        slug: "gilded-emerald-banarasi-silk-saree",
        sku: "SAR-BAN-EMD",
        stock: 8,
        lowStockThreshold: 10,
        categoryId: sareeParent._id,
        subcategoryId: banarasiSub._id,
        shortDescription: "Traditional Banarasi silk drape in emerald green.",
        description: "An exquisite Banarasi silk drape in rich emerald green, woven with intricate floral golden bootis and an ornate pallu. Exemplifies centuries of weaving heritage.",
        basePrice: 15000,
        discountPrice: 13999,
        brand: "LS Heritage",
        weight: 900,
        dimensions: { length: 32, width: 24, height: 6 },
        seo: {
          title: "Gilded Emerald Green Banarasi Saree | LS Collections",
          metaDescription: "Discover luxury emerald green Banarasi silk saree woven with golden bootis. Premium traditional drape.",
          keywords: ["banarasi saree", "emerald green saree", "gold brocade", "woven saree"],
        },
        media: [
          { url: "/products/emerald_banarasi.png", type: "image" as const, alt: "Emerald Banarasi Saree portrait view" },
        ],
        category: "saree" as const,
        subCategory: "Banarasi",
        tags: ["traditional", "banarasi", "emerald", "gold-brocade"],
        variants: [
          {
            sku: "SAR-BAN-EMD-UNST",
            attributes: { size: "Standard (5.5m)", material: "Pure Banarasi Silk", color: "Emerald Green" },
            price: 13999,
            stock: 8,
            mediaIndices: [0],
          },
        ],
        reviews: [],
        isTrending: true,
        isFeatured: false,
        isNewArrival: true,
        isBestSeller: false,
        isActive: true,
      },
      {
        name: "Royal Kundan Choker Bridal Jewellery Set",
        slug: "royal-kundan-choker-bridal-jewellery-set",
        sku: "JWL-KUN-CHOK",
        stock: 20,
        lowStockThreshold: 10,
        categoryId: jewelleryParent._id,
        subcategoryId: kundanSub._id,
        shortDescription: "Handcrafted 24k gold-plated choker set with kundan stones and raw pearls.",
        description: "Handcrafted 24k gold-plated choker set studded with premium glass kundan stones and raw pearls. Features royal purple drops to match premium traditional outfits.",
        basePrice: 6500,
        discountPrice: 5499,
        brand: "LS Ornaments",
        weight: 350,
        dimensions: { length: 20, width: 20, height: 8 },
        seo: {
          title: "Kundan Choker Bridal Set Gold Plated | LS Collections",
          metaDescription: "Purchase handcrafted Kundan choker bridal necklace set with royal purple pearls. Premium artificial jewelry.",
          keywords: ["kundan choker", "bridal jewellery set", "gold plated necklace", "kundan set"],
        },
        media: [
          { url: "/products/kundan_choker.png", type: "image" as const, alt: "Royal Kundan Choker Set display" },
          { url: "/products/kundan_choker.png", type: "image" as const, alt: "Close up of matching earrings" },
        ],
        category: "jewellery" as const,
        subCategory: "Kundan",
        tags: ["kundan", "choker", "bridal", "pearls", "purple"],
        variants: [
          {
            sku: "JWL-KUN-CHOK-STD",
            attributes: { size: "Standard Adjustable", material: "Brass Gold Plated", color: "Gold & Royal Purple" },
            price: 5499,
            stock: 20,
            mediaIndices: [0, 1],
          },
        ],
        personalization: {
          isEnabled: true,
          fields: [
            {
              fieldName: "Engraving Text (Inside ring/pendant, max 10 chars)",
              fieldType: "text" as const,
              isRequired: false,
              additionalCost: 300,
            },
          ],
        },
        reviews: [
          {
            rating: 5,
            comment: "Absolutely breathtaking. The details on the Kundan stones are very neat, and the pearls look incredibly premium.",
            user: "Rhea Deshmukh",
            date: new Date("2026-06-20"),
          },
        ],
        isTrending: true,
        isFeatured: true,
        isNewArrival: false,
        isBestSeller: true,
        isActive: true,
      },
      {
        name: "Temple Grace Antique Gold Lakshmi Haram",
        slug: "temple-grace-antique-gold-lakshmi-haram",
        sku: "JWL-TMP-HRM",
        stock: 12,
        lowStockThreshold: 10,
        categoryId: jewelleryParent._id,
        subcategoryId: templeSub._id,
        shortDescription: "Statement antique finish long necklace with Lakshmi motifs.",
        description: "A statement antique finish long necklace featuring goddess Lakshmi motifs, intricately carved by master artisans. Highlighted by premium gold micro-plating.",
        basePrice: 5400,
        discountPrice: 4800,
        brand: "LS Ornaments",
        weight: 420,
        dimensions: { length: 24, width: 18, height: 8 },
        seo: {
          title: "Temple Lakshmi Haram Antique Gold Necklace | LS Collections",
          metaDescription: "Shop antique finish temple jewelry lakshmi haram long necklace set. Micro gold plated, highly detailed.",
          keywords: ["temple jewelry", "lakshmi haram", "antique gold necklace", "traditional jewellery"],
        },
        media: [
          { url: "/products/temple_haram.png", type: "image" as const, alt: "Temple Haram display" },
        ],
        category: "jewellery" as const,
        subCategory: "Temple",
        tags: ["traditional", "temple", "lakshmi", "antique-gold"],
        variants: [
          {
            sku: "JWL-TMP-HRM-STD",
            attributes: { size: "Standard Length", material: "Copper Alloy", color: "Antique Gold" },
            price: 4800,
            stock: 12,
            mediaIndices: [0],
          },
        ],
        reviews: [],
        isTrending: false,
        isFeatured: true,
        isNewArrival: false,
        isBestSeller: false,
        isActive: true,
      },
    ];

    // Seed mock data conditionally
    let seededProductsCount = 0;
    if (productCount === 0) {
      const normalizedProducts = mockProducts.map(p => normalizeProductFields(p));
      const insertedProducts = await Product.insertMany(normalizedProducts);
      seededProductsCount = insertedProducts.length;
    }

    let seededCouponsCount = 0;
    if (couponCount === 0) {
      const insertedCoupons = await Coupon.insertMany(mockCoupons);
      seededCouponsCount = insertedCoupons.length;
    }

    return NextResponse.json({
      success: true,
      message: productCount === 0
        ? "Database seeded successfully with categories and default products!"
        : "Database already has products. Existing products and categories preserved.",
      categoriesCount: await Category.countDocuments(),
      productsCount: await Product.countDocuments(),
      couponsCount: await Coupon.countDocuments(),
      seededProductsCount,
      seededCouponsCount,
    });
  } catch (error: any) {
    console.error("Database seeding error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to seed database.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
