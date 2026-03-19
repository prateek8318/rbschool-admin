export type Role = 'ADMIN' | 'TEACHER' | 'STUDENT';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

export interface Student {
  id: string;
  admissionNumber: string;
  firstName: string;
  lastName: string;
  classId: string;
  section: string;
  rollNumber: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  dateOfBirth: string;
  parentName: string;
  parentPhone: string;
  address: string;
  joinedAt: string;
}

export interface Teacher {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  qualification: string;
  joinedAt: string;
}

export interface Class {
  id: string;
  name: string;
  section: string;
  teacherId: string; // Class teacher
  capacity: number;
  studentCount: number;
}

export interface Attendance {
  id: string;
  studentId: string;
  classId: string;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF_DAY';
  remarks?: string;
}

export interface Exam {
  id: string;
  name: string;
  classId: string;
  subject: string;
  date: string;
  maxMarks: number;
  passingMarks: number;
}

export interface Fee {
  id: string;
  studentId: string;
  amount: number;
  dueDate: string;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
  paidAt?: string;
}

export interface CommonResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
}
