import type React from 'react';
import {
  Building2,
  CalendarCheck,
  ClipboardList,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Layers,
  Megaphone,
  Settings,
  UserRound,
  Users,
  Wallet,
} from 'lucide-react';
import { useInstitution } from '../../hooks/useInstitution';
import { plural } from '../../lib/format';
import type { Role } from '../../types';

export interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: Role[];
}

const MANAGEMENT: Role[] = ['owner', 'admin'];

/** The menu, shared with the top bar for page titles. */
export const useNavigation = (mode: 'platform' | 'institution') => {
  const { terms } = useInstitution();
  if (mode === 'platform') {
    return [{ title: 'Platform', items: [{ name: 'Institutions', href: '/platform', icon: Building2 }] as NavItem[] }];
  }
  return [
    {
      title: 'Overview',
      items: [{ name: 'Dashboard', href: '/', icon: LayoutDashboard }] as NavItem[],
    },
    {
      title: 'People',
      items: [
        { name: plural(terms.student), href: '/students', icon: Users, roles: MANAGEMENT },
        { name: `${plural(terms.teacher)} & Staff`, href: '/teachers', icon: GraduationCap, roles: MANAGEMENT },
        { name: plural(terms.guardian), href: '/parents', icon: UserRound, roles: MANAGEMENT },
      ] as NavItem[],
    },
    {
      title: 'Academics',
      items: [
        { name: terms.program === terms.batch ? plural(terms.program) : `${plural(terms.program)} & ${plural(terms.batch)}`, href: '/classes', icon: Layers, roles: MANAGEMENT },
        { name: 'Attendance', href: '/attendance', icon: CalendarCheck, roles: MANAGEMENT },
        { name: 'Exams & Results', href: '/exams', icon: FileText, roles: MANAGEMENT },
      ] as NavItem[],
    },
    {
      title: 'Finance',
      items: [{ name: 'Fees', href: '/fees', icon: Wallet, roles: [...MANAGEMENT, 'accountant'] }] as NavItem[],
    },
    {
      title: 'Communication',
      items: [
        { name: 'Announcements', href: '/announcements', icon: Megaphone, roles: MANAGEMENT },
        { name: 'Leave Requests', href: '/leaves', icon: ClipboardList, roles: MANAGEMENT },
      ] as NavItem[],
    },
    {
      title: 'Administration',
      items: [{ name: 'Settings', href: '/settings', icon: Settings, roles: MANAGEMENT }] as NavItem[],
    },
  ];
};

