import { type Request, type Response, type NextFunction } from 'express';
import slugify from 'slugify';
import Service, { type IService } from '../models/Service';
import { AppError } from '../utils/AppError';
import { catchAsync } from '../utils/catchAsync';
import { PAGINATION, SORT } from '../config/constants';
import { type AugmentedRequest } from '../middleware/authMiddleware';

interface ListQuery {
  page?: string;
  limit?: string;
  search?: string;
  isActive?: string;
  isFeatured?: string;
  sort?: string;
}

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
  return field === 'displayOrder' ? { [field]: 1 } : { [field]: SORT.DEFAULT_SORT_DIRECTION };
};

export const getServicesPublic = catchAsync(async (_req: Request, res: Response): Promise<void> => {
  const services = await Service.find({ isActive: true }).sort({ displayOrder: 1, title: 1 });

  res.status(200).json({
    success: true,
    data: services,
  });
});

export const getServices = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { page, limit } = parsePagination(req.query);
  const { search, isActive, isFeatured, sort } = req.query;

  const filter: Record<string, unknown> = {};

  if (search) {
    filter.title = { $regex: search as string, $options: 'i' };
  }

  if (isActive === 'true' || isActive === 'false') {
    filter.isActive = isActive === 'true';
  }

  if (isFeatured === 'true' || isFeatured === 'false') {
    filter.isFeatured = isFeatured === 'true';
  }

  const [total, services] = await Promise.all([
    Service.countDocuments(filter),
    Service.find(filter)
      .sort(buildSort(sort as string | undefined))
      .skip((page - 1) * limit)
      .limit(limit),
  ]);

  res.status(200).json({
    success: true,
    data: {
      items: services,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    },
  });
});

export const getServiceBySlug = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { slug } = req.params;

    const service = await Service.findOne({ slug });

    if (!service) {
      return next(new AppError('Service not found.', 404));
    }

    const isPublic = service.isActive;
    const isAuthenticated = !!(req as AugmentedRequest).user;

    if (!isPublic && !isAuthenticated) {
      return next(new AppError('Service not found.', 404));
    }

    res.status(200).json({
      success: true,
      data: { service },
    });
  }
);

export const createService = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const {
    title,
    slug,
    shortDescription,
    description,
    featuredImage,
    gallery,
    features,
    specifications,
    isActive,
    isFeatured,
    displayOrder,
    seoTitle,
    seoDescription,
  } = req.body;

  const generatedSlug = slug ?? slugify(title, { lower: true, strict: true });

  const existing = await Service.findOne({ slug: generatedSlug });
  if (existing) {
    return next(new AppError('A service with this slug already exists.', 409));
  }

  const service = await Service.create({
    title,
    slug: generatedSlug,
    shortDescription,
    description,
    featuredImage,
    gallery: Array.isArray(gallery) ? gallery : [],
    features: Array.isArray(features) ? features : [],
    specifications: Array.isArray(specifications) ? specifications : [],
    isActive: isActive ?? true,
    isFeatured: isFeatured ?? false,
    displayOrder: displayOrder ?? 0,
    seoTitle,
    seoDescription,
  });

  res.status(201).json({
    success: true,
    data: { service },
  });
});

export const updateService = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const service = await Service.findById(req.params.id);
  if (!service) {
    return next(new AppError('Service not found.', 404));
  }

  const fields: Partial<IService> = {};

  if (req.body.title !== undefined) {
    fields.title = req.body.title;
    fields.slug = slugify(req.body.title, { lower: true, strict: true });
  }

  if (req.body.slug !== undefined) {
    const slug = slugify(req.body.slug, { lower: true, strict: true });
    const duplicate = await Service.findOne({ slug, _id: { $ne: service._id } });
    if (duplicate) {
      return next(new AppError('A service with this slug already exists.', 409));
    }
    fields.slug = slug;
  }

  const arrayFields = ['shortDescription', 'description', 'featuredImage', 'isActive', 'isFeatured', 'displayOrder', 'seoTitle', 'seoDescription'] as const;
  for (const key of arrayFields) {
    if (req.body[key] !== undefined) {
      (fields as Record<string, unknown>)[key] = req.body[key];
    }
  }

  if (Array.isArray(req.body.gallery)) {
    fields.gallery = req.body.gallery;
  }
  if (Array.isArray(req.body.features)) {
    fields.features = req.body.features;
  }
  if (Array.isArray(req.body.specifications)) {
    fields.specifications = req.body.specifications;
  }

  Object.assign(service, fields);
  await service.save();

  res.status(200).json({
    success: true,
    data: { service },
  });
});

export const deleteService = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  const { confirm } = req.query;

  if (confirm !== 'true') {
    return next(new AppError('Deletion requires confirmation. Pass ?confirm=true to proceed.', 400));
  }

  const service = await Service.findByIdAndDelete(id);
  if (!service) {
    return next(new AppError('Service not found.', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Service deleted successfully.',
  });
});