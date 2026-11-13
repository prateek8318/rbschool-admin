import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BookOpen, Plus, Settings2, Trash2, UserRound, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { academicsApi, staffApi } from '../api';
import { errorMessage } from '../api/client';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Table } from '../components/ui/Table';
import { EmptyState } from '../components/ui/EmptyState';
import { Field, inputClass, Page, PageHeader, Tabs } from '../components/ui/Kit';
import { useBatches, useInstitution, usePrograms, useSubjects } from '../hooks/useInstitution';
import { plural, refId, refName } from '../lib/format';
import type { Batch } from '../types';

const useTeachers = () =>
  useQuery({ queryKey: ['teachers-all'], queryFn: () => staffApi.list({ limit: 200, status: 'active' }), staleTime: 60_000 });

export const Classes: React.FC = () => {
  const { terms } = useInstitution();
  const [tab, setTab] = useState('batches');
  return (
    <Page>
      <PageHeader title={`${plural(terms.program)} & ${plural(terms.batch)}`} subtitle={`Set up ${plural(terms.program).toLowerCase()}, ${plural(terms.batch).toLowerCase()}, subjects and who teaches what`} />
      <Tabs
        active={tab}
        onChange={setTab}
        tabs={[
          { id: 'batches', label: plural(terms.batch) },
          { id: 'programs', label: plural(terms.program) },
          { id: 'subjects', label: 'Subjects' },
        ]}
      />
      {tab === 'batches' && <BatchesTab />}
      {tab === 'programs' && <ProgramsTab />}
      {tab === 'subjects' && <SubjectsTab />}
    </Page>
  );
};

// ---------------- Batches ----------------

const BatchesTab: React.FC = () => {
  const { terms } = useInstitution();
  const batches = useBatches();
  const programs = usePrograms();
  const [creating, setCreating] = useState(false);
  const [managing, setManaging] = useState<Batch | null>(null);

  if (!programs.isLoading && !programs.data?.length) {
    return <EmptyState title={`Add a ${terms.program.toLowerCase()} first`} description={`Create ${plural(terms.program).toLowerCase()} (e.g. Class 10, B.Tech CSE) in the ${plural(terms.program)} tab, then add ${plural(terms.batch).toLowerCase()} here.`} />;
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setCreating(true)}>New {terms.batch.toLowerCase()}</Button>
      </div>
      {batches.data?.length ? (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 stagger">
          {batches.data.map((batch) => (
            <div key={batch._id} className="glass lift rounded-2xl p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs font-semibold text-indigo-600">{refName(batch.programId)}</div>
                  <div className="text-xl font-semibold text-slate-800">{batch.name}</div>
                </div>
                <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-500" onClick={() => setManaging(batch)} title="Manage">
                  <Settings2 className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <div className="flex items-center gap-2"><Users className="w-4 h-4 text-slate-400" /> {batch.studentCount ?? 0} {plural(terms.student).toLowerCase()}{batch.capacity ? ` / ${batch.capacity}` : ''}</div>
                <div className="flex items-center gap-2"><UserRound className="w-4 h-4 text-slate-400" /> {batch.coordinatorId ? refName(batch.coordinatorId) : <span className="text-amber-600">No class teacher</span>}</div>
                <div className="flex items-center gap-2"><BookOpen className="w-4 h-4 text-slate-400" /> {batch.subjects.length} subjects</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !batches.isLoading && <EmptyState title={`No ${plural(terms.batch).toLowerCase()} yet`} description={`Create your first ${terms.batch.toLowerCase()} to start adding ${plural(terms.student).toLowerCase()}.`} />
      )}
      {creating && <BatchForm onClose={() => setCreating(false)} />}
      {managing && <BatchManager batchId={managing._id} onClose={() => setManaging(null)} />}
    </>
  );
};

const BatchForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { terms } = useInstitution();
  const programs = usePrograms();
  const teachers = useTeachers();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ programId: '', name: '', coordinatorId: '', room: '', capacity: '' });
  const set = (key: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm({ ...form, [key]: event.target.value });
  const mutation = useMutation({
    mutationFn: () =>
      academicsApi.createBatch({
        programId: form.programId,
        name: form.name,
        coordinatorId: form.coordinatorId || undefined,
        room: form.room || undefined,
        capacity: form.capacity ? Number(form.capacity) : undefined,
      }),
    onSuccess: () => {
      toast.success(`${terms.batch} created`);
      queryClient.invalidateQueries({ queryKey: ['batches'] });
      onClose();
    },
    onError: (error) => toast.error(errorMessage(error)),
  });
  return (
    <Modal isOpen onClose={onClose} title={`New ${terms.batch.toLowerCase()}`} maxWidth="lg">
      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }}>
        <Field label={terms.program}>
          <select className={inputClass} value={form.programId} onChange={set('programId')} required>
            <option value="">Select</option>
            {programs.data?.map((program) => <option key={program._id} value={program._id}>{program.name}</option>)}
          </select>
        </Field>
        <Field label={`${terms.batch} name`} hint="e.g. A, B, Morning Batch, Sem 3 Div B">
          <input className={inputClass} value={form.name} onChange={set('name')} required />
        </Field>
        <Field label="Class teacher / coordinator">
          <select className={inputClass} value={form.coordinatorId} onChange={set('coordinatorId')}>
            <option value="">—</option>
            {teachers.data?.items.filter((t) => t.roles.some((r) => ['teacher', 'admin', 'owner'].includes(r))).map((t) => (
              <option key={t.userId} value={t.userId}>{t.name}</option>
            ))}
          </select>
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Room"><input className={inputClass} value={form.room} onChange={set('room')} /></Field>
          <Field label="Capacity"><input type="number" min={1} className={inputClass} value={form.capacity} onChange={set('capacity')} /></Field>
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={mutation.isPending}>Create</Button>
        </div>
      </form>
    </Modal>
  );
};

