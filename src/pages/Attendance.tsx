import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CalendarCheck, CheckCheck, Download, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { attendanceApi } from '../api';
import { errorMessage } from '../api/client';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Table } from '../components/ui/Table';
import { inputClass, Page, PageHeader, Panel, StatCard, StatusBadge, Tabs } from '../components/ui/Kit';
import { BarList } from '../components/charts/Charts';
import { useBatches, useInstitution } from '../hooks/useInstitution';
import { date, plural, refName, today } from '../lib/format';
import type { AttendanceStatus } from '../types';

const STATUS_BUTTONS: Array<{ status: AttendanceStatus; label: string; on: string }> = [
  { status: 'present', label: 'P', on: 'bg-emerald-600 text-white border-emerald-600' },
  { status: 'absent', label: 'A', on: 'bg-red-600 text-white border-red-600' },
  { status: 'late', label: 'L', on: 'bg-amber-500 text-white border-amber-500' },
  { status: 'leave', label: 'Lv', on: 'bg-blue-600 text-white border-blue-600' },
];

export const Attendance: React.FC = () => {
  const [tab, setTab] = useState('today');
  return (
    <Page>
      <PageHeader title="Attendance" subtitle="Registers, reports and holidays" />
      <Tabs
        active={tab}
        onChange={setTab}
        tabs={[
          { id: 'today', label: 'Daily overview' },
          { id: 'report', label: 'Reports' },
          { id: 'holidays', label: 'Holidays' },
        ]}
      />
      {tab === 'today' && <Overview />}
      {tab === 'report' && <Reports />}
      {tab === 'holidays' && <Holidays />}
    </Page>
  );
};

const Overview: React.FC = () => {
  const { terms } = useInstitution();
  const [day, setDay] = useState(today());
  const [marking, setMarking] = useState<string | null>(null);
  const overview = useQuery({ queryKey: ['attendance-overview', day], queryFn: () => attendanceApi.overview(day) });
  const data = overview.data;

  return (
    <>
      <div className="flex items-center gap-3 mb-4">
        <input type="date" className={`${inputClass} w-44`} value={day} max={today()} onChange={(e) => setDay(e.target.value)} />
        {data?.holiday && <span className="text-sm font-semibold text-amber-600">Holiday: {data.holiday.name}</span>}
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mb-6 stagger">
        <StatCard loading={overview.isLoading} label="Attendance" value={data ? `${data.percentage}%` : '—'} icon={<CalendarCheck className="w-5 h-5" />} tone="green" />
        <StatCard label="Present" value={data?.present ?? '—'} tone="blue" />
        <StatCard label="Absent / leave" value={data?.absent ?? '—'} tone="rose" />
        <StatCard label={`${plural(terms.batch)} marked`} value={data ? `${data.batchesMarked}/${data.batchesTotal}` : '—'} tone="amber" />
      </div>
      {Boolean(data?.batchesMarked) && (
        <Panel title={`Attendance by ${terms.batch.toLowerCase()}`} description="Present (incl. late) as a share of marked students" className="mb-6">
          <BarList
            items={(data?.batches ?? [])
              .filter((row) => row.marked)
              .map((row) => {
                const present = (row.present ?? 0) + (row.late ?? 0);
                const total = present + (row.absent ?? 0) + (row.leave ?? 0);
                const pct = total ? Math.round((present / total) * 1000) / 10 : 0;
                return {
                  key: row.batch._id,
                  label: `${refName(row.batch.programId)} · ${row.batch.name}`,
                  sub: `${present}/${total}`,
                  value: pct,
                  tone: pct < 75 ? ('critical' as const) : ('default' as const),
                };
              })
              .sort((a, b) => a.value - b.value)}
            max={100}
            format={(v) => `${v}%`}
          />
        </Panel>
      )}
      <Table
        data={data?.batches ?? []}
        isLoading={overview.isLoading}
        keyExtractor={(row) => row.batch._id}
        columns={[
          { header: terms.batch, accessorKey: 'batch', cell: (row) => <span className="font-semibold text-slate-800">{refName(row.batch.programId)} · {row.batch.name}</span> },
          { header: 'Status', accessorKey: 'marked', cell: (row) => <StatusBadge status={row.marked ? 'present' : 'pending'} /> },
          { header: 'Present', accessorKey: 'present', cell: (row) => (row.marked ? (row.present ?? 0) + (row.late ?? 0) : '—') },
          { header: 'Absent', accessorKey: 'absent', cell: (row) => (row.marked ? (row.absent ?? 0) + (row.leave ?? 0) : '—') },
          {
            header: '',
            accessorKey: 'action',
            cell: (row) => (
              <Button size="sm" variant={row.marked ? 'outline' : 'primary'} onClick={() => setMarking(row.batch._id)}>
                {row.marked ? 'View / edit' : 'Mark now'}
              </Button>
            ),
          },
        ]}
      />
      {marking && <MarkSheet batchId={marking} day={day} onClose={() => setMarking(null)} />}
    </>
  );
};

