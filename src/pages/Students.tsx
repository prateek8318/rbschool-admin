import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowUpRight, Download, Plus, Search, Trash2, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { studentsApi } from '../api';
import { errorMessage } from '../api/client';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Table } from '../components/ui/Table';
import { Pagination } from '../components/ui/Pagination';
import { CredentialsDialog, Field, inputClass, Page, PageHeader, StatusBadge, PersonCell, ErrorState } from '../components/ui/Kit';
import { useBatches, useInstitution } from '../hooks/useInstitution';
import { date, plural, refId, refName } from '../lib/format';
import type { Credential, Student } from '../types';

const STATUSES = ['active', 'alumni', 'transferred', 'dropped'] as const;

export const Students: React.FC = () => {
  const { terms } = useInstitution();
  const batches = useBatches();
  const [filters, setFilters] = useState({ page: 1, search: '', batchId: '', status: 'active' });
  const [adding, setAdding] = useState(false);
  const [promoting, setPromoting] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const queryClient = useQueryClient();

  const params = {
    page: filters.page,
    limit: 25,
    search: filters.search || undefined,
    batchId: filters.batchId || undefined,
    status: filters.status,
  };
  const list = useQuery({ queryKey: ['students', params], queryFn: () => studentsApi.list(params) });

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['students'] });
    queryClient.invalidateQueries({ queryKey: ['batches'] });
    queryClient.invalidateQueries({ queryKey: ['guardians'] });
  };

  return (
    <Page>
      <PageHeader
        title={plural(terms.student)}
        subtitle={`${list.data?.meta.total ?? 0} ${filters.status} ${plural(terms.student).toLowerCase()}`}
        actions={
          <>
            <Button variant="outline" leftIcon={<Download className="w-4 h-4" />} onClick={() => studentsApi.export({ batchId: params.batchId, status: params.status }).catch((e) => toast.error(errorMessage(e)))}>
              Export
            </Button>
            <Button variant="outline" leftIcon={<ArrowUpRight className="w-4 h-4" />} onClick={() => setPromoting(true)}>
              Promote
            </Button>
            <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setAdding(true)}>
              Add {terms.student.toLowerCase()}
            </Button>
          </>
        }
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            className={`${inputClass} pl-9`}
            placeholder={`Search name, ${terms.enrollmentNo.toLowerCase()}, phone`}
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
          />
        </div>
        <select className={`${inputClass} sm:w-56`} value={filters.batchId} onChange={(e) => setFilters({ ...filters, batchId: e.target.value, page: 1 })}>
          <option value="">All {plural(terms.batch).toLowerCase()}</option>
          {batches.data?.map((batch) => (
            <option key={batch._id} value={batch._id}>
              {refName(batch.programId)} · {batch.name}
            </option>
          ))}
        </select>
        <select className={`${inputClass} sm:w-40`} value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}>
          {STATUSES.map((status) => (
            <option key={status} value={status}>{status[0].toUpperCase() + status.slice(1)}</option>
          ))}
        </select>
      </div>

      {list.error && <ErrorState error={list.error} onRetry={() => list.refetch()} />}
      <Table
        data={list.data?.items ?? []}
        isLoading={list.isLoading}
        keyExtractor={(row) => row._id}
        onRowClick={(row) => setSelected(row._id)}
        columns={[
          {
            header: terms.student,
            accessorKey: 'name',
            cell: (row) => (
              <PersonCell name={row.name} sub={<>{row.enrollmentNo}{row.rollNo ? ` · Roll ${row.rollNo}` : ''}</>} />
            ),
          },
          { header: `${terms.program} / ${terms.batch}`, accessorKey: 'batchId', cell: (row) => `${refName(row.programId)} · ${refName(row.batchId)}` },
          {
            header: terms.guardian,
            accessorKey: 'guardians',
            cell: (row) => {
              const guardian = row.guardians.find((g) => g.isPrimary) ?? row.guardians[0];
              return guardian ? (
                <div>
                  <div className="text-slate-700">{guardian.name}</div>
                  <div className="text-xs text-slate-500">{guardian.phone}</div>
                </div>
              ) : (
                <span className="text-amber-600 text-xs font-semibold">No {terms.guardian.toLowerCase()}</span>
              );
            },
          },
          { header: 'App login', accessorKey: 'userId', cell: (row) => (row.userId ? <StatusBadge status="active" /> : <span className="text-xs text-slate-400">—</span>) },
          { header: 'Status', accessorKey: 'status', cell: (row) => <StatusBadge status={row.status} /> },
        ]}
      />
      <Pagination currentPage={filters.page} totalPages={list.data?.meta.totalPages ?? 1} onPageChange={(page) => setFilters({ ...filters, page })} />

      {adding && (
        <AddStudentModal
          onClose={() => setAdding(false)}
          onCreated={(issued) => {
            setAdding(false);
            setCredentials(issued);
            refresh();
          }}
        />
      )}
      {selected && <StudentDetails id={selected} onClose={() => setSelected(null)} onChanged={refresh} onCredentials={setCredentials} />}
      {promoting && <PromoteModal onClose={() => setPromoting(false)} onDone={refresh} />}
      <CredentialsDialog credentials={credentials} onClose={() => setCredentials([])} />
    </Page>
  );
};

