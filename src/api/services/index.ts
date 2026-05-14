/**
 * RBSchool — Final API Service Layer (SQL + Gateway Ready)
 * Place at: src/api/services/index.ts
 */

import axios from "axios";
import type {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export type UserRole = "admin" | "super_admin" | "teacher" | "parent";
export type AttendanceStatus = "present" | "absent" | "holiday" | "half_day";
export type FeeStatus = "paid" | "pending" | "overdue";
export type ExamType = "unit" | "midterm" | "final";
export type ExamStatus = "upcoming" | "ongoing" | "completed";
export type PaymentMode = "cash" | "online" | "cheque";
export type Gender = "male" | "female" | "other";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: Pagination;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  role: UserRole;
  schoolId?: string;
  userId: string;
}

// ─────────────────────────────────────────────
// AXIOS INSTANCE SETUP
// ─────────────────────────────────────────────

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("rbschool_access_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
);

// Response interceptor for auto-refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("rbschool_refresh_token");
        const { data } = await axios.post(`${BASE_URL}/api/auth/refresh`, { refreshToken });
        const newToken = data.data.accessToken;
        localStorage.setItem("rbschool_access_token", newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch {
        localStorage.clear();
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

const unwrap = <T>(response: AxiosResponse<ApiResponse<T>>): ApiResponse<T> => response.data;

// ─────────────────────────────────────────────
// AUTH SERVICE
// ─────────────────────────────────────────────

export const authService = {
  // Super Admin Login (admin@gmail.com)
  adminLogin: async (payload: { email: string; password: string }) => {
    const res = await api.post<ApiResponse<AuthTokens>>("/api/auth/admin/login", payload);
    localStorage.setItem("rbschool_access_token", res.data.data.accessToken);
    localStorage.setItem("rbschool_refresh_token", res.data.data.refreshToken);
    localStorage.setItem("rbschool_user", JSON.stringify(res.data.data));
    return unwrap(res);
  },

  // Standard Login (for Teachers/Parents with schoolId)
  login: async (payload: { email: string; password: string; schoolId: string }) => {
    const res = await api.post<ApiResponse<AuthTokens>>("/api/auth/login", payload);
    localStorage.setItem("rbschool_access_token", res.data.data.accessToken);
    localStorage.setItem("rbschool_refresh_token", res.data.data.refreshToken);
    localStorage.setItem("rbschool_user", JSON.stringify(res.data.data));
    return unwrap(res);
  },

  logout: async () => {
    await api.post("/api/auth/logout").catch(() => {});
    localStorage.clear();
  },

  registerSchool: async (payload: any) => {
    const res = await api.post<ApiResponse<AuthTokens>>("/api/auth/register-school", payload);
    return unwrap(res);
  }
};

// ─────────────────────────────────────────────
// ADMIN & DASHBOARD SERVICE
// ─────────────────────────────────────────────

export const adminService = {
  // Naya Admin Dashboard API (Jo humne gateway mein set kiya)
  getDashboardStats: async () => {
    const res = await api.get<ApiResponse<any>>("/api/admin/dashboard");
    return unwrap(res);
  },

  getSchools: async () => {
    const res = await api.get<ApiResponse<any[]>>("/api/schools");
    return unwrap(res);
  }
};

// ─────────────────────────────────────────────
// DATA SERVICES (Students, Teachers, etc.)
// ─────────────────────────────────────────────

export const studentService = {
  getAll: async (params?: any) => {
    const res = await api.get<ApiResponse<any[]>>("/api/students", { params });
    return unwrap(res);
  },
  create: async (data: any) => unwrap(await api.post("/api/students", data)),
  update: async (id: string, data: any) => unwrap(await api.put(`/api/students/${id}`, data)),
  delete: async (id: string) => unwrap(await api.delete(`/api/students/${id}`))
};

export const teacherService = {
  getAll: async (params?: any) => {
    const res = await api.get<ApiResponse<any[]>>("/api/teachers", { params });
    return unwrap(res);
  },
  create: async (data: any) => unwrap(await api.post("/api/teachers", data)),
  update: async (id: string, data: any) => unwrap(await api.put(`/api/teachers/${id}`, data)),
  delete: async (id: string) => unwrap(await api.delete(`/api/teachers/${id}`))
};

export const classService = {
  getAll: async () => unwrap(await api.get("/api/classes")),
  create: async (data: any) => unwrap(await api.post("/api/classes", data))
};

export const attendanceService = {
  markBulk: async (data: any) => unwrap(await api.post("/api/attendance/bulk", data)),
  getReport: async (params: any) => unwrap(await api.get("/api/attendance/report", { params }))
};

export const feeService = {
  getAll: async (params?: any) => unwrap(await api.get("/api/fees", { params })),
  recordPayment: async (id: string, data: any) => unwrap(await api.put(`/api/fees/${id}/pay`, data))
};

// ─────────────────────────────────────────────
// EXPORT ALL
// ─────────────────────────────────────────────

const rbschoolApi = {
  auth: authService,
  admin: adminService,
  students: studentService,
  teachers: teacherService,
  classes: classService,
  attendance: attendanceService,
  fees: feeService
};

export default rbschoolApi;
