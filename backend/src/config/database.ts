import mongoose from 'mongoose';
import { DATABASE_URI } from './constants';

export const connectDB = async (): Promise<void> => {
  try {
    const connection = await mongoose.connect(DATABASE_URI, {
      // Fail fast so Render's health check and deploys do not hang on an
      // unreachable cluster. Values are overridable for slow networks.
      serverSelectionTimeoutMS: Number(process.env.MONGO_SERVER_SELECTION_TIMEOUT_MS ?? 10000),
      connectTimeoutMS: Number(process.env.MONGO_CONNECT_TIMEOUT_MS ?? 10000),
      socketTimeoutMS: Number(process.env.MONGO_SOCKET_TIMEOUT_MS ?? 45000),
      maxPoolSize: 10,
    });
    console.log(`MongoDB connected: ${connection.connection.host}/${connection.connection.name}`);
  } catch (error) {
    // Never log the connection string — it contains credentials.
    const reason = error instanceof Error ? error.message : 'unknown error';
    console.error('MongoDB connection failed:', reason);
    process.exit(1);
  }
};

export default DATABASE_URI;