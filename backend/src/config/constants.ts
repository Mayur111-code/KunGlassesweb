export const ENQUIRY_STATUS = {
  NEW: 'NEW',
  CONTACTED: 'CONTACTED',
  IN_PROGRESS: 'IN_PROGRESS',
  QUOTED: 'QUOTED',
  CONVERTED: 'CONVERTED',
  REJECTED: 'REJECTED',
  CLOSED: 'CLOSED',
} as const;

export type EnquiryStatus = (typeof ENQUIRY_STATUS)[keyof typeof ENQUIRY_STATUS];

export const ENQUIRY_STATUS_LIST = Object.values(ENQUIRY_STATUS) as readonly string[];

export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  EDITOR: 'EDITOR',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_LIST = Object.values(ROLES) as readonly string[];

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

export const SORT = {
  DEFAULT_SORT_FIELD: 'createdAt',
  DEFAULT_SORT_DIRECTION: -1,
} as const;

export const JWT = {
  COOKIE_NAME: 'kun_glass_token',
  EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? '7d',
  COOKIE_EXPIRES_IN_DAYS: Number(process.env.JWT_COOKIE_EXPIRES_IN ?? 7),
} as const;

const configuredJwtSecret = process.env.JWT_SECRET;
if (!configuredJwtSecret) {
  throw new Error('JWT_SECRET must be configured before starting the API.');
}
export const JWT_SECRET: string = configuredJwtSecret;

export const BCRYPT_ROUNDS = Number(process.env.BCRYPT_ROUNDS ?? 10);

const configuredClientUrl = process.env.CLIENT_URL;
if (!configuredClientUrl && process.env.NODE_ENV === 'production') {
  throw new Error('CLIENT_URL must be configured in production.');
}

export const DATABASE_URI = process.env.MONGODB_URI ?? (process.env.NODE_ENV === 'production'
  ? (() => {
      throw new Error('MONGODB_URI must be configured in production.');
    })()
  : 'mongodb://127.0.0.1:27017/kun_glass');

export const UPLOAD = {
  MAX_FILE_SIZE: 5 * 1024 * 1024,
  ALLOWED_MIME_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
  IMAGEKIT_FOLDER: 'kun-glass',
} as const;

export const APP = {
  NAME: 'KUN Glass & Aluminium',
  EMAIL: process.env.FROM_EMAIL ?? 'no-reply@kunglass.com',
  CLIENT_URL: configuredClientUrl ?? 'http://localhost:3000',
} as const;