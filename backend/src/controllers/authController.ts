import { type Request, type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { type IUser } from '../models/User';
import { AppError } from '../utils/AppError';
import { catchAsync } from '../utils/catchAsync';
import { JWT, JWT_SECRET, AUTH_COOKIE_OPTIONS } from '../config/constants';
import { type AugmentedRequest } from '../middleware/authMiddleware';

interface FailedAttempts {
  count: number;
  lastAttempt: number;
}

const failedAttempts = new Map<string, FailedAttempts>();

const MAX_FAILED_ATTEMPTS = 10;
const LOCKOUT_WINDOW_MS = 15 * 60 * 1000;

const getIpKey = (req: Request): string => {
  const ip = req.ip ?? req.socket?.remoteAddress ?? 'unknown';
  const email = (req.body?.email as string | undefined)?.toLowerCase() ?? 'unknown';
  return `${ip}:${email}`;
};

const isLockedOut = (key: string): boolean => {
  const entry = failedAttempts.get(key);
  if (!entry) return false;
  if (entry.count >= MAX_FAILED_ATTEMPTS) {
    if (Date.now() - entry.lastAttempt < LOCKOUT_WINDOW_MS) return true;
    failedAttempts.delete(key);
  }
  return false;
};

const recordFailedAttempt = (key: string): void => {
  const entry = failedAttempts.get(key) ?? { count: 0, lastAttempt: 0 };
  entry.count += 1;
  entry.lastAttempt = Date.now();
  failedAttempts.set(key, entry);
};

const clearFailedAttempts = (key: string): void => {
  failedAttempts.delete(key);
};

const signToken = (userId: string): string => {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: JWT.EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
};

const setAuthCookie = (res: Response, token: string): void => {
  const maxAge = JWT.COOKIE_EXPIRES_IN_DAYS * 24 * 60 * 60 * 1000;
  res.cookie(JWT.COOKIE_NAME, token, {
    ...AUTH_COOKIE_OPTIONS,
    maxAge,
  });
};

const createSendToken = (user: IUser, statusCode: number, res: Response): void => {
  const token = signToken(user._id.toString());
  setAuthCookie(res, token);

  const userJson = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar ?? undefined,
    isActive: user.isActive,
    lastLogin: user.lastLogin ?? undefined,
    createdAt: user.createdAt,
  };

  res.status(statusCode).json({
    success: true,
    data: {
      user: userJson,
    },
  });
};

export const login = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password.', 400));
  }

  const key = getIpKey(req);
  if (isLockedOut(key)) {
    return next(
      new AppError(
        `Too many failed login attempts. Please try again after ${(LOCKOUT_WINDOW_MS / 60000).toFixed(0)} minutes.`,
        429
      )
    );
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  if (!user || !user.isActive || !(await user.comparePassword(password))) {
    recordFailedAttempt(key);
    return next(new AppError('Invalid email or password.', 401));
  }

  clearFailedAttempts(key);

  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  createSendToken(user, 200, res);
});

export const logout = catchAsync(async (_req: Request, res: Response): Promise<void> => {
  res.clearCookie(JWT.COOKIE_NAME, { ...AUTH_COOKIE_OPTIONS });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
});

export const me = catchAsync(async (req: AugmentedRequest, res: Response, next: NextFunction): Promise<void> => {
  if (!req.user) {
    return next(new AppError('You are not logged in.', 401));
  }

  res.status(200).json({
    success: true,
    data: {
      user: req.user,
    },
  });
});

export const changePassword = catchAsync(async (req: AugmentedRequest, res: Response, next: NextFunction): Promise<void> => {
  if (!req.user) {
    return next(new AppError('You are not logged in.', 401));
  }

  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return next(new AppError('Current password and new password are required.', 400));
  }

  const user = await User.findById(req.user._id).select('+password');
  if (!user) {
    return next(new AppError('User not found.', 404));
  }

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    return next(new AppError('Your current password is incorrect.', 401));
  }

  if (currentPassword === newPassword) {
    return next(new AppError('New password must be different from the current password.', 400));
  }

  user.password = newPassword;
  await user.save();

  const token = signToken(user._id.toString());
  setAuthCookie(res, token);

  res.status(200).json({
    success: true,
    message: 'Password changed successfully.',
  });
});