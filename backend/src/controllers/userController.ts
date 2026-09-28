import { type Request, type Response, type NextFunction } from 'express';
import User from '../models/User';
import { AppError } from '../utils/AppError';
import { catchAsync } from '../utils/catchAsync';
import { PAGINATION, SORT } from '../config/constants';
import { ROLES, type Role } from '../config/constants';

interface GetUsersQuery {
  page?: string;
  limit?: string;
  search?: string;
  role?: string;
  isActive?: string;
  sort?: string;
}

const parsePagination = (query: GetUsersQuery) => {
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

const safeRole = (role: string): role is Role => {
  return Object.values(ROLES).includes(role as Role);
};

export const getUsers = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { page, limit } = parsePagination(req.query);
  const { search, role, isActive, sort } = req.query;

  const filter: Record<string, unknown> = {};

  if (search) {
    filter.$or = [
      { name: { $regex: search as string, $options: 'i' } },
      { email: { $regex: search as string, $options: 'i' } },
    ];
  }

  if (role && safeRole(role as string)) {
    filter.role = role;
  }

  if (isActive === 'true' || isActive === 'false') {
    filter.isActive = isActive === 'true';
  }

  const [total, users] = await Promise.all([
    User.countDocuments(filter),
    User.find(filter)
      .select('-password')
      .sort(buildSort(sort as string | undefined))
      .skip((page - 1) * limit)
      .limit(limit),
  ]);

  res.status(200).json({
    success: true,
    data: {
      items: users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    },
  });
});

export const getUser = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user) {
    return next(new AppError('User not found.', 404));
  }

  res.status(200).json({
    success: true,
    data: { user },
  });
});

export const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { name, email, password, role, avatar, isActive } = req.body;

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return next(new AppError('A user with this email already exists.', 409));
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role ?? ROLES.EDITOR,
    avatar,
    isActive,
  });

  const userJson = await User.findById(user._id).select('-password');

  res.status(201).json({
    success: true,
    data: { user: userJson },
  });
});

export const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { name, email, role, avatar, isActive, password } = req.body;

  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError('User not found.', 404));
  }

  if (email && email.toLowerCase() !== user.email) {
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return next(new AppError('A user with this email already exists.', 409));
    }
  }

  if (name) user.name = name;
  if (email) user.email = email.toLowerCase();
  if (role) user.role = role as Role;
  if (typeof avatar === 'string') user.avatar = avatar;
  if (typeof isActive === 'boolean') user.isActive = isActive;
  if (password) user.password = password;

  await user.save();

  const userJson = await User.findById(user._id).select('-password');

  res.status(200).json({
    success: true,
    data: { user: userJson },
  });
});

export const deleteUser = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError('User not found.', 404));
  }

  user.isActive = false;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'User deactivated successfully.',
  });
});