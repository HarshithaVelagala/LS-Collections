import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProductMedia {
  url: string;
  type: "image" | "video";
  alt?: string;
}

export interface IProductVariant {
  sku: string;
  attributes: {
    color?: string;
    size?: string;
    material?: string;
    fabric?: string;
    type?: string;
  };
  price?: number;
  stock: number;
  mediaIndices?: number[];
}

export interface IPersonalizationField {
  fieldName: string;
  fieldType: "text" | "number" | "select";
  isRequired: boolean;
  options?: string[];
  additionalCost?: number;
}

export interface IProductReview {
  rating: number;
  comment: string;
  user: string;
  date: Date;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  sku?: string;
  stock?: number;
  lowStockThreshold?: number;
  categoryId?: mongoose.Types.ObjectId | null;
  subcategoryId?: mongoose.Types.ObjectId | null;
  shortDescription?: string;
  brand?: string;
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  description: string;
  basePrice: number;
  discountPrice?: number;
  seo?: {
    title?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  media: IProductMedia[];
  category: "saree" | "jewellery";
  subCategory?: string;
  fabric?: string;
  material?: string;
  type?: string;
  tags?: string[];
  variants: IProductVariant[];
  personalization?: {
    isEnabled: boolean;
    fields: IPersonalizationField[];
  };
  reviews: IProductReview[];
  isTrending: boolean;
  isFeatured: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isActive?: boolean;
  createdAt: Date;
}

const ProductMediaSchema = new Schema<IProductMedia>({
  url: { type: String, required: true },
  type: { type: String, enum: ["image", "video"], default: "image" },
  alt: { type: String },
});

const ProductVariantSchema = new Schema<IProductVariant>({
  sku: { type: String, required: true },
  attributes: {
    color: { type: String },
    size: { type: String },
    material: { type: String },
    fabric: { type: String },
    type: { type: String },
  },
  price: { type: Number },
  stock: { type: Number, default: 0 },
  mediaIndices: [{ type: Number }],
});

const PersonalizationFieldSchema = new Schema<IPersonalizationField>({
  fieldName: { type: String, required: true },
  fieldType: { type: String, enum: ["text", "number", "select"], required: true },
  isRequired: { type: Boolean, default: false },
  options: [{ type: String }],
  additionalCost: { type: Number, default: 0 },
});

const ProductReviewSchema = new Schema<IProductReview>({
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  user: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  sku: { type: String, unique: true, sparse: true, index: true },
  stock: { type: Number, default: 0 },
  lowStockThreshold: { type: Number, default: 10 },
  categoryId: { type: Schema.Types.ObjectId, ref: "Category", default: null },
  subcategoryId: { type: Schema.Types.ObjectId, ref: "Category", default: null },
  shortDescription: { type: String },
  brand: { type: String },
  weight: { type: Number },
  dimensions: {
    length: { type: Number },
    width: { type: Number },
    height: { type: Number },
  },
  description: { type: String, required: true },
  basePrice: { type: Number, required: true },
  discountPrice: { type: Number },
  seo: {
    title: { type: String },
    metaDescription: { type: String },
    keywords: [{ type: String }],
  },
  media: [ProductMediaSchema],
  category: { type: String, enum: ["saree", "jewellery"], required: true, index: true },
  subCategory: { type: String },
  fabric: { type: String },
  material: { type: String },
  type: { type: String },
  tags: [{ type: String }],
  variants: [ProductVariantSchema],
  personalization: {
    isEnabled: { type: Boolean, default: false },
    fields: [PersonalizationFieldSchema],
  },
  reviews: [ProductReviewSchema],
  isTrending: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
  isBestSeller: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
export default Product;
