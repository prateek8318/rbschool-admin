import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AlertTriangle, Download, IndianRupee, Plus, Receipt, Search, Trash2, Wallet } from 'lucide-react';
import toast from 'react-hot-toast';
import { feesApi } from '../api';
import { errorMessage } from '../api/client';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Table } from '../components/ui/Table';
import { Pagination } from '../components/ui/Pagination';
import { Field, inputClass, Page, PageHeader, Panel, StatCard, StatusBadge, Tabs } from '../components/ui/Kit';
import { AreaTrend, BarList, SegmentedBar } from '../components/charts/Charts';
import { SERIES, STATUS } from '../components/charts/palette';
import { chipClass } from '../lib/ui';
import { useBatches, useInstitution, usePrograms } from '../hooks/useInstitution';
import { useAuthStore } from '../store/authStore';
import { compactMoney, date, modeLabel, money, plural, refName, today } from '../lib/format';
import type { Invoice } from '../types';

const MODES = ['cash', 'upi', 'card', 'bank_transfer', 'cheque', 'online'];

export const Fees: React.FC = () => {
  const [tab, setTab] = useState('overview');
  const isManagement = useAuthStore((state) => state.active?.role !== 'accountant');
  return (
    <Page>
      <PageHeader title="Fees" subtitle="Fee plans, invoices, collections and defaulters" />
      <Tabs
        active={tab}
        onChange={setTab}
        tabs={[
          { id: 'overview', label: 'Overview' },
          { id: 'invoices', label: 'Invoices' },
          { id: 'plans', label: 'Fee plans' },
          { id: 'payments', label: 'Payments' },
          { id: 'overdue', label: 'Defaulters' },
        ]}
      />
      {tab === 'overview' && <Overview />}
      {tab === 'invoices' && <Invoices />}
      {tab === 'plans' && <Plans canEdit={isManagement} />}
      {tab === 'payments' && <Payments />}
      {tab === 'overdue' && <Overdue />}
    </Page>
  );
};

const monthLabel = (month: string) => new Date(`${month}-01T00:00:00`).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });

const Overview: React.FC = () => {
  const { institution } = useInstitution();
  const summary = useQuery({ queryKey: ['fee-summary'], queryFn: feesApi.summary });
  const s = summary.data;
  const currency = institution?.currency ?? 'INR';
  const byStatus = s?.byStatus ?? {};
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 stagger">
        <StatCard loading={summary.isLoading} label="Billed" value={compactMoney(s?.billed)} hint={money(s?.billed, currency)} icon={<Receipt className="w-5 h-5" />} />
        <StatCard loading={summary.isLoading} label="Collected" value={compactMoney(s?.collected)} hint={`${s?.collectionRate ?? 0}% collection`} icon={<Wallet className="w-5 h-5" />} tone="green" />
        <StatCard loading={summary.isLoading} label="Outstanding" value={compactMoney(s?.outstanding)} hint={money(s?.outstanding, currency)} icon={<IndianRupee className="w-5 h-5" />} tone="amber" />
        <StatCard loading={summary.isLoading} label="Overdue" value={compactMoney(byStatus.overdue?.balance)} hint={`${byStatus.overdue?.count ?? 0} invoices`} icon={<AlertTriangle className="w-5 h-5" />} tone="rose" />
      </div>
      <Panel title="Collection trend" description="Payments received per month">
        {summary.isLoading ? (
          <div className="skeleton h-[260px]" />
        ) : s?.monthly.length ? (
          <AreaTrend data={s.monthly.map((row) => ({ label: monthLabel(row.month), value: row.amount }))} format={(v) => compactMoney(v)} valueLabel="Collected" />
        ) : (
          <div className="h-[200px] flex items-center justify-center text-sm text-slate-500">No payments recorded yet</div>
        )}
      </Panel>
      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 stagger">
        <Panel title="Collection by payment mode">
          <BarList
            items={Object.entries(s?.byMode ?? {})
              .sort(([, a], [, b]) => b - a)
              .map(([mode, amount]) => ({ key: mode, label: modeLabel(mode), value: amount }))}
            format={(v) => money(v, currency)}
            emptyText="No payments yet"
          />
        </Panel>
        <Panel title="Invoices by status" description="Number of invoices">
          <SegmentedBar
            segments={[
              { key: 'paid', label: 'Paid', value: byStatus.paid?.count ?? 0, color: STATUS.good },
              { key: 'partial', label: 'Partly paid', value: byStatus.partial?.count ?? 0, color: SERIES.blue },
              { key: 'unpaid', label: 'Not due yet', value: byStatus.unpaid?.count ?? 0, color: STATUS.neutral },
              { key: 'overdue', label: 'Overdue', value: byStatus.overdue?.count ?? 0, color: STATUS.critical },
            ]}
          />
        </Panel>
      </div>
    </div>
  );
};

