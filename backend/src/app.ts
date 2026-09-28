import express, { type Application, type NextFunction, type Request, type Response } from 'express';
import path from 'path';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { ALLOWED_ORIGINS } from './config/constants';
import { AppError } from './utils/AppError';

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import serviceRoutes from './routes/service.routes';
import projectRoutes from './routes/project.routes';
import clientRoutes from './routes/client.routes';
import enquiryRoutes from './routes/enquiry.routes';
import mediaRoutes from './routes/media.routes';
import settingsRoutes from './routes/settings.routes';
import activityRoutes from './routes/activity.routes';

const app: Application = express();

app.disable('x-powered-by');
app.set('trust proxy', 1);

app.use(helmet());

const allowedOrigins = ALLOWED_ORIGINS;

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const cleaned = origin.replace(/\/$/, '');
      if (allowedOrigins.includes(cleaned)) {
        return callback(null, true);
      }
      return callback(new AppError('Not allowed by CORS', 403));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

app.use('/uploads/media', express.static(path.join(__dirname, '../uploads/media')));

app.use(
  '/api',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 200,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: 'Too many requests from this IP, please try again later.',
  })
);

app.use((req: Request, res: Response, next: NextFunction) => {
  const startedAt = Date.now();
  res.on('finish', () => {
    const durationMs = Date.now() - startedAt;
    const line = `${req.method} ${req.originalUrl} ${res.statusCode} ${durationMs}ms`;
    if (res.statusCode >= 500) {
      console.error(line);
    } else if (res.statusCode >= 400) {
      console.warn(line);
    } else {
      console.log(line);
    }
  });
  next();
});

app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({ success: true, message: 'KUN Glass & Aluminium API is healthy' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/activity-logs', activityRoutes);

app.use((req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(`Cannot find ${req.method} ${req.originalUrl} on this server`, 404));
});

const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message,
      code: err.code,
    });
    return;
  }

  if (err instanceof SyntaxError) {
    res.status(400).json({ success: false, status: 'fail', message: 'Invalid JSON payload' });
    return;
  }

  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, status: 'error', message: 'Internal server error' });
};

app.use(errorHandler);

export default app;