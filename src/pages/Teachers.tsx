import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BadgeCheck, Clock, Plus, Search, ShieldBan, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { staffApi } from '../api';
import { errorMessage } from '../api/client';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Table } from '../components/ui/Table';
import { Pagination } from '../components/ui/Pagination';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import {CredentialsDialog, Field, inputClass, Page, PageHeader, StatusBadge, PersonCell, ErrorState } from '../components/ui/Kit';
import { chipClass } from '../lib/ui';
import { useInstitution, useSubjects } from '../hooks/useInstitution';
import { useAuthStore } from '../store/authStore';
import { dateTime, plural, refName, roleLabel } from '../lib/format';
import type { AccessInfo, Credential, StaffMember } from '../types';

const STAFF_ROLES = ['teacher', 'accountant', 'staff', 'admin'] as const;

export const AccessBadge: React.FC<{ access?: AccessInfo | null }> = ({ access }) =>
  access?.phoneVerified ? (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700" title={`Last login ${dateTime(access.lastLoginAt)}`}>
      <BadgeCheck className="w-4 h-4" /> Verified
    </span>
  ) : access?.lastLoginAt ? (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700">
      <BadgeCheck className="w-4 h-4" /> Logged in
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500">
      <Clock className="w-4 h-4" /> Not logged in yet
    </span>
  );

export const Teachers: React.FC = () => {
  const { terms } = useInstitution();
  const [filters, setFilters] = useState({ page: 1, search: '', role: '', status: 'active' });
  const [adding, setAdding] = useState(false);
  const [selected, setSelected] = useState<StaffMember | null>(null);
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const queryClient = useQueryClient();

  const params = { page: filters.page, limit: 25, search: filters.search || undefined, role: filters.role || undefined, status: filters.status };
  const list = useQuery({ queryKey: ['staff', params], queryFn: () => staffApi.list(params) });
  const refresh = () => queryClient.invalidateQueries({ queryKey: ['staff'] });

  return (
    <Page>
      <PageHeader
        title={`${plural(terms.teacher)} & Staff`}
        subtitle="Only people you add here can sign in to the app — with their mobile number (OTP)"
        actions={<Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setAdding(true)}>Add staff member</Button>}
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input className={`${inputClass} pl-9`} placeholder="Search name, phone, employee code" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })} />
        </div>
        <select className={`${inputClass} sm:w-44`} value={filters.role} onChange={(e) => setFilters({ ...filters, role: e.target.value, page: 1 })}>
          <option value="">All roles</option>
          {STAFF_ROLES.map((role) => (
            <option key={role} value={role}>{roleLabel[role]}</option>
          ))}
        </select>
        <select className={`${inputClass} sm:w-40`} value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}>
          <option value="active">Active</option>
          <option value="inactive">Blocked</option>
        </select>
      </div>

      {list.error && <ErrorState error={list.error} onRetry={() => list.refetch()} />}
      <Table
        data={list.data?.items ?? []}
        isLoading={list.isLoading}
        keyExtractor={(row) => row._id}
        onRowClick={setSelected}
        columns={[
          {
            header: 'Name',
            accessorKey: 'name',
            cell: (row) => (
              <PersonCell name={row.name} sub={<>{row.designation ?? ''}{row.employeeCode ? ` · ${row.employeeCode}` : ''}</>} />
            ),
          },
          { header: 'Mobile', accessorKey: 'phone' },
          { header: 'Role', accessorKey: 'roles', cell: (row) => row.roles.map((role) => roleLabel[role]).join(', ') || '—' },
          { header: 'Subjects', accessorKey: 'subjectIds', cell: (row) => row.subjectIds.map(refName).join(', ') || '—' },
          { header: 'App access', accessorKey: 'access', cell: (row) => <AccessBadge access={row.access} /> },
          { header: 'Status', accessorKey: 'status', cell: (row) => <StatusBadge status={row.status === 'active' ? 'active' : 'blocked'} /> },
        ]}
      />
      <Pagination currentPage={filters.page} totalPages={list.data?.meta.totalPages ?? 1} onPageChange={(page) => setFilters({ ...filters, page })} />

      {adding && (
        <StaffForm
          onClose={() => setAdding(false)}
          onSaved={(credential) => {
            setAdding(false);
            if (credential) setCredentials([credential]);
            else toast.success('Added. They can log in with their existing account.');
            refresh();
          }}
        />
      )}
      {selected && <StaffDetails staff={selected} onClose={() => setSelected(null)} onChanged={refresh} />}
      <CredentialsDialog credentials={credentials} onClose={() => setCredentials([])} />
    </Page>
  );
};

