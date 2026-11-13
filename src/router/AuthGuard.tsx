import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { PANEL_ROLES, useAuthStore } from '../store/authStore';

export const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  return <>{children}</>;
};

/** Pages that work inside one institution (as owner/admin/accountant). */
export const InstitutionGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { active, isPlatformAdmin } = useAuthStore();
  if (!active || !(PANEL_ROLES as readonly string[]).includes(active.role)) {
    return <Navigate to={isPlatformAdmin ? '/platform' : '/select'} replace />;
  }
  return <>{children}</>;
};

export const PlatformGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isPlatformAdmin = useAuthStore((state) => state.isPlatformAdmin);
  if (!isPlatformAdmin) return <Navigate to="/" replace />;
  return <>{children}</>;
};
