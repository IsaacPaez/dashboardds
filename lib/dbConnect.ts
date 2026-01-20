import mongoose from 'mongoose';

// Import models to ensure they are registered
import '@/lib/models/Phone';
import '@/lib/models/PageContent';

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
    const opts = {
      bufferCommands: false,
    };
    
    cached.promise = mongoose.connect(MONGODB_URL as string, opts)
      .then((mongoose) => {
        console.log('✅ MongoDB connected successfully');
        return mongoose;
      })
      .catch((error) => {
        console.error('❌ MongoDB connection error:', error);
        cached.promise = null; // Reset on error
        throw error;
      });
  }

  // Wait for the connection to complete
  try {
    cached.conn = await cached.promise;
    globalAny.mongoose = cached;
    
    // Ensure connection is ready before returning
    if (mongoose.connection.readyState !== 1) {
      console.error('❌ MongoDB connection state:', mongoose.connection.readyState);
      throw new Error('Database connection not ready');
    }
    
    return cached.conn;
  } catch (error) {
    // Reset the promise and connection on error so we can retry
    cached.promise = null;
    cached.conn = null;
    console.error('❌ Failed to establish MongoDB connection:', error);
    throw error;
  }
}

export default dbConnect; 