const StaffForm: React.FC<{ staff?: StaffMember; onClose: () => void; onSaved: (credential: Credential | null) => void }> = ({ staff, onClose, onSaved }) => {
  const subjects = useSubjects();
  const ownerView = useAuthStore((state) => state.active?.role === 'owner');
  const [form, setForm] = useState({
    name: staff?.name ?? '',
    phone: staff?.phone ?? '',
    email: staff?.email ?? '',
    role: 'teacher' as (typeof STAFF_ROLES)[number],
    employeeCode: staff?.employeeCode ?? '',
    designation: staff?.designation ?? '',
    department: staff?.department ?? '',
    qualification: staff?.qualification ?? '',
    experienceYears: String(staff?.experienceYears ?? ''),
    joiningDate: staff?.joiningDate ?? '',
    subjectIds: (staff?.subjectIds ?? []).map((s) => (typeof s === 'string' ? s : s._id)),
  });
  const set = (key: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm({ ...form, [key]: event.target.value });

  const body = () => ({
    name: form.name,
    email: form.email || undefined,
    employeeCode: form.employeeCode || undefined,
    designation: form.designation || undefined,
    department: form.department || undefined,
    qualification: form.qualification || undefined,
    experienceYears: form.experienceYears ? Number(form.experienceYears) : undefined,
    joiningDate: form.joiningDate || undefined,
    subjectIds: form.subjectIds,
  });

  const mutation = useMutation({
    mutationFn: async () => {
      if (staff) {
        await staffApi.update(staff._id, body());
        return null;
      }
      return (await staffApi.create({ ...body(), phone: form.phone, role: form.role })).credential;
    },
    onSuccess: (credential) => {
      toast.success(staff ? 'Saved' : `${form.name} added`);
      onSaved(credential);
    },
    onError: (error) => toast.error(errorMessage(error)),
  });

  return (
    <Modal isOpen onClose={onClose} title={staff ? `Edit ${staff.name}` : 'Add staff member'} maxWidth="2xl">
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          mutation.mutate();
        }}
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Full name">
            <input className={inputClass} value={form.name} onChange={set('name')} required minLength={2} />
          </Field>
          <Field label="Mobile number" hint={staff ? 'Mobile is their login and cannot be changed here' : 'They will log in with this number (OTP)'}>
            <input className={inputClass} value={form.phone} onChange={set('phone')} required disabled={Boolean(staff)} inputMode="tel" />
          </Field>
          {!staff && (
            <Field label="Role">
              <select className={inputClass} value={form.role} onChange={set('role')}>
                {STAFF_ROLES.filter((role) => role !== 'admin' || ownerView).map((role) => (
                  <option key={role} value={role}>{roleLabel[role]}</option>
                ))}
              </select>
            </Field>
          )}
          <Field label="Email (optional)">
            <input type="email" className={inputClass} value={form.email} onChange={set('email')} />
          </Field>
          <Field label="Employee code">
            <input className={inputClass} value={form.employeeCode} onChange={set('employeeCode')} />
          </Field>
          <Field label="Designation" hint="e.g. PGT, Lecturer, Clerk">
            <input className={inputClass} value={form.designation} onChange={set('designation')} />
          </Field>
          <Field label="Department">
            <input className={inputClass} value={form.department} onChange={set('department')} />
          </Field>
          <Field label="Qualification">
            <input className={inputClass} value={form.qualification} onChange={set('qualification')} />
          </Field>
          <Field label="Experience (years)">
            <input type="number" min={0} className={inputClass} value={form.experienceYears} onChange={set('experienceYears')} />
          </Field>
          <Field label="Joining date">
            <input type="date" className={inputClass} value={form.joiningDate} onChange={set('joiningDate')} />
          </Field>
        </div>
        <Field label="Subjects">
          <div className="flex flex-wrap gap-2">
            {subjects.data?.length ? (
              subjects.data.map((subject) => {
                const on = form.subjectIds.includes(subject._id);
                return (
                  <button
                    type="button"
                    key={subject._id}
                    onClick={() => setForm({ ...form, subjectIds: on ? form.subjectIds.filter((id) => id !== subject._id) : [...form.subjectIds, subject._id] })}
                    className={chipClass(on)}
                  >
                    {subject.name}
                  </button>
                );
              })
            ) : (
              <span className="text-xs text-slate-500">Add subjects in Classes first</span>
            )}
          </div>
        </Field>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={mutation.isPending}>Save</Button>
        </div>
      </form>
    </Modal>
  );
};

