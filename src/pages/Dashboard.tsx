import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, ArrowRight, CalendarCheck, CheckCircle2, Circle, ClipboardList, GraduationCap, IndianRupee, Layers, Megaphone, Sparkles, TrendingUp, Users, Wallet } from 'lucide-react';
import { attendanceApi, dashboardApi, feesApi } from '../api';
import { ErrorState, Page, Panel, StatCard } from '../components/ui/Kit';
import { AreaTrend, BarList, Ring, SegmentedBar } from '../components/charts/Charts';
import { SERIES, STATUS } from '../components/charts/palette';
import { useBatches, useInstitution, useSubjects } from '../hooks/useInstitution';
import { useAuthStore } from '../store/authStore';
import { usePageTitle } from '../lib/ui';
import { compactMoney, date, modeLabel, money, plural, refName } from '../lib/format';

interface AdminDashboard {
  role: string;
  today: string;
  session: { id: string; name: string } | null;
  counts?: { students: number; staff: number; batches: number };
  attendanceToday?: { batchesMarked: number; batchesTotal: number; present: number; absent: number; percentage: number | null };
  fees?: { billed: number; collected: number; outstanding: number; collectedThisMonth: number; overdueInvoices: number };
  pendingLeaves?: number;
  upcomingExams?: Array<{ _id: string; name: string; papers: Array<{ date: string; subjectId: { name: string } | string }>; batchIds: unknown[] }>;
  announcements?: Array<{ _id: string; title: string; createdAt: string }>;
}

const monthLabel = (month: string) => new Date(`${month}-01T00:00:00`).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });

const card = 'flex items-center gap-3 rounded-2xl bg-white/70 ring-1 ring-slate-900/5 p-3';