// ---------------- Add student ----------------

const AddStudentModal: React.FC<{ onClose: () => void; onCreated: (credentials: Credential[]) => void }> = ({ onClose, onCreated }) => {
  const { terms } = useInstitution();
  const batches = useBatches();
  const [form, setForm] = useState({
    name: '',
    enrollmentNo: '',
    rollNo: '',
    batchId: '',
    gender: '',
    dob: '',
    phone: '',
    address: '',
    guardianName: '',
    guardianPhone: '',
    guardianRelation: 'father',
    createLogin: false,
  });
  const set = (key: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [key]: event.target.value });

  const mutation = useMutation({
    mutationFn: () =>
      studentsApi.create({
        name: form.name,
        enrollmentNo: form.enrollmentNo,
        rollNo: form.rollNo || undefined,
        batchId: form.batchId || undefined,
        gender: form.gender || undefined,
        dob: form.dob || undefined,
        phone: form.phone || undefined,
        address: form.address || undefined,
        guardians: form.guardianPhone ? [{ name: form.guardianName, phone: form.guardianPhone, relation: form.guardianRelation }] : undefined,
        createLogin: form.createLogin || undefined,
      }),
    onSuccess: (result) => {
      toast.success(`${result.student.name} added`);
      onCreated(result.credentials);
    },
    onError: (error) => toast.error(errorMessage(error)),
  });

  return (
    <Modal isOpen onClose={onClose} title={`New ${terms.student.toLowerCase()}`} maxWidth="2xl">
      <form
        className="space-y-6"
        onSubmit={(event) => {
          event.preventDefault();
          mutation.mutate();
        }}
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Full name">
            <input className={inputClass} value={form.name} onChange={set('name')} required minLength={2} />
          </Field>
          <Field label={terms.enrollmentNo}>
            <input className={inputClass} value={form.enrollmentNo} onChange={set('enrollmentNo')} required />
          </Field>
          <Field label={`${terms.program} / ${terms.batch}`}>
            <select className={inputClass} value={form.batchId} onChange={set('batchId')}>
              <option value="">Not assigned</option>
              {batches.data?.map((batch) => (
                <option key={batch._id} value={batch._id}>{refName(batch.programId)} · {batch.name}</option>
              ))}
            </select>
          </Field>
          <Field label="Roll no.">
            <input className={inputClass} value={form.rollNo} onChange={set('rollNo')} />
          </Field>
          <Field label="Gender">
            <select className={inputClass} value={form.gender} onChange={set('gender')}>
              <option value="">—</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </Field>
          <Field label="Date of birth">
            <input type="date" className={inputClass} value={form.dob} onChange={set('dob')} />
          </Field>
          <Field label={`${terms.student}'s mobile (optional)`}>
            <input className={inputClass} value={form.phone} onChange={set('phone')} inputMode="tel" />
          </Field>
          <Field label="Address">
            <input className={inputClass} value={form.address} onChange={set('address')} />
          </Field>
        </div>

        <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-4">
          <h4 className="text-sm font-bold text-slate-800 mb-1">{terms.guardian}</h4>
          <p className="text-xs text-slate-500 mb-3">The {terms.guardian.toLowerCase()} can log in to the app with this mobile number (OTP). If the number already exists, the same account is linked.</p>
          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Name">
              <input className={inputClass} value={form.guardianName} onChange={set('guardianName')} required={Boolean(form.guardianPhone)} />
            </Field>
            <Field label="Mobile">
              <input className={inputClass} value={form.guardianPhone} onChange={set('guardianPhone')} inputMode="tel" />
            </Field>
            <Field label="Relation">
              <select className={inputClass} value={form.guardianRelation} onChange={set('guardianRelation')}>
                {['father', 'mother', 'guardian', 'brother', 'sister', 'other'].map((r) => (
                  <option key={r} value={r} className="capitalize">{r}</option>
                ))}
              </select>
            </Field>
          </div>
        </div>

        <label className="flex items-center gap-3 text-sm text-slate-700">
          <input type="checkbox" checked={form.createLogin} onChange={(e) => setForm({ ...form, createLogin: e.target.checked })} className="rounded" />
          Also give the {terms.student.toLowerCase()} their own app login
        </label>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={mutation.isPending}>Save</Button>
        </div>
      </form>
    </Modal>
  );
};

