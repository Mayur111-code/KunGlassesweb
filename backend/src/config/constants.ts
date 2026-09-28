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

/**
 * Production detection.
 *
 * `NODE_ENV` is the canonical signal, but it is NOT set automatically on every
 * managed host (Render in particular does not set it for plain Node web
 * services). If it is missing, the API silently degrades to "development",
 * which issues `SameSite=Lax` auth cookies — and a Lax cookie is never sent on
 * a cross-site `fetch()` from the Vercel frontend, so every authenticated
 * request 401s even though `POST /api/auth/login` returns 200.
 *
 * Render always sets `RENDER=true`, so we treat that as an equivalent
 * production signal. This keeps the behaviour correct on the platform while
 * still honouring NODE_ENV wherever it is set explicitly. Nothing is
 * hardcoded and no secret is involved.
 */
export const IS_PRODUCTION =
  process.env.NODE_ENV === 'production' || process.env.RENDER === 'true';

/** Human-readable runtime mode, for startup logging only. */
export const RUNTIME_ENV = IS_PRODUCTION ? 'production' : 'development';

export const JWT = {
  COOKIE_NAME: 'kun_glass_token',
  EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? '7d',
  COOKIE_EXPIRES_IN_DAYS: Number(process.env.JWT_COOKIE_EXPIRES_IN ?? 7),
} as const;

/**
 * The API (Render) and the frontend (Vercel) are deployed on different domains,
 * so the auth cookie is a cross-site cookie in production and therefore requires
 * SameSite=None + Secure. Localhost development keeps SameSite=Lax so the cookie
 * still works over plain http://localhost.
 */
export const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: (IS_PRODUCTION ? 'none' : 'lax') as 'none' | 'lax',
  secure: IS_PRODUCTION,
  path: '/',
} as const;

const configuredJwtSecret = process.env.JWT_SECRET;
if (!configuredJwtSecret) {
  throw new Error('JWT_SECRET must be configured before starting the API.');
}
export const JWT_SECRET: string = configuredJwtSecret;

export const BCRYPT_ROUNDS = Number(process.env.BCRYPT_ROUNDS ?? 10);

const configuredClientUrl = process.env.CLIENT_URL;
if (!configuredClientUrl && IS_PRODUCTION) {
  throw new Error('CLIENT_URL must be configured in production.');
}

/**
 * CLIENT_URL may be a comma-separated list so preview deployments can be allowed.
 * Localhost origins are appended automatically outside production.
 */
export const ALLOWED_ORIGINS: string[] = (configuredClientUrl ?? 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim().replace(/\/$/, ''))
  .filter(Boolean);

if (!IS_PRODUCTION) {
  for (const localOrigin of ['http://localhost:3000', 'http://127.0.0.1:3000']) {
    if (!ALLOWED_ORIGINS.includes(localOrigin)) {
      ALLOWED_ORIGINS.push(localOrigin);
    }
  }
}

export const DATABASE_URI = process.env.MONGODB_URI ?? (IS_PRODUCTION
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