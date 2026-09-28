import type { Express } from 'express';
import type ImageKit from '@imagekit/nodejs';
import { getImageKitInstance } from '../config/imagekit';
import { AppError } from '../utils/AppError';

export interface ImageKitUploadResult {
  publicId: string;
  secureUrl: string;
  resourceType: string;
  folder: string;
  fileName: string;
  fileSize: number;
  width?: number;
  height?: number;
}

const FILE_TYPE_TO_RESOURCE_TYPE: Record<string, string> = {
  jpg: 'image',
  jpeg: 'image',
  png: 'image',
  webp: 'image',
  avif: 'image',
  gif: 'image',
};

export const detectResourceType = (filePath?: string, mime?: string): string => {
  if (mime?.startsWith('image/')) return 'image';
  if (mime?.startsWith('video/')) return 'video';
  if (!filePath) return 'image';
  const ext = filePath.split('.').pop()?.toLowerCase() ?? '';
  return FILE_TYPE_TO_RESOURCE_TYPE[ext] ?? 'image';
};

export const uploadToImageKit = (
  file: Express.Multer.File,
  folder: string
): Promise<ImageKitUploadResult> => {
  const imagekit: ImageKit = getImageKitInstance();

  return new Promise((resolve, reject) => {
    imagekit.files
      .upload({
        file: file.buffer.toString('base64'),
        fileName: file.originalname,
        folder,
        useUniqueFileName: true,
      })
      .then((result) => {
        const resourceType = detectResourceType(result.filePath, file.mimetype);
        resolve({
          publicId: result.fileId ?? '',
          secureUrl: result.url ?? '',
          resourceType,
          folder: result.filePath?.split('/').slice(0, -1).join('/') ?? folder,
          fileName: file.originalname,
          fileSize: file.size,
          width: result.width,
          height: result.height,
        });
      })
      .catch((error) => {
        reject(error ?? new Error('ImageKit upload failed.'));
      });
  });
};

export const deleteFileFromImageKit = async (fileId: string): Promise<void> => {
  const imagekit: ImageKit = getImageKitInstance();
  await imagekit.files.delete(fileId);
};
