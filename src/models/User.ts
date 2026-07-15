import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUserAddress {
  id?: string;
  name: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  zip: string;
  isDefault: boolean;
}

export interface IUser extends Document {
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  mobile?: string;
  passwordHash?: string;
  role: "user" | "editor" | "admin" | "superadmin";
  status?: "active" | "suspended" | "inactive";
  addresses: IUserAddress[];
  createdAt: Date;
  updatedAt?: Date;
}

const UserAddressSchema = new Schema<IUserAddress>({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  addressLine: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
});

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, required: true, unique: true, index: true },
  mobile: { type: String, unique: true, sparse: true, index: true },
  passwordHash: { type: String },
  role: { type: String, enum: ["user", "editor", "admin", "superadmin"], default: "user" },
  status: { type: String, enum: ["active", "suspended", "inactive"], default: "active" },
  addresses: [UserAddressSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

import { mockUserModel } from "@/lib/mockDb";
const User: any = mockUserModel;
export default User;
