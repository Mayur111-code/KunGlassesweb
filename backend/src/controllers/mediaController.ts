import { type Request, type Response, type NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Media from '../models/Media';
import { AppError } from '../utils/AppError';
import { catchAsync } from '../utils/catchAsync';
import { PAGINATION, SORT, UPLOAD } from '../config/constants';
import { isImageKitConfigured } from '../config/imagekit';
import { uploadToImageKit, deleteFileFromImageKit } from '../services/imagekitService';
import { type AugmentedRequest } from '../middleware/authMiddleware';

interface ListQuery {
  page?: string;
  limit?: string;
  folder?: string;
  resourceType?: string;
  search?: string;
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
  return { [field]: SORT.DEFAULT_SORT_DIRECTION };
};

const storage = multer.memoryStorage();

const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes: readonly string[] = UPLOAD.ALLOWED_MIME_TYPES;
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Only image files (JPEG, PNG, WEBP, AVIF) are allowed.', 400));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: UPLOAD.MAX_FILE_SIZE,
    files: parseInt(process.env.MAX_UPLOAD_FILES ?? '10', 10) || 10,
  },
});

export const uploadMedia = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  await new Promise<void>((resolve, reject) => {
    upload.array('files', 10)(req, res, (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });

  const files = (req as Request & { files?: Express.Multer.File[] }).files;

  if (!files || files.length === 0) {
    return next(new AppError('No files uploaded. Please attach at least one image.', 400));
  }

  const folder = (req.body.folder as string | undefined) ?? UPLOAD.IMAGEKIT_FOLDER;
  const altText = (req.body.altText as string | undefined) ?? '';
  const uploader = (req as AugmentedRequest).user;

  if (!isImageKitConfigured()) {
    return next(new AppError('Image upload service is not configured.', 503));
  }

  let uploadedResults: Awaited<ReturnType<typeof uploadToImageKit>>[];
  try {
    uploadedResults = await Promise.all(files.map((file) => uploadToImageKit(file, folder)));
  } catch (error) {
    console.error('ImageKit upload failed:', error);
    return next(new AppError('Image upload failed. Please try again.', 502));
  }

  const mediaRecords = await Media.insertMany(
    uploadedResults.map((result) => ({
      publicId: result.publicId,
      sourceType: 'upload',
      secureUrl: result.secureUrl,
      resourceType: result.resourceType,
      fileName: result.fileName,
      folder: result.folder,
      altText,
      fileSize: result.fileSize,
      width: result.width,
      height: result.height,
      uploadedBy: uploader?._id,
    }))
  );

  res.status(201).json({
    success: true,
    message: `${mediaRecords.length} file(s) uploaded successfully.`,
    data: { items: mediaRecords },
  });
});

export const createExternalMedia = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { imageUrl, altText, folder } = req.body;

  if (!isSafeImageUrl(imageUrl)) {
    return next(new AppError('Please enter a valid HTTPS image URL.', 400));
  }

  const parsed = new URL(imageUrl);
  const fallbackName = parsed.pathname.split('/').filter(Boolean).pop() || parsed.hostname;
  const media = await Media.create({
    sourceType: 'url',
    secureUrl: imageUrl,
    resourceType: 'image',
    fileName: fallbackName,
    folder: typeof folder === 'string' ? folder : 'external',
    altText: typeof altText === 'string' ? altText.trim() : '',
    uploadedBy: (req as AugmentedRequest).user?._id,
  });

  res.status(201).json({
    success: true,
    message: 'Media created successfully.',
    data: { item: media },
  });
});

export const getMedia = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { page, limit } = parsePagination(req.query);

  const query = req.query as ListQuery;
  const filter: Record<string, unknown> = {};

  if (query.folder) filter.folder = query.folder;
  if (query.resourceType) filter.resourceType = query.resourceType; // accepts 'image' | 'upload' | 'url'

  if (query.search) {
    filter.$or = [
      { fileName: { $regex: query.search, $options: 'i' } },
      { altText: { $regex: query.search, $options: 'i' } },
      { publicId: { $regex: query.search, $options: 'i' } },
    ];
  }

  const [total, items] = await Promise.all([
    Media.countDocuments(filter),
    Media.find(filter)
      .sort(buildSort(query.sort))
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
        totalPages: Math.max(Math.ceil(total / limit), 1),
      },
    },
  });
});

export const deleteMedia = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;

  const media = await Media.findById(id);
  if (!media) {
    return next(new AppError('Media not found.', 404));
  }

  if (media.sourceType === 'url') {
    // External URLs are not owned by this application; only remove their database record.
  } else if (media.resourceType === 'local' && media.publicId?.startsWith('uploads/media/')) {
    const localPath = path.resolve(__dirname, '../..', media.publicId);
    try {
      fs.unlinkSync(localPath);
    } catch (error) {
      console.error('Failed to delete local file:', error);
    }
  } else if (media.publicId && media.sourceType === 'upload') {
    try {
      await deleteFileFromImageKit(media.publicId);
    } catch (error) {
      console.error('Failed to delete file from ImageKit:', error);
    }
  }

  await media.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Media deleted successfully.',
  });
});

const isSafeImageUrl = (value: unknown): value is string => {
  if (typeof value !== 'string' || !value.trim()) return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:';
  } catch {
    return false;
  }
};