const Invoices: React.FC = () => {
  const { terms, institution } = useInstitution();
  const batches = useBatches();
  const [filters, setFilters] = useState({ page: 1, search: '', status: '', batchId: '' });
  const [open, setOpen] = useState<string | null>(null);
  const params = { page: filters.page, limit: 25, search: filters.search || undefined, status: filters.status || undefined, batchId: filters.batchId || undefined };
  const list = useQuery({ queryKey: ['invoices', params], queryFn: () => feesApi.invoices(params) });
  const currency = institution?.currency ?? 'INR';

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-3 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input className={`${inputClass} pl-9`} placeholder={`Search ${terms.student.toLowerCase()} name or ${terms.enrollmentNo.toLowerCase()}`} value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })} />
        </div>
        <select className={`${inputClass} lg:w-56`} value={filters.batchId} onChange={(e) => setFilters({ ...filters, batchId: e.target.value, page: 1 })}>
          <option value="">All {plural(terms.batch).toLowerCase()}</option>
          {batches.data?.map((b) => <option key={b._id} value={b._id}>{refName(b.programId)} · {b.name}</option>)}
        </select>
        <select className={`${inputClass} lg:w-40`} value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}>
          <option value="">All statuses</option>
          {['unpaid', 'partial', 'overdue', 'paid', 'cancelled'].map((s) => <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>)}
        </select>
        <Button variant="outline" leftIcon={<Download className="w-4 h-4" />} onClick={() => feesApi.exportInvoices({ status: params.status, batchId: params.batchId }).catch((e) => toast.error(errorMessage(e)))}>Export</Button>
      </div>
      <Table
        data={list.data?.items ?? []}
        isLoading={list.isLoading}
        keyExtractor={(row) => row._id}
        onRowClick={(row) => setOpen(row._id)}
        columns={[
          {
            header: terms.student,
            accessorKey: 'studentId',
            cell: (row) => {
              const student = typeof row.studentId === 'string' ? null : row.studentId;
              return (
                <div>
                  <div className="font-semibold text-slate-800">{student?.name ?? '—'}</div>
                  <div className="text-xs text-slate-500">{student?.enrollmentNo} · {refName(student?.batchId)}</div>
                </div>
              );
            },
          },
          { header: 'Invoice', accessorKey: 'title' },
          { header: 'Total', accessorKey: 'totalAmount', cell: (row) => money(row.totalAmount, currency) },
          { header: 'Paid', accessorKey: 'paidAmount', cell: (row) => money(row.paidAmount, currency) },
          { header: 'Balance', accessorKey: 'balance', cell: (row) => <span className="font-semibold">{money(row.balance, currency)}</span> },
          { header: 'Next due', accessorKey: 'nextDueDate', cell: (row) => date(row.nextDueDate) },
          { header: 'Status', accessorKey: 'status', cell: (row) => <StatusBadge status={row.status} /> },
        ]}
      />
      <Pagination currentPage={filters.page} totalPages={list.data?.meta.totalPages ?? 1} onPageChange={(page) => setFilters({ ...filters, page })} />
      {open && <InvoiceModal id={open} onClose={() => setOpen(null)} />}
    </>
  );
};

