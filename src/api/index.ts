import { del, download, get, getPaged, patch, post, put } from './client';
import type {
  AcademicSession,
  Announcement,
  AttendanceSheet,
  AttendanceStatus,
  Batch,
  Credential,
  Exam,
  FeeStructure,
  Institution,
  Invoice,
  LeaveRequest,
  LoginResult,
  MembershipView,
  NotificationItem,
  ParentRow,
  Payment,
  Program,
  StaffMember,
  Student,
  Subject,
} from '../types';

type Params = Record<string, string | number | boolean | undefined>;

export const authApi = {
  login: (identifier: string, password: string) => post<LoginResult>('/auth/login', { identifier, password }),
  requestOtp: (phone: string) => post<{ sent: true; devCode?: string }>('/auth/otp/request', { phone }),
  verifyOtp: (phone: string, code: string) => post<LoginResult>('/auth/otp/verify', { phone, code }),
  me: () => get<{ user: LoginResult['user']; isPlatformAdmin: boolean; memberships: MembershipView[] }>('/auth/me'),
  switchTo: (body: { membershipId?: string; institutionId?: string }) =>
    post<{ accessToken: string; activeMembership: MembershipView | null }>('/auth/switch', body),
  logout: () => post('/auth/logout', {}),
  changePassword: (currentPassword: string, newPassword: string) => put('/auth/password', { currentPassword, newPassword }),
};

export const platformApi = {
  stats: () => get<{ institutions: number; byType: Record<string, number>; users: number; students: number }>('/platform/stats'),
  institutions: (params?: Params) => getPaged<Institution>('/platform/institutions', params),
  create: (body: unknown) => post<{ institutionId: string; code: string; credential: Credential | null; institution: Institution }>('/platform/institutions', body),
  setStatus: (id: string, isActive: boolean) => patch(`/platform/institutions/${id}/status`, { isActive }),
};

export const institutionApi = {
  get: () => get<Institution>('/institution'),
  update: (body: unknown) => patch<Institution>('/institution', body),
  updateSettings: (body: unknown) => patch('/institution/settings', body),
  sessions: () => get<AcademicSession[]>('/institution/sessions'),
  createSession: (body: unknown) => post<AcademicSession>('/institution/sessions', body),
  activateSession: (id: string) => post(`/institution/sessions/${id}/activate`),
};

export const academicsApi = {
  programs: () => get<Program[]>('/academics/programs'),
  createProgram: (body: unknown) => post<Program>('/academics/programs', body),
  updateProgram: (id: string, body: unknown) => patch<Program>(`/academics/programs/${id}`, body),
  subjects: () => get<Subject[]>('/academics/subjects'),
  createSubject: (body: unknown) => post<Subject>('/academics/subjects', body),
  updateSubject: (id: string, body: unknown) => patch<Subject>(`/academics/subjects/${id}`, body),
  batches: (params?: Params) => get<Batch[]>('/academics/batches', params),
  batch: (id: string) => get<Batch>(`/academics/batches/${id}`),
  createBatch: (body: unknown) => post<Batch>('/academics/batches', body),
  updateBatch: (id: string, body: unknown) => patch<Batch>(`/academics/batches/${id}`, body),
  setBatchSubjects: (id: string, subjects: Array<{ subjectId: string; teacherId?: string }>) =>
    put<Batch>(`/academics/batches/${id}/subjects`, { subjects }),
  batchStudents: (id: string) => get<Student[]>(`/academics/batches/${id}/students`),
};

export const studentsApi = {
  list: (params?: Params) => getPaged<Student>('/students', params),
  get: (id: string) => get<Student>(`/students/${id}`),
  create: (body: unknown) => post<{ student: Student; credentials: Credential[] }>('/students', body),
  update: (id: string, body: unknown) => patch<Student>(`/students/${id}`, body),
  addGuardian: (id: string, body: unknown) => post<{ student: Student; credential: Credential | null }>(`/students/${id}/guardians`, body),
  removeGuardian: (id: string, userId: string) => del(`/students/${id}/guardians/${userId}`),
  createLogin: (id: string) => post<{ credential: Credential | null }>(`/students/${id}/login`),
  promote: (body: unknown) => post<{ updated: number }>('/students/promote', body),
  export: (params?: Params) => download('/students/export', 'students.csv', params),
};

export const staffApi = {
  list: (params?: Params) => getPaged<StaffMember>('/staff', params),
  get: (id: string) => get<StaffMember & { batches: Batch[] }>(`/staff/${id}`),
  create: (body: unknown) => post<{ staff: StaffMember; role: string; credential: Credential | null }>('/staff', body),
  update: (id: string, body: unknown) => patch<StaffMember>(`/staff/${id}`, body),
  setRoles: (id: string, roles: string[]) => put(`/staff/${id}/roles`, { roles }),
  deactivate: (id: string) => post(`/staff/${id}/deactivate`),
  activate: (id: string) => post(`/staff/${id}/activate`),
};

export const guardiansApi = {
  list: (params?: Params) => getPaged<ParentRow>('/guardians', params),
  block: (userId: string) => post(`/guardians/${userId}/block`),
  unblock: (userId: string) => post(`/guardians/${userId}/unblock`),
};

