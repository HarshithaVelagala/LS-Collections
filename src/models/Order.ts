import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  variantSku?: string;
  quantity: number;
  price: number;
  personalizationInputs?: {
    fieldName: string;
    value: string;
  }[];
}

export interface IShippingAddress {
  name: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  zip: string;
}

export interface IOrder extends Document {
  userId: string;
  items: IOrderItem[];
  totalAmount: number;
  discountAmount: number;
  couponApplied?: mongoose.Types.ObjectId;
  shippingAddress: IShippingAddress;
  paymentStatus: "pending" | "paid" | "failed";
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  orderStatus: "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  variantSku: { type: String },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  personalizationInputs: [{
    fieldName: { type: String, required: true },
    value: { type: String, required: true },
  }],
});

const ShippingAddressSchema = new Schema<IShippingAddress>({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  addressLine: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true },
});

const OrderSchema = new Schema<IOrder>({
  userId: { type: String, required: true, index: true },
  items: [OrderItemSchema],
  totalAmount: { type: Number, required: true },
  discountAmount: { type: Number, default: 0 },
  couponApplied: { type: Schema.Types.ObjectId, ref: "Coupon" },
  shippingAddress: ShippingAddressSchema,
  paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  orderStatus: { type: String, enum: ["processing", "shipped", "delivered", "cancelled"], default: "processing" },
  createdAt: { type: Date, default: Date.now },
});

const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
export default Order;
