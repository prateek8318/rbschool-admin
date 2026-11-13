import React, { useState } from 'react';
import { AlertCircle, Check, Copy, KeyRound, Phone, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { Modal } from './Modal';
import { Button } from './Button';
import type { Credential } from '../../types';
import { roleLabel } from '../../lib/format';
import { errorMessage } from '../../api/client';
import { usePageTitle } from '../../lib/ui';

/** Page title row with optional actions on the right. Also sets the tab title. */
export const PageHeader: React.FC<{ title: string; subtitle?: React.ReactNode; actions?: React.ReactNode }> = ({ title, subtitle, actions }) => {
  usePageTitle(title);
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6">
      <div className="min-w-0">
        <h1 className="text-2xl sm:text-[26px] font-semibold text-slate-900 tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">{actions}</div>}
    </div>
  );
};

export const Page: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="page-enter px-4 pt-5 sm:px-6 lg:px-8 lg:pt-8 pb-nav max-w-[1440px] mx-auto w-full">{children}</div>
);

const toneClasses = {
  blue: 'bg-indigo-50 text-indigo-600',
  green: 'bg-emerald-50 text-emerald-600',
  amber: 'bg-amber-50 text-amber-600',
  rose: 'bg-rose-50 text-rose-600',
  purple: 'bg-violet-50 text-violet-600',
  slate: 'bg-slate-100 text-slate-600',
};

export const StatCard: React.FC<{
  label: string;
  value: React.ReactNode;
  hint?: React.ReactNode;
  icon?: React.ReactNode;
  tone?: keyof typeof toneClasses;
  loading?: boolean;
}> = ({ label, value, hint, icon, tone = 'blue', loading }) => (
  <div className="glass lift rounded-2xl p-4 sm:p-5">
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm font-medium text-slate-500 truncate">{label}</span>
      {icon && <span className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center ring-1 ring-inset ring-white/60 ${toneClasses[tone]}`}>{icon}</span>}
    </div>
    {loading ? <div className="skeleton h-8 w-28 mt-3" /> : <div className="text-[26px] leading-tight font-semibold text-slate-900 mt-2 tabular truncate">{value}</div>}
    {hint && <div className="text-xs text-slate-500 mt-1">{hint}</div>}
  </div>
);

export const Panel: React.FC<{ title?: React.ReactNode; description?: React.ReactNode; actions?: React.ReactNode; children: React.ReactNode; className?: string; padded?: boolean }> = ({
  title,
  description,
  actions,
  children,
  className = '',
  padded = true,
}) => (
  <section className={`glass rounded-2xl ${className}`}>
    {(title || actions) && (
      <div className="px-4 sm:px-5 py-4 border-b border-slate-900/[0.06] flex flex-wrap items-center justify-between gap-3">
        <div>
          {title && <h3 className="text-sm font-semibold text-slate-900">{title}</h3>}
          {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
        </div>
        {actions}
      </div>
    )}
    <div className={padded ? 'p-4 sm:p-5' : ''}>{children}</div>
  </section>
);

/** Inline error with a retry button, for failed queries. */
export const ErrorState: React.FC<{ error: unknown; onRetry?: () => void }> = ({ error, onRetry }) => (
  <div className="flex items-start gap-3 rounded-2xl border border-rose-200/80 bg-rose-50/80 backdrop-blur px-4 py-3 text-sm text-rose-700 mb-4 animate-pop-in">
    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
    <span className="flex-1">{errorMessage(error)}</span>
    {onRetry && (
      <button onClick={onRetry} className="inline-flex items-center gap-1 font-medium hover:underline">
        <RefreshCw className="w-3.5 h-3.5" /> Retry
      </button>
    )}
  </div>
);

/** Shows temporary login details once, right after an account is created. */
export const CredentialsDialog: React.FC<{ credentials: Credential[]; onClose: () => void; note?: string }> = ({ credentials, onClose, note }) => {
  const [copied, setCopied] = useState<number | null>(null);
  if (!credentials.length) return null;

  const copy = async (credential: Credential, index: number) => {
    try {
      await navigator.clipboard.writeText(`Login: ${credential.login}\nPassword: ${credential.tempPassword}`);
      setCopied(index);
      toast.success('Copied to clipboard');
    } catch {
      toast.error('Could not copy');
    }
  };

  return (
    <Modal isOpen onClose={onClose} title="Account created" description={note ?? 'They can sign in with their mobile number using OTP. A temporary password is shown below only once.'} maxWidth="lg">
      <div className="space-y-3">
        {credentials.map((credential, index) => (
          <div key={index} className="rounded-xl border border-slate-200 bg-white/70 p-4 flex items-center justify-between gap-3">
            <div className="min-w-0 space-y-1">
              <div className="font-medium text-slate-900">
                {credential.name} <span className="text-xs font-normal text-slate-500">· {roleLabel[credential.role] ?? credential.role}</span>
              </div>
              <div className="text-sm text-slate-600 flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-slate-400" /> {credential.login}</div>
              <div className="text-sm text-slate-600 flex items-center gap-2"><KeyRound className="w-3.5 h-3.5 text-slate-400" /> <code className="font-mono">{credential.tempPassword}</code></div>
            </div>
            <Button variant="outline" size="sm" onClick={() => copy(credential, index)} leftIcon={copied === index ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}>
              Copy
            </Button>
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-end">
        <Button onClick={onClose}>Done</Button>
      </div>
    </Modal>
  );
};

export const Field: React.FC<{ label: string; children: React.ReactNode; hint?: string }> = ({ label, children, hint }) => (
  <label className="block">
    <span className="block text-sm font-medium text-slate-700 mb-1.5">{label}</span>
    {children}
    {hint && <span className="block text-xs text-slate-500 mt-1">{hint}</span>}
  </label>
);

export const inputClass = 'input-field px-3';

export const Tabs: React.FC<{ tabs: Array<{ id: string; label: string; count?: number }>; active: string; onChange: (id: string) => void }> = ({ tabs, active, onChange }) => (
  <div className="mb-6 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto no-scrollbar">
    <nav className="inline-flex gap-1 p-1 rounded-2xl glass">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`press px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
            active === tab.id ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-slate-900/5' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          {tab.label}
          {tab.count !== undefined && <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{tab.count}</span>}
        </button>
      ))}
    </nav>
  </div>
);