export const Dashboard: React.FC = () => {
  usePageTitle('Dashboard');
  const { terms, institution } = useInstitution();
  const role = useAuthStore((state) => state.active?.role);
  const user = useAuthStore((state) => state.user);
  const isManagement = role === 'owner' || role === 'admin';
  const currency = institution?.currency ?? 'INR';

  const dashboard = useQuery({ queryKey: ['dashboard'], queryFn: () => dashboardApi.get<AdminDashboard>() });
  const fees = useQuery({ queryKey: ['fee-summary'], queryFn: feesApi.summary });
  const overview = useQuery({ queryKey: ['attendance-overview'], queryFn: () => attendanceApi.overview(), enabled: isManagement });
  const batches = useBatches();
  const subjects = useSubjects();

  const data = dashboard.data;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  // Today's attendance split, summed over every register marked today.
  const split = (overview.data?.batches ?? []).reduce(
    (acc, row) => ({
      present: acc.present + (row.present ?? 0),
      late: acc.late + (row.late ?? 0),
      absent: acc.absent + (row.absent ?? 0),
      leave: acc.leave + (row.leave ?? 0),
    }),
    { present: 0, late: 0, absent: 0, leave: 0 },
  );
  const attendancePct = data?.attendanceToday?.percentage ?? null;
  const ringTone = attendancePct == null ? 'brand' : attendancePct >= 85 ? 'good' : attendancePct >= 70 ? 'warning' : 'critical';

  const firstPaper = (exam: NonNullable<AdminDashboard['upcomingExams']>[number]) => [...exam.papers].sort((a, b) => a.date.localeCompare(b.date))[0];
  const todayMs = data?.today ? new Date(`${data.today}T00:00:00`).getTime() : null;
  const daysUntil = (day?: string) => (day && todayMs != null ? Math.max(0, Math.round((new Date(`${day}T00:00:00`).getTime() - todayMs) / 86_400_000)) : null);
  const byStatus = fees.data?.byStatus ?? {};

  // Only show sections that have real data behind them.
  const hasFees = (fees.data?.billed ?? 0) > 0;
  const hasBatches = (batches.data?.length ?? 0) > 0;
  const counts = data?.counts;
  const setupSteps = [
    { done: hasBatches, title: `Create ${plural(terms.program).toLowerCase()} and ${plural(terms.batch).toLowerCase()}`, hint: 'Classes, courses or batches your institution runs', to: '/classes' },
    { done: (subjects.data?.length ?? 0) > 0, title: 'Add subjects', hint: 'Used for timetable, attendance and exams', to: '/classes' },
    { done: (counts?.staff ?? 0) > 0, title: `Add ${plural(terms.teacher).toLowerCase()} and staff`, hint: 'They sign in with their mobile number (OTP)', to: '/teachers' },
    { done: (counts?.students ?? 0) > 0, title: `Admit ${plural(terms.student).toLowerCase()}`, hint: `${plural(terms.guardian)} get app access automatically`, to: '/students' },
    { done: hasFees, title: 'Create a fee plan and assign it', hint: 'Invoices, receipts and reminders start from here', to: '/fees' },
  ];
  const stepsDone = setupSteps.filter((step) => step.done).length;
  const showSetup = isManagement && Boolean(counts) && !subjects.isLoading && !fees.isLoading && stepsDone < setupSteps.length;

  const attention = [
    isManagement && { to: '/leaves', label: 'Pending leave requests', value: data?.pendingLeaves ?? 0, Icon: ClipboardList, tone: 'text-indigo-600 bg-indigo-50' },
    { to: '/fees', label: 'Overdue fee invoices', value: byStatus.overdue?.count ?? 0, Icon: AlertTriangle, tone: 'text-rose-600 bg-rose-50' },
    isManagement &&
      overview.data && {
        to: '/attendance',
        label: 'Attendance not marked',
        value: overview.data.batchesTotal - overview.data.batchesMarked,
        Icon: CalendarCheck,
        tone: 'text-emerald-600 bg-emerald-50',
      },
  ].filter((item) => item && item.value > 0) as Array<{ to: string; label: string; value: number; Icon: typeof ClipboardList; tone: string }>;

  return (
    <Page>
      {dashboard.error && <ErrorState error={dashboard.error} onRetry={() => dashboard.refetch()} />}

      {/* Hero */}
      <section className="brand-gradient relative overflow-hidden rounded-3xl p-5 sm:p-7 text-white shadow-xl shadow-indigo-600/20 mb-6">
        <div className="absolute -top-24 -right-16 w-72 h-72 rounded-full bg-white/10 blur-2xl" aria-hidden />
        <div className="absolute -bottom-28 left-1/3 w-80 h-80 rounded-full bg-sky-300/20 blur-3xl" aria-hidden />
        <div className="relative flex flex-col lg:flex-row lg:items-center gap-6">
          <div className="flex-1 min-w-0">
            <p className="text-sm text-indigo-100">{[data?.session?.name, date(data?.today)].filter(Boolean).join(' · ')}</p>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mt-1">
              {greeting}, {user?.name?.split(' ')[0] ?? ''}
            </h1>
            <p className="text-indigo-100 mt-1 truncate">{institution?.name}</p>
            {isManagement && data?.counts && (
              <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3 max-w-lg">
                {[
                  { label: plural(terms.student), value: data.counts.students, Icon: Users },
                  { label: 'Staff', value: data.counts.staff, Icon: GraduationCap },
                  { label: plural(terms.batch), value: data.counts.batches, Icon: Layers },
                ].map(({ label, value, Icon }) => (
                  <div key={label} className="rounded-2xl bg-white/15 backdrop-blur-md ring-1 ring-white/25 px-3 py-2.5">
                    <Icon className="w-4 h-4 text-indigo-100" />
                    <div className="text-xl sm:text-2xl font-semibold tabular mt-1">{value}</div>
                    <div className="text-[11px] sm:text-xs text-indigo-100 truncate">{label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {isManagement && hasBatches && (
            <div className="flex items-center gap-4 rounded-2xl bg-white/90 backdrop-blur-md p-4 text-slate-900 shadow-lg lg:w-[300px]">
              <Ring value={attendancePct} label="present" tone={ringTone} size={96} />
              <div className="min-w-0">
                <div className="text-sm font-semibold">Attendance today</div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {data?.attendanceToday?.batchesMarked ?? 0} of {data?.attendanceToday?.batchesTotal ?? 0} {plural(terms.batch).toLowerCase()} marked
                </div>
                <Link to="/attendance" className="press inline-flex items-center gap-1 mt-2 text-xs font-semibold text-indigo-600">
                  Open register <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {showSetup && (
        <Panel
          className="mb-6"
          title={<span className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-indigo-600" /> Get started</span>}
          description={`${stepsDone} of ${setupSteps.length} steps done — the dashboard fills up as you add real data`}
        >
          <div className="h-2 rounded-full bg-slate-900/[0.06] overflow-hidden mb-4">
            <div className="h-full rounded-full brand-gradient transition-all duration-700" style={{ width: `${(stepsDone / setupSteps.length) * 100}%` }} />
          </div>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5 stagger">
            {setupSteps.map((step) => (
              <li key={step.title}>
                <Link to={step.to} className={`press lift flex items-start gap-3 rounded-2xl p-3 ring-1 ${step.done ? 'bg-emerald-50/70 ring-emerald-600/10' : 'bg-white/70 ring-slate-900/5'}`}>
                  {step.done ? <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" /> : <Circle className="w-5 h-5 text-slate-300 shrink-0 mt-0.5" />}
                  <span className="min-w-0">
                    <span className={`block text-sm font-medium ${step.done ? 'text-emerald-800 line-through decoration-emerald-600/40' : 'text-slate-900'}`}>{step.title}</span>
                    <span className="block text-xs text-slate-500 mt-0.5">{step.hint}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Panel>
      )}

      {/* Fee KPIs (only once fees exist) */}
      {hasFees && (
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mb-6 stagger">
        <StatCard loading={fees.isLoading} label="Collected" value={compactMoney(fees.data?.collected)} hint={`${fees.data?.collectionRate ?? 0}% of billed`} icon={<Wallet className="w-5 h-5" />} tone="green" />
        <StatCard loading={dashboard.isLoading} label="This month" value={compactMoney(data?.fees?.collectedThisMonth)} icon={<TrendingUp className="w-5 h-5" />} tone="blue" />
        <StatCard loading={fees.isLoading} label="Outstanding" value={compactMoney(fees.data?.outstanding)} icon={<IndianRupee className="w-5 h-5" />} tone="amber" />
        <StatCard
          loading={fees.isLoading}
          label="Overdue"
          value={byStatus.overdue?.count ?? 0}
          hint={byStatus.overdue?.count ? `${compactMoney(byStatus.overdue?.balance)} pending` : 'Nothing overdue'}
          icon={<AlertTriangle className="w-5 h-5" />}
          tone="rose"
        />
      </div>
      )}

      {/* Trend + today */}
      {(hasFees || (isManagement && hasBatches)) && (
      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 mb-6 stagger">
        {hasFees && (
        <Panel
          title="Fee collection"
          description="Payments received per month"
          className="lg:col-span-2"
          actions={<Link to="/fees" className="text-xs font-semibold text-indigo-600">Details</Link>}
        >
          {fees.isLoading ? (
            <div className="skeleton h-[260px]" />
          ) : fees.data?.monthly.length ? (
            <AreaTrend data={fees.data.monthly.map((row) => ({ label: monthLabel(row.month), value: row.amount }))} format={(v) => compactMoney(v)} valueLabel="Collected" />
          ) : (
            <div className="h-[260px] flex items-center justify-center text-sm text-slate-500">No payments recorded yet</div>
          )}
        </Panel>
        )}

        {isManagement ? hasBatches && (
          <Panel className={hasFees ? '' : 'lg:col-span-3'} title="Today's attendance" description={overview.data?.holiday ? `Holiday: ${overview.data.holiday.name}` : 'Across all marked registers'}>
            {overview.isLoading ? (
              <div className="skeleton h-40" />
            ) : (
              <SegmentedBar
                segments={[
                  { key: 'present', label: 'Present', value: split.present, color: STATUS.good },
                  { key: 'late', label: 'Late', value: split.late, color: STATUS.warning },
                  { key: 'absent', label: 'Absent', value: split.absent, color: STATUS.critical },
                  { key: 'leave', label: 'On leave', value: split.leave, color: STATUS.neutral },
                ]}
              />
            )}
            <div className="mt-5 pt-4 border-t border-slate-900/[0.06] flex items-center justify-between text-sm">
              <span className="text-slate-500">Not marked yet</span>
              <span className="font-semibold text-slate-900 tabular">
                {(overview.data?.batchesTotal ?? 0) - (overview.data?.batchesMarked ?? 0)} {plural(terms.batch).toLowerCase()}
              </span>
            </div>
          </Panel>
        ) : (
          hasFees && (
          <Panel title="Collection by payment mode">
            <BarList items={Object.entries(fees.data?.byMode ?? {}).map(([mode, amount]) => ({ key: mode, label: modeLabel(mode), value: amount }))} format={(v) => money(v, currency)} />
          </Panel>
          )
        )}
      </div>
      )}

      {/* Breakdown row */}
      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 mb-6 stagger">
        {isManagement && hasBatches && (
          <Panel title={`${plural(terms.student)} by ${terms.batch.toLowerCase()}`} actions={<Link to="/classes" className="text-xs font-semibold text-indigo-600">Manage</Link>}>
            {batches.isLoading ? (
              <div className="skeleton h-40" />
            ) : (
              <BarList
                items={[...(batches.data ?? [])]
                  .sort((a, b) => (b.studentCount ?? 0) - (a.studentCount ?? 0))
                  .slice(0, 8)
                  .map((batch) => ({ key: batch._id, label: `${refName(batch.programId)} · ${batch.name}`, value: batch.studentCount ?? 0 }))}
                emptyText={`No ${plural(terms.batch).toLowerCase()} yet`}
              />
            )}
          </Panel>
        )}

        {hasFees && (
        <Panel title="Invoices by status" description="Current session">
          {fees.isLoading ? (
            <div className="skeleton h-40" />
          ) : (
            <SegmentedBar
              segments={[
                { key: 'paid', label: 'Paid', value: byStatus.paid?.count ?? 0, color: STATUS.good },
                { key: 'partial', label: 'Partly paid', value: byStatus.partial?.count ?? 0, color: SERIES.blue },
                { key: 'unpaid', label: 'Not due yet', value: byStatus.unpaid?.count ?? 0, color: STATUS.neutral },
                { key: 'overdue', label: 'Overdue', value: byStatus.overdue?.count ?? 0, color: STATUS.critical },
              ]}
            />
          )}
        </Panel>
        )}

        {(attention.length > 0 || !showSetup) && (
        <Panel title="Needs attention">
          {!attention.length && (
            <div className="flex items-center gap-3 rounded-2xl bg-emerald-50/70 ring-1 ring-emerald-600/10 p-3 text-sm text-emerald-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" /> All caught up
            </div>
          )}
          <ul className="space-y-2.5 text-sm">
            {attention.map((row) => (
              <li key={row.label}>
                <Link to={row.to} className={`press lift ${card}`}>
                  <span className={`w-9 h-9 rounded-xl flex items-center justify-center ${row.tone}`}>
                    <row.Icon className="w-[18px] h-[18px]" />
                  </span>
                  <span className="flex-1 text-slate-700">{row.label}</span>
                  <span className="text-base font-semibold text-slate-900 tabular">{row.value}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Panel>
        )}
      </div>

      {/* Lists */}
      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 stagger">
        {isManagement && (
          <Panel title="Upcoming exams" actions={<Link to="/exams" className="text-xs font-semibold text-indigo-600">View all</Link>}>
            {data?.upcomingExams?.length ? (
              <ul className="space-y-2.5">
                {data.upcomingExams.map((exam) => {
                  const paper = firstPaper(exam);
                  const days = daysUntil(paper?.date);
                  return (
                    <li key={exam._id} className={card}>
                      <div className="w-12 shrink-0 rounded-xl bg-indigo-50 text-indigo-700 text-center py-1.5">
                        <div className="text-[10px] uppercase font-semibold">{paper ? new Date(`${paper.date}T00:00:00`).toLocaleDateString('en-IN', { month: 'short' }) : ''}</div>
                        <div className="text-lg font-semibold leading-none tabular">{paper?.date.slice(8, 10)}</div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-slate-900 truncate">{exam.name}</div>
                        <div className="text-xs text-slate-500">{exam.papers.length} papers · starts with {refName(paper?.subjectId)}</div>
                      </div>
                      {days != null && <span className="text-xs font-semibold text-slate-500 shrink-0">{days === 0 ? 'Today' : `in ${days}d`}</span>}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-sm text-slate-500">No upcoming exams</p>
            )}
          </Panel>
        )}
        <Panel title="Recent announcements" actions={isManagement && <Link to="/announcements" className="text-xs font-semibold text-indigo-600">Post new</Link>}>
          {data?.announcements?.length ? (
            <ul className="space-y-2.5">
              {data.announcements.map((item) => (
                <li key={item._id} className={card}>
                  <span className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                    <Megaphone className="w-4 h-4" />
                  </span>
                  <span className="flex-1 text-sm font-medium text-slate-700 truncate">{item.title}</span>
                  <span className="text-xs text-slate-400 shrink-0">{date(item.createdAt)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">Nothing posted yet</p>
          )}
        </Panel>
      </div>
    </Page>
  );
};
