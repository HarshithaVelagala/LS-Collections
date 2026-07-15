import mongoose, { Schema, Document, Model } from "mongoose";

export interface INotification extends Document {
  userId: string; // User ID or "all" for broadcast
  title: string;
  message: string;
  type: "order_update" | "promotional" | "system";
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>({
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ["order_update", "promotional", "system"], default: "system" },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Notification: Model<INotification> = mongoose.models.Notification || mongoose.model<INotification>("Notification", NotificationSchema);
export default Notification;
