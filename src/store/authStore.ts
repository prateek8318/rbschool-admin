import { create } from 'zustand';
import type { AuthUser, MembershipView } from '../types';

const STORAGE_KEY = 'rbschool_auth_v2';

interface PersistedAuth {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  isPlatformAdmin: boolean;
  memberships: MembershipView[];
  active: MembershipView | null;
}

interface AuthState extends PersistedAuth {
  isAuthenticated: boolean;
  setSession: (session: {
    accessToken: string;
    refreshToken: string;
    user: AuthUser;
    isPlatformAdmin: boolean;
    memberships: MembershipView[];
    activeMembership: MembershipView | null;
  }) => void;
  setActive: (accessToken: string, active: MembershipView | null) => void;
  updateTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: AuthUser) => void;
  logout: () => void;
}

const empty: PersistedAuth = {
  accessToken: null,
  refreshToken: null,
  user: null,
  isPlatformAdmin: false,
  memberships: [],
  active: null,
};

const load = (): PersistedAuth => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...empty, ...JSON.parse(raw) } : empty;
  } catch {
    return empty;
  }
};

const save = (state: PersistedAuth) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable */
  }
};

const pick = (state: AuthState): PersistedAuth => ({
  accessToken: state.accessToken,
  refreshToken: state.refreshToken,
  user: state.user,
  isPlatformAdmin: state.isPlatformAdmin,
  memberships: state.memberships,
  active: state.active,
});

const initial = load();

export const useAuthStore = create<AuthState>((set, getState) => ({
  ...initial,
  isAuthenticated: Boolean(initial.accessToken),

  setSession: (session) => {
    set({
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      user: session.user,
      isPlatformAdmin: session.isPlatformAdmin,
      memberships: session.memberships,
      active: session.activeMembership,
      isAuthenticated: true,
    });
    save(pick(getState()));
  },

  setActive: (accessToken, active) => {
    set({ accessToken, active });
    save(pick(getState()));
  },

  updateTokens: (accessToken, refreshToken) => {
    set({ accessToken, refreshToken });
    save(pick(getState()));
  },

  setUser: (user) => {
    set({ user });
    save(pick(getState()));
  },

  logout: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('token');
    } catch {
      /* ignore */
    }
    set({ ...empty, isAuthenticated: false });
  },
}));

/** Roles that may use this admin panel. */
export const PANEL_ROLES = ['owner', 'admin', 'accountant'] as const;
