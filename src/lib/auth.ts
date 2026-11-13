import { PANEL_ROLES } from '../store/authStore';
import type { LoginResult } from '../types';

/** Where to go after a successful login. Returns an error message if the user can't use this panel. */
export const routeAfterLogin = (result: Pick<LoginResult, 'isPlatformAdmin' | 'activeMembership' | 'memberships'>): { to: string } | { error: string } => {
  const panelMemberships = result.memberships.filter((m) => (PANEL_ROLES as readonly string[]).includes(m.role));
  if (result.activeMembership && (PANEL_ROLES as readonly string[]).includes(result.activeMembership.role)) return { to: '/' };
  if (result.isPlatformAdmin) return { to: '/platform' };
  if (panelMemberships.length) return { to: '/select' };
  return { error: 'This panel is for institution admins. Teachers and parents should use the mobile app.' };
};
