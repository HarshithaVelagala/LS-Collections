import bcrypt from "bcryptjs";

// Global cache objects for Next.js hot reload / dev environment
const globalAny = global as any;

// Helper to match values against Mongoose-like queries
function matchValue(item: any, key: string, queryVal: any): boolean {
  const getNestedValue = (obj: any, path: string): any => {
    return path.split('.').reduce((acc, part) => {
      if (acc && Array.isArray(acc)) {
        return acc.map(x => x?.[part]).filter(x => x !== undefined);
      }
      return acc?.[part];
    }, obj);
  };

  const itemVal = getNestedValue(item, key);

  const checkSingleValue = (val: any, qVal: any): boolean => {
    if (qVal instanceof RegExp) {
      return val ? qVal.test(val.toString()) : false;
    }
    if (qVal && typeof qVal === "object") {
      if (qVal.$in && Array.isArray(qVal.$in)) {
        return qVal.$in.some((x: any) => checkSingleValue(val, x));
      }
      if (qVal.$ne) {
        return val?.toString() !== qVal.$ne?.toString();
      }
      if (qVal.$gte !== undefined) {
        return Number(val) >= Number(qVal.$gte);
      }
      if (qVal.$lte !== undefined) {
        return Number(val) <= Number(qVal.$lte);
      }
    }
    return val === qVal || 
           val?.toString() === qVal?.toString() ||
           (val && val.toString().toLowerCase() === qVal?.toString().toLowerCase());
  };

  if (Array.isArray(itemVal)) {
    return itemVal.some(v => checkSingleValue(v, queryVal));
  }
  return checkSingleValue(itemVal, queryVal);
}

class MockQuery {
  private promise: Promise<any>;

  constructor(execFn: () => Promise<any>) {
    this.promise = execFn();
  }

  sort(sortObj: any) {
    this.promise = this.promise.then(data => {
      if (!Array.isArray(data)) return data;
      const sorted = [...data];
      const keys = Object.keys(sortObj);
      if (keys.length > 0) {
        const key = keys[0];
        const direction = sortObj[key];
        sorted.sort((a, b) => {
          let valA = a[key];
          let valB = b[key];
          if (key === "createdAt") {
            valA = new Date(valA).getTime();
            valB = new Date(valB).getTime();
          }
          if (valA < valB) return direction === 1 ? -1 : 1;
          if (valA > valB) return direction === 1 ? 1 : -1;
          return 0;
        });
      }
      return sorted;
    });
    return this;
  }

  limit(num: number) {
    this.promise = this.promise.then(data => {
      if (!Array.isArray(data)) return data;
      return data.slice(0, num);
    });
    return this;
  }

  select(fields: string) {
    return this;
  }

  populate(path: string, selectFields?: string) {
    this.promise = this.promise.then(data => {
      const populateItem = (item: any) => {
        if (!item) return item;
        const newItem = { ...item };
        if (path === "items.productId" && newItem.items && Array.isArray(newItem.items)) {
          newItem.items = newItem.items.map((orderItem: any) => {
            const prodId = orderItem.productId?._id || orderItem.productId;
            const prod = globalAny.mockProducts.find(
              (p: any) => p._id?.toString() === prodId?.toString()
            );
            if (prod) {
              let populatedProduct = { ...prod };
              if (selectFields) {
                const fields = selectFields.split(" ");
                const temp: any = {};
                fields.forEach(f => {
                  temp[f] = populatedProduct[f];
                });
                temp._id = populatedProduct._id;
                populatedProduct = temp;
              }
              return { ...orderItem, productId: populatedProduct };
            }
            return orderItem;
          });
        }
        return newItem;
      };

      if (Array.isArray(data)) {
        return data.map(populateItem);
      } else {
        return populateItem(data);
      }
    });
    return this;
  }

  lean() {
    return this.promise;
  }

  then(onfulfilled?: (value: any) => any, onrejected?: (reason: any) => any) {
    return this.promise.then(onfulfilled, onrejected);
  }
}

export class MockModel {
  private getStore: () => any[];
  private setStore: (val: any[]) => void;

  constructor(getStore: () => any[], setStore: (val: any[]) => void) {
    this.getStore = getStore;
    this.setStore = setStore;
  }

  private wrapInstance(item: any) {
    if (!item) return item;
    const self = this;
    return {
      ...item,
      _id: item._id || `id-${Math.random().toString(36).substr(2, 9)}`,
      toObject: function() {
        const obj = { ...this };
        delete (obj as any).save;
        delete (obj as any).toObject;
        return obj;
      },
      save: async function() {
        const store = self.getStore();
        const index = store.findIndex(x => x._id?.toString() === this._id?.toString());
        const plainData = { ...this };
        delete (plainData as any).save;
        delete (plainData as any).toObject;
        if (index !== -1) {
          store[index] = plainData;
        } else {
          store.push(plainData);
        }
        self.setStore(store);
        return self.wrapInstance(plainData);
      }
    };
  }

