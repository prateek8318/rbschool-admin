export const money = (value: number | undefined | null, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(value ?? 0);

export const compactMoney = (value: number | undefined | null) => {
  const amount = value ?? 0;
  if (amount >= 1e7) return `₹${(amount / 1e7).toFixed(1)}Cr`;
  if (amount >= 1e5) return `₹${(amount / 1e5).toFixed(1)}L`;
  if (amount >= 1e3) return `₹${(amount / 1e3).toFixed(1)}K`;
  return `₹${amount}`;
};

export const date = (value?: string | null) => {
  if (!value) return '—';
  const parsed = new Date(value.length === 10 ? `${value}T00:00:00` : value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const dateTime = (value?: string | null) =>
  value ? new Date(value).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—';

export const today = () => {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
};

export const refName = (value: unknown): string => {
  if (!value) return '—';
  if (typeof value === 'string') return value;
  return (value as { name?: string }).name ?? '—';
};

export const refId = (value: unknown): string => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return (value as { _id?: string })._id ?? '';
};

export const initials = (name?: string) =>
  (name ?? '?')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

/** English plural for UI labels: Class→Classes, Batch→Batches, Section→Sections. */
export const plural = (word: string) => {
  if (/(s|x|z|ch|sh)$/i.test(word)) return `${word}es`;
  if (/[^aeiou]y$/i.test(word)) return `${word.slice(0, -1)}ies`;
  return `${word}s`;
};

export const roleLabel: Record<string, string> = {
  owner: 'Owner',
  admin: 'Admin',
  accountant: 'Accountant',
  teacher: 'Teacher',
  staff: 'Staff',
  student: 'Student',
  guardian: 'Parent',
};

const MODE_LABELS: Record<string, string> = {
  cash: 'Cash',
  upi: 'UPI',
  card: 'Card',
  bank_transfer: 'Bank transfer',
  cheque: 'Cheque',
  online: 'Online',
};

export const modeLabel = (mode: string) => MODE_LABELS[mode] ?? mode;