export const InvoiceModal: React.FC<{ id: string; onClose: () => void }> = ({ id, onClose }) => {
  const { institution } = useInstitution();
  const canDiscount = useAuthStore((state) => state.active?.role !== 'accountant');
  const queryClient = useQueryClient();
  const invoice = useQuery({ queryKey: ['invoice', id], queryFn: () => feesApi.invoice(id) });
  const [payment, setPayment] = useState({ amount: '', mode: 'cash', reference: '', paidAt: today() });
  const [discount, setDiscount] = useState<{ amount: string; reason: string } | null>(null);
  const currency = institution?.currency ?? 'INR';

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['invoice', id] });
    queryClient.invalidateQueries({ queryKey: ['invoices'] });
    queryClient.invalidateQueries({ queryKey: ['fee-summary'] });
    queryClient.invalidateQueries({ queryKey: ['payments'] });
  };

  const pay = useMutation({
    mutationFn: () => feesApi.pay(id, { amount: Number(payment.amount), mode: payment.mode, reference: payment.reference || undefined, paidAt: payment.paidAt }),
    onSuccess: (result) => {
      toast.success(`Payment recorded · Receipt ${result.receiptNo}`);
      setPayment({ ...payment, amount: '', reference: '' });
      refresh();
    },
    onError: (error) => toast.error(errorMessage(error)),
  });
  const saveDiscount = useMutation({
    mutationFn: () => feesApi.updateInvoice(id, { discount: { amount: Number(discount?.amount || 0), reason: discount?.reason || undefined } }),
    onSuccess: () => { toast.success('Discount applied'); setDiscount(null); refresh(); },
    onError: (error) => toast.error(errorMessage(error)),
  });
  const reverse = useMutation({
    mutationFn: (paymentId: string) => feesApi.reverse(paymentId, 'Reversed from admin panel'),
    onSuccess: () => { toast.success('Payment reversed'); refresh(); },
    onError: (error) => toast.error(errorMessage(error)),
  });

  const inv = invoice.data as Invoice | undefined;
  const student = inv && typeof inv.studentId !== 'string' ? inv.studentId : null;
  return (
    <Modal isOpen onClose={onClose} title={inv ? `${student?.name ?? ''} · ${inv.title}` : 'Loading…'} maxWidth="2xl">
      {!inv ? <div className="py-10 text-center text-slate-500">Loading…</div> : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            {[['Total', inv.totalAmount], ['Discount', inv.discount?.amount ?? 0], ['Paid', inv.paidAmount], ['Balance', inv.balance]].map(([label, value]) => (
              <div key={label as string} className="rounded-xl border border-slate-200 p-3">
                <div className="text-xs text-slate-500">{label}</div>
                <div className="text-lg font-semibold text-slate-800">{money(value as number, currency)}</div>
              </div>
            ))}
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-800 mb-2">Installments</h4>
            <div className="rounded-xl border border-slate-200 divide-y divide-slate-100">
              {inv.installments.map((item) => (
                <div key={item.label} className="flex items-center justify-between px-4 py-2 text-sm">
                  <div><span className="font-medium text-slate-800">{item.label}</span> <span className="text-slate-500">· due {date(item.dueDate)}</span></div>
                  <div className="flex items-center gap-3"><span>{money(item.paidAmount ?? 0, currency)} / {money(item.amount, currency)}</span><StatusBadge status={item.status ?? 'pending'} /></div>
                </div>
              ))}
            </div>
          </div>

          {inv.status !== 'cancelled' && inv.balance > 0 && (
            <form className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 space-y-3" onSubmit={(e) => { e.preventDefault(); pay.mutate(); }}>
              <h4 className="text-sm font-bold text-slate-800">Record payment</h4>
              <div className="grid sm:grid-cols-4 gap-3">
                <input type="number" min={1} max={inv.balance} step="0.01" className={inputClass} placeholder={`Amount (max ${inv.balance})`} value={payment.amount} onChange={(e) => setPayment({ ...payment, amount: e.target.value })} required />
                <select className={inputClass} value={payment.mode} onChange={(e) => setPayment({ ...payment, mode: e.target.value })}>
                  {MODES.map((m) => <option key={m} value={m}>{modeLabel(m)}</option>)}
                </select>
                <input className={inputClass} placeholder="Reference / UTR" value={payment.reference} onChange={(e) => setPayment({ ...payment, reference: e.target.value })} />
                <input type="date" className={inputClass} max={today()} value={payment.paidAt} onChange={(e) => setPayment({ ...payment, paidAt: e.target.value })} />
              </div>
              <div className="flex justify-between">
                <Button type="button" variant="ghost" size="sm" onClick={() => setPayment({ ...payment, amount: String(inv.balance) })}>Full balance</Button>
                <Button type="submit" variant="success" isLoading={pay.isPending}>Save payment</Button>
              </div>
            </form>
          )}

          {canDiscount && inv.status !== 'cancelled' && (
            discount ? (
              <form className="grid sm:grid-cols-[1fr_2fr_auto] gap-2" onSubmit={(e) => { e.preventDefault(); saveDiscount.mutate(); }}>
                <input type="number" min={0} className={inputClass} placeholder="Discount amount" value={discount.amount} onChange={(e) => setDiscount({ ...discount, amount: e.target.value })} required />
                <input className={inputClass} placeholder="Reason (scholarship, sibling...)" value={discount.reason} onChange={(e) => setDiscount({ ...discount, reason: e.target.value })} />
                <Button type="submit" variant="outline" isLoading={saveDiscount.isPending}>Apply</Button>
              </form>
            ) : (
              <Button variant="ghost" size="sm" onClick={() => setDiscount({ amount: String(inv.discount?.amount ?? ''), reason: inv.discount?.reason ?? '' })}>Give discount / scholarship</Button>
            )
          )}

          <div>
            <h4 className="text-sm font-bold text-slate-800 mb-2">Payments</h4>
            {inv.payments?.length ? (
              <div className="rounded-xl border border-slate-200 divide-y divide-slate-100">
                {inv.payments.map((p) => (
                  <div key={p._id} className="flex items-center justify-between px-4 py-2 text-sm">
                    <div>
                      <div className="font-medium text-slate-800">{money(p.amount, currency)} · <span>{modeLabel(p.mode)}</span></div>
                      <div className="text-xs text-slate-500">{p.receiptNo} · {date(p.paidAt)}{p.reference ? ` · ${p.reference}` : ''}</div>
                    </div>
                    {p.status === 'reversed' ? <StatusBadge status="cancelled" /> : canDiscount && (
                      <Button size="sm" variant="ghost" onClick={() => reverse.mutate(p._id)}>Reverse</Button>
                    )}
                  </div>
                ))}
              </div>
            ) : <p className="text-sm text-slate-500">No payments yet</p>}
          </div>
        </div>
      )}
    </Modal>
  );
};

