const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');

/**
 * A production build must never silently talk to localhost: that would make the
 * live site look "up" with no data and no working admin login. Fail loudly at
 * request time instead so the misconfiguration is obvious.
 */
const API_BASE_URL = (() => {
  if (configuredApiUrl) return configuredApiUrl;
  if (process.env.NODE_ENV === 'production') {
    return '';
  }
  return 'http://localhost:5000';
})();

const missingApiUrlError = (): Error =>
  new Error(
    'NEXT_PUBLIC_API_URL is not configured. Set it to your deployed API origin (e.g. https://api.example.com) and rebuild.',
  );

export const getApiUrl = (path: string): string => {
  if (path.startsWith('http')) return path;
  if (!API_BASE_URL) throw missingApiUrlError();
  return `${API_BASE_URL}${path.startsWith('/') ? `/${path.slice(1)}` : `/${path}`}`;
};

interface RequestOptions extends RequestInit {
  token?: string;
  useCredentials?: boolean;
}

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

export const apiRequest = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  const { token, useCredentials = true, headers, ...rest } = options;

  const requestHeaders: Record<string, string> = {
    ...(headers as Record<string, string>),
  };

  if (!(rest.body instanceof FormData) && !requestHeaders['Content-Type']) {
    requestHeaders['Content-Type'] = 'application/json';
  }

  if (token) {
    requestHeaders['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(getApiUrl(path), {
    ...rest,
    headers: requestHeaders,
    credentials: useCredentials ? 'include' : 'omit',
  });

  const contentType = response.headers.get('content-type') ?? '';
  const isJson = contentType.includes('application/json');

  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message =
      (payload as { message?: string })?.message ??
      `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status);
  }

  return payload as T;
};

export const apiGet = <T>(path: string, token?: string): Promise<T> =>
  apiRequest<T>(path, { method: 'GET', token });

export const apiPost = <T>(path: string, body?: unknown, token?: string): Promise<T> =>
  apiRequest<T>(path, {
    method: 'POST',
    body: body === undefined ? undefined : body instanceof FormData ? body : JSON.stringify(body),
    token,
  });

export const apiPut = <T>(path: string, body?: unknown, token?: string): Promise<T> =>
  apiRequest<T>(path, {
    method: 'PUT',
    body: body === undefined ? undefined : body instanceof FormData ? body : JSON.stringify(body),
    token,
  });

export const apiPatch = <T>(path: string, body?: unknown, token?: string): Promise<T> =>
  apiRequest<T>(path, {
    method: 'PATCH',
    body: body === undefined ? undefined : JSON.stringify(body),
    token,
  });

export const apiDelete = <T>(path: string, token?: string): Promise<T> =>
  apiRequest<T>(path, { method: 'DELETE', token });

export { ApiError };

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return 'Something went wrong';
};