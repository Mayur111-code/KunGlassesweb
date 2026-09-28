export type EnquiryStatus =
  | 'NEW'
  | 'CONTACTED'
  | 'IN_PROGRESS'
  | 'QUOTED'
  | 'CONVERTED'
  | 'REJECTED'
  | 'CLOSED';

export type Role = 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR';

export type ContactMethodType = 'phone' | 'whatsapp' | 'email';

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    items: T[];
    pagination: Pagination;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface ErrorResponse {
  success: boolean;
  message: string;
  status?: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceSpecification {
  label: string;
  value: string;
}

export type ImageValue =
  | string
  | { url?: string | null; secureUrl?: string | null; filePath?: string | null; sourceType?: string | null }
  | null
  | undefined;

export interface Service {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  featuredImage?: ImageValue;
  gallery: ImageValue[];
  features: string[];
  specifications: ServiceSpecification[];
  isActive: boolean;
  isFeatured: boolean;
  displayOrder: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  _id: string;
  title: string;
  slug: string;
  client?: string;
  clientName: string;
  location: string;
  category: string;
  serviceName: string;
  description: string;
  images: ImageValue[];
  completionYear?: number;
  featured: boolean;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  _id: string;
  name: string;
  slug: string;
  logo?: ImageValue;
  description?: string;
  websiteUrl?: string;
  category?: string;
  location?: string;
  projectDescription?: string;
  displayOrder: number;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EnquiryNote {
  _id?: string;
  note: string;
  addedBy?: { _id: string; name: string; email?: string };
  createdAt: string;
}

export interface Enquiry {
  _id: string;
  fullName: string;
  phone: string;
  email?: string;
  company?: string;
  serviceInterestedIn?: { _id: string; title: string; slug: string } | string;
  serviceInterestedInName?: string;
  message: string;
  preferredContactMethod: 'phone' | 'email' | 'whatsapp';
  location?: string;
  source: string;
  status: EnquiryStatus;
  assignedTo?: { _id: string; name: string; email?: string } | string;
  followUpDate?: string;
  notes: EnquiryNote[];
  createdAt: string;
  updatedAt: string;
}

export interface MediaItem {
  _id: string;
  sourceType: 'upload' | 'url';
  publicId?: string;
  secureUrl: string;
  resourceType: string;
  fileName?: string;
  folder: string;
  altText?: string;
  fileSize: number;
  width?: number;
  height?: number;
  uploadedBy?: string;
  createdAt: string;
}

export interface ContactMethod {
  _id: string;
  type: ContactMethodType;
  value: string;
  label: string;
  isPrimary: boolean;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface SiteSettings {
  _id: string;
  companyName: string;
  tagline: string;
  logo?: string;
  favicon?: string;
  aboutShort?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords: string[];
  ogImage?: string;
  googleVerification?: string;
  robotsContent?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  youtubeUrl?: string;
  whatsappEnabled: boolean;
  whatsappDefaultMessage: string;
  address?: string;
  googleMapsUrl?: string;
  footerDescription?: string;
  copyrightText?: string;
  heroImages?: {
    home?: string;
    about?: string;
    services?: string;
    projects?: string;
    clients?: string;
    contact?: string;
  };
  updatedAt: string;
}

export interface SettingsPayload {
  settings: SiteSettings;
  contactMethods: ContactMethod[];
}

export interface ActivityLog {
  _id: string;
  admin: string;
  adminName?: string;
  action: string;
  entity: string;
  entityId?: unknown;
  entityName?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface EnquiryStats {
  total: number;
  byStatus: Record<string, number>;
}

export interface DashboardStats {
  services: { total: number; active: number };
  projects: { total: number; active: number };
  clients: { total: number; active: number };
  enquiries: {
    total: number;
    new: number;
    pending: number;
    converted: number;
  };
}

export interface ActivityLogEntry extends ActivityLog {}

export const ENQUIRY_STATUSES: EnquiryStatus[] = [
  'NEW',
  'CONTACTED',
  'IN_PROGRESS',
  'QUOTED',
  'CONVERTED',
  'REJECTED',
  'CLOSED',
];

export const ROLES_LIST: Role[] = ['SUPER_ADMIN', 'ADMIN', 'EDITOR'];

export const PROJECT_CATEGORIES = [
  'Residential',
  'Commercial Interiors',
  'Retail',
  'Institutional',
  'Industrial',
  'Facade / Exterior',
  'Mall',
  'Healthcare',
];

export const SOURCES = ['website', 'whatsapp', 'phone', 'email', 'referral', 'other'];