const Plans: React.FC<{ canEdit: boolean }> = ({ canEdit }) => {
  const { terms, institution } = useInstitution();
  const structures = useQuery({ queryKey: ['fee-structures'], queryFn: feesApi.structures });
  const [creating, setCreating] = useState(false);
  const [assigning, setAssigning] = useState<string | null>(null);
  const currency = institution?.currency ?? 'INR';
  return (
    <>
      {canEdit && <div className="flex justify-end mb-4"><Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setCreating(true)}>New fee plan</Button></div>}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 stagger">
        {structures.data?.map((s) => (
          <div key={s._id} className="glass lift rounded-2xl p-5">
            <div className="text-lg font-semibold text-slate-800">{s.name}</div>
            <div className="text-xs text-slate-500 mb-3">{s.programIds.map(refName).join(', ') || `No ${terms.program.toLowerCase()} linked`}</div>
            <div className="text-2xl font-semibold text-indigo-700 mb-3">{money(s.totalAmount, currency)}</div>
            <ul className="text-xs text-slate-600 space-y-1 mb-4">
              {s.installments.map((i) => <li key={i.label} className="flex justify-between"><span>{i.label} · {date(i.dueDate)}</span><span>{money(i.amount, currency)}</span></li>)}
            </ul>
            {canEdit && <Button size="sm" fullWidth variant="outline" onClick={() => setAssigning(s._id)}>Assign to {plural(terms.student).toLowerCase()}</Button>}
          </div>
        ))}
      </div>
      {!structures.isLoading && !structures.data?.length && <p className="text-sm text-slate-500">No fee plans yet.</p>}
      {creating && <PlanForm onClose={() => setCreating(false)} />}
      {assigning && <AssignPlan structureId={assigning} onClose={() => setAssigning(null)} />}
    </>
  );
};

const PlanForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { terms } = useInstitution();
  const programs = usePrograms();
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [programIds, setProgramIds] = useState<string[]>([]);
  const [components, setComponents] = useState([{ name: 'Tuition fee', amount: '' }]);
  const [installments, setInstallments] = useState([{ label: 'Installment 1', dueDate: '', amount: '' }]);
  const total = components.reduce((sum, c) => sum + (Number(c.amount) || 0), 0);
  const scheduled = installments.reduce((sum, i) => sum + (Number(i.amount) || 0), 0);

  const split = (count: number) => {
    const each = Math.floor(total / count);
    setInstallments(Array.from({ length: count }, (_, i) => ({
      label: count === 1 ? 'Full payment' : `Installment ${i + 1}`,
      dueDate: installments[i]?.dueDate ?? '',
      amount: String(i === count - 1 ? total - each * (count - 1) : each),
    })));
  };

  const create = useMutation({
    mutationFn: () => feesApi.createStructure({
      name,
      programIds,
      components: components.filter((c) => c.name).map((c) => ({ name: c.name, amount: Number(c.amount) || 0 })),
      installments: installments.map((i) => ({ label: i.label, dueDate: i.dueDate, amount: Number(i.amount) || 0 })),
    }),
    onSuccess: () => { toast.success('Fee plan created'); queryClient.invalidateQueries({ queryKey: ['fee-structures'] }); onClose(); },
    onError: (error) => toast.error(errorMessage(error)),
  });

  return (
    <Modal isOpen onClose={onClose} title="New fee plan" maxWidth="2xl">
      <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); create.mutate(); }}>
        <Field label="Plan name"><input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Class 10 Annual Fee 2026-27" required /></Field>
        <Field label={`Applies to ${plural(terms.program).toLowerCase()}`}>
          <div className="flex flex-wrap gap-2">
            {programs.data?.map((p) => {
              const on = programIds.includes(p._id);
              return <button type="button" key={p._id} onClick={() => setProgramIds(on ? programIds.filter((id) => id !== p._id) : [...programIds, p._id])} className={chipClass(on)}>{p.name}</button>;
            })}
          </div>
        </Field>
        <div>
          <div className="flex justify-between items-center mb-2"><span className="text-sm font-semibold text-slate-700">Fee heads</span><Button type="button" size="sm" variant="outline" onClick={() => setComponents([...components, { name: '', amount: '' }])}>+ Head</Button></div>
          <div className="space-y-2">
            {components.map((c, i) => (
              <div key={i} className="grid grid-cols-[2fr_1fr_auto] gap-2">
                <input className={inputClass} placeholder="Tuition, Transport, Lab..." value={c.name} onChange={(e) => setComponents(components.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))} required />
                <input type="number" min={0} className={inputClass} placeholder="Amount" value={c.amount} onChange={(e) => setComponents(components.map((x, j) => (j === i ? { ...x, amount: e.target.value } : x)))} required />
                <button type="button" className="p-2 text-slate-400 hover:text-red-600" onClick={() => setComponents(components.filter((_, j) => j !== i))}><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
          <div className="text-right text-sm font-bold text-slate-800 mt-2">Total: {money(total)}</div>
        </div>
        <div>
          <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
            <span className="text-sm font-semibold text-slate-700">Installments</span>
            <div className="flex gap-1">{[1, 2, 4, 12].map((n) => <Button key={n} type="button" size="sm" variant="ghost" onClick={() => split(n)}>{n === 1 ? 'One-time' : n === 12 ? 'Monthly' : `${n} parts`}</Button>)}</div>
          </div>
          <div className="space-y-2">
            {installments.map((item, i) => (
              <div key={i} className="grid grid-cols-[1.2fr_1fr_1fr] gap-2">
                <input className={inputClass} value={item.label} onChange={(e) => setInstallments(installments.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))} required />
                <input type="date" className={inputClass} value={item.dueDate} onChange={(e) => setInstallments(installments.map((x, j) => (j === i ? { ...x, dueDate: e.target.value } : x)))} required />
                <input type="number" min={0} className={inputClass} value={item.amount} onChange={(e) => setInstallments(installments.map((x, j) => (j === i ? { ...x, amount: e.target.value } : x)))} required />
              </div>
            ))}
          </div>
          {Math.abs(scheduled - total) > 0.01 && <p className="text-xs text-red-600 mt-2">Installments add up to {money(scheduled)}, but the total is {money(total)}.</p>}
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={create.isPending} disabled={Math.abs(scheduled - total) > 0.01 || total <= 0}>Create plan</Button>
        </div>
      </form>
    </Modal>
  );
};