const MarkSheet: React.FC<{ batchId: string; day: string; onClose: () => void }> = ({ batchId, day, onClose }) => {
  const queryClient = useQueryClient();
  const sheet = useQuery({ queryKey: ['attendance-sheet', batchId, day], queryFn: () => attendanceApi.sheet(batchId, day) });
  const [marks, setMarks] = useState<Record<string, AttendanceStatus>>({});
  const statusOf = (id: string, fallback: AttendanceStatus | null) => marks[id] ?? fallback ?? 'present';

  const save = useMutation({
    mutationFn: () =>
      attendanceApi.save({
        batchId,
        date: day,
        entries: (sheet.data?.students ?? []).map((student) => ({ studentId: student._id, status: statusOf(student._id, student.status) })),
      }),
    onSuccess: () => {
      toast.success('Attendance saved. Parents of absent students are notified.');
      queryClient.invalidateQueries({ queryKey: ['attendance-overview'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      onClose();
    },
    onError: (error) => toast.error(errorMessage(error)),
  });

  const students = sheet.data?.students ?? [];
  const counts = students.reduce<Record<string, number>>((acc, student) => {
    const status = statusOf(student._id, student.status);
    acc[status] = (acc[status] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <Modal isOpen onClose={onClose} title={`Attendance · ${date(day)}`} maxWidth="2xl">
      {sheet.isLoading ? (
        <div className="py-10 text-center text-slate-500">Loading…</div>
      ) : (
        <>
          {sheet.data?.holiday && <div className="mb-3 rounded-xl bg-amber-50 border border-amber-200 px-4 py-2 text-sm text-amber-700">This day is a holiday: {sheet.data.holiday.name}</div>}
          {!sheet.data?.isWorkingDay && <div className="mb-3 rounded-xl bg-slate-50 border border-slate-200 px-4 py-2 text-sm text-slate-600">This is not a working day.</div>}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="text-sm text-slate-600">
              P {counts.present ?? 0} · A {counts.absent ?? 0} · L {counts.late ?? 0} · Leave {counts.leave ?? 0}
            </div>
            <Button size="sm" variant="outline" leftIcon={<CheckCheck className="w-4 h-4" />} onClick={() => setMarks(Object.fromEntries(students.map((s) => [s._id, 'present'])))}>
              All present
            </Button>
          </div>
          <div className="max-h-[55vh] overflow-y-auto rounded-xl border border-slate-200 divide-y divide-slate-100">
            {students.map((student) => {
              const current = statusOf(student._id, student.status);
              return (
                <div key={student._id} className="flex items-center justify-between px-4 py-2.5">
                  <div className="min-w-0">
                    <div className="font-medium text-slate-800 truncate">{student.rollNo ? `${student.rollNo}. ` : ''}{student.name}</div>
                    <div className="text-xs text-slate-500">{student.enrollmentNo}</div>
                  </div>
                  <div className="flex gap-1">
                    {STATUS_BUTTONS.map((button) => (
                      <button
                        key={button.status}
                        onClick={() => setMarks({ ...marks, [student._id]: button.status })}
                        className={`w-9 h-9 rounded-lg border text-xs font-bold ${current === button.status ? button.on : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'}`}
                        title={button.status}
                      >
                        {button.label}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
            {!students.length && <div className="px-4 py-6 text-center text-sm text-slate-500">No students in this batch</div>}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={() => save.mutate()} isLoading={save.isPending} disabled={!students.length}>Save attendance</Button>
          </div>
        </>
      )}
    </Modal>
  );
};

const Reports: React.FC = () => {
  const { terms } = useInstitution();
  const batches = useBatches();
  const [batchId, setBatchId] = useState('');
  const [range, setRange] = useState({ from: '', to: '' });
  const params = { batchId, from: range.from || undefined, to: range.to || undefined };
  const report = useQuery({ queryKey: ['attendance-report', params], queryFn: () => attendanceApi.report(params), enabled: Boolean(batchId) });
  const low = useQuery({ queryKey: ['attendance-low'], queryFn: () => attendanceApi.low() });

  return (
    <div className="space-y-6">
      <Panel
        title="Batch report"
        actions={
          batchId && (
            <Button size="sm" variant="outline" leftIcon={<Download className="w-4 h-4" />} onClick={() => attendanceApi.exportReport(params).catch((e) => toast.error(errorMessage(e)))}>
              CSV
            </Button>
          )
        }
      >
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <select className={`${inputClass} sm:w-64`} value={batchId} onChange={(e) => setBatchId(e.target.value)}>
            <option value="">Select {terms.batch.toLowerCase()}</option>
            {batches.data?.map((batch) => <option key={batch._id} value={batch._id}>{refName(batch.programId)} · {batch.name}</option>)}
          </select>
          <input type="date" className={`${inputClass} sm:w-44`} value={range.from} onChange={(e) => setRange({ ...range, from: e.target.value })} />
          <input type="date" className={`${inputClass} sm:w-44`} value={range.to} onChange={(e) => setRange({ ...range, to: e.target.value })} />
        </div>
        {batchId ? (
          <Table
            data={report.data?.students ?? []}
            isLoading={report.isLoading}
            keyExtractor={(row) => row._id}
            columns={[
              { header: terms.student, accessorKey: 'name', cell: (row) => <span className="font-medium text-slate-800">{row.name}</span> },
              { header: 'Present', accessorKey: 'present', cell: (row) => row.present + row.late },
              { header: 'Absent', accessorKey: 'absent' },
              { header: 'Leave', accessorKey: 'leave' },
              { header: 'Total', accessorKey: 'total' },
              { header: '%', accessorKey: 'percentage', cell: (row) => <span className={`font-bold ${row.percentage < 75 ? 'text-red-600' : 'text-emerald-700'}`}>{row.percentage}%</span> },
            ]}
          />
        ) : (
          <p className="text-sm text-slate-500">Choose a {terms.batch.toLowerCase()} to see its report.</p>
        )}
      </Panel>

      <Panel title={`Low attendance (below ${low.data?.threshold ?? 75}%)`}>
        <Table
          data={low.data?.students ?? []}
          isLoading={low.isLoading}
          keyExtractor={(row) => row._id}
          columns={[
            { header: terms.student, accessorKey: 'name', cell: (row) => <span className="font-medium text-slate-800">{row.name}</span> },
            { header: terms.batch, accessorKey: 'batchId', cell: (row) => refName(row.batchId) },
            { header: 'Sessions', accessorKey: 'total' },
            { header: '%', accessorKey: 'percentage', cell: (row) => <span className="font-bold text-red-600">{row.percentage}%</span> },
          ]}
        />
      </Panel>
    </div>
  );
};

const Holidays: React.FC = () => {
  const queryClient = useQueryClient();
  const holidays = useQuery({ queryKey: ['holidays'], queryFn: attendanceApi.holidays });
  const [form, setForm] = useState({ name: '', date: '', toDate: '', type: 'institution' });
  const [open, setOpen] = useState(false);
  const add = useMutation({
    mutationFn: () => attendanceApi.addHoliday({ name: form.name, date: form.date, toDate: form.toDate || undefined, type: form.type }),
    onSuccess: () => {
      toast.success('Holiday added');
      setOpen(false);
      setForm({ name: '', date: '', toDate: '', type: 'institution' });
      queryClient.invalidateQueries({ queryKey: ['holidays'] });
    },
    onError: (error) => toast.error(errorMessage(error)),
  });
  const remove = useMutation({
    mutationFn: attendanceApi.deleteHoliday,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['holidays'] }),
    onError: (error) => toast.error(errorMessage(error)),
  });
  return (
    <>
      <div className="flex justify-end mb-4">
        <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setOpen(true)}>Add holiday</Button>
      </div>
      <Table
        data={holidays.data ?? []}
        isLoading={holidays.isLoading}
        keyExtractor={(row) => row._id}
        columns={[
          { header: 'Date', accessorKey: 'date', cell: (row) => date(row.date) },
          { header: 'Name', accessorKey: 'name', cell: (row) => <span className="font-medium text-slate-800">{row.name}</span> },
          { header: 'Type', accessorKey: 'type', cell: (row) => <span className="capitalize">{row.type}</span> },
          { header: '', accessorKey: 'x', cell: (row) => <button className="p-2 text-slate-400 hover:text-red-600" onClick={() => remove.mutate(row._id)}><Trash2 className="w-4 h-4" /></button> },
        ]}
      />
      {open && (
        <Modal isOpen onClose={() => setOpen(false)} title="Add holiday" maxWidth="md">
          <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); add.mutate(); }}>
            <input className={inputClass} placeholder="Name (e.g. Diwali)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <div className="grid grid-cols-2 gap-3">
              <input type="date" className={inputClass} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
              <input type="date" className={inputClass} value={form.toDate} onChange={(e) => setForm({ ...form, toDate: e.target.value })} title="Till (optional, for vacations)" />
            </div>
            <select className={inputClass} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              {['national', 'regional', 'institution', 'exam', 'vacation'].map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" isLoading={add.isPending}>Add</Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
};