const statusStyles: Record<string, string> = {
  active: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  paid: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  approved: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  published: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  present: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  marked: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  pass: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  partial: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  pending: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  late: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  scheduled: 'bg-indigo-50 text-indigo-700 ring-indigo-600/20',
  unpaid: 'bg-slate-100 text-slate-700 ring-slate-500/20',
  incomplete: 'bg-slate-100 text-slate-700 ring-slate-500/20',
  alumni: 'bg-slate-100 text-slate-700 ring-slate-500/20',
  cancelled: 'bg-slate-100 text-slate-500 ring-slate-500/20',
  overdue: 'bg-rose-50 text-rose-700 ring-rose-600/20',
  rejected: 'bg-rose-50 text-rose-700 ring-rose-600/20',
  absent: 'bg-rose-50 text-rose-700 ring-rose-600/20',
  fail: 'bg-rose-50 text-rose-700 ring-rose-600/20',
  suspended: 'bg-rose-50 text-rose-700 ring-rose-600/20',
  blocked: 'bg-rose-50 text-rose-700 ring-rose-600/20',
  inactive: 'bg-rose-50 text-rose-700 ring-rose-600/20',
  dropped: 'bg-rose-50 text-rose-700 ring-rose-600/20',
  transferred: 'bg-slate-100 text-slate-700 ring-slate-500/20',
};

export const StatusBadge: React.FC<{ status: string; label?: string }> = ({ status, label }) => (
  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium capitalize ring-1 ring-inset ${statusStyles[status] ?? 'bg-slate-100 text-slate-700 ring-slate-500/20'}`}>
    <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
    {label ?? status.replace(/_/g, ' ')}
  </span>
);

/** Small avatar with initials. */
export const Avatar: React.FC<{ name?: string; size?: 'sm' | 'md' }> = ({ name, size = 'sm' }) => {
  const letters = (name ?? '?').split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join('');
  const palette = ['bg-indigo-100 text-indigo-700', 'bg-emerald-100 text-emerald-700', 'bg-amber-100 text-amber-700', 'bg-rose-100 text-rose-700', 'bg-sky-100 text-sky-700', 'bg-violet-100 text-violet-700'];
  const color = palette[(name ?? '').split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % palette.length];
  return (
    <span className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold ${color} ${size === 'sm' ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm'}`}>
      {letters}
    </span>
  );
};

/** Name cell with avatar and a secondary line. */
export const PersonCell: React.FC<{ name: string; sub?: React.ReactNode }> = ({ name, sub }) => (
  <div className="flex items-center gap-3 min-w-0">
    <Avatar name={name} />
    <div className="min-w-0">
      <div className="font-medium text-slate-900 truncate">{name}</div>
      {sub && <div className="text-xs text-slate-500 truncate">{sub}</div>}
    </div>
  </div>
);

/** Search box with icon. */
export const SearchInput: React.FC<{ value: string; onChange: (value: string) => void; placeholder?: string }> = ({ value, onChange, placeholder }) => (
  <div className="relative flex-1 min-w-[220px] max-w-md">
    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
    <input className="input-field pl-9 pr-3" placeholder={placeholder ?? 'Search'} value={value} onChange={(e) => onChange(e.target.value)} />
  </div>
);

/** Row of filters above tables. */
export const Toolbar: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 mb-4">{children}</div>
);
