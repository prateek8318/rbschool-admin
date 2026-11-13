import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { AuthGuard, InstitutionGuard, PlatformGuard } from './AuthGuard';
import { RoleGuard } from './RoleGuard';

import { Login } from '../pages/Login';
import { SelectInstitution } from '../pages/SelectInstitution';
import { Dashboard } from '../pages/Dashboard';
import { Students } from '../pages/Students';
import { Teachers } from '../pages/Teachers';
import { Parents } from '../pages/Parents';
import { Classes } from '../pages/Classes';
import { Attendance } from '../pages/Attendance';
import { Exams } from '../pages/Exams';
import { Fees } from '../pages/Fees';
import { Announcements } from '../pages/Announcements';
import { Leaves } from '../pages/Leaves';
import { Settings } from '../pages/Settings';
import { Institutions } from '../pages/platform/Institutions';

const MANAGEMENT = ['owner', 'admin'] as const;

const managed = (element: React.ReactNode) => <RoleGuard allowedRoles={[...MANAGEMENT]}>{element}</RoleGuard>;

export const router = createBrowserRouter([
  { path: '/login', element: <Login /> },
  {
    path: '/select',
    element: (
      <AuthGuard>
        <SelectInstitution />
      </AuthGuard>
    ),
  },
  {
    path: '/platform',
    element: (
      <AuthGuard>
        <PlatformGuard>
          <AppLayout mode="platform" />
        </PlatformGuard>
      </AuthGuard>
    ),
    children: [{ index: true, element: <Institutions /> }],
  },
  {
    path: '/',
    element: (
      <AuthGuard>
        <InstitutionGuard>
          <AppLayout mode="institution" />
        </InstitutionGuard>
      </AuthGuard>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'students', element: managed(<Students />) },
      { path: 'teachers', element: managed(<Teachers />) },
      { path: 'parents', element: managed(<Parents />) },
      { path: 'classes', element: managed(<Classes />) },
      { path: 'attendance', element: managed(<Attendance />) },
      { path: 'exams', element: managed(<Exams />) },
      { path: 'fees', element: <RoleGuard allowedRoles={['owner', 'admin', 'accountant']}><Fees /></RoleGuard> },
      { path: 'announcements', element: managed(<Announcements />) },
      { path: 'leaves', element: managed(<Leaves />) },
      { path: 'settings', element: managed(<Settings />) },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);