export const attendanceApi = {
  sheet: (batchId: string, date?: string) => get<AttendanceSheet>('/attendance/sheet', { batchId, date }),
  save: (body: { batchId: string; date: string; entries: Array<{ studentId: string; status: AttendanceStatus }> }) =>
    put('/attendance/sheet', body),
  overview: (date?: string) =>
    get<{
      date: string;
      holiday?: { name: string } | null;
      batchesMarked: number;
      batchesTotal: number;
      present: number;
      absent: number;
      percentage: number;
      batches: Array<{ batch: Batch; marked: boolean; present?: number; absent?: number; late?: number; leave?: number }>;
    }>('/attendance/overview', { date }),
  report: (params: Params) => get<{ students: Array<Student & { present: number; absent: number; late: number; leave: number; total: number; percentage: number }> }>('/attendance/report', params),
  exportReport: (params: Params) => download('/attendance/report', 'attendance.csv', { ...params, format: 'csv' }),
  low: (params?: Params) => get<{ threshold: number; students: Array<Student & { percentage: number; total: number }> }>('/attendance/low', params),
  holidays: () => get<Array<{ _id: string; date: string; name: string; type: string }>>('/attendance/holidays'),
  addHoliday: (body: unknown) => post('/attendance/holidays', body),
  deleteHoliday: (id: string) => del(`/attendance/holidays/${id}`),
};

export interface MarksSheet {
  exam: { id: string; name: string; status: string };
  paper: { maxMarks: number; passMarks?: number };
  students: Array<{ _id: string; name: string; enrollmentNo: string; rollNo?: string; marks: number | null; isAbsent: boolean }>;
}

export interface ResultsTable {
  summary: { students: number; complete: number; passed: number; failed: number; averagePercentage: number | null; highestPercentage: number | null };
  results: Array<{
    _id: string;
    studentId: { _id: string; name: string; enrollmentNo: string; rollNo?: string };
    totalMarks: number;
    maxMarks: number;
    percentage: number;
    grade?: string;
    rank?: number;
    result: 'pass' | 'fail' | 'incomplete';
  }>;
}

export const examsApi = {
  list: (params?: Params) => get<Exam[]>('/exams', params),
  create: (body: unknown) => post<Exam>('/exams', body),
  update: (id: string, body: unknown) => patch<Exam>(`/exams/${id}`, body),
  remove: (id: string) => del(`/exams/${id}`),
  marks: (id: string, batchId: string, subjectId: string) => get<MarksSheet>(`/exams/${id}/marks`, { batchId, subjectId }),
  saveMarks: (id: string, body: unknown) => put(`/exams/${id}/marks`, body),
  publish: (id: string) => post<{ results: number; incomplete: number }>(`/exams/${id}/publish`),
  unpublish: (id: string) => post(`/exams/${id}/unpublish`),
  results: (id: string, batchId: string) => get<ResultsTable>(`/exams/${id}/results`, { batchId }),
};

export interface FeeSummary {
  billed: number;
  collected: number;
  outstanding: number;
  discounts: number;
  collectionRate: number;
  byStatus: Record<string, { count: number; balance: number }>;
  monthly: Array<{ month: string; amount: number; count: number }>;
  byMode: Record<string, number>;
}

export const feesApi = {
  summary: () => get<FeeSummary>('/fees/summary'),
  structures: () => get<FeeStructure[]>('/fees/structures'),
  createStructure: (body: unknown) => post<FeeStructure>('/fees/structures', body),
  assign: (id: string, body: unknown) => post<{ created: number; skipped: number }>(`/fees/structures/${id}/assign`, body),
  invoices: (params?: Params) => getPaged<Invoice>('/fees/invoices', params),
  invoice: (id: string) => get<Invoice>(`/fees/invoices/${id}`),
  updateInvoice: (id: string, body: unknown) => patch<Invoice>(`/fees/invoices/${id}`, body),
  pay: (id: string, body: unknown) => post<Payment>(`/fees/invoices/${id}/payments`, body),
  reverse: (paymentId: string, reason: string) => post(`/fees/payments/${paymentId}/reverse`, { reason }),
  payments: (params?: Params) => getPaged<Payment>('/fees/payments', params),
  overdue: () => get<Invoice[]>('/fees/overdue'),
  exportInvoices: (params?: Params) => download('/fees/invoices/export', 'fees.csv', params),
};

export const announcementsApi = {
  list: (params?: Params) => getPaged<Announcement>('/announcements', params),
  create: (body: unknown) => post<Announcement>('/announcements', body),
  remove: (id: string) => del(`/announcements/${id}`),
};

export const notificationsApi = {
  list: (params?: Params) => getPaged<NotificationItem>('/notifications', params),
  unreadCount: () => get<{ unread: number }>('/notifications/unread-count'),
  readAll: () => post('/notifications/read-all'),
};

export const leavesApi = {
  list: (params?: Params) => getPaged<LeaveRequest>('/leaves', params),
  review: (id: string, status: 'approved' | 'rejected', note?: string) => post(`/leaves/${id}/review`, { status, note }),
};

export const dashboardApi = {
  // Shape depends on the active role; the admin view is typed in the Dashboard page.
  get: <T,>() => get<T>('/dashboard'),
};
