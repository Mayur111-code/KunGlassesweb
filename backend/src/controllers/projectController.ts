import { type Request, type Response, type NextFunction } from 'express';
import slugify from 'slugify';
import { Types } from 'mongoose';
import Project, { type IProject } from '../models/Project';
import { AppError } from '../utils/AppError';
import { catchAsync } from '../utils/catchAsync';
import { PAGINATION, SORT } from '../config/constants';
import { type AugmentedRequest } from '../middleware/authMiddleware';

interface ListQuery {
  page?: string;
  limit?: string;
  search?: string;
  category?: string;
  client?: string;
  featured?: string;
  isActive?: string;
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

const isValidObjectId = (value: string): boolean => Types.ObjectId.isValid(value);

export const getProjectsPublic = catchAsync(async (_req: Request, res: Response): Promise<void> => {
  const projects = await Project.find({ isActive: true })
    .populate('client', 'name slug logo location')
    .sort({ displayOrder: 1, createdAt: -1 });

  res.status(200).json({
    success: true,
    data: projects,
  });
});

export const getProjects = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { page, limit } = parsePagination(req.query);
  const { search, category, client, featured, isActive, sort } = req.query;

  const filter: Record<string, unknown> = {};

  if (search) {
    filter.$or = [
      { title: { $regex: search as string, $options: 'i' } },
      { clientName: { $regex: search as string, $options: 'i' } },
      { location: { $regex: search as string, $options: 'i' } },
      { category: { $regex: search as string, $options: 'i' } },
    ];
  }

  if (category) {
    filter.category = category as string;
  }

  if (client) {
    filter.client = isValidObjectId(client as string)
      ? new Types.ObjectId(client as string)
      : client;
  }

  if (featured === 'true' || featured === 'false') {
    filter.featured = featured === 'true';
  }

  if (isActive === 'true' || isActive === 'false') {
    filter.isActive = isActive === 'true';
  }

  const [total, projects] = await Promise.all([
    Project.countDocuments(filter),
    Project.find(filter)
      .populate('client', 'name slug logo location')
      .sort(buildSort(sort as string | undefined))
      .skip((page - 1) * limit)
      .limit(limit),
  ]);

  res.status(200).json({
    success: true,
    data: {
      items: projects,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    },
  });
});

export const getProjectBySlug = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { slug } = req.params;

    const project = await Project.findOne({ slug }).populate('client', 'name slug logo location');

    if (!project) {
      return next(new AppError('Project not found.', 404));
    }

    const isPublic = project.isActive;
    const isAuthenticated = !!(req as AugmentedRequest).user;

    if (!isPublic && !isAuthenticated) {
      return next(new AppError('Project not found.', 404));
    }

    res.status(200).json({
      success: true,
      data: { project },
    });
  }
);

export const createProject = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const {
    title,
    slug,
    client,
    clientName,
    location,
    category,
    serviceName,
    description,
    images,
    completionYear,
    featured,
    isActive,
    displayOrder,
  } = req.body;

  const generatedSlug = slug ?? slugify(title, { lower: true, strict: true });

  const existing = await Project.findOne({ slug: generatedSlug });
  if (existing) {
    return next(new AppError('A project with this slug already exists.', 409));
  }

  const project = await Project.create({
    title,
    slug: generatedSlug,
    client: client && isValidObjectId(client) ? new Types.ObjectId(client) : undefined,
    clientName,
    location,
    category,
    serviceName,
    description,
    images: Array.isArray(images) ? images : [],
    completionYear,
    featured: featured ?? false,
    isActive: isActive ?? true,
    displayOrder: displayOrder ?? 0,
  });

  const populated = await project.populate('client', 'name slug logo location');

  res.status(201).json({
    success: true,
    data: { project: populated },
  });
});

export const updateProject = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    return next(new AppError('Project not found.', 404));
  }

  const fields: Partial<IProject> = {};

  if (req.body.title !== undefined) {
    fields.title = req.body.title;
    fields.slug = slugify(req.body.title, { lower: true, strict: true });
  }

  if (req.body.slug !== undefined) {
    const slug = slugify(req.body.slug, { lower: true, strict: true });
    const duplicate = await Project.findOne({ slug, _id: { $ne: project._id } });
    if (duplicate) {
      return next(new AppError('A project with this slug already exists.', 409));
    }
    fields.slug = slug;
  }

  const simpleFields = ['clientName', 'location', 'category', 'serviceName', 'description', 'completionYear', 'featured', 'isActive', 'displayOrder'] as const;
  for (const key of simpleFields) {
    if (req.body[key] !== undefined) {
      (fields as Record<string, unknown>)[key] = req.body[key];
    }
  }

  if (req.body.client !== undefined) {
    fields.client = req.body.client && isValidObjectId(req.body.client)
      ? new Types.ObjectId(req.body.client)
      : undefined;
  }

  if (Array.isArray(req.body.images)) {
    fields.images = req.body.images;
  }

  Object.assign(project, fields);
  await project.save();

  const populated = await project.populate('client', 'name slug logo location');

  res.status(200).json({
    success: true,
    data: { project: populated },
  });
});

export const deleteProject = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  const { confirm } = req.query;

  if (confirm !== 'true') {
    return next(new AppError('Deletion requires confirmation. Pass ?confirm=true to proceed.', 400));
  }

  const project = await Project.findByIdAndDelete(id);
  if (!project) {
    return next(new AppError('Project not found.', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Project deleted successfully.',
  });
});