import mongoose from 'mongoose';
import { DATABASE_URI } from './constants';

export const connectDB = async (): Promise<void> => {
  try {
    const connection = await mongoose.connect(DATABASE_URI);
    console.log(`MongoDB connected: ${connection.connection.host}/${connection.connection.name}`);
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};

export default DATABASE_URI;