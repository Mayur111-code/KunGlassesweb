import { type Request, type Response, type NextFunction } from 'express';
import slugify from 'slugify';
import Client, { type IClient } from '../models/Client';
import { AppError } from '../utils/AppError';
import { catchAsync } from '../utils/catchAsync';
import { PAGINATION, SORT } from '../config/constants';

interface ListQuery {
  page?: string;
  limit?: string;
  search?: string;
  isActive?: string;
  isFeatured?: string;
  category?: string;
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

export const getClientsPublic = catchAsync(async (_req: Request, res: Response): Promise<void> => {
  const clients = await Client.find({ isActive: true }).sort({ displayOrder: 1, name: 1 });

  res.status(200).json({
    success: true,
    data: clients,
  });
});

export const getClients = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { page, limit } = parsePagination(req.query);
  const { search, isActive, isFeatured, category, sort } = req.query;

  const filter: Record<string, unknown> = {};

  if (search) {
    filter.name = { $regex: search as string, $options: 'i' };
  }

  if (isActive === 'true' || isActive === 'false') {
    filter.isActive = isActive === 'true';
  }

  if (isFeatured === 'true' || isFeatured === 'false') {
    filter.isFeatured = isFeatured === 'true';
  }

  if (category) {
    filter.category = category as string;
  }

  const [total, clients] = await Promise.all([
    Client.countDocuments(filter),
    Client.find(filter)
      .sort(buildSort(sort as string | undefined))
      .skip((page - 1) * limit)
      .limit(limit),
  ]);

  res.status(200).json({
    success: true,
    data: {
      items: clients,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    },
  });
});

export const createClient = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const {
    name,
    logo,
    description,
    websiteUrl,
    category,
    location,
    projectDescription,
    displayOrder,
    isFeatured,
    isActive,
  } = req.body;

  const generatedSlug = slugify(name, { lower: true, strict: true });

  const existing = await Client.findOne({ slug: generatedSlug });
  if (existing) {
    return next(new AppError('A client with this name already exists.', 409));
  }

  const client = await Client.create({
    name,
    slug: generatedSlug,
    logo,
    description,
    websiteUrl,
    category,
    location,
    projectDescription,
    displayOrder: displayOrder ?? 0,
    isFeatured: isFeatured ?? false,
    isActive: isActive ?? true,
  });

  res.status(201).json({
    success: true,
    data: { client },
  });
});

export const updateClient = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const client = await Client.findById(req.params.id);
  if (!client) {
    return next(new AppError('Client not found.', 404));
  }

  const fields: Partial<IClient> = {};

  if (req.body.name !== undefined) {
    fields.name = req.body.name;
    fields.slug = slugify(req.body.name, { lower: true, strict: true });
  }

  if (req.body.slug !== undefined) {
    const slug = slugify(req.body.slug, { lower: true, strict: true });
    const duplicate = await Client.findOne({ slug, _id: { $ne: client._id } });
    if (duplicate) {
      return next(new AppError('A client with this slug already exists.', 409));
    }
    fields.slug = slug;
  }

  const simpleFields = ['logo', 'description', 'websiteUrl', 'category', 'location', 'projectDescription', 'displayOrder', 'isFeatured', 'isActive'] as const;
  for (const key of simpleFields) {
    if (req.body[key] !== undefined) {
      (fields as Record<string, unknown>)[key] = req.body[key];
    }
  }

  Object.assign(client, fields);
  await client.save();

  res.status(200).json({
    success: true,
    data: { client },
  });
});

export const deleteClient = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  const { confirm } = req.query;

  if (confirm !== 'true') {
    return next(new AppError('Deletion requires confirmation. Pass ?confirm=true to proceed.', 400));
  }

  const client = await Client.findByIdAndDelete(id);
  if (!client) {
    return next(new AppError('Client not found.', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Client deleted successfully.',
  });
});