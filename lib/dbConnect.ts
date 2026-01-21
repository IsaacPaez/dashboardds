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

  // If connection is currently connecting, wait for existing promise
  if (cached.promise) {
    try {
      cached.conn = await cached.promise;
      globalAny.mongoose = cached;
      
      // Wait a bit for connection to stabilize if needed
      if (mongoose.connection.readyState === 2) { // connecting
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      if (mongoose.connection.readyState === 1) {
        return cached.conn;
      }
    } catch (error) {
      // Reset on error and continue to retry
      cached.promise = null;
      cached.conn = null;
    }
  }

  // Create new connection
  const opts = {
    bufferCommands: false,
    maxPoolSize: 10,
    minPoolSize: 2,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  };
  
  cached.promise = mongoose.connect(MONGODB_URL as string, opts)
    .then((mongoose) => {
      console.log('✅ MongoDB connected successfully');
      return mongoose;
    })
    .catch((error) => {
      console.error('❌ MongoDB connection error:', error);
      cached.promise = null;
      throw error;
    });

  try {
    cached.conn = await cached.promise;
    globalAny.mongoose = cached;
    
    // Wait for connection to be fully ready with timeout
    const maxWait = 5000; // 5 seconds max
    const startTime = Date.now();
    
    while (mongoose.connection.readyState !== 1) {
      if (Date.now() - startTime > maxWait) {
        throw new Error('Database connection timeout - not ready after 5s');
      }
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    cached.conn = null;
    console.error('❌ Failed to establish MongoDB connection:', error);
    throw error;
  }
}

export default dbConnect; 