import { apiGet, apiPost, apiDelete, apiPut, apiPatch } from '@/lib/api';
import type {
  ApiResponse,
  Client,
  ContactMethod,
  DashboardStats,
  Enquiry,
  EnquiryStats,
  MediaItem,
  PaginatedResponse,
  Project,
  Service,
  SettingsPayload,
  SiteSettings,
  User,
  ActivityLog,
} from '@/types';

export interface LoginResponse {
  user: User;
}

export interface AuthMeResponse {
  user: User;
}

export const authApi = {
  login: (email: string, password: string) =>
    apiPost<ApiResponse<LoginResponse>>('/api/auth/login', { email, password }),
  logout: () => apiPost<ApiResponse<{ success: true }>>('/api/auth/logout'),
  me: () => apiGet<ApiResponse<AuthMeResponse>>('/api/auth/me'),
  changePassword: (currentPassword: string, newPassword: string) =>
    apiPost<ApiResponse<{ success: true }>>(
      '/api/auth/change-password',
      { currentPassword, newPassword },
      undefined
    ),
};

export const settingsApi = {
  getPublic: () => apiGet<ApiResponse<SettingsPayload>>('/api/settings/public'),
  getAdmin: (token?: string) => apiGet<ApiResponse<SettingsPayload>>('/api/settings', token),
  update: (data: Partial<SiteSettings>, token?: string) =>
    apiPut<ApiResponse<SettingsPayload>>('/api/settings', data, token),
  createContactMethod: (data: { type: string; value: string; label?: string; isPrimary?: boolean; isActive?: boolean; displayOrder?: number }, token?: string) =>
    apiPost<ApiResponse<{ contactMethod: ContactMethod }>>('/api/settings/contact-methods', data, token),
  updateContactMethod: (id: string, data: Partial<ContactMethod>, token?: string) =>
    apiPut<ApiResponse<{ contactMethod: ContactMethod }>>(`/api/settings/contact-methods/${id}`, data, token),
  setPrimaryContactMethod: (id: string, token?: string) =>
    apiPatch<ApiResponse<{ contactMethod: ContactMethod }>>(`/api/settings/contact-methods/${id}/primary`, {}, token),
  deleteContactMethod: (id: string, token?: string) =>
    apiDelete<ApiResponse<{ success: true }>>(`/api/settings/contact-methods/${id}`, token),
};

export const servicesApi = {
  getAll: () => apiGet<ApiResponse<Service[]>>('/api/services/public'),
  getBySlug: (slug: string) => apiGet<ApiResponse<{ service: Service }>>(`/api/services/slug/${slug}`),
  getAdmin: (token?: string, query = '') =>
    apiGet<PaginatedResponse<Service>>(`/api/services${query}`, token),
  create: (data: Partial<Service>, token?: string) =>
    apiPost<ApiResponse<{ service: Service }>>('/api/services', data, token),
  update: (id: string, data: Partial<Service>, token?: string) =>
    apiPut<ApiResponse<{ service: Service }>>(`/api/services/${id}`, data, token),
  remove: (id: string, token?: string) =>
    apiDelete<ApiResponse<{ success: true }>>(`/api/services/${id}?confirm=true`, token),
};

export const projectsApi = {
  getAll: () => apiGet<ApiResponse<Project[]>>('/api/projects/public'),
  getBySlug: (slug: string) => apiGet<ApiResponse<{ project: Project }>>(`/api/projects/slug/${slug}`),
  getAdmin: (token?: string, query = '') =>
    apiGet<PaginatedResponse<Project>>(`/api/projects${query}`, token),
  create: (data: Partial<Project>, token?: string) =>
    apiPost<ApiResponse<{ project: Project }>>('/api/projects', data, token),
  update: (id: string, data: Partial<Project>, token?: string) =>
    apiPut<ApiResponse<{ project: Project }>>(`/api/projects/${id}`, data, token),
  remove: (id: string, token?: string) =>
    apiDelete<ApiResponse<{ success: true }>>(`/api/projects/${id}?confirm=true`, token),
};

export const clientsApi = {
  getAll: () => apiGet<ApiResponse<Client[]>>('/api/clients/public'),
  getAdmin: (token?: string, query = '') =>
    apiGet<PaginatedResponse<Client>>(`/api/clients${query}`, token),
  create: (data: Partial<Client>, token?: string) =>
    apiPost<ApiResponse<{ client: Client }>>('/api/clients', data, token),
  update: (id: string, data: Partial<Client>, token?: string) =>
    apiPut<ApiResponse<{ client: Client }>>(`/api/clients/${id}`, data, token),
  remove: (id: string, token?: string) =>
    apiDelete<ApiResponse<{ success: true }>>(`/api/clients/${id}?confirm=true`, token),
};

