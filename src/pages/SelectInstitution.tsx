import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, ChevronRight, Loader2, LogOut, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { authApi } from '../api';
import { errorMessage } from '../api/client';
import { PANEL_ROLES, useAuthStore } from '../store/authStore';
import { roleLabel } from '../lib/format';
import logoImage from '../assets/R. B. LOGO.png';

/** Shown when a person manages more than one institution. */
export const SelectInstitution: React.FC = () => {
  const { memberships, setActive, logout, user, isPlatformAdmin } = useAuthStore();
  const [busy, setBusy] = useState<string | null>(null);
  const navigate = useNavigate();
  const options = memberships.filter((m) => (PANEL_ROLES as readonly string[]).includes(m.role));

  useEffect(() => {
    document.title = 'Choose institution · RB Education Admin';
  }, []);

  const choose = async (membershipId: string) => {
    setBusy(membershipId);
    try {
      const result = await authApi.switchTo({ membershipId });
      setActive(result.accessToken, result.activeMembership);
      navigate('/', { replace: true });
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4"><div className="app-bg" aria-hidden />
      <div className="w-full max-w-md">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <img src={logoImage} alt="" className="w-10 h-10 rounded-xl object-contain bg-white ring-1 ring-slate-200" />
          <span className="font-semibold text-slate-900">RB Education</span>
        </div>
        <div className="glass rounded-3xl p-6">
          <h1 className="text-lg font-semibold text-slate-900">Choose an institution</h1>
          <p className="text-sm text-slate-500 mt-1 mb-5">Hi {user?.name?.split(' ')[0]}, you have access to more than one institution.</p>
          <div className="space-y-2">
            {options.map((m) => (
              <button
                key={m.membershipId}
                onClick={() => choose(m.membershipId)}
                disabled={Boolean(busy)}
                className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 transition-colors text-left disabled:opacity-60"
              >
                <span className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5" />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-sm font-medium text-slate-900 truncate">{m.institution.name}</span>
                  <span className="block text-xs text-slate-500 capitalize">{m.institution.type.replace('_', ' ')} · {roleLabel[m.role]}</span>
                </span>
                {busy === m.membershipId ? <Loader2 className="w-4 h-4 animate-spin text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
              </button>
            ))}
            {isPlatformAdmin && (
              <button onClick={() => navigate('/platform')} className="w-full flex items-center gap-3 p-3 rounded-lg border border-dashed border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50">
                <ShieldCheck className="w-5 h-5 text-slate-400" /> Platform administration
              </button>
            )}
          </div>
        </div>
        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="mt-5 mx-auto flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800"
        >
          <LogOut className="w-4 h-4" /> Sign out
        </button>
      </div>
    </div>
  );
};