const StaffDetails: React.FC<{ staff: StaffMember; onClose: () => void; onChanged: () => void }> = ({ staff, onClose, onChanged }) => {
  const ownerView = useAuthStore((state) => state.active?.role === 'owner');
  const details = useQuery({ queryKey: ['staff-member', staff._id], queryFn: () => staffApi.get(staff._id) });
  const [editing, setEditing] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [roles, setRoles] = useState<string[]>(staff.roles.filter((role) => role !== 'owner'));
  const isOwner = staff.roles.includes('owner');

  const done = (message: string) => {
    toast.success(message);
    onChanged();
    onClose();
  };
  const saveRoles = useMutation({ mutationFn: () => staffApi.setRoles(staff._id, roles), onSuccess: () => done('Roles updated'), onError: (e) => toast.error(errorMessage(e)) });
  const block = useMutation({ mutationFn: () => staffApi.deactivate(staff._id), onSuccess: () => done('Access blocked'), onError: (e) => toast.error(errorMessage(e)) });
  const unblock = useMutation({ mutationFn: () => staffApi.activate(staff._id), onSuccess: () => done('Access restored'), onError: (e) => toast.error(errorMessage(e)) });

  if (editing) return <StaffForm staff={staff} onClose={() => setEditing(false)} onSaved={() => { onChanged(); onClose(); }} />;

  return (
    <Modal isOpen onClose={onClose} title={staff.name} maxWidth="2xl">
      <div className="space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
          {[
            ['Mobile', staff.phone],
            ['Email', staff.email],
            ['Designation', staff.designation],
            ['Department', staff.department],
            ['Qualification', staff.qualification],
            ['Experience', staff.experienceYears != null ? `${staff.experienceYears} yrs` : undefined],
          ].map(([label, value]) => (
            <div key={label}>
              <div className="text-xs text-slate-500">{label}</div>
              <div className="font-semibold text-slate-800">{value || '—'}</div>
            </div>
          ))}
          <div>
            <div className="text-xs text-slate-500">App access</div>
            <AccessBadge access={staff.access} />
          </div>
          <div>
            <div className="text-xs text-slate-500">Last login</div>
            <div className="font-semibold text-slate-800">{dateTime(staff.access?.lastLoginAt)}</div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold text-slate-800 mb-2">Teaching</h4>
          {details.data?.batches.length ? (
            <div className="flex flex-wrap gap-2">
              {details.data.batches.map((batch) => (
                <span key={batch._id} className="px-3 py-1 rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
                  {refName(batch.programId)} · {batch.name}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">Not assigned to any class yet (assign in Classes).</p>
          )}
        </div>

        {!isOwner && (
          <div>
            <h4 className="text-sm font-bold text-slate-800 mb-2">Roles</h4>
            <div className="flex flex-wrap gap-2 mb-3">
              {STAFF_ROLES.filter((role) => role !== 'admin' || ownerView).map((role) => {
                const on = roles.includes(role);
                return (
                  <button
                    key={role}
                    onClick={() => setRoles(on ? roles.filter((r) => r !== role) : [...roles, role])}
                    className={chipClass(on)}
                  >
                    {roleLabel[role]}
                  </button>
                );
              })}
            </div>
            <Button size="sm" variant="outline" disabled={!roles.length} isLoading={saveRoles.isPending} onClick={() => saveRoles.mutate()}>Save roles</Button>
          </div>
        )}

        <div className="flex flex-wrap justify-between gap-2 pt-2 border-t border-slate-100">
          {!isOwner &&
            (staff.status === 'active' ? (
              <Button variant="danger" leftIcon={<ShieldBan className="w-4 h-4" />} onClick={() => setConfirm(true)}>Block access</Button>
            ) : (
              <Button variant="success" leftIcon={<ShieldCheck className="w-4 h-4" />} onClick={() => unblock.mutate()} isLoading={unblock.isPending}>Restore access</Button>
            ))}
          <Button onClick={() => setEditing(true)}>Edit details</Button>
        </div>
      </div>
      <ConfirmDialog
        isOpen={confirm}
        onClose={() => setConfirm(false)}
        onConfirm={() => block.mutate()}
        isLoading={block.isPending}
        title="Block access?"
        description={`${staff.name} will be logged out and can no longer sign in to this institution. You can restore access anytime.`}
        confirmText="Block"
      />
    </Modal>
  );
};
