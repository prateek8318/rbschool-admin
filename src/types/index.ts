// Types mirroring the backend API (rbschool-backend /api/v1).

export type Role = 'owner' | 'admin' | 'accountant' | 'teacher' | 'staff' | 'student' | 'guardian';
export type InstitutionType = 'school' | 'college' | 'university' | 'coaching' | 'training_center' | 'other';

export interface AuthUser {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  username?: string;
  isPlatformAdmin?: boolean;
  mustChangePassword?: boolean;
  lastLoginAt?: string;
}

export interface MembershipView {
  membershipId: string;
  role: Role;
  institution: { id: string; name: string; code: string; type: InstitutionType; logoUrl?: string | null };
}

export interface LoginResult {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
  isPlatformAdmin: boolean;
  memberships: MembershipView[];
  activeMembership: MembershipView | null;
  requiresMembershipSelection: boolean;
}

export interface Terminology {
  program: string;
  batch: string;
  session: string;
  student: string;
  guardian: string;
  teacher: string;
  enrollmentNo: string;
}

export interface Institution {
  _id: string;
  name: string;
  code: string;
  type: InstitutionType;
  affiliation?: string;
  email?: string;
  phone?: string;
  website?: string;
  logoUrl?: string;
  timezone: string;
  currency: string;
  isActive: boolean;
  address?: { line1?: string; city?: string; state?: string; country?: string; pincode?: string };
  settings: {
    terminology: Terminology;
    attendanceMode: 'daily' | 'per_period';
    workingDays: number[];
    gradingScale: Array<{ min: number; grade: string; gradePoint?: number }>;
    passPercentage: number;
    lowAttendanceThreshold: number;
    notifyGuardiansOnAbsence: boolean;
    sendFeeReminders: boolean;
  };
  currentSession?: AcademicSession | null;
  studentCount?: number;
  createdAt?: string;
}

export interface AcademicSession {
  _id: string;
  name: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

export interface Ref {
  _id: string;
  name: string;
  code?: string;
}

export interface Program {
  _id: string;
  name: string;
  code?: string;
  level?: number;
  duration?: string;
  description?: string;
  isActive: boolean;
}

export interface Subject {
  _id: string;
  name: string;
  code?: string;
  type: 'theory' | 'practical' | 'activity' | 'other';
  credits?: number;
}

export interface Batch {
  _id: string;
  name: string;
  programId: Ref | string;
  sessionId: Ref | string;
  coordinatorId?: (Ref & { phone?: string }) | string | null;
  room?: string;
  capacity?: number;
  subjects: Array<{ subjectId: Ref | string; teacherId?: Ref | string | null }>;
  studentCount?: number;
  isActive: boolean;
}

export interface Guardian {
  userId: string;
  name: string;
  phone?: string;
  relation?: string;
  isPrimary?: boolean;
}

export interface Student {
  _id: string;
  name: string;
  enrollmentNo: string;
  rollNo?: string;
  dob?: string;
  gender?: 'male' | 'female' | 'other';
  phone?: string;
  email?: string;
  address?: string;
  photoUrl?: string;
  programId?: Ref | string | null;
  batchId?: Ref | string | null;
  userId?: string | null;
  guardians: Guardian[];
  status: 'active' | 'alumni' | 'transferred' | 'dropped';
  admissionDate?: string;
}

export interface AccessInfo {
  phoneVerified: boolean;
  phoneVerifiedAt?: string | null;
  lastLoginAt?: string | null;
}

export interface StaffMember {
  _id: string;
  userId: string;
  name: string;
  phone?: string;
  email?: string;
  employeeCode?: string;
  designation?: string;
  department?: string;
  qualification?: string;
  experienceYears?: number;
  joiningDate?: string;
  subjectIds: Array<Ref | string>;
  status: 'active' | 'inactive';
  roles: Role[];
  access?: AccessInfo | null;
}

export interface ParentRow {
  userId: string;
  name: string;
  phone?: string;
  email?: string;
  status: 'active' | 'suspended';
  phoneVerified: boolean;
  lastLoginAt?: string | null;
  children: Array<{ _id: string; name: string; enrollmentNo: string; batch?: Ref | null; relation?: string; status: string }>;
}

export interface Credential {
  name: string;
  role: Role;
  login: string;
  tempPassword: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'leave' | 'excused';

export interface AttendanceSheet {
  batchId: string;
  date: string;
  period: string;
  isMarked: boolean;
  isWorkingDay: boolean;
  holiday?: { name: string } | null;
  takenBy?: Ref | null;
  counts?: Record<AttendanceStatus, number> | null;
  students: Array<{ _id: string; name: string; enrollmentNo: string; rollNo?: string; status: AttendanceStatus | null; remark?: string | null }>;
}

export interface ExamPaper {
  _id?: string;
  subjectId: Ref | string;
  date: string;
  startTime?: string;
  maxMarks: number;
  passMarks?: number;
}

export interface Exam {
  _id: string;
  name: string;
  type: string;
  batchIds: Array<Ref | string>;
  papers: ExamPaper[];
  status: 'scheduled' | 'published';
  instructions?: string;
  resultsPublishedAt?: string;
}

export interface Installment {
  label: string;
  dueDate: string;
  amount: number;
  paidAmount?: number;
  status?: 'pending' | 'partial' | 'paid' | 'overdue';
}

export interface FeeStructure {
  _id: string;
  name: string;
  programIds: Array<Ref | string>;
  components: Array<{ name: string; amount: number }>;
  installments: Installment[];
  totalAmount: number;
  isActive: boolean;
}

export interface Invoice {
  _id: string;
  title: string;
  studentId: (Ref & { enrollmentNo?: string; rollNo?: string; batchId?: Ref | null; guardians?: Guardian[] }) | string;
  items: Array<{ name: string; amount: number }>;
  discount?: { amount: number; reason?: string };
  totalAmount: number;
  paidAmount: number;
  balance: number;
  installments: Installment[];
  status: 'unpaid' | 'partial' | 'paid' | 'overdue' | 'cancelled';
  nextDueDate?: string;
  overdueAmount?: number;
  payments?: Payment[];
}

export interface Payment {
  _id: string;
  amount: number;
  mode: string;
  reference?: string;
  paidAt: string;
  receiptNo: string;
  status: 'success' | 'reversed';
  studentId?: Ref | string;
  receivedBy?: Ref | string;
}

export interface Announcement {
  _id: string;
  title: string;
  body: string;
  audience: { roles: Role[]; batchIds: string[]; programIds: string[] };
  isPinned?: boolean;
  createdBy?: Ref | string;
  createdAt: string;
  recipients?: number;
}

export interface LeaveRequest {
  _id: string;
  applicantUserId: (Ref & { phone?: string }) | string;
  applicantRole: Role;
  studentId?: (Ref & { enrollmentNo?: string }) | null;
  batchId?: Ref | null;
  type: string;
  fromDate: string;
  toDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  reviewNote?: string;
  createdAt: string;
}

export interface NotificationItem {
  _id: string;
  title: string;
  body: string;
  category: string;
  readAt?: string | null;
  createdAt: string;
}