/** Coordinator, subjects and subject teachers of a batch, plus its students. */
const BatchManager: React.FC<{ batchId: string; onClose: () => void }> = ({ batchId, onClose }) => {
  const { terms } = useInstitution();
  const queryClient = useQueryClient();
  const batch = useQuery({ queryKey: ['batch', batchId], queryFn: () => academicsApi.batch(batchId) });
  const students = useQuery({ queryKey: ['batch-students', batchId], queryFn: () => academicsApi.batchStudents(batchId) });
  const subjects = useSubjects();
  const teachers = useTeachers();
  const [rows, setRows] = useState<Array<{ subjectId: string; teacherId: string }> | null>(null);
  const [coordinatorId, setCoordinator] = useState<string | null>(null);

  const current = rows ?? (batch.data?.subjects ?? []).map((s) => ({ subjectId: refId(s.subjectId), teacherId: refId(s.teacherId) }));
  const coordinator = coordinatorId ?? refId(batch.data?.coordinatorId);
  const teacherOptions = teachers.data?.items.filter((t) => t.roles.some((r) => ['teacher', 'admin', 'owner'].includes(r))) ?? [];

  const save = useMutation({
    mutationFn: async () => {
      await academicsApi.setBatchSubjects(batchId, current.filter((r) => r.subjectId).map((r) => ({ subjectId: r.subjectId, teacherId: r.teacherId || undefined })));
      if (coordinator !== refId(batch.data?.coordinatorId)) await academicsApi.updateBatch(batchId, { coordinatorId: coordinator || undefined });
    },
    onSuccess: () => {
      toast.success('Saved');
      queryClient.invalidateQueries({ queryKey: ['batches'] });
      queryClient.invalidateQueries({ queryKey: ['batch', batchId] });
      onClose();
    },
    onError: (error) => toast.error(errorMessage(error)),
  });

  return (
    <Modal isOpen onClose={onClose} title={batch.data ? `${refName(batch.data.programId)} · ${batch.data.name}` : 'Loading…'} maxWidth="2xl">
      <div className="space-y-6">
        <Field label="Class teacher / coordinator" hint={`Takes attendance and approves ${terms.student.toLowerCase()} leave for this ${terms.batch.toLowerCase()}`}>
          <select className={inputClass} value={coordinator} onChange={(e) => setCoordinator(e.target.value)}>
            <option value="">—</option>
            {teacherOptions.map((t) => <option key={t.userId} value={t.userId}>{t.name}</option>)}
          </select>
        </Field>

        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-bold text-slate-800">Subjects & teachers</h4>
            <Button size="sm" variant="outline" leftIcon={<Plus className="w-3.5 h-3.5" />} onClick={() => setRows([...current, { subjectId: '', teacherId: '' }])}>Add subject</Button>
          </div>
          <div className="space-y-2">
            {current.map((row, index) => (
              <div key={index} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                <select className={inputClass} value={row.subjectId} onChange={(e) => setRows(current.map((r, i) => (i === index ? { ...r, subjectId: e.target.value } : r)))}>
                  <option value="">Subject</option>
                  {subjects.data?.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
                </select>
                <select className={inputClass} value={row.teacherId} onChange={(e) => setRows(current.map((r, i) => (i === index ? { ...r, teacherId: e.target.value } : r)))}>
                  <option value="">Teacher</option>
                  {teacherOptions.map((t) => <option key={t.userId} value={t.userId}>{t.name}</option>)}
                </select>
                <button className="p-2 text-slate-400 hover:text-red-600" onClick={() => setRows(current.filter((_, i) => i !== index))}>
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {!current.length && <p className="text-sm text-slate-500">No subjects yet.</p>}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold text-slate-800 mb-2">{plural(terms.student)} ({students.data?.length ?? 0})</h4>
          <div className="max-h-60 overflow-y-auto rounded-xl border border-slate-200 divide-y divide-slate-100">
            {students.data?.map((s) => (
              <div key={s._id} className="px-4 py-2 text-sm flex justify-between">
                <span className="font-medium text-slate-700">{s.rollNo ? `${s.rollNo}. ` : ''}{s.name}</span>
                <span className="text-slate-500">{s.enrollmentNo}</span>
              </div>
            ))}
            {!students.data?.length && <div className="px-4 py-3 text-sm text-slate-500">No {plural(terms.student).toLowerCase()} yet</div>}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button onClick={() => save.mutate()} isLoading={save.isPending}>Save</Button>
        </div>
      </div>
    </Modal>
  );
};

// ---------------- Programs ----------------

const ProgramsTab: React.FC = () => {
  const { terms } = useInstitution();
  const programs = usePrograms();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ name: '', code: '', level: '', duration: '' });
  const create = useMutation({
    mutationFn: () => academicsApi.createProgram({ name: form.name, code: form.code || undefined, level: form.level ? Number(form.level) : undefined, duration: form.duration || undefined }),
    onSuccess: () => {
      toast.success(`${terms.program} added`);
      setForm({ name: '', code: '', level: '', duration: '' });
      queryClient.invalidateQueries({ queryKey: ['programs'] });
    },
    onError: (error) => toast.error(errorMessage(error)),
  });
  return (
    <div className="space-y-4">
      <form className="glass rounded-2xl p-4 grid sm:grid-cols-5 gap-3" onSubmit={(e) => { e.preventDefault(); create.mutate(); }}>
        <input className={`${inputClass} sm:col-span-2`} placeholder={`${terms.program} name (e.g. Class 10, B.Tech CSE)`} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input className={inputClass} placeholder="Order / level (e.g. 10)" type="number" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} />
        <input className={inputClass} placeholder="Duration (e.g. 1 year)" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
        <Button type="submit" isLoading={create.isPending} leftIcon={<Plus className="w-4 h-4" />}>Add</Button>
      </form>
      <Table
        data={programs.data ?? []}
        isLoading={programs.isLoading}
        keyExtractor={(row) => row._id}
        columns={[
          { header: 'Name', accessorKey: 'name', cell: (row) => <span className="font-semibold text-slate-800">{row.name}</span> },
          { header: 'Level', accessorKey: 'level', cell: (row) => row.level ?? '—' },
          { header: 'Duration', accessorKey: 'duration', cell: (row) => row.duration ?? '—' },
        ]}
      />
    </div>
  );
};

// ---------------- Subjects ----------------

const SubjectsTab: React.FC = () => {
  const subjects = useSubjects();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ name: '', code: '', type: 'theory' });
  const create = useMutation({
    mutationFn: () => academicsApi.createSubject({ name: form.name, code: form.code || undefined, type: form.type }),
    onSuccess: () => {
      toast.success('Subject added');
      setForm({ name: '', code: '', type: 'theory' });
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
    },
    onError: (error) => toast.error(errorMessage(error)),
  });
  return (
    <div className="space-y-4">
      <form className="glass rounded-2xl p-4 grid sm:grid-cols-4 gap-3" onSubmit={(e) => { e.preventDefault(); create.mutate(); }}>
        <input className={inputClass} placeholder="Subject name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input className={inputClass} placeholder="Code (optional)" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
        <select className={inputClass} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
          <option value="theory">Theory</option>
          <option value="practical">Practical</option>
          <option value="activity">Activity</option>
          <option value="other">Other</option>
        </select>
        <Button type="submit" isLoading={create.isPending} leftIcon={<Plus className="w-4 h-4" />}>Add</Button>
      </form>
      <Table
        data={subjects.data ?? []}
        isLoading={subjects.isLoading}
        keyExtractor={(row) => row._id}
        columns={[
          { header: 'Subject', accessorKey: 'name', cell: (row) => <span className="font-semibold text-slate-800">{row.name}</span> },
          { header: 'Code', accessorKey: 'code', cell: (row) => row.code ?? '—' },
          { header: 'Type', accessorKey: 'type', cell: (row) => <span className="capitalize">{row.type}</span> },
        ]}
      />
    </div>
  );
};