const AssignPlan: React.FC<{ structureId: string; onClose: () => void }> = ({ structureId, onClose }) => {
  const { terms } = useInstitution();
  const batches = useBatches();
  const queryClient = useQueryClient();
  const [batchIds, setBatchIds] = useState<string[]>([]);
  const assign = useMutation({
    mutationFn: () => feesApi.assign(structureId, batchIds.length ? { batchIds } : {}),
    onSuccess: (result) => {
      toast.success(`${result.created} invoices created${result.skipped ? `, ${result.skipped} already billed` : ''}`);
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['fee-summary'] });
      onClose();
    },
    onError: (error) => toast.error(errorMessage(error)),
  });
  return (
    <Modal isOpen onClose={onClose} title="Assign fee plan" maxWidth="lg">
      <p className="text-sm text-slate-600 mb-3">Pick {plural(terms.batch).toLowerCase()}, or leave empty to bill every active {terms.student.toLowerCase()} of the plan's {plural(terms.program).toLowerCase()}. Already billed {plural(terms.student).toLowerCase()} are skipped.</p>
      <div className="flex flex-wrap gap-2 mb-5">
        {batches.data?.map((b) => {
          const on = batchIds.includes(b._id);
          return <button key={b._id} onClick={() => setBatchIds(on ? batchIds.filter((id) => id !== b._id) : [...batchIds, b._id])} className={chipClass(on)}>{refName(b.programId)} · {b.name} ({b.studentCount ?? 0})</button>;
        })}
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={() => assign.mutate()} isLoading={assign.isPending}>Create invoices</Button>
      </div>
    </Modal>
  );
};