  find(filterQuery: any = {}) {
    return new MockQuery(async () => {
      let data = this.getStore();
      if (filterQuery && Object.keys(filterQuery).length > 0) {
        data = data.filter(item => {
          for (const key of Object.keys(filterQuery)) {
            const queryVal = filterQuery[key];
            if (key === "$or" && Array.isArray(queryVal)) {
              const matched = queryVal.some((subQuery: any) => {
                return Object.keys(subQuery).every(subKey => 
                  matchValue(item, subKey, subQuery[subKey])
                );
              });
              if (!matched) return false;
            } else if (key === "$and" && Array.isArray(queryVal)) {
              const matched = queryVal.every((subQuery: any) => {
                return Object.keys(subQuery).every(subKey => 
                  matchValue(item, subKey, subQuery[subKey])
                );
              });
              if (!matched) return false;
            } else {
              if (!matchValue(item, key, queryVal)) return false;
            }
          }
          return true;
        });
      }
      return data.map(item => this.wrapInstance(item));
    });
  }

  findOne(filterQuery: any = {}) {
    return new MockQuery(async () => {
      const results = await this.find(filterQuery).lean();
      return results.length > 0 ? this.wrapInstance(results[0]) : null;
    });
  }

  findById(id: any) {
    return new MockQuery(async () => {
      const store = this.getStore();
      const item = store.find(x => x._id?.toString() === id?.toString());
      return item ? this.wrapInstance(item) : null;
    });
  }