export const enquiriesApi = {
  submit: (data: Record<string, unknown>) => apiPost<ApiResponse<Enquiry>>('/api/enquiries', data),
  getAll: (token?: string, query = '') =>
    apiGet<PaginatedResponse<Enquiry>>(`/api/enquiries${query}`, token),
  get: (id: string, token?: string) =>
    apiGet<ApiResponse<{ enquiry: Enquiry }>>(`/api/enquiries/${id}`, token),
  update: (id: string, data: Partial<Enquiry>, token?: string) =>
    apiPut<ApiResponse<{ enquiry: Enquiry }>>(`/api/enquiries/${id}`, data, token),
  updateStatus: (id: string, status: Enquiry['status'], token?: string) =>
    apiPatch<ApiResponse<{ enquiry: Enquiry }>>(`/api/enquiries/${id}/status`, { status }, token),
  addNote: (id: string, note: string, token?: string) =>
    apiPost<ApiResponse<{ enquiry: Enquiry }>>(`/api/enquiries/${id}/notes`, { note }, token),
  assign: (id: string, userId: string, token?: string) =>
    apiPatch<ApiResponse<{ enquiry: Enquiry }>>(`/api/enquiries/${id}/assign`, { userId }, token),
  remove: (id: string, token?: string) =>
    apiDelete<ApiResponse<{ success: true }>>(`/api/enquiries/${id}?confirm=true`, token),
  stats: (token?: string) =>
    apiGet<ApiResponse<EnquiryStats>>('/api/enquiries/stats', token),
};

export const mediaApi = {
  upload: (files: File[], folder?: string, altText?: string, token?: string) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    if (folder) formData.append('folder', folder);
    if (altText) formData.append('altText', altText);
    return apiPost<ApiResponse<{ items: MediaItem[] }>>('/api/media/upload', formData, token);
  },
  addExternal: (imageUrl: string, altText?: string, folder?: string, token?: string) =>
    apiPost<ApiResponse<{ item: MediaItem }>>('/api/media/external', { imageUrl, altText, folder }, token),
  getAll: (token?: string, query = '') =>
    apiGet<PaginatedResponse<MediaItem>>(`/api/media${query}`, token),
  remove: (id: string, token?: string) =>
    apiDelete<ApiResponse<{ success: true }>>(`/api/media/${id}?confirm=true`, token),
};

export const usersApi = {
  getAll: (token?: string, query = '') =>
    apiGet<PaginatedResponse<User>>(`/api/users${query}`, token),
  create: (data: Partial<User>, token?: string) =>
    apiPost<ApiResponse<{ user: User }>>('/api/users', data, token),
  update: (id: string, data: Partial<User>, token?: string) =>
    apiPut<ApiResponse<{ user: User }>>(`/api/users/${id}`, data, token),
  remove: (id: string, token?: string) =>
    apiDelete<ApiResponse<{ success: true }>>(`/api/users/${id}`, token),
};

export const activityApi = {
  getAll: (token?: string, query = '') =>
    apiGet<PaginatedResponse<ActivityLog>>(`/api/activity-logs${query}`, token),
};

export const dashboardApi = {
  getStats: async (token?: string) => {
    const [services, projects, clients, enquiryStats] = await Promise.all([
      servicesApi.getAdmin(token, '?limit=1'),
      projectsApi.getAdmin(token, '?limit=1'),
      clientsApi.getAdmin(token, '?limit=1'),
      enquiriesApi.stats(token),
    ]);

    const activeServices = await servicesApi.getAdmin(token, '?limit=1&isActive=true');
    const activeProjects = await projectsApi.getAdmin(token, '?limit=1&isActive=true');
    const activeClients = await clientsApi.getAdmin(token, '?limit=1&isActive=true');

    return {
      services: {
        total: services.data.pagination.total,
        active: activeServices.data.pagination.total,
      },
      projects: {
        total: projects.data.pagination.total,
        active: activeProjects.data.pagination.total,
      },
      clients: {
        total: clients.data.pagination.total,
        active: activeClients.data.pagination.total,
      },
      enquiries: {
        total: enquiryStats.data.total,
        new: enquiryStats.data.byStatus.NEW ?? 0,
        pending: (enquiryStats.data.byStatus.NEW ?? 0) + (enquiryStats.data.byStatus.CONTACTED ?? 0) + (enquiryStats.data.byStatus.IN_PROGRESS ?? 0),
        converted: enquiryStats.data.byStatus.CONVERTED ?? 0,
      },
    } satisfies DashboardStats;
  },
};
