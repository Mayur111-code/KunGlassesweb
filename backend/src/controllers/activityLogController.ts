import { type Request, type Response } from 'express';
import { Types } from 'mongoose';
import { catchAsync } from '../utils/catchAsync';
import { PAGINATION } from '../config/constants';
import { type AugmentedRequest } from '../middleware/authMiddleware';
import { ActivityLog } from '../models/ActivityLog';

interface LogActivityOptions {
  metadata?: Record<string, unknown>;
  actorName?: string;
  actorRole?: string;
  ip?: string;
  userAgent?: string;
  entityName?: string;
}

export const logActivity = async (
  adminId: string,
  action: string,
  entity: string,
  entityId?: unknown,
  options: LogActivityOptions = {}
): Promise<void> => {
  try {
    await ActivityLog.create({
      admin: new Types.ObjectId(adminId),
      adminName: options.actorName ?? '',
      action,
      entity,
      entityId,
      entityName: options.entityName ?? '',
      metadata: options.metadata ?? {},
    });
  } catch (error) {
    console.error('Failed to write activity log:', error);
  }
};

const logActivityFromRequest = (
  req: AugmentedRequest,
  action: string,
  entity: string,
  entityId?: unknown,
  metadata?: Record<string, unknown>,
  entityName?: string
): Promise<void> => {
  return logActivity(
    req.user?._id?.toString() ?? 'unknown',
    action,
    entity,
    entityId,
    {
      metadata,
      actorName: req.user?.name,
      actorRole: req.user?.role,
      ip: req.ip ?? req.socket?.remoteAddress,
      userAgent: req.headers['user-agent'],
      entityName,
    }
  );
};

export const buildLogMiddleware = (
  action: string,
  entity: string,
  entityNameGetter?: (req: Request) => string | undefined,
  entityIdGetter?: (req: Request) => unknown
) => {
  return (req: Request, res: Response, next: (err?: unknown) => void): void => {
    logActivityFromRequest(
      req as AugmentedRequest,
      action,
      entity,
      entityIdGetter?.(req),
      undefined,
      entityNameGetter?.(req)
    ).catch((error: Error) => console.error('Failed to log activity:', error));
    next();
  };
};

export const getActivityLogs = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const page = Math.max(parseInt(req.query.page as string ?? '', 10) || PAGINATION.DEFAULT_PAGE, 1);
    const limit = Math.min(
      Math.max(parseInt(req.query.limit as string ?? '', 10) || PAGINATION.DEFAULT_LIMIT, 1),
      PAGINATION.MAX_LIMIT
    );

    const filter: Record<string, unknown> = {};
    if (req.query.action) filter.action = req.query.action;
    if (req.query.entity) filter.entity = req.query.entity;
    if (req.query.entityId) filter.entityId = req.query.entityId;
    if (req.query.q) {
      filter.$or = [
        { action: { $regex: String(req.query.q), $options: 'i' } },
        { entityName: { $regex: String(req.query.q), $options: 'i' } },
        { adminName: { $regex: String(req.query.q), $options: 'i' } },
      ];
    }

    const mongoFilter = Object.fromEntries(
      Object.entries(filter).filter(([, value]) => value !== undefined)
    );

    const [total, items] = await Promise.all([
      ActivityLog.countDocuments(mongoFilter),
      ActivityLog.find(mongoFilter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
    ]);

    res.status(200).json({
      success: true,
      data: {
        items,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit) || 1,
        },
      },
    });
  }
);