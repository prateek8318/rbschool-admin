import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../store/authStore';

const ROOT = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '');
export const API_BASE = `${ROOT}/api/v1`;

export interface PageMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  [key: string]: unknown;
}

export interface Paged<T> {
  items: T[];
  meta: PageMeta;
}

/** Microsoft dev tunnels show a warning page to browsers unless this header is sent. */
const TUNNEL_HEADERS = { 'X-Tunnel-Skip-AntiPhishing-Page': 'true' };

export const http = axios.create({ baseURL: API_BASE, timeout: 20000, headers: TUNNEL_HEADERS });

http.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// One refresh at a time; concurrent 401s wait for the same promise.
let refreshing: Promise<string | null> | null = null;

const refreshAccessToken = async (): Promise<string | null> => {
  const { refreshToken, updateTokens, logout } = useAuthStore.getState();
  if (!refreshToken) return null;
  try {
    const { data } = await axios.post(`${API_BASE}/auth/refresh`, { refreshToken }, { headers: TUNNEL_HEADERS });
    updateTokens(data.data.accessToken, data.data.refreshToken);
    return data.data.accessToken as string;
  } catch {
    logout();
    return null;
  }
};

http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;
    const isAuthCall = original?.url?.startsWith('/auth/login') || original?.url?.startsWith('/auth/otp') || original?.url?.startsWith('/auth/refresh');
    if (error.response?.status === 401 && original && !original._retry && !isAuthCall) {
      original._retry = true;
      refreshing = refreshing ?? refreshAccessToken().finally(() => (refreshing = null));
      const token = await refreshing;
      if (token) {
        original.headers.Authorization = `Bearer ${token}`;
        return http(original);
      }
      if (window.location.pathname !== '/login') window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

/** Human readable message from any API error. */
export const errorMessage = (error: unknown): string => {
  const err = error as AxiosError<{ error?: { message?: string; details?: Array<{ path: string; message: string }> } }>;
  if (err?.code === 'ERR_NETWORK' || (err?.isAxiosError && !err.response)) {
    return 'Cannot reach the server. Check your internet connection or try again in a moment.';
  }
  if (err?.code === 'ECONNABORTED') return 'The server took too long to respond. Please try again.';
  const apiError = err?.response?.data?.error;
  if (apiError?.details?.length) {
    return apiError.details.map((detail) => `${detail.path || 'field'}: ${detail.message}`).join(', ');
  }
  if (err?.response?.status === 429) return 'Too many requests. Please wait a minute and try again.';
  return apiError?.message || err?.message || 'Something went wrong';
};

export const get = async <T>(url: string, params?: object): Promise<T> => (await http.get(url, { params })).data.data;

export const getPaged = async <T>(url: string, params?: object): Promise<Paged<T>> => {
  const { data } = await http.get(url, { params });
  return { items: data.data, meta: data.meta };
};

export const post = async <T>(url: string, body?: unknown): Promise<T> => (await http.post(url, body ?? {})).data.data;
export const put = async <T>(url: string, body?: unknown): Promise<T> => (await http.put(url, body ?? {})).data.data;
export const patch = async <T>(url: string, body?: unknown): Promise<T> => (await http.patch(url, body ?? {})).data.data;
export const del = async <T>(url: string): Promise<T> => (await http.delete(url)).data.data;

/** Downloads a CSV/file endpoint with the auth header. */
export const download = async (url: string, filename: string, params?: object) => {
  const response = await http.get(url, { params, responseType: 'blob' });
  const href = URL.createObjectURL(response.data as Blob);
  const link = document.createElement('a');
  link.href = href;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(href);
};