// ---------------- Details / edit ----------------

const StudentDetails: React.FC<{ id: string; onClose: () => void; onChanged: () => void; onCredentials: (c: Credential[]) => void }> = ({
  id,
  onClose,
  onChanged,
  onCredentials,
}) => {
  const { terms } = useInstitution();
  const batches = useBatches();
  const queryClient = useQueryClient();
  const student = useQuery({ queryKey: ['student', id], queryFn: () => studentsApi.get(id) });
  const [edit, setEdit] = useState<Partial<Student> | null>(null);
  const [guardian, setGuardian] = useState({ name: '', phone: '', relation: 'mother' });

  const reload = () => {
    queryClient.invalidateQueries({ queryKey: ['student', id] });
    onChanged();
  };

  const save = useMutation({
    mutationFn: () =>
      studentsApi.update(id, {
        name: edit?.name,
        enrollmentNo: edit?.enrollmentNo,
        rollNo: edit?.rollNo || undefined,
        batchId: refId(edit?.batchId) || undefined,
        phone: edit?.phone || undefined,
        address: edit?.address || undefined,
        status: edit?.status,
      }),
    onSuccess: () => {
      toast.success('Saved');
      setEdit(null);
      reload();
    },
    onError: (error) => toast.error(errorMessage(error)),
  });

  const addGuardian = useMutation({
    mutationFn: () => studentsApi.addGuardian(id, guardian),
    onSuccess: (result) => {
      toast.success(`${terms.guardian} linked`);
      setGuardian({ name: '', phone: '', relation: 'mother' });
      if (result.credential) onCredentials([result.credential]);
      reload();
    },
    onError: (error) => toast.error(errorMessage(error)),
  });

  const removeGuardian = useMutation({
    mutationFn: (userId: string) => studentsApi.removeGuardian(id, userId),
    onSuccess: () => {
      toast.success('Removed');
      reload();
    },
    onError: (error) => toast.error(errorMessage(error)),
  });

  const createLogin = useMutation({
    mutationFn: () => studentsApi.createLogin(id),
    onSuccess: (result) => {
      if (result.credential) onCredentials([result.credential]);
      else toast.success('Linked to existing account');
      reload();
    },
    onError: (error) => toast.error(errorMessage(error)),
  });

  const s = student.data;
  return (
    <Modal isOpen onClose={onClose} title={s?.name ?? 'Loading…'} maxWidth="2xl">
      {!s ? (
        <div className="py-10 text-center text-slate-500">Loading…</div>
      ) : edit ? (
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            save.mutate();
          }}
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Name">
              <input className={inputClass} value={edit.name ?? ''} onChange={(e) => setEdit({ ...edit, name: e.target.value })} required />
            </Field>
            <Field label={terms.enrollmentNo}>
              <input className={inputClass} value={edit.enrollmentNo ?? ''} onChange={(e) => setEdit({ ...edit, enrollmentNo: e.target.value })} required />
            </Field>
            <Field label={terms.batch}>
              <select className={inputClass} value={refId(edit.batchId)} onChange={(e) => setEdit({ ...edit, batchId: e.target.value })}>
                <option value="">Not assigned</option>
                {batches.data?.map((batch) => (
                  <option key={batch._id} value={batch._id}>{refName(batch.programId)} · {batch.name}</option>
                ))}
              </select>
            </Field>
            <Field label="Roll no.">
              <input className={inputClass} value={edit.rollNo ?? ''} onChange={(e) => setEdit({ ...edit, rollNo: e.target.value })} />
            </Field>
            <Field label="Mobile">
              <input className={inputClass} value={edit.phone ?? ''} onChange={(e) => setEdit({ ...edit, phone: e.target.value })} />
            </Field>
            <Field label="Status" hint="Students who are not active lose app access">
              <select className={inputClass} value={edit.status} onChange={(e) => setEdit({ ...edit, status: e.target.value as Student['status'] })}>
                {STATUSES.map((status) => (
                  <option key={status} value={status}>{status[0].toUpperCase() + status.slice(1)}</option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Address">
            <input className={inputClass} value={edit.address ?? ''} onChange={(e) => setEdit({ ...edit, address: e.target.value })} />
          </Field>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setEdit(null)}>Cancel</Button>
            <Button type="submit" isLoading={save.isPending}>Save changes</Button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
            {[
              [terms.enrollmentNo, s.enrollmentNo],
              [`${terms.program} / ${terms.batch}`, `${refName(s.programId)} · ${refName(s.batchId)}`],
              ['Roll no.', s.rollNo ?? '—'],
              ['Gender', s.gender ?? '—'],
              ['Date of birth', date(s.dob)],
              ['Mobile', s.phone ?? '—'],
            ].map(([label, value]) => (
              <div key={label}>
                <div className="text-xs text-slate-500">{label}</div>
                <div className="font-semibold text-slate-800 capitalize">{value}</div>
              </div>
            ))}
            <div>
              <div className="text-xs text-slate-500">Status</div>
              <StatusBadge status={s.status} />
            </div>
            <div>
              <div className="text-xs text-slate-500">{terms.student} app login</div>
              {s.userId ? (
                <StatusBadge status="active" />
              ) : (
                <Button size="sm" variant="outline" onClick={() => createLogin.mutate()} isLoading={createLogin.isPending}>Create login</Button>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-800 mb-2">{plural(terms.guardian)}</h4>
            <div className="space-y-2 mb-3">
              {s.guardians.length ? (
                s.guardians.map((g) => (
                  <div key={g.userId} className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-2">
                    <div>
                      <div className="font-semibold text-slate-800">
                        {g.name} {g.isPrimary && <span className="text-xs text-indigo-600 font-semibold">(primary)</span>}
                      </div>
                      <div className="text-xs text-slate-500 capitalize">{g.relation} · {g.phone}</div>
                    </div>
                    <button className="p-2 text-slate-400 hover:text-red-600" onClick={() => removeGuardian.mutate(g.userId)} title="Unlink">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-amber-600">No {terms.guardian.toLowerCase()} linked yet.</p>
              )}
            </div>
            <form
              className="grid sm:grid-cols-4 gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                addGuardian.mutate();
              }}
            >
              <input className={inputClass} placeholder="Name" value={guardian.name} onChange={(e) => setGuardian({ ...guardian, name: e.target.value })} required />
              <input className={inputClass} placeholder="Mobile" value={guardian.phone} onChange={(e) => setGuardian({ ...guardian, phone: e.target.value })} required />
              <select className={inputClass} value={guardian.relation} onChange={(e) => setGuardian({ ...guardian, relation: e.target.value })}>
                {['father', 'mother', 'guardian', 'other'].map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <Button type="submit" variant="outline" leftIcon={<UserPlus className="w-4 h-4" />} isLoading={addGuardian.isPending}>Link</Button>
            </form>
          </div>

          <div className="flex justify-end">
            <Button onClick={() => setEdit(s)}>Edit details</Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

// ---------------- Promote ----------------

const PromoteModal: React.FC<{ onClose: () => void; onDone: () => void }> = ({ onClose, onDone }) => {
  const { terms } = useInstitution();
  const batches = useBatches();
  const [fromBatchId, setFrom] = useState('');
  const [toBatchId, setTo] = useState('');
  const [alumni, setAlumni] = useState(false);
  const mutation = useMutation({
    mutationFn: () => studentsApi.promote({ fromBatchId, toBatchId: alumni ? undefined : toBatchId, markAsAlumni: alumni }),
    onSuccess: (result) => {
      toast.success(`${result.updated} ${plural(terms.student).toLowerCase()} updated`);
      onDone();
      onClose();
    },
    onError: (error) => toast.error(errorMessage(error)),
  });
  const option = (batchId: string) => batches.data?.map((batch) => (
    <option key={batch._id} value={batch._id} disabled={batch._id === batchId}>{refName(batch.programId)} · {batch.name} ({batch.studentCount ?? 0})</option>
  ));
  return (
    <Modal isOpen onClose={onClose} title={`Promote ${plural(terms.student).toLowerCase()}`} maxWidth="lg">
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          mutation.mutate();
        }}
      >
        <Field label={`From ${terms.batch.toLowerCase()}`}>
          <select className={inputClass} value={fromBatchId} onChange={(e) => setFrom(e.target.value)} required>
            <option value="">Select</option>
            {option(toBatchId)}
          </select>
        </Field>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={alumni} onChange={(e) => setAlumni(e.target.checked)} /> Final year — mark everyone as alumni
        </label>
        {!alumni && (
          <Field label={`To ${terms.batch.toLowerCase()}`} hint="Create next session's batches first in Classes, if needed">
            <select className={inputClass} value={toBatchId} onChange={(e) => setTo(e.target.value)} required>
              <option value="">Select</option>
              {option(fromBatchId)}
            </select>
          </Field>
        )}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={mutation.isPending}>Promote</Button>
        </div>
      </form>
    </Modal>
  );
};
