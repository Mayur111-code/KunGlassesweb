import './config/env';
import mongoose from 'mongoose';
import app from './app';
import { connectDB } from './config/database';

const rawPort = Number(process.env.PORT ?? 5000);
const PORT = Number.isInteger(rawPort) && rawPort > 0 ? rawPort : 5000;

const startServer = async (): Promise<void> => {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(
        `KUN Glass & Aluminium API listening on port ${PORT} (${process.env.NODE_ENV ?? 'development'})`
      );
    });

    const shutdown = (signal: NodeJS.Signals): void => {
      console.log(`${signal} received, shutting down gracefully...`);
      server.close(() => {
        void mongoose.connection.close().finally(() => process.exit(0));
      });
      setTimeout(() => process.exit(1), 10000).unref();
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

void startServer();