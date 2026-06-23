import mongoose from "mongoose";
import { MongoClient } from "mongodb";
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    // Not throwing at import time so the app can build without secrets,
    // but any DB call will surface this clearly.
    console.warn("[db] MONGODB_URI is not set — database features are disabled.");
}
const cached = global._mongoose ?? { conn: null, promise: null };
global._mongoose = cached;
export async function connectDB() {
    if (!MONGODB_URI)
        throw new Error("MONGODB_URI is not configured.");
    if (cached.conn)
        return cached.conn;
    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false });
    }
    cached.conn = await cached.promise;
    return cached.conn;
}
// ─── Native client promise (for @auth/mongodb-adapter) ───────
let clientPromise;
if (MONGODB_URI) {
    if (process.env.NODE_ENV === "development") {
        if (!global._mongoClientPromise) {
            global._mongoClientPromise = new MongoClient(MONGODB_URI).connect();
        }
        clientPromise = global._mongoClientPromise;
    }
    else {
        clientPromise = new MongoClient(MONGODB_URI).connect();
    }
}
export { clientPromise };
