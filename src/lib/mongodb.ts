import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Extend global namespace to avoid TypeScript errors in hot-reloads
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

const cached = global.mongoose || (global.mongoose = { conn: null, promise: null });

async function connectDB() {
  // Database connection completely bypassed for offline/mock mode
  return null;
}

export default connectDB;