const Payments: React.FC = () => {
  const { institution } = useInstitution();
  const [filters, setFilters] = useState({ page: 1, from: '', to: '', mode: '' });
  const params = { page: filters.page, limit: 25, from: filters.from || undefined, to: filters.to || undefined, mode: filters.mode || undefined };
  const list = useQuery({ queryKey: ['payments', params], queryFn: () => feesApi.payments(params) });
  const currency = institution?.currency ?? 'INR';
  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3 mb-4 items-start sm:items-center">
        <input type="date" className={`${inputClass} sm:w-44`} value={filters.from} onChange={(e) => setFilters({ ...filters, from: e.target.value, page: 1 })} />
        <input type="date" className={`${inputClass} sm:w-44`} value={filters.to} onChange={(e) => setFilters({ ...filters, to: e.target.value, page: 1 })} />
        <select className={`${inputClass} sm:w-44`} value={filters.mode} onChange={(e) => setFilters({ ...filters, mode: e.target.value, page: 1 })}>
          <option value="">All modes</option>
          {MODES.map((m) => <option key={m} value={m}>{modeLabel(m)}</option>)}
        </select>
        <div className="sm:ml-auto text-sm font-bold text-slate-800">Total: {money(Number(list.data?.meta.totalAmount ?? 0), currency)}</div>
      </div>
      <Table
        data={list.data?.items ?? []}
        isLoading={list.isLoading}
        keyExtractor={(row) => row._id}
        columns={[
          { header: 'Receipt', accessorKey: 'receiptNo', cell: (row) => <span className="font-mono text-xs">{row.receiptNo}</span> },
          { header: 'Date', accessorKey: 'paidAt', cell: (row) => date(row.paidAt) },
          { header: 'Student', accessorKey: 'studentId', cell: (row) => refName(row.studentId) },
          { header: 'Amount', accessorKey: 'amount', cell: (row) => <span className="font-semibold">{money(row.amount, currency)}</span> },
          { header: 'Mode', accessorKey: 'mode', cell: (row) => <span>{modeLabel(row.mode)}</span> },
          { header: 'Received by', accessorKey: 'receivedBy', cell: (row) => refName(row.receivedBy) },
        ]}
      />
      <Pagination currentPage={filters.page} totalPages={list.data?.meta.totalPages ?? 1} onPageChange={(page) => setFilters({ ...filters, page })} />
    </>
  );
};

const Overdue: React.FC = () => {
  const { terms, institution } = useInstitution();
  const overdue = useQuery({ queryKey: ['overdue'], queryFn: feesApi.overdue });
  const [open, setOpen] = useState<string | null>(null);
  const currency = institution?.currency ?? 'INR';
  return (
    <>
      <Table
        data={overdue.data ?? []}
        isLoading={overdue.isLoading}
        keyExtractor={(row) => row._id}
        onRowClick={(row) => setOpen(row._id)}
        columns={[
          { header: terms.student, accessorKey: 'studentId', cell: (row) => { const s = typeof row.studentId === 'string' ? null : row.studentId; return <div><div className="font-semibold text-slate-800">{s?.name}</div><div className="text-xs text-slate-500">{refName(s?.batchId)}</div></div>; } },
          { header: terms.guardian, accessorKey: 'guardian', cell: (row) => { const s = typeof row.studentId === 'string' ? null : row.studentId; const g = s?.guardians?.find((x) => x.isPrimary) ?? s?.guardians?.[0]; return g ? <div><div>{g.name}</div><a className="text-xs text-indigo-600" href={`tel:${g.phone}`}>{g.phone}</a></div> : '—'; } },
          { header: 'Overdue', accessorKey: 'overdueAmount', cell: (row) => <span className="font-bold text-red-600">{money(row.overdueAmount, currency)}</span> },
          { header: 'Balance', accessorKey: 'balance', cell: (row) => money(row.balance, currency) },
          { header: 'Due since', accessorKey: 'nextDueDate', cell: (row) => date(row.nextDueDate) },
        ]}
      />
      {open && <InvoiceModal id={open} onClose={() => setOpen(null)} />}
    </>
  );
};
