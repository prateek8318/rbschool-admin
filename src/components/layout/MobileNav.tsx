import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowLeftRight, Grid2x2, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';
import { authApi } from '../../api';
import { errorMessage } from '../../api/client';
import { useAuthStore } from '../../store/authStore';
import { Modal } from '../ui/Modal';
import { useNavigation, type NavItem } from './navigation';

/** App-style bottom tab bar for phones, with a "More" sheet for everything else. */
export const MobileNav: React.FC<{ mode: 'platform' | 'institution' }> = ({ mode }) => {
  const sections = useNavigation(mode);
  const { active, isPlatformAdmin, setActive, logout } = useAuthStore();
  const [moreOpen, setMoreOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const all = sections.flatMap((section) => section.items).filter((item) => !item.roles || (active && item.roles.includes(active.role)));
  const preferred = ['/', '/students', '/attendance', '/fees', '/platform'];
  const tabs = preferred.map((href) => all.find((item) => item.href === href)).filter(Boolean).slice(0, 4) as NavItem[];
  const isActive = (href: string) => (href === '/' || href === '/platform' ? location.pathname === href : location.pathname.startsWith(href));
  const moreActive = !tabs.some((tab) => isActive(tab.href));

  const go = (href: string) => {
    setMoreOpen(false);
    navigate(href);
  };

  const backToPlatform = async () => {
    try {
      const result = await authApi.switchTo({});
      setActive(result.accessToken, null);
      queryClient.clear();
      setMoreOpen(false);
      navigate('/platform');
    } catch (error) {
      toast.error(errorMessage(error));
    }
  };

  const signOut = async () => {
    await authApi.logout().catch(() => undefined);
    logout();
    queryClient.clear();
    navigate('/login');
  };

  const tabClass = (on: boolean) =>
    `press relative flex flex-1 flex-col items-center justify-center gap-1 h-full text-[11px] font-medium transition-colors ${on ? 'text-indigo-600' : 'text-slate-500'}`;

  return (
    <>
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 glass-bar border-t border-white/70 shadow-[0_-8px_24px_-12px_rgb(15_23_42/0.18)]" style={{ paddingBottom: 'var(--safe-bottom)' }}>
        <div className="flex h-16 px-2">
          {tabs.map((tab) => {
            const on = isActive(tab.href);
            return (
              <NavLink key={tab.href} to={tab.href} end={tab.href === '/' || tab.href === '/platform'} className={tabClass(on)}>
                <span className={`flex items-center justify-center w-12 h-8 rounded-full transition-all duration-300 ${on ? 'bg-indigo-600/10 scale-100' : 'scale-90'}`}>
                  <tab.icon className="w-[22px] h-[22px]" />
                </span>
                <span className="truncate max-w-[72px]">{tab.href === '/' ? 'Home' : tab.name.split(' ')[0]}</span>
              </NavLink>
            );
          })}
          <button onClick={() => setMoreOpen(true)} className={tabClass(moreActive || moreOpen)}>
            <span className={`flex items-center justify-center w-12 h-8 rounded-full transition-all duration-300 ${moreActive || moreOpen ? 'bg-indigo-600/10' : ''}`}>
              <Grid2x2 className="w-[22px] h-[22px]" />
            </span>
            <span>More</span>
          </button>
        </div>
      </nav>

      <Modal isOpen={moreOpen} onClose={() => setMoreOpen(false)} title={mode === 'platform' ? 'Platform' : active?.institution.name ?? 'Menu'}>
        <div className="space-y-5">
          {sections.map((section) => {
            const items = section.items.filter((item) => !item.roles || (active && item.roles.includes(active.role)));
            if (!items.length) return null;
            return (
              <div key={section.title}>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">{section.title}</div>
                <div className="grid grid-cols-3 gap-2">
                  {items.map((item) => {
                    const on = isActive(item.href);
                    return (
                      <button
                        key={item.href}
                        onClick={() => go(item.href)}
                        className={`press flex flex-col items-center gap-2 rounded-2xl p-3 text-center text-xs font-medium ring-1 transition-colors ${
                          on ? 'bg-indigo-600 text-white ring-indigo-600 shadow-lg shadow-indigo-600/25' : 'bg-white/70 text-slate-700 ring-slate-900/5'
                        }`}
                      >
                        <item.icon className={`w-6 h-6 ${on ? 'text-white' : 'text-indigo-600'}`} />
                        <span className="leading-tight">{item.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
          <div className="grid gap-2 pt-1">
            {isPlatformAdmin && mode === 'institution' && (
              <button onClick={backToPlatform} className="press flex items-center gap-3 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
                <ArrowLeftRight className="w-5 h-5" /> Back to platform
              </button>
            )}
            <button onClick={signOut} className="press flex items-center gap-3 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
              <LogOut className="w-5 h-5" /> Log out
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
