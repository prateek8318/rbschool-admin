import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CalendarDays, Plus, Send, Trash2, Undo2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { examsApi } from '../api';
import { errorMessage } from '../api/client';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Table } from '../components/ui/Table';
import { EmptyState } from '../components/ui/EmptyState';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Field, inputClass, Page, PageHeader, Panel, StatusBadge, Tabs } from '../components/ui/Kit';
import { Columns, SegmentedBar } from '../components/charts/Charts';
import { ORDINAL_BLUE, STATUS } from '../components/charts/palette';
import { chipClass } from '../lib/ui';
import { useBatches, useInstitution, useSubjects } from '../hooks/useInstitution';
import { date, plural, refId, refName } from '../lib/format';
import type { Exam } from '../types';

const EXAM_TYPES = ['unit_test', 'midterm', 'final', 'quiz', 'assignment', 'practical', 'mock_test', 'other'];

export const Exams: React.FC = () => {
  const [creating, setCreating] = useState(false);
  const [openExam, setOpenExam] = useState<string | null>(null);
  const exams = useQuery({ queryKey: ['exams'], queryFn: () => examsApi.list() });
  const sorted = [...(exams.data ?? [])].sort((a, b) => (firstDate(b) ?? '').localeCompare(firstDate(a) ?? ''));

  return (
    <Page>
      <PageHeader
        title="Exams & Results"
        subtitle="Schedule exams, enter marks and publish results to parents"
        actions={<Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setCreating(true)}>New exam</Button>}
      />
      {sorted.length ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {sorted.map((exam) => (
            <button key={exam._id} onClick={() => setOpenExam(exam._id)} className="press lift text-left glass rounded-2xl p-5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-xs font-semibold text-indigo-600 capitalize">{exam.type.replace('_', ' ')}</div>
                  <div className="text-lg font-semibold text-slate-800">{exam.name}</div>
                </div>
                <StatusBadge status={exam.status} />
              </div>
              <div className="mt-3 text-sm text-slate-600 flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-slate-400" /> {date(firstDate(exam))} → {date(lastDate(exam))}
              </div>
              <div className="mt-2 text-xs text-slate-500">
                {exam.papers.length} papers · {exam.batchIds.map(refName).join(', ')}
              </div>
            </button>
          ))}
        </div>
      ) : (
        !exams.isLoading && <EmptyState title="No exams yet" description="Create an exam with one paper per subject. Parents are notified automatically." />
      )}
      {creating && <ExamForm onClose={() => setCreating(false)} />}
      {openExam && <ExamDetails examId={openExam} onClose={() => setOpenExam(null)} />}
    </Page>
  );
};

const firstDate = (exam: Exam) => [...exam.papers].map((p) => p.date).sort()[0];
const lastDate = (exam: Exam) => [...exam.papers].map((p) => p.date).sort().pop();

const ExamForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { terms } = useInstitution();
  const batches = useBatches();
  const subjects = useSubjects();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ name: '', type: 'unit_test', batchIds: [] as string[] });
  const [papers, setPapers] = useState([{ subjectId: '', date: '', startTime: '', maxMarks: '100' }]);

  const create = useMutation({
    mutationFn: () =>
      examsApi.create({
        ...form,
        papers: papers.filter((p) => p.subjectId).map((p) => ({ subjectId: p.subjectId, date: p.date, startTime: p.startTime || undefined, maxMarks: Number(p.maxMarks) })),
      }),
    onSuccess: () => {
      toast.success('Exam scheduled. Parents and students are notified.');
      queryClient.invalidateQueries({ queryKey: ['exams'] });
      onClose();
    },
    onError: (error) => toast.error(errorMessage(error)),
  });

  const addAllSubjects = () => setPapers((subjects.data ?? []).map((s) => ({ subjectId: s._id, date: papers[0]?.date ?? '', startTime: '', maxMarks: papers[0]?.maxMarks ?? '100' })));

  return (
    <Modal isOpen onClose={onClose} title="New exam" maxWidth="2xl">
      <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); create.mutate(); }}>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Exam name"><input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Half Yearly 2026" required /></Field>
          <Field label="Type">
            <select className={inputClass} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              {EXAM_TYPES.map((t) => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
            </select>
          </Field>
        </div>
        <Field label={plural(terms.batch)}>
          <div className="flex flex-wrap gap-2">
            {batches.data?.map((batch) => {
              const on = form.batchIds.includes(batch._id);
              return (
                <button type="button" key={batch._id} onClick={() => setForm({ ...form, batchIds: on ? form.batchIds.filter((id) => id !== batch._id) : [...form.batchIds, batch._id] })}
                  className={chipClass(on)}>
                  {refName(batch.programId)} · {batch.name}
                </button>
              );
            })}
          </div>
        </Field>
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-slate-700">Papers</span>
            <div className="flex gap-2">
              <Button type="button" size="sm" variant="ghost" onClick={addAllSubjects}>Add all subjects</Button>
              <Button type="button" size="sm" variant="outline" onClick={() => setPapers([...papers, { subjectId: '', date: '', startTime: '', maxMarks: '100' }])}>+ Paper</Button>
            </div>
          </div>
          <div className="space-y-2">
            {papers.map((paper, index) => {
              const update = (key: keyof typeof paper) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setPapers(papers.map((p, i) => (i === index ? { ...p, [key]: e.target.value } : p)));
              return (
                <div key={index} className="grid grid-cols-[1.4fr_1fr_0.8fr_0.7fr_auto] gap-2">
                  <select className={inputClass} value={paper.subjectId} onChange={update('subjectId')} required>
                    <option value="">Subject</option>
                    {subjects.data?.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
                  </select>
                  <input type="date" className={inputClass} value={paper.date} onChange={update('date')} required />
                  <input type="time" className={inputClass} value={paper.startTime} onChange={update('startTime')} />
                  <input type="number" min={1} className={inputClass} value={paper.maxMarks} onChange={update('maxMarks')} title="Max marks" required />
                  <button type="button" className="p-2 text-slate-400 hover:text-red-600" onClick={() => setPapers(papers.filter((_, i) => i !== index))}><Trash2 className="w-4 h-4" /></button>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={create.isPending} disabled={!form.batchIds.length}>Schedule exam</Button>
        </div>
      </form>
    </Modal>
  );
};

const ExamDetails: React.FC<{ examId: string; onClose: () => void }> = ({ examId, onClose }) => {
  const { terms } = useInstitution();
  const queryClient = useQueryClient();
  const exams = useQuery({ queryKey: ['exams'], queryFn: () => examsApi.list() });
  const exam = exams.data?.find((e) => e._id === examId);
  const [tab, setTab] = useState('marks');
  const [batchId, setBatchId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const activeBatch = batchId || refId(exam?.batchIds[0]);
  const activeSubject = subjectId || refId(exam?.papers[0]?.subjectId);
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['exams'] });

  const publish = useMutation({
    mutationFn: () => (exam?.status === 'published' ? examsApi.unpublish(examId) : examsApi.publish(examId)),
    onSuccess: (result) => {
      if (exam?.status === 'published') toast.success('Results hidden from parents');
      else {
        const r = result as { results: number; incomplete: number };
        toast.success(`Published ${r.results} results${r.incomplete ? ` (${r.incomplete} incomplete)` : ''}. Parents notified.`);
      }
      invalidate();
      queryClient.invalidateQueries({ queryKey: ['exam-results'] });
    },
    onError: (error) => toast.error(errorMessage(error)),
  });
  const remove = useMutation({
    mutationFn: () => examsApi.remove(examId),
    onSuccess: () => { toast.success('Exam deleted'); invalidate(); onClose(); },
    onError: (error) => toast.error(errorMessage(error)),
  });

  if (!exam) return null;
  return (
    <Modal isOpen onClose={onClose} title={exam.name} maxWidth="full">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <StatusBadge status={exam.status} />
            <span className="text-sm text-slate-500">{date(firstDate(exam))} → {date(lastDate(exam))}</span>
          </div>
          <div className="flex gap-2">
            {exam.status !== 'published' && <Button variant="ghost" size="sm" leftIcon={<Trash2 className="w-4 h-4" />} onClick={() => setConfirmDelete(true)}>Delete</Button>}
            <Button size="sm" variant={exam.status === 'published' ? 'outline' : 'success'} leftIcon={exam.status === 'published' ? <Undo2 className="w-4 h-4" /> : <Send className="w-4 h-4" />} isLoading={publish.isPending} onClick={() => publish.mutate()}>
              {exam.status === 'published' ? 'Unpublish' : 'Publish results'}
            </Button>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <select className={`${inputClass} sm:w-60`} value={activeBatch} onChange={(e) => setBatchId(e.target.value)}>
            {exam.batchIds.map((b) => <option key={refId(b)} value={refId(b)}>{terms.batch}: {refName(b)}</option>)}
          </select>
          {tab === 'marks' && (
            <select className={`${inputClass} sm:w-60`} value={activeSubject} onChange={(e) => setSubjectId(e.target.value)}>
              {exam.papers.map((p) => <option key={refId(p.subjectId)} value={refId(p.subjectId)}>{refName(p.subjectId)} (/{p.maxMarks})</option>)}
            </select>
          )}
        </div>
        <Tabs active={tab} onChange={setTab} tabs={[{ id: 'marks', label: 'Enter marks' }, { id: 'results', label: 'Results' }]} />
        {tab === 'marks' ? (
          <MarksEntry key={`${activeBatch}-${activeSubject}`} examId={examId} batchId={activeBatch} subjectId={activeSubject} />
        ) : (
          <Results examId={examId} batchId={activeBatch} />
        )}
      </div>
      <ConfirmDialog isOpen={confirmDelete} onClose={() => setConfirmDelete(false)} onConfirm={() => remove.mutate()} isLoading={remove.isPending} title="Delete exam?" description="Only possible before any marks are entered." confirmText="Delete" />
    </Modal>
  );
};

const MarksEntry: React.FC<{ examId: string; batchId: string; subjectId: string }> = ({ examId, batchId, subjectId }) => {
  const queryClient = useQueryClient();
  const sheet = useQuery({ queryKey: ['marks', examId, batchId, subjectId], queryFn: () => examsApi.marks(examId, batchId, subjectId), enabled: Boolean(batchId && subjectId) });
  const [values, setValues] = useState<Record<string, { marks: string; isAbsent: boolean }>>({});
  const max = sheet.data?.paper.maxMarks ?? 100;

  const valueOf = (id: string, marks: number | null, isAbsent: boolean) => values[id] ?? { marks: marks == null ? '' : String(marks), isAbsent };

  const save = useMutation({
    mutationFn: () =>
      examsApi.saveMarks(examId, {
        batchId,
        subjectId,
        entries: (sheet.data?.students ?? []).map((s) => {
          const v = valueOf(s._id, s.marks, s.isAbsent);
          return { studentId: s._id, isAbsent: v.isAbsent, marks: v.isAbsent || v.marks === '' ? null : Number(v.marks) };
        }),
      }),
    onSuccess: () => {
      toast.success('Marks saved');
      queryClient.invalidateQueries({ queryKey: ['marks', examId] });
      queryClient.invalidateQueries({ queryKey: ['exam-results', examId] });
    },
    onError: (error) => toast.error(errorMessage(error)),
  });

  if (sheet.isLoading) return <div className="py-10 text-center text-slate-500">Loading…</div>;
  if (sheet.error) return <div className="py-6 text-center text-red-600 text-sm">{errorMessage(sheet.error)}</div>;
  const invalid = (sheet.data?.students ?? []).some((s) => {
    const v = valueOf(s._id, s.marks, s.isAbsent);
    return !v.isAbsent && v.marks !== '' && (Number(v.marks) < 0 || Number(v.marks) > max);
  });

  return (
    <>
      <div className="rounded-xl border border-slate-200 divide-y divide-slate-100 max-h-[55vh] overflow-y-auto">
        {sheet.data?.students.map((s) => {
          const v = valueOf(s._id, s.marks, s.isAbsent);
          const bad = !v.isAbsent && v.marks !== '' && (Number(v.marks) < 0 || Number(v.marks) > max);
          return (
            <div key={s._id} className="flex items-center justify-between gap-3 px-4 py-2">
              <div className="min-w-0">
                <div className="font-medium text-slate-800 truncate">{s.rollNo ? `${s.rollNo}. ` : ''}{s.name}</div>
                <div className="text-xs text-slate-500">{s.enrollmentNo}</div>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1 text-xs text-slate-600">
                  <input type="checkbox" checked={v.isAbsent} onChange={(e) => setValues({ ...values, [s._id]: { ...v, isAbsent: e.target.checked } })} /> Absent
                </label>
                <input
                  type="number"
                  step="0.5"
                  min={0}
                  max={max}
                  disabled={v.isAbsent}
                  className={`${inputClass} w-24 text-right ${bad ? 'border-red-400 ring-1 ring-red-300' : ''}`}
                  value={v.marks}
                  onChange={(e) => setValues({ ...values, [s._id]: { ...v, marks: e.target.value } })}
                />
                <span className="text-xs text-slate-400 w-10">/ {max}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-end mt-4">
        <Button onClick={() => save.mutate()} isLoading={save.isPending} disabled={invalid || !sheet.data?.students.length}>Save marks</Button>
      </div>
    </>
  );
};

const Results: React.FC<{ examId: string; batchId: string }> = ({ examId, batchId }) => {
  const results = useQuery({ queryKey: ['exam-results', examId, batchId], queryFn: () => examsApi.results(examId, batchId), enabled: Boolean(batchId) });
  const s = results.data?.summary;
  // Grades used in this exam, best first.
  const grades = [
    ...new Set(
      (results.data?.results ?? [])
        .filter((r) => r.grade)
        .sort((a, b) => b.percentage - a.percentage)
        .map((r) => r.grade as string),
    ),
  ];
  return (
    <>
      {s && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-4 text-center">
          {[
            ['Students', s.students],
            ['Complete', s.complete],
            ['Passed', s.passed],
            ['Failed', s.failed],
            ['Average', s.averagePercentage != null ? `${s.averagePercentage}%` : '—'],
          ].map(([label, value]) => (
            <div key={label as string} className="glass rounded-2xl p-3">
              <div className="text-xs text-slate-500">{label}</div>
              <div className="text-lg font-semibold text-slate-800">{value}</div>
            </div>
          ))}
        </div>
      )}
      {Boolean(results.data?.results.length) && (
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <Panel title="Grade distribution" description="Students per grade">
            <Columns
              data={grades.map((grade) => ({ label: grade, value: (results.data?.results ?? []).filter((r) => r.grade === grade).length }))}
              colors={grades.map((_, i) => ORDINAL_BLUE[Math.min(i, ORDINAL_BLUE.length - 1)])}
              valueLabel="Students"
              height={200}
            />
          </Panel>
          <Panel title="Pass / fail">
            <SegmentedBar
              segments={[
                { key: 'pass', label: 'Passed', value: s?.passed ?? 0, color: STATUS.good },
                { key: 'fail', label: 'Failed', value: s?.failed ?? 0, color: STATUS.critical },
                { key: 'incomplete', label: 'Marks pending', value: (s?.students ?? 0) - (s?.complete ?? 0), color: STATUS.neutral },
              ]}
            />
          </Panel>
        </div>
      )}
      <Table
        data={results.data?.results ?? []}
        isLoading={results.isLoading}
        keyExtractor={(row) => row._id}
        columns={[
          { header: 'Rank', accessorKey: 'rank', cell: (row) => row.rank ?? '—' },
          { header: 'Student', accessorKey: 'studentId', cell: (row) => <span className="font-medium text-slate-800">{row.studentId.name}</span> },
          { header: 'Marks', accessorKey: 'totalMarks', cell: (row) => `${row.totalMarks} / ${row.maxMarks}` },
          { header: '%', accessorKey: 'percentage', cell: (row) => `${row.percentage}%` },
          { header: 'Grade', accessorKey: 'grade', cell: (row) => row.grade ?? '—' },
          { header: 'Result', accessorKey: 'result', cell: (row) => <StatusBadge status={row.result} /> },
        ]}
      />
    </>
  );
};
