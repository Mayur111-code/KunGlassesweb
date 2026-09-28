import { type Request, type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { type IUser } from '../models/User';
import { AppError } from '../utils/AppError';
import { JWT, JWT_SECRET } from '../config/constants';

export interface AugmentedRequest extends Request {
  user?: IUser;
}

export const protect = async (
  req: AugmentedRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token && req.cookies && req.cookies[JWT.COOKIE_NAME]) {
      token = req.cookies[JWT.COOKIE_NAME];
    }

    if (!token) {
      throw new AppError('You are not logged in. Please log in to access this resource.', 401);
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

    const user = await User.findById(decoded.id);
    if (!user) {
      throw new AppError('The user belonging to this token no longer exists.', 401);
    }

    if (!user.isActive) {
      throw new AppError('Your account has been deactivated. Please contact an administrator.', 403);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError('Invalid token. Please log in again.', 401));
    } else if (error instanceof jwt.TokenExpiredError) {
      next(new AppError('Your token has expired. Please log in again.', 401));
    } else {
      next(new AppError('Authentication failed.', 401));
    }
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AugmentedRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError('You are not logged in.', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action.', 403)
      );
    }

    next();
  };
};
