import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { AuthGuard } from './AuthGuard';

import { Login } from '../pages/Login';
import { Dashboard } from '../pages/Dashboard';
import { Students } from '../pages/Students';
import { Teachers } from '../pages/Teachers';
import { Classes } from '../pages/Classes';
import { Attendance } from '../pages/Attendance';
import { Exams } from '../pages/Exams';
import { Fees } from '../pages/Fees';
import { Announcements } from '../pages/Announcements';
import { Settings } from '../pages/Settings';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: (
      <AuthGuard>
        <AppLayout />
      </AuthGuard>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'students', element: <Students /> },
      { path: 'teachers', element: <Teachers /> },
      { path: 'classes', element: <Classes /> },
      { path: 'attendance', element: <Attendance /> },
      { path: 'exams', element: <Exams /> },
      { path: 'fees', element: <Fees /> },
      { path: 'announcements', element: <Announcements /> },
      { path: 'settings', element: <Settings /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);
