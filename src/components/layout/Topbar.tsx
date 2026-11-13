import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Bell, ChevronDown, KeyRound, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';
import { authApi, notificationsApi } from '../../api';
import { errorMessage } from '../../api/client';
import { useAuthStore } from '../../store/authStore';
import { dateTime, roleLabel } from '../../lib/format';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Avatar, Field, inputClass } from '../ui/Kit';
import { useNavigation } from './navigation';
import logoImage from '../../assets/R. B. LOGO.png';

/** Top bar: menu button (mobile), current section, notifications and profile menu. */
export const Topbar: React.FC<{ mode: 'platform' | 'institution' }> = ({ mode }) => {
  const { user, active, logout } = useAuthStore();
  const [open, setOpen] = useState<'notifications' | 'profile' | null>(null);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const sections = useNavigation(mode);

  const current = sections
    .flatMap((section) => section.items.map((item) => ({ ...item, section: section.title })))
    .find((item) => (item.href === '/' || item.href === '/platform' ? location.pathname === item.href : location.pathname.startsWith(item.href)));

  const inInstitution = mode === 'institution' && Boolean(active);
  const unread = useQuery({ queryKey: ['unread'], queryFn: notificationsApi.unreadCount, enabled: inInstitution, refetchInterval: 60_000 });
  const list = useQuery({ queryKey: ['notifications'], queryFn: () => notificationsApi.list({ limit: 8 }), enabled: inInstitution && open === 'notifications' });
  const readAll = useMutation({
    mutationFn: notificationsApi.readAll,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unread'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const signOut = async () => {
    await authApi.logout().catch(() => undefined);
    logout();
    queryClient.clear();
    navigate('/login');
  };

  const unreadCount = unread.data?.unread ?? 0;

  return (
    <>
      <header className="sticky top-0 z-30 h-16 flex items-center justify-between gap-4 glass-bar border-b border-white/60 lg:border-transparent lg:bg-transparent lg:backdrop-blur-0 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 min-w-0">
          <img src={(mode === 'institution' && active?.institution.logoUrl) || logoImage} alt="" className="lg:hidden w-9 h-9 rounded-xl object-contain bg-white shadow ring-1 ring-slate-900/5" />
          <nav className="flex items-center gap-2 text-sm min-w-0">
            <span className="text-slate-400 hidden sm:inline truncate">{current?.section ?? ''}</span>
            {current?.section && <span className="text-slate-300 hidden sm:inline">/</span>}
            <span className="font-semibold lg:font-medium text-base lg:text-sm text-slate-900 truncate">{current?.name ?? ''}</span>
          </nav>
        </div>

        <div className="flex items-center gap-1">
          {inInstitution && (
            <div className="relative">
              <button
                onClick={() => setOpen(open === 'notifications' ? null : 'notifications')}
                className="press relative p-2.5 rounded-xl text-slate-500 hover:bg-white/70 hover:text-slate-700"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-semibold flex items-center justify-center ring-2 ring-white">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>
              {open === 'notifications' && (
                <div className="absolute right-0 top-full mt-2 w-[22rem] max-w-[calc(100vw-2rem)] glass-strong rounded-2xl z-40 animate-pop-in overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-900">Notifications</h3>
                    {unreadCount > 0 && (
                      <button className="text-xs font-medium text-indigo-600 hover:text-indigo-700" onClick={() => readAll.mutate()}>
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
                    {list.data?.items.length ? (
                      list.data.items.map((item) => (
                        <div key={item._id} className="px-4 py-3 flex gap-3">
                          <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${item.readAt ? 'bg-transparent' : 'bg-indigo-500'}`} />
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-slate-900">{item.title}</div>
                            <div className="text-xs text-slate-500 mt-0.5">{item.body}</div>
                            <div className="text-[11px] text-slate-400 mt-1">{dateTime(item.createdAt)}</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-10 text-center text-sm text-slate-500">{list.isLoading ? 'Loading…' : "You're all caught up"}</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="relative">
            <button onClick={() => setOpen(open === 'profile' ? null : 'profile')} className="press flex items-center gap-2 rounded-xl p-1.5 hover:bg-white/70">
              <Avatar name={user?.name} />
              <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
            </button>
            {open === 'profile' && (
              <div className="absolute right-0 top-full mt-2 w-60 glass-strong rounded-2xl z-40 py-1 animate-pop-in overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100">
                  <div className="text-sm font-medium text-slate-900 truncate">{user?.name}</div>
                  <div className="text-xs text-slate-500 truncate">{user?.email ?? user?.phone}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{mode === 'platform' ? 'Super admin' : `${roleLabel[active?.role ?? '']} · ${active?.institution.name}`}</div>
                </div>
                <button onClick={() => { setOpen(null); setPasswordOpen(true); }} className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3">
                  <KeyRound className="w-4 h-4 text-slate-400" /> Change password
                </button>
                <button onClick={signOut} className="w-full px-4 py-2 text-left text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-3">
                  <LogOut className="w-4 h-4" /> Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      {open && <div className="fixed inset-0 z-20" onClick={() => setOpen(null)} />}
      {passwordOpen && <ChangePasswordModal onClose={() => setPasswordOpen(false)} />}
    </>
  );
};

const ChangePasswordModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const mutation = useMutation({
    mutationFn: () => authApi.changePassword(current, next),
    onSuccess: () => {
      toast.success('Password changed. Other devices have been signed out.');
      onClose();
    },
    onError: (error) => toast.error(errorMessage(error)),
  });
  const mismatch = confirm.length > 0 && confirm !== next;
  return (
    <Modal isOpen onClose={onClose} title="Change password" maxWidth="md">
      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); if (!mismatch) mutation.mutate(); }}>
        <Field label="Current password">
          <input type="password" className={inputClass} value={current} onChange={(e) => setCurrent(e.target.value)} autoComplete="current-password" required />
        </Field>
        <Field label="New password" hint="At least 8 characters">
          <input type="password" className={inputClass} value={next} onChange={(e) => setNext(e.target.value)} minLength={8} autoComplete="new-password" required />
        </Field>
        <Field label="Confirm new password" hint={mismatch ? 'Passwords do not match' : undefined}>
          <input type="password" className={inputClass} value={confirm} onChange={(e) => setConfirm(e.target.value)} minLength={8} autoComplete="new-password" required />
        </Field>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={mutation.isPending} disabled={mismatch}>Update password</Button>
        </div>
      </form>
    </Modal>
  );
};
