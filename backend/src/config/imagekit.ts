import ImageKit from '@imagekit/nodejs';
import { AppError } from '../utils/AppError';

export const IMAGEKIT_ENV_KEYS = [
  'IMAGEKIT_PUBLIC_KEY',
  'IMAGEKIT_PRIVATE_KEY',
  'IMAGEKIT_URL_ENDPOINT',
] as const;

const getMissingEnvKeys = (): string[] => IMAGEKIT_ENV_KEYS.filter((key) => !process.env[key]);

export const isImageKitConfigured = (): boolean => getMissingEnvKeys().length === 0;

let imagekit: ImageKit | null = null;

if (isImageKitConfigured()) {
  try {
    imagekit = new ImageKit({
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
    });
    console.log('ImageKit configured successfully.');
  } catch (error) {
    console.error('ImageKit initialization failed:', (error as Error)?.message);
    imagekit = null;
  }
} else {
  console.warn(
    `ImageKit is NOT configured. Missing variables: ${getMissingEnvKeys().join(
      ', '
    )}. Image upload service will be unavailable.`
  );
}

export const getImageKitInstance = (): ImageKit => {
  if (!imagekit) {
    throw new AppError('Image upload service is not configured.', 503);
  }
  return imagekit;
};

export default imagekit;
