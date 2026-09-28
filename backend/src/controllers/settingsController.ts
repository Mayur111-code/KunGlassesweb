import { type Request, type Response, type NextFunction } from 'express';
import SiteSettings from '../models/SiteSettings';
import ContactMethod from '../models/ContactMethod';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';
import { type AugmentedRequest } from '../middleware/authMiddleware';
import { logActivity } from './activityLogController';

export const getSettings = catchAsync(async (_req: Request, res: Response): Promise<void> => {
  const [settings, contactMethods] = await Promise.all([
    SiteSettings.getSettings(),
    ContactMethod.find({ isActive: true }).sort({ type: 1, displayOrder: 1 }),
  ]);

  res.status(200).json({
    success: true,
    data: {
      settings,
      contactMethods,
    },
  });
});

export const getSettingsAdmin = catchAsync(async (_req: Request, res: Response): Promise<void> => {
  const [settings, contactMethods] = await Promise.all([
    SiteSettings.getSettings(),
    ContactMethod.find().sort({ type: 1, displayOrder: 1 }),
  ]);

  res.status(200).json({
    success: true,
    data: {
      settings,
      contactMethods,
    },
  });
});

export const updateSettings = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const existing = await SiteSettings.getSettings();

  for (const key of Object.keys(req.body)) {
    if (key === 'contactMethods') continue;
    if ((req.body as Record<string, unknown>)[key] !== undefined) {
      (existing as unknown as Record<string, unknown>)[key] = (req.body as Record<string, unknown>)[key];
    }
  }

  await existing.save();

  const settings = await SiteSettings.getSettings();

  res.status(200).json({
    success: true,
    message: 'Settings updated successfully.',
    data: { settings },
  });
});

const CONTACT_TYPE_VALUES = ['phone', 'whatsapp', 'email'] as const;
type ContactType = (typeof CONTACT_TYPE_VALUES)[number];

const isContactType = (value: string): value is ContactType =>
  (CONTACT_TYPE_VALUES as readonly string[]).includes(value);

export const createContactMethod = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { type, value, label, isPrimary = false } = req.body;

    if (!type || !isContactType(type)) {
      return next(new AppError('Type must be phone, whatsapp or email.', 400));
    }
    if (!value || typeof value !== 'string' || !value.trim()) {
      return next(new AppError('Value is required for the contact method.', 400));
    }

    const displayOrder = req.body.displayOrder ?? 0;

    const contactMethod = await ContactMethod.create({
      type,
      value: value.trim(),
      label: label?.trim() || (type === 'email' ? 'Email' : type === 'whatsapp' ? 'WhatsApp' : 'Phone'),
      isPrimary,
      isActive: req.body.isActive ?? true,
      displayOrder,
    });

    if (isPrimary) {
      await ContactMethod.updateMany(
        { type, _id: { $ne: contactMethod._id } },
        { $set: { isPrimary: false } }
      );
    }

    const actor = (req as AugmentedRequest).user;
    if (actor) {
      await logActivity(actor._id.toString(), 'CREATE', 'ContactMethod', contactMethod._id.toString(), {
        metadata: { type, value: contactMethod.value },
      }).catch((error: Error) => console.error('Failed to log activity:', error));
    }

    res.status(201).json({ success: true, data: { contactMethod } });
  }
);

export const updateContactMethod = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const contactMethod = await ContactMethod.findById(req.params.id);
    if (!contactMethod) {
      return next(new AppError('Contact method not found.', 404));
    }

    for (const key of ['type', 'value', 'label', 'isActive', 'displayOrder']) {
      if (req.body[key] !== undefined) {
        (contactMethod as unknown as Record<string, unknown>)[key] = req.body[key];
      }
    }

    if (req.body.isPrimary === true) {
      contactMethod.isPrimary = true;
      await ContactMethod.updateMany(
        { type: contactMethod.type, _id: { $ne: contactMethod._id } },
        { $set: { isPrimary: false } }
      );
    } else if (req.body.isPrimary === false && req.body.isPrimarySetter === true) {
      contactMethod.isPrimary = false;
    }

    await contactMethod.save();

    const actor = (req as AugmentedRequest).user;
    if (actor) {
      await logActivity(actor._id.toString(), 'UPDATE', 'ContactMethod', contactMethod._id.toString(), {
        metadata: { type: contactMethod.type, value: contactMethod.value },
      }).catch((error: Error) => console.error('Failed to log activity:', error));
    }

    res.status(200).json({ success: true, data: { contactMethod } });
  }
);

export const setPrimaryContactMethod = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const contactMethod = await ContactMethod.findById(req.params.id);
    if (!contactMethod) {
      return next(new AppError('Contact method not found.', 404));
    }

    contactMethod.isPrimary = true;
    contactMethod.isActive = true;
    await contactMethod.save();

    await ContactMethod.updateMany(
      { type: contactMethod.type, _id: { $ne: contactMethod._id } },
      { $set: { isPrimary: false } }
    );

    const actor = (req as AugmentedRequest).user;
    if (actor) {
      await logActivity(actor._id.toString(), 'UPDATE', 'ContactMethod', contactMethod._id.toString(), {
        metadata: { action: 'set-primary', type: contactMethod.type },
      }).catch((error: Error) => console.error('Failed to log activity:', error));
    }

    res.status(200).json({ success: true, message: 'Set as primary.', data: { contactMethod } });
  }
);

export const deleteContactMethod = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const contactMethod = await ContactMethod.findById(req.params.id);
    if (!contactMethod) {
      return next(new AppError('Contact method not found.', 404));
    }

    if (contactMethod.isPrimary) {
      await ContactMethod.updateMany(
        { type: contactMethod.type, _id: { $ne: contactMethod._id } },
        { $set: { isPrimary: true, isActive: true } }
      ).sort({ displayOrder: 1 });
    }

    await contactMethod.deleteOne();

    const actor = (req as AugmentedRequest).user;
    if (actor) {
      await logActivity(actor._id.toString(), 'DELETE', 'ContactMethod', req.params.id, {
        metadata: { type: contactMethod.type, value: contactMethod.value },
      }).catch((error: Error) => console.error('Failed to log activity:', error));
    }

    res.status(200).json({ success: true, message: 'Contact method deleted.', data: {} });
  }
);