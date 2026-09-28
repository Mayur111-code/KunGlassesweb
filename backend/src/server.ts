import './config/env';
import mongoose from 'mongoose';
import app from './app';
import { connectDB } from './config/database';
import { RUNTIME_ENV, ALLOWED_ORIGINS } from './config/constants';

const rawPort = Number(process.env.PORT ?? 5000);
const PORT = Number.isInteger(rawPort) && rawPort > 0 ? rawPort : 5000;

const startServer = async (): Promise<void> => {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      // Logged explicitly because a mis-detected runtime mode is the single
      // most common cause of "login succeeds but every request is 401".
      console.log(
        `KUN Glass & Aluminium API listening on port ${PORT} (${RUNTIME_ENV})`
      );
      console.log(
        `Runtime: NODE_ENV=${process.env.NODE_ENV ?? '(unset)'} RENDER=${process.env.RENDER ?? '(unset)'} -> ${RUNTIME_ENV}`
      );
      console.log(`Auth cookie: SameSite=${RUNTIME_ENV === 'production' ? 'None; Secure' : 'Lax'}`);
      console.log(`Allowed origins: ${ALLOWED_ORIGINS.join(', ') || '(none)'}`);

      if (!process.env.PORT) {
        console.warn(
          'PORT was not provided by the platform; falling back to 5000. On Render this is unexpected.'
        );
      }
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