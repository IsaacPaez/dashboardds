import mongoose from 'mongoose';

// Import models to ensure they are registered
import '@/lib/models/Phone';

const MONGODB_URL = process.env.MONGODB_URL;
if (!MONGODB_URL) {
    throw new Error('Please define the MONGODB_URL environment variable');
}

interface Cached {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

const globalAny = global as unknown as { mongoose?: Cached };
const cached: Cached = globalAny.mongoose || { conn: null, promise: null };

async function dbConnect() {
  // If we already have a connection and it's ready, return it
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // If there's no promise yet, create one
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URL as string, {
      bufferCommands: false,
    });
  }

  // Wait for the connection to complete
  try {
    cached.conn = await cached.promise;
    globalAny.mongoose = cached;
    
    // Ensure connection is ready before returning
    if (mongoose.connection.readyState !== 1) {
      throw new Error('Database connection not ready');
    }
    
    return cached.conn;
  } catch (error) {
    // Reset the promise on error so we can retry
    cached.promise = null;
    cached.conn = null;
    throw error;
  }
}

export default dbConnect; 