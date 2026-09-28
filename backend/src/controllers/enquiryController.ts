import { type Request, type Response, type NextFunction } from 'express';
import { Types } from 'mongoose';
import Enquiry, { type IEnquiry, type IEnquiryNote } from '../models/Enquiry';
import Service from '../models/Service';
import User from '../models/User';
import { AppError } from '../utils/AppError';
import { catchAsync } from '../utils/catchAsync';
import { sendAdminEnquiryNotification, sendCustomerConfirmation } from '../utils/emailService';
import { ENQUIRY_STATUS_LIST, PAGINATION, SORT, type EnquiryStatus } from '../config/constants';
import { type AugmentedRequest } from '../middleware/authMiddleware';
import { logActivity } from './activityLogController';

interface ListQuery {
  page?: string;
  limit?: string;
  status?: string;
  from?: string;
  to?: string;
  search?: string;
  assignedTo?: string;
  sort?: string;
}

const isValidObjectId = (value: string): boolean => Types.ObjectId.isValid(value);

const parsePagination = (query: ListQuery) => {
  const page = Math.max(parseInt(query.page ?? '', 10) || PAGINATION.DEFAULT_PAGE, 1);
  const limit = Math.min(
    Math.max(parseInt(query.limit ?? '', 10) || PAGINATION.DEFAULT_LIMIT, 1),
    PAGINATION.MAX_LIMIT
  );
  return { page, limit };
};

const buildSort = (sortField?: string): Record<string, 1 | -1> => {
  const field = sortField ?? SORT.DEFAULT_SORT_FIELD;
  return { [field]: SORT.DEFAULT_SORT_DIRECTION };
};

const isEnquiryStatus = (value: string): value is EnquiryStatus => {
  return (ENQUIRY_STATUS_LIST as readonly string[]).includes(value);
};

const addStatusActivity = (
  enquiry: IEnquiry,
  status: EnquiryStatus,
  actorName: string
): void => {
  const previousStatus = enquiry.status;
  enquiry.status = status;
  enquiry.notes.push({
    note: `Status changed from ${previousStatus} to ${status}.`,
    createdAt: new Date(),
  } as IEnquiryNote);
};

export const submitEnquiry = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const {
      fullName,
      phone,
      email,
      company,
      serviceInterestedIn,
      message,
      preferredContactMethod,
      location,
      source,
    } = req.body;

    let serviceName: string | undefined;
    let serviceId: Types.ObjectId | undefined;

    if (serviceInterestedIn) {
      if (isValidObjectId(serviceInterestedIn)) {
        const service = await Service.findById(serviceInterestedIn);
        if (service) {
          serviceId = service._id as Types.ObjectId;
          serviceName = service.title;
        }
      } else {
        serviceName = serviceInterestedIn as string;
      }
    }

    const enquiry = await Enquiry.create({
      fullName,
      phone,
      email: email?.toLowerCase() || undefined,
      company,
      serviceInterestedIn: serviceId,
      serviceInterestedInName: serviceName,
      message,
      preferredContactMethod: preferredContactMethod ?? 'phone',
      location,
      source: source ?? 'website',
    });

    const emailPayload = {
      name: fullName,
      email: email ?? '',
      phone,
      service: serviceName,
      message,
    };

    const emailPromises: Promise<void>[] = [];
    emailPromises.push(
      sendAdminEnquiryNotification(emailPayload).catch((error: Error) => {
        console.error('Failed to send admin notification email:', error);
      })
    );
    if (emailPayload.email) {
      emailPromises.push(
        sendCustomerConfirmation(emailPayload).catch((error: Error) => {
          console.error('Failed to send customer confirmation email:', error);
        })
      );
    }

    await Promise.allSettled(emailPromises);

    res.status(201).json({
      success: true,
      message:
        'Thank you! Your enquiry has been submitted. Our team will get in touch with you soon.',
      data: { enquiry: { _id: enquiry._id, name: enquiry.fullName, status: enquiry.status } },
    });
  }
);

export const getEnquiries = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { page, limit } = parsePagination(req.query);
  const { status, from, to, search, assignedTo, sort } = req.query;

  const filter: Record<string, unknown> = {};

  if (status && isEnquiryStatus(status as string)) {
    filter.status = status;
  }

  if (from || to) {
    filter.createdAt = {};
    if (from) {
      (filter.createdAt as Record<string, unknown>).$gte = new Date(from as string);
    }
    if (to) {
      (filter.createdAt as Record<string, unknown>).$lte = new Date(to as string);
    }
  }

  if (search) {
    filter.$or = [
      { fullName: { $regex: search as string, $options: 'i' } },
      { phone: { $regex: search as string, $options: 'i' } },
      { email: { $regex: search as string, $options: 'i' } },
      { company: { $regex: search as string, $options: 'i' } },
      { serviceInterestedInName: { $regex: search as string, $options: 'i' } },
      { message: { $regex: search as string, $options: 'i' } },
    ];
  }

  if (assignedTo) {
    if (assignedTo === 'none') {
      filter.assignedTo = { $exists: false };
    } else if (isValidObjectId(assignedTo as string)) {
      filter.assignedTo = new Types.ObjectId(assignedTo as string);
    }
  }

  const [total, enquiries] = await Promise.all([
    Enquiry.countDocuments(filter),
    Enquiry.find(filter)
      .populate('serviceInterestedIn', 'title slug')
      .populate('assignedTo', 'name email')
      .sort(buildSort(sort as string | undefined))
      .skip((page - 1) * limit)
      .limit(limit),
  ]);

  res.status(200).json({
    success: true,
    data: {
      items: enquiries,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    },
  });
});