  async create(data: any) {
    const store = this.getStore();
    const items = Array.isArray(data) ? data : [data];
    const createdItems = items.map(x => {
      const newItem = {
        ...x,
        _id: x._id || `id-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: x.createdAt || new Date(),
        updatedAt: new Date()
      };
      store.push(newItem);
      return this.wrapInstance(newItem);
    });
    this.setStore(store);
    return Array.isArray(data) ? createdItems : createdItems[0];
  }

  async findByIdAndUpdate(id: any, updateData: any, options?: any) {
    const store = this.getStore();
    const index = store.findIndex(x => x._id?.toString() === id?.toString());
    if (index !== -1) {
      const baseUpdate = updateData.$set || updateData;
      store[index] = {
        ...store[index],
        ...baseUpdate,
        updatedAt: new Date()
      };
      this.setStore(store);
      return this.wrapInstance(store[index]);
    }
    return null;
  }

  async findByIdAndDelete(id: any) {
    const store = this.getStore();
    const index = store.findIndex(x => x._id?.toString() === id?.toString());
    if (index !== -1) {
      const deleted = store[index];
      store.splice(index, 1);
      this.setStore(store);
      return this.wrapInstance(deleted);
    }
    return null;
  }

  async countDocuments(filterQuery: any = {}) {
    const results = await this.find(filterQuery).lean();
    return results.length;
  }

  count(filterQuery: any = {}) {
    return this.countDocuments(filterQuery);
  }

  async insertMany(data: any[]) {
    return this.create(data);
  }
}

// Initial Data configuration
const initialCategories = [
  { _id: "cat-saree", name: "Sarees", slug: "saree", description: "Kanjeevaram, Banarasi & Luxury Silks", parentCategory: null, createdAt: new Date() },
  { _id: "cat-jewellery", name: "Jewellery", slug: "jewellery", description: "Kundan, Temple & Premium Chokers", parentCategory: null, createdAt: new Date() },
  { _id: "sub-kanjeevaram", name: "Kanjeevaram", slug: "kanjeevaram", parentCategory: "cat-saree", createdAt: new Date() },
  { _id: "sub-banarasi", name: "Banarasi", slug: "banarasi", parentCategory: "cat-saree", createdAt: new Date() },
  { _id: "sub-kundan", name: "Kundan", slug: "kundan", parentCategory: "cat-jewellery", createdAt: new Date() },
  { _id: "sub-temple", name: "Temple", slug: "temple", parentCategory: "cat-jewellery", createdAt: new Date() },
  { _id: "sub-linen", name: "Linen", slug: "linen", parentCategory: "cat-saree", createdAt: new Date() }
];

const initialCoupons = [
  { _id: "coupon-royalty", code: "LSROYALTY", discountType: "percentage", discountValue: 15, minPurchase: 5000, maxDiscount: 2000, expiryDate: new Date("2027-12-31"), isActive: true, createdAt: new Date() },
  { _id: "coupon-golden", code: "GOLDENDEAL", discountType: "fixed", discountValue: 1000, minPurchase: 8000, expiryDate: new Date("2027-12-31"), isActive: true, createdAt: new Date() }
];

const initialUsers = [
  {
    _id: "user-admin",
    name: "Admin User",
    firstName: "Admin",
    lastName: "User",
    email: "admin@ls.com",
    mobile: "9999999999",
    role: "admin",
    status: "active",
    passwordHash: bcrypt.hashSync("admin123", 10),
    addresses: [],
    createdAt: new Date()
  },
  {
    _id: "user-customer",
    name: "Alice Customer",
    firstName: "Alice",
    lastName: "Customer",
    email: "user@ls.com",
    mobile: "8888888888",
    role: "user",
    status: "active",
    passwordHash: bcrypt.hashSync("user123", 10),
    addresses: [],
    createdAt: new Date()
  }
];

const initialProducts = [
  {
    _id: "prod-beige-linen",
    name: "Elegant Beige Linen Saree",
    slug: "elegant-beige-linen-saree",
    sku: "SAR-LIN-BGE",
    stock: 15,
    lowStockThreshold: 5,
    categoryId: "cat-saree",
    subcategoryId: "sub-linen",
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
      { url: "/products/beige_linen_primary.png", type: "image", alt: "Elegant Beige Linen Saree front hero shot" },
      { url: "/products/beige_linen_angle.png", type: "image", alt: "Elegant Beige Linen Saree side draping angle" },
      { url: "/products/beige_linen_close_up.png", type: "image", alt: "Elegant Beige Linen Saree weaving detail close-up" },
      { url: "/products/beige_linen_texture.png", type: "image", alt: "Elegant Beige Linen Saree fabric texture and pleats" },
    ],
    category: "saree",
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
          fieldType: "select",
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
    createdAt: new Date()
  },
  {
    _id: "prod-purple-kanjeevaram",
    name: "Royal Velvet Purple Kanjeevaram Saree",
    slug: "royal-velvet-purple-kanjeevaram-saree",
    sku: "SAR-KANJ-PUR",
    stock: 20,
    lowStockThreshold: 10,
    categoryId: "cat-saree",
    subcategoryId: "sub-kanjeevaram",
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
      { url: "/products/purple_kanjeevaram.png", type: "image", alt: "Royal Kanjeevaram Saree model view" },
      { url: "/products/purple_kanjeevaram.png", type: "image", alt: "Close-up of gold zari border details" },
    ],
    category: "saree",
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
          fieldType: "select",
          isRequired: false,
          options: ["34 inches", "36 inches", "38 inches", "40 inches", "42 inches"],
          additionalCost: 0,
        },
        {
          fieldName: "Special Border Notes / Gift Wrapping Text",
          fieldType: "text",
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
    createdAt: new Date()
  },
  {
    _id: "prod-emerald-banarasi",
    name: "Gilded Emerald Banarasi Silk Saree",
    slug: "gilded-emerald-banarasi-silk-saree",
    sku: "SAR-BAN-EMD",
    stock: 8,
    lowStockThreshold: 10,
    categoryId: "cat-saree",
    subcategoryId: "sub-banarasi",
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
      { url: "/products/emerald_banarasi.png", type: "image", alt: "Emerald Banarasi Saree portrait view" },
    ],
    category: "saree",
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
    createdAt: new Date()
  },
  {
    _id: "prod-peach-cotton-silk",
    name: "Premium Peach Cotton Silk Saree",
    slug: "peach-cotton-silk",
    sku: "SAR-CTSLK-PCH-01",
    stock: 20,
    lowStockThreshold: 5,
    categoryId: "cat-saree",
    subcategoryId: "sub-linen",
    shortDescription: "Beautiful soft peach cotton silk saree with delicate floral motifs and a gold zari border.",
    description: "Experience the elegance of this premium peach cotton silk saree. Features an elegant antique gold zari border, delicate woven floral motifs and a refined premium fabric with a subtle silk sheen.",
    basePrice: 11500,
    discountPrice: 9500,
    brand: "LS Collections",
    weight: 500,
    dimensions: { length: 30, width: 22, height: 5 },
    seo: {
      title: "Premium Peach Cotton Silk Saree | LS Collections",
      metaDescription: "Beautiful soft peach cotton silk saree with delicate floral motifs and a gold zari border.",
      keywords: ["peach cotton silk saree", "cotton silk", "saree"],
    },
    media: [
      { url: "/products/peach_cotton_silk_primary.png", type: "image", alt: "Premium Peach Cotton Silk Saree Primary" },
      { url: "/products/peach_cotton_silk_angle.png", type: "image", alt: "Premium Peach Cotton Silk Saree Angle" },
      { url: "/products/peach_cotton_silk_texture.png", type: "image", alt: "Premium Peach Cotton Silk Saree Texture" },
      { url: "/products/peach_cotton_silk_close_up.png", type: "image", alt: "Premium Peach Cotton Silk Saree Close Up" },
    ],
    category: "saree",
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
    createdAt: new Date()
  },
  {
    _id: "prod-royal-ivory-silk",
    name: "Premium Royal Ivory Silk Saree",
    slug: "royal-ivory-silk",
    sku: "SAR-SILK-RIV-01",
    stock: 12,
    lowStockThreshold: 3,
    categoryId: "cat-saree",
    subcategoryId: "sub-kanjeevaram",
    shortDescription: "Luxurious Royal Ivory Pure Silk saree with intricate traditional woven motifs and an antique gold zari border.",
    description: "Experience the grandeur of this premium Royal Ivory Pure Silk saree. Handcrafted with fine pure silk weave, rich natural sheen, intricate traditional woven motifs, and a grand antique gold zari border.",
    basePrice: 18500,
    discountPrice: 15500,
    brand: "LS Collections",
    weight: 600,
    dimensions: { length: 32, width: 22, height: 6 },
    seo: {
      title: "Premium Royal Ivory Silk Saree | LS Collections",
      metaDescription: "Luxurious Royal Ivory Pure Silk saree with intricate traditional woven motifs.",
      keywords: ["royal ivory silk saree", "pure silk", "saree"],
    },
    media: [
      { url: "/products/royal_ivory_silk_primary.png", type: "image", alt: "Premium Royal Ivory Silk Saree Primary" },
      { url: "/products/royal_ivory_silk_angle.png", type: "image", alt: "Premium Royal Ivory Silk Saree Angle" },
      { url: "/products/royal_ivory_silk_texture.png", type: "image", alt: "Premium Royal Ivory Silk Saree Texture" },
      { url: "/products/royal_ivory_silk_close_up.png", type: "image", alt: "Premium Royal Ivory Silk Saree Close Up" },
    ],
    category: "saree",
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
    isActive: true,
    createdAt: new Date()
  },
  {
    _id: "prod-lavender-organza",
    name: "Premium Lavender Organza Saree",
    slug: "lavender-organza",
    sku: "SAR-ORG-LAV-01",
    stock: 15,
    lowStockThreshold: 5,
    categoryId: "cat-saree",
    subcategoryId: "sub-linen",
    shortDescription: "Beautiful soft lavender organza saree with delicate floral embroidery and a zari border.",
    description: "Experience the elegance of this premium lavender organza saree. Handcrafted with lightweight translucent organza fabric, subtle floral embroidery, and a refined zari border.",
    basePrice: 12500,
    discountPrice: 10500,
    brand: "LS Collections",
    weight: 450,
    dimensions: { length: 30, width: 22, height: 5 },
    seo: {
      title: "Premium Lavender Organza Saree | LS Collections",
      metaDescription: "Beautiful soft lavender organza saree with delicate floral embroidery.",
      keywords: ["lavender organza saree", "organza", "saree"],
    },
    media: [
      { url: "/products/lavender_organza_primary.png", type: "image", alt: "Premium Lavender Organza Saree Primary" },
      { url: "/products/lavender_organza_angle.png", type: "image", alt: "Premium Lavender Organza Saree Angle" },
      { url: "/products/lavender_organza_texture.png", type: "image", alt: "Premium Lavender Organza Saree Texture" },
      { url: "/products/lavender_organza_close_up.png", type: "image", alt: "Premium Lavender Organza Saree Close Up" },
    ],
    category: "saree",
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
    createdAt: new Date()
  },
  {
    _id: "prod-crimson-wedding",
    name: "Crimson Wedding Saree",
    slug: "crimson-wedding",
    sku: "SAR-WED-CRM-01",
    stock: 10,
    lowStockThreshold: 3,
    categoryId: "cat-saree",
    subcategoryId: "sub-kanjeevaram",
    shortDescription: "Beautiful crimson wedding saree with heavy traditional designs.",
    description: "Make your special day unforgettable with this exquisite crimson wedding saree, heavily detailed with classical patterns and rich border weaves.",
    basePrice: 16500,
    discountPrice: 14500,
    brand: "LS Collections",
    weight: 800,
    dimensions: { length: 32, width: 24, height: 6 },
    seo: {
      title: "Crimson Wedding Saree | LS Collections",
      metaDescription: "Exquisite crimson wedding saree for traditional elegance.",
      keywords: ["crimson saree", "wedding saree", "bridal wear"],
    },
    media: [
      { url: "/products/crimson_wedding_primary.png", type: "image", alt: "Crimson Wedding Saree Primary" },
      { url: "/products/crimson_wedding_angle.png", type: "image", alt: "Crimson Wedding Saree Angle" },
      { url: "/products/crimson_wedding_texture.png", type: "image", alt: "Crimson Wedding Saree Texture" },
      { url: "/products/crimson_wedding_close_up.png", type: "image", alt: "Crimson Wedding Saree Close Up" },
    ],
    category: "saree",
    subCategory: "Wedding",
    tags: ["wedding", "crimson", "saree", "bridal"],
    variants: [
      {
        sku: "SAR-WED-CRM-01-STD",
        attributes: { size: "Standard", material: "Pure Silk", color: "Crimson Red" },
        price: 14500,
        stock: 10,
        mediaIndices: [0, 1, 2, 3],
      }
    ],
    personalization: { isEnabled: false, fields: [] },
    reviews: [],
    isTrending: true,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    isActive: true,
    createdAt: new Date()
  },
  {
    _id: "prod-emerald-georgette",
    name: "Emerald Georgette Saree",
    slug: "emerald-georgette",
    sku: "SAR-GEO-EMD-01",
    stock: 18,
    lowStockThreshold: 4,
    categoryId: "cat-saree",
    subcategoryId: "sub-banarasi",
    shortDescription: "Elegant emerald green georgette saree.",
    description: "Lightweight and flowy georgette saree in a rich emerald green shade, perfect for parties and gatherings.",
    basePrice: 9800,
    discountPrice: 8200,
    brand: "LS Collections",
    weight: 480,
    dimensions: { length: 30, width: 22, height: 5 },
    seo: {
      title: "Emerald Georgette Saree | LS Collections",
      metaDescription: "Flowy emerald green georgette saree for luxury styling.",
      keywords: ["emerald georgette", "georgette saree", "green saree"],
    },
    media: [
      { url: "/products/emerald_georgette_primary.png", type: "image", alt: "Emerald Georgette Saree Primary" },
      { url: "/products/emerald_georgette_angle.png", type: "image", alt: "Emerald Georgette Saree Angle" },
      { url: "/products/emerald_georgette_texture.png", type: "image", alt: "Emerald Georgette Saree Texture" },
      { url: "/products/emerald_georgette_close_up.png", type: "image", alt: "Emerald Georgette Saree Close Up" },
    ],
    category: "saree",
    subCategory: "Georgette",
    tags: ["georgette", "emerald", "saree", "green"],
    variants: [
      {
        sku: "SAR-GEO-EMD-01-STD",
        attributes: { size: "Standard", material: "Georgette", color: "Emerald Green" },
        price: 8200,
        stock: 18,
        mediaIndices: [0, 1, 2, 3],
      }
    ],
    personalization: { isEnabled: false, fields: [] },
    reviews: [],
    isTrending: true,
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false,
    isActive: true,
    createdAt: new Date()
  },
  {
    _id: "prod-rose-pink-chiffon",
    name: "Rose Pink Chiffon Saree",
    slug: "rose-pink-chiffon",
    sku: "SAR-CHF-PNK-01",
    stock: 14,
    lowStockThreshold: 3,
    categoryId: "cat-saree",
    subcategoryId: "sub-linen",
    shortDescription: "Graceful rose pink chiffon saree with subtle shimmer.",
    description: "Soft, sheer rose pink chiffon saree with a delicate shimmer, lightweight design, and premium flow.",
    basePrice: 8900,
    discountPrice: 7500,
    brand: "LS Collections",
    weight: 420,
    dimensions: { length: 30, width: 22, height: 5 },
    seo: {
      title: "Rose Pink Chiffon Saree | LS Collections",
      metaDescription: "Delicate rose pink chiffon saree with subtle shimmer.",
      keywords: ["rose pink chiffon", "chiffon saree", "pink saree"],
    },
    media: [
      { url: "/products/rose_pink_chiffon_primary.png", type: "image", alt: "Rose Pink Chiffon Saree Primary" },
      { url: "/products/rose_pink_chiffon_angle.png", type: "image", alt: "Rose Pink Chiffon Saree Angle" },
      { url: "/products/rose_pink_chiffon_texture.png", type: "image", alt: "Rose Pink Chiffon Saree Texture" },
      { url: "/products/rose_pink_chiffon_close_up.png", type: "image", alt: "Rose Pink Chiffon Saree Close Up" },
    ],
    category: "saree",
    subCategory: "Chiffon",
    tags: ["chiffon", "rose-pink", "saree", "pink"],
    variants: [
      {
        sku: "SAR-CHF-PNK-01-STD",
        attributes: { size: "Standard", material: "Chiffon", color: "Rose Pink" },
        price: 7500,
        stock: 14,
        mediaIndices: [0, 1, 2, 3],
      }
    ],
    personalization: { isEnabled: false, fields: [] },
    reviews: [],
    isTrending: false,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: false,
    isActive: true,
    createdAt: new Date()
  },
  {
    _id: "prod-sky-blue-cotton",
    name: "Sky Blue Cotton Saree",
    slug: "sky-blue-cotton",
    sku: "SAR-COT-BLU-01",
    stock: 22,
    lowStockThreshold: 5,
    categoryId: "cat-saree",
    subcategoryId: "sub-linen",
    shortDescription: "Breezy sky blue cotton saree.",
    description: "Intricately woven sky blue cotton saree, providing ultimate comfort and elegant summer styling.",
    basePrice: 6500,
    discountPrice: 5200,
    brand: "LS Collections",
    weight: 480,
    dimensions: { length: 30, width: 22, height: 5 },
    seo: {
      title: "Sky Blue Cotton Saree | LS Collections",
      metaDescription: "Breezy comfort with our sky blue cotton saree.",
      keywords: ["sky blue cotton", "cotton saree", "blue saree"],
    },
    media: [
      { url: "/products/sky_blue_cotton_primary.png", type: "image", alt: "Sky Blue Cotton Saree Primary" },
      { url: "/products/sky_blue_cotton_angle.png", type: "image", alt: "Sky Blue Cotton Saree Angle" },
      { url: "/products/sky_blue_cotton_texture.png", type: "image", alt: "Sky Blue Cotton Saree Texture" },
      { url: "/products/sky_blue_cotton_close_up.png", type: "image", alt: "Sky Blue Cotton Saree Close Up" },
    ],
    category: "saree",
    subCategory: "Cotton",
    tags: ["cotton", "sky-blue", "saree", "comfort"],
    variants: [
      {
        sku: "SAR-COT-BLU-01-STD",
        attributes: { size: "Standard", material: "Cotton", color: "Sky Blue" },
        price: 5200,
        stock: 22,
        mediaIndices: [0, 1, 2, 3],
      }
    ],
    personalization: { isEnabled: false, fields: [] },
    reviews: [],
    isTrending: false,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    isActive: true,
    createdAt: new Date()
  },
  {
    _id: "prod-kundan-choker",
    name: "Royal Kundan Choker Bridal Jewellery Set",
    slug: "royal-kundan-choker-bridal-jewellery-set",
    sku: "JWL-KUN-CHOK",
    stock: 20,
    lowStockThreshold: 10,
    categoryId: "cat-jewellery",
    subcategoryId: "sub-kundan",
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
      { url: "/products/kundan_choker.png", type: "image", alt: "Royal Kundan Choker Set display" },
      { url: "/products/kundan_choker.png", type: "image", alt: "Close up of matching earrings" },
    ],
    category: "jewellery",
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
          fieldType: "text",
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
    createdAt: new Date()
  },
  {
    _id: "prod-temple-haram",
    name: "Temple Grace Antique Gold Lakshmi Haram",
    slug: "temple-grace-antique-gold-lakshmi-haram",
    sku: "JWL-TMP-HRM",
    stock: 12,
    lowStockThreshold: 10,
    categoryId: "cat-jewellery",
    subcategoryId: "sub-temple",
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
      { url: "/products/temple_haram.png", type: "image", alt: "Temple Haram display" },
    ],
    category: "jewellery",
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
    createdAt: new Date()
  },
  {
    _id: "prod-royal-antique-brass-alloy-temple-necklace",
    name: "Royal Antique Brass Alloy Temple Necklace",
    slug: "royal-antique-brass-alloy-temple-necklace",
    sku: "JWL-TMP-NEC-01",
    stock: 15,
    lowStockThreshold: 5,
    categoryId: "cat-jewellery",
    subcategoryId: "sub-temple",
    shortDescription: "Royal antique brass alloy temple necklace set.",
    description: "Detailed temple pattern brass alloy necklace with antique finishing.",
    basePrice: 4200,
    discountPrice: 3500,
    brand: "LS Ornaments",
    weight: 250,
    dimensions: { length: 15, width: 15, height: 5 },
    media: [{ url: "/products/royal_antique_brass_alloy_temple_necklace.png", type: "image", alt: "Royal Antique Brass Alloy Temple Necklace" }],
    category: "jewellery",
    subCategory: "Neck Sets",
    tags: ["temple", "necklace", "jewellery", "antique"],
    variants: [{ sku: "JWL-TMP-NEC-01-STD", attributes: { size: "Standard", material: "Brass Alloy", color: "Gold" }, price: 3500, stock: 15, mediaIndices: [0] }],
    reviews: [],
    isTrending: true,
    isFeatured: true,
    isActive: true,
    createdAt: new Date()
  },
  {
    _id: "prod-royal-antique-gold-bridal-bangles-set",
    name: "Royal Antique Gold Bridal Bangles Set",
    slug: "royal-antique-gold-bridal-bangles-set",
    sku: "JWL-BAN-GLD-01",
    stock: 12,
    lowStockThreshold: 3,
    categoryId: "cat-jewellery",
    subcategoryId: "sub-kundan",
    shortDescription: "Royal antique gold bridal bangles set.",
    description: "Stunning set of royal antique gold plated bridal bangles with detailed engravings.",
    basePrice: 3800,
    discountPrice: 3200,
    brand: "LS Ornaments",
    weight: 180,
    dimensions: { length: 10, width: 10, height: 5 },
    media: [{ url: "/products/royal_antique_gold_bridal_bangles_set.png", type: "image", alt: "Royal Antique Gold Bridal Bangles Set" }],
    category: "jewellery",
    subCategory: "Bangles",
    tags: ["bangles", "bridal", "jewellery", "antique-gold"],
    variants: [{ sku: "JWL-BAN-GLD-01-STD", attributes: { size: "Standard", material: "Gold Plated", color: "Gold" }, price: 3200, stock: 12, mediaIndices: [0] }],
    reviews: [],
    isTrending: true,
    isFeatured: true,
    isActive: true,
    createdAt: new Date()
  },
  {
    _id: "prod-royal-bridal-heritage-jewellery-set",
    name: "Royal Bridal Heritage Jewellery Set",
    slug: "royal-bridal-heritage-jewellery-set",
    sku: "JWL-SET-HER-01",
    stock: 8,
    lowStockThreshold: 2,
    categoryId: "cat-jewellery",
    subcategoryId: "sub-kundan",
    shortDescription: "Heritage royal bridal jewellery set.",
    description: "Magnificent bridal heritage set containing choker, long haram, and matching accessories.",
    basePrice: 18500,
    discountPrice: 15500,
    brand: "LS Ornaments",
    weight: 900,
    dimensions: { length: 25, width: 25, height: 10 },
    media: [{ url: "/products/royal_bridal_heritage_jewellery_set.png", type: "image", alt: "Royal Bridal Heritage Jewellery Set" }],
    category: "jewellery",
    subCategory: "Bridal Sets",
    tags: ["bridal", "set", "jewellery", "heritage"],
    variants: [{ sku: "JWL-SET-HER-01-STD", attributes: { size: "Standard", material: "Brass Gold Plated", color: "Gold" }, price: 15500, stock: 8, mediaIndices: [0] }],
    reviews: [],
    isTrending: true,
    isFeatured: true,
    isActive: true,
    createdAt: new Date()
  },
  {
    _id: "prod-royal-emerald-bridal-neck-set",
    name: "Royal Emerald Bridal Neck Set",
    slug: "royal-emerald-bridal-neck-set",
    sku: "JWL-NEC-EMD-01",
    stock: 10,
    lowStockThreshold: 3,
    categoryId: "cat-jewellery",
    subcategoryId: "sub-kundan",
    shortDescription: "Exquisite royal emerald bridal neck set.",
    description: "Studded with simulated emeralds and premium stones, a masterwork of bridal styling.",
    basePrice: 8500,
    discountPrice: 7200,
    brand: "LS Ornaments",
    weight: 380,
    dimensions: { length: 18, width: 18, height: 6 },
    media: [{ url: "/products/royal_emerald_bridal_neck_set.png", type: "image", alt: "Royal Emerald Bridal Neck Set" }],
    category: "jewellery",
    subCategory: "Neck Sets",
    tags: ["emerald", "bridal", "necklace", "jewellery"],
    variants: [{ sku: "JWL-NEC-EMD-01-STD", attributes: { size: "Standard", material: "Gold Plated", color: "Gold & Emerald Green" }, price: 7200, stock: 10, mediaIndices: [0] }],
    reviews: [],
    isTrending: true,
    isFeatured: true,
    isActive: true,
    createdAt: new Date()
  },
  {
    _id: "prod-royal-emerald-diamond-ring",
    name: "Royal Emerald Diamond Ring",
    slug: "royal-emerald-diamond-ring",
    sku: "JWL-RNG-EMD-01",
    stock: 30,
    lowStockThreshold: 5,
    categoryId: "cat-jewellery",
    subcategoryId: "sub-kundan",
    shortDescription: "Royal emerald diamond ring.",
    description: "Stunning simulated emerald and CZ diamond ring with gold plated finish.",
    basePrice: 2800,
    discountPrice: 2200,
    brand: "LS Ornaments",
    weight: 20,
    dimensions: { length: 5, width: 5, height: 3 },
    media: [{ url: "/products/royal_emerald_diamond_ring.png", type: "image", alt: "Royal Emerald Diamond Ring" }],
    category: "jewellery",
    subCategory: "Rings",
    tags: ["ring", "emerald", "diamond", "jewellery"],
    variants: [{ sku: "JWL-RNG-EMD-01-STD", attributes: { size: "Standard Adjustable", material: "Gold Plated", color: "Gold & Emerald" }, price: 2200, stock: 30, mediaIndices: [0] }],
    reviews: [],
    isTrending: false,
    isFeatured: true,
    isActive: true,
    createdAt: new Date()
  },
  {
    _id: "prod-royal-pearl-chandbali-earrings",
    name: "Royal Pearl Chandbali Earrings",
    slug: "royal-pearl-chandbali-earrings",
    sku: "JWL-EAR-PRL-01",
    stock: 25,
    lowStockThreshold: 5,
    categoryId: "cat-jewellery",
    subcategoryId: "sub-temple",
    shortDescription: "Exquisite royal pearl chandbali earrings.",
    description: "Classic traditional chandbali earrings decorated with fine pearls and gold plating.",
    basePrice: 2400,
    discountPrice: 1900,
    brand: "LS Ornaments",
    weight: 50,
    dimensions: { length: 8, width: 6, height: 2 },
    media: [{ url: "/products/royal_pearl_chandbali_earrings.png", type: "image", alt: "Royal Pearl Chandbali Earrings" }],
    category: "jewellery",
    subCategory: "Earrings",
    tags: ["earrings", "chandbali", "pearls", "jewellery"],
    variants: [{ sku: "JWL-EAR-PRL-01-STD", attributes: { size: "Standard", material: "Gold Plated", color: "Gold & Pearl" }, price: 1900, stock: 25, mediaIndices: [0] }],
    reviews: [],
    isTrending: true,
    isFeatured: true,
    isActive: true,
    createdAt: new Date()
  },
  {
    _id: "prod-royal-sterling-silver-diamond-pendant-set",
    name: "Royal Sterling Silver Diamond Pendant Set",
    slug: "royal-sterling-silver-diamond-pendant-set",
    sku: "JWL-PDT-SLV-01",
    stock: 15,
    lowStockThreshold: 4,
    categoryId: "cat-jewellery",
    subcategoryId: "sub-kundan",
    shortDescription: "Royal sterling silver diamond pendant set.",
    description: "Elegant 925 sterling silver chain and pendant studded with premium sparkling cubic zirconia diamonds.",
    basePrice: 4800,
    discountPrice: 3900,
    brand: "LS Ornaments",
    weight: 80,
    dimensions: { length: 12, width: 12, height: 4 },
    media: [{ url: "/products/royal_sterling_silver_diamond_pendant_set.png", type: "image", alt: "Royal Sterling Silver Diamond Pendant Set" }],
    category: "jewellery",
    subCategory: "Neck Sets",
    tags: ["pendant", "silver", "diamond", "jewellery"],
    variants: [{ sku: "JWL-PDT-SLV-01-STD", attributes: { size: "Standard", material: "Sterling Silver", color: "Silver" }, price: 3900, stock: 15, mediaIndices: [0] }],
    reviews: [],
    isTrending: false,
    isFeatured: true,
    isActive: true,
    createdAt: new Date()
  }
];

const initialOrders = [
  {
    _id: "ord-1",
    userId: "user-customer",
    items: [
      {
        productId: "prod-beige-linen",
        variantSku: "SAR-LIN-BGE-UNST",
        quantity: 1,
        price: 7200
      }
    ],
    totalAmount: 7200,
    discountAmount: 0,
    shippingAddress: {
      name: "Alice Customer",
      phone: "8888888888",
      addressLine: "123 luxury lane, Royal Gardens",
      city: "Bangalore",
      state: "Karnataka",
      zip: "560001"
    },
    paymentStatus: "paid",
    razorpayOrderId: "rzp_order_001",
    razorpayPaymentId: "pay_001",
    orderStatus: "delivered",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3) // 3 days ago
  },
  {
    _id: "ord-2",
    userId: "user-customer",
    items: [
      {
        productId: "prod-kundan-choker",
        variantSku: "JWL-KUN-CHOK-STD",
        quantity: 1,
        price: 5499
      }
    ],
    totalAmount: 5499,
    discountAmount: 500,
    shippingAddress: {
      name: "Alice Customer",
      phone: "8888888888",
      addressLine: "123 luxury lane, Royal Gardens",
      city: "Bangalore",
      state: "Karnataka",
      zip: "560001"
    },
    paymentStatus: "pending",
    orderStatus: "processing",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4) // 4 hours ago
  }
];

// Load collections into global memory to persist over dynamic operations/HMR
if (!globalAny.mockProducts) {
  globalAny.mockProducts = initialProducts;
} else {
  initialProducts.forEach(p => {
    if (!globalAny.mockProducts.some((x: any) => x.slug === p.slug)) {
      globalAny.mockProducts.push(p);
    }
  });
}
if (!globalAny.mockCategories) {
  globalAny.mockCategories = initialCategories;
} else {
  initialCategories.forEach(c => {
    if (!globalAny.mockCategories.some((x: any) => x.slug === c.slug)) {
      globalAny.mockCategories.push(c);
    }
  });
}
if (!globalAny.mockCoupons) {
  globalAny.mockCoupons = initialCoupons;
} else {
  initialCoupons.forEach(c => {
    if (!globalAny.mockCoupons.some((x: any) => x.code === c.code)) {
      globalAny.mockCoupons.push(c);
    }
  });
}
if (!globalAny.mockUsers) {
  globalAny.mockUsers = initialUsers;
} else {
  initialUsers.forEach(u => {
    if (!globalAny.mockUsers.some((x: any) => x.email === u.email)) {
      globalAny.mockUsers.push(u);
    }
  });
}
if (!globalAny.mockOrders) {
  globalAny.mockOrders = initialOrders;
}

export const mockProductModel = new MockModel(
  () => globalAny.mockProducts,
  (val) => { globalAny.mockProducts = val; }
);

export const mockCategoryModel = new MockModel(
  () => globalAny.mockCategories,
  (val) => { globalAny.mockCategories = val; }
);

export const mockCouponModel = new MockModel(
  () => globalAny.mockCoupons,
  (val) => { globalAny.mockCoupons = val; }
);

export const mockUserModel = new MockModel(
  () => globalAny.mockUsers,
  (val) => { globalAny.mockUsers = val; }
);

export const mockOrderModel = new MockModel(
  () => globalAny.mockOrders,
  (val) => { globalAny.mockOrders = val; }
);
