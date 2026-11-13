import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ArrowLeftRight, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { authApi } from '../../api';
import { errorMessage } from '../../api/client';
import { roleLabel } from '../../lib/format';
import { useNavigation, type NavItem } from './navigation';
import { Avatar } from '../ui/Kit';
import logoImage from '../../assets/R. B. LOGO.png';

/** Desktop sidebar (phones use the bottom tab bar instead). */
export const Sidebar: React.FC<{ mode: 'platform' | 'institution' }> = ({ mode }) => {
  const { logout, active, isPlatformAdmin, setActive, user, memberships } = useAuthStore();
  const sections = useNavigation(mode);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const canSwitch = memberships.filter((m) => ['owner', 'admin', 'accountant'].includes(m.role)).length > 1;

  const handleLogout = async () => {
    await authApi.logout().catch(() => undefined);
    logout();
    queryClient.clear();
    navigate('/login');
  };

  const backToPlatform = async () => {
    try {
      const result = await authApi.switchTo({});
      setActive(result.accessToken, null);
      queryClient.clear();
      navigate('/platform');
    } catch (error) {
      toast.error(errorMessage(error));
    }
  };

  const visible = (item: NavItem) => !item.roles || (active && item.roles.includes(active.role));

  return (
    <aside className="hidden lg:flex sticky top-0 h-screen w-[268px] shrink-0 flex-col p-3">
      <div className="glass flex h-full flex-col rounded-3xl overflow-hidden">
        {/* Brand */}
        <div className="flex items-center gap-3 px-4 pt-5 pb-4">
          <div className="relative">
            <img src={(mode === 'institution' && active?.institution.logoUrl) || logoImage} alt="" className="w-11 h-11 rounded-2xl object-contain bg-white shadow-md ring-1 ring-slate-900/5" />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" title="Online" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-slate-900 truncate">{mode === 'platform' ? 'RB Education' : active?.institution.name}</div>
            <div className="text-xs text-slate-500 truncate capitalize">{mode === 'platform' ? 'Platform admin' : active?.institution.type.replace('_', ' ')}</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-5">
          {sections.map((section) => {
            const items = section.items.filter(visible);
            if (!items.length) return null;
            return (
              <div key={section.title}>
                <div className="px-3 mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">{section.title}</div>
                <div className="space-y-0.5">
                  {items.map((item) => (
                    <NavLink
                      key={item.href}
                      to={item.href}
                      end={item.href === '/' || item.href === '/platform'}
                      className={({ isActive }) =>
                        `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                          isActive ? 'brand-gradient text-white shadow-lg shadow-indigo-600/25' : 'text-slate-600 hover:bg-white/70 hover:text-slate-900'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <item.icon className={`w-[18px] h-[18px] shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'}`} />
                          <span className="truncate">{item.name}</span>
                        </>
                      )}
                    </NavLink>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-900/[0.06] p-3 space-y-1">
          {isPlatformAdmin && mode === 'institution' && (
            <button onClick={backToPlatform} className="press w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-amber-700 hover:bg-amber-50/80">
              <ArrowLeftRight className="w-[18px] h-[18px]" /> Back to platform
            </button>
          )}
          {canSwitch && mode === 'institution' && (
            <button onClick={() => navigate('/select')} className="press w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 hover:bg-white/70">
              <ArrowLeftRight className="w-[18px] h-[18px] text-slate-400" /> Switch institution
            </button>
          )}
          <div className="flex items-center gap-3 rounded-2xl bg-white/60 ring-1 ring-slate-900/5 px-3 py-2.5">
            <Avatar name={user?.name} />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-slate-900 truncate">{user?.name}</div>
              <div className="text-xs text-slate-500 truncate">{mode === 'platform' ? 'Super admin' : roleLabel[active?.role ?? '']}</div>
            </div>
            <button onClick={handleLogout} className="press p-1.5 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600" title="Log out" aria-label="Log out">
              <LogOut className="w-[18px] h-[18px]" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