export const getEnquiry = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const enquiry = await Enquiry.findById(req.params.id)
    .populate('serviceInterestedIn', 'title slug')
    .populate('assignedTo', 'name email')
    .populate('notes.addedBy', 'name email');

  if (!enquiry) {
    return next(new AppError('Enquiry not found.', 404));
  }

  res.status(200).json({
    success: true,
    data: { enquiry },
  });
});

export const updateEnquiry = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) {
      return next(new AppError('Enquiry not found.', 404));
    }

    const allowedFields = [
      'fullName',
      'phone',
      'email',
      'company',
      'serviceInterestedInName',
      'message',
      'preferredContactMethod',
      'location',
      'source',
      'status',
      'assignedTo',
      'followUpDate',
    ] as const;

    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        (enquiry as unknown as Record<string, unknown>)[key] = req.body[key];
      }
    }

    if (req.body.serviceInterestedIn !== undefined) {
      if (req.body.serviceInterestedIn && isValidObjectId(req.body.serviceInterestedIn)) {
        const service = await Service.findById(req.body.serviceInterestedIn);
        if (service) {
          enquiry.serviceInterestedIn = service._id as Types.ObjectId;
          enquiry.serviceInterestedInName = service.title;
        }
      }
    }

    await enquiry.save();

    const populated = await enquiry.populate('serviceInterestedIn', 'title slug');

    res.status(200).json({
      success: true,
      data: { enquiry: populated },
    });
  }
);

export const updateEnquiryStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { status } = req.body;

    if (!status || !isEnquiryStatus(status)) {
      return next(new AppError('Invalid enquiry status.', 400));
    }

    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) {
      return next(new AppError('Enquiry not found.', 404));
    }

    const actor = (req as AugmentedRequest).user;
    const actorName = actor?.name ?? 'Admin';

    addStatusActivity(enquiry, status, actorName);

    await enquiry.save();

    if (actor) {
      await logActivity(actor._id.toString(), 'UPDATE', 'Enquiry', enquiry._id.toString(), {
        metadata: {
          field: 'status',
          newStatus: status,
          message: `Enquiry status set to ${status}`,
        },
      }).catch((error: Error) => console.error('Failed to log activity:', error));
    }

    res.status(200).json({
      success: true,
      data: { enquiry },
    });
  }
);

export const addEnquiryNote = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { note } = req.body;

    if (!note || typeof note !== 'string' || !note.trim()) {
      return next(new AppError('Note is required.', 400));
    }

    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) {
      return next(new AppError('Enquiry not found.', 404));
    }

    const actor = (req as AugmentedRequest).user;
    const addedBy = actor?._id;

    enquiry.notes.push({
      note: note.trim(),
      addedBy,
      createdAt: new Date(),
    });

    await enquiry.save();

    if (actor) {
      await logActivity(actor._id.toString(), 'CREATE', 'EnquiryNote', enquiry._id.toString(), {
        metadata: { message: 'Note added to enquiry' },
      }).catch((error: Error) => console.error('Failed to log activity:', error));
    }

    const populated = await enquiry.populate('notes.addedBy', 'name email');

    res.status(201).json({
      success: true,
      data: { enquiry: populated },
    });
  }
);

export const assignEnquiry = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { userId } = req.body;

    if (!userId || !isValidObjectId(userId)) {
      return next(new AppError('A valid userId is required.', 400));
    }

    const user = await User.findById(userId);
    if (!user) {
      return next(new AppError('User not found.', 404));
    }

    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) {
      return next(new AppError('Enquiry not found.', 404));
    }

    enquiry.assignedTo = user._id as Types.ObjectId;
    enquiry.notes.push({
      note: `Enquiry assigned to ${user.name}.`,
      addedBy: (req as AugmentedRequest).user?._id,
      createdAt: new Date(),
    });

    await enquiry.save();

    const populated = await enquiry.populate('assignedTo', 'name email');

    res.status(200).json({
      success: true,
      data: { enquiry: populated },
    });
  }
);

export const deleteEnquiry = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  const { confirm } = req.query;

  if (confirm !== 'true') {
    return next(new AppError('Deletion requires confirmation. Pass ?confirm=true to proceed.', 400));
  }

  const enquiry = await Enquiry.findByIdAndDelete(id);
  if (!enquiry) {
    return next(new AppError('Enquiry not found.', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Enquiry deleted successfully.',
  });
});

export const getEnquiryStats = catchAsync(async (_req: Request, res: Response): Promise<void> => {
  const pipeline = [
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ];

  const results = await Enquiry.aggregate<{ _id: string; count: number }>(pipeline);

  const statusCounts: Record<string, number> = {};
  for (const status of ENQUIRY_STATUS_LIST as readonly string[]) {
    statusCounts[status] = 0;
  }

  let total = 0;
  for (const result of results) {
    statusCounts[result._id] = result.count;
    total += result.count;
  }

  res.status(200).json({
    success: true,
    data: {
      total,
      byStatus: statusCounts,
    },
  });
});