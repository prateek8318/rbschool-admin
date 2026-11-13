import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import type { Role } from '../types';

/** Restricts a page to some institution roles (e.g. accountants only see fees). */
export const RoleGuard: React.FC<{ children: React.ReactNode; allowedRoles: Role[] }> = ({ children, allowedRoles }) => {
  const role = useAuthStore((state) => state.active?.role);
  if (!role || !allowedRoles.includes(role)) return <Navigate to="/" replace />;
  return <>{children}</>;
};
