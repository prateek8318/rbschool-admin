import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Building2, LogIn, Plus, Search, School, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { authApi, platformApi } from '../../api';
import { errorMessage } from '../../api/client';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Table } from '../../components/ui/Table';
import { Pagination } from '../../components/ui/Pagination';
import { CredentialsDialog, ErrorState, Field, inputClass, Page, PageHeader, Panel, PersonCell, StatCard, StatusBadge } from '../../components/ui/Kit';
import { BarList } from '../../components/charts/Charts';
import { useAuthStore } from '../../store/authStore';
import { date } from '../../lib/format';
import type { Credential, Institution, InstitutionType } from '../../types';

const TYPES: Array<{ value: InstitutionType; label: string }> = [
  { value: 'school', label: 'School' },
  { value: 'college', label: 'College' },
  { value: 'university', label: 'University' },
  { value: 'coaching', label: 'Coaching Institute' },
  { value: 'training_center', label: 'Training Center' },
  { value: 'other', label: 'Other' },
];

export const Institutions: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [creating, setCreating] = useState(false);
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const setActive = useAuthStore((state) => state.setActive);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const stats = useQuery({ queryKey: ['platform-stats'], queryFn: platformApi.stats });
  const list = useQuery({
    queryKey: ['platform-institutions', page, search],
    queryFn: () => platformApi.institutions({ page, limit: 20, search: search || undefined }),
  });

  const toggle = useMutation({
    mutationFn: (institution: Institution) => platformApi.setStatus(institution._id, !institution.isActive),
    onSuccess: () => {
      toast.success('Status updated');
      queryClient.invalidateQueries({ queryKey: ['platform-institutions'] });
    },
    onError: (error) => toast.error(errorMessage(error)),
  });

  const enter = async (institution: Institution) => {
    try {
      const result = await authApi.switchTo({ institutionId: institution._id });
      setActive(result.accessToken, result.activeMembership);
      queryClient.clear();
      navigate('/');
    } catch (error) {
      toast.error(errorMessage(error));
    }
  };

  return (
    <Page>
      <PageHeader
        title="Institutions"
        subtitle="Every school, college and coaching institute on the platform"
        actions={<Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setCreating(true)}>New institution</Button>}
      />

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mb-6 stagger">
        <StatCard loading={stats.isLoading} label="Institutions" value={stats.data?.institutions ?? '—'} icon={<Building2 className="w-5 h-5" />} />
        <StatCard loading={stats.isLoading} label="Schools" value={stats.data?.byType.school ?? 0} icon={<School className="w-5 h-5" />} tone="green" />
        <StatCard loading={stats.isLoading} label="Active students" value={stats.data?.students ?? '—'} icon={<Users className="w-5 h-5" />} tone="purple" />
        <StatCard loading={stats.isLoading} label="Active users" value={stats.data?.users ?? '—'} icon={<Users className="w-5 h-5" />} tone="amber" />
      </div>

      {stats.data && Object.keys(stats.data.byType).length > 0 && (
        <Panel title="Institutions by type" className="mb-6">
          <BarList
            items={Object.entries(stats.data.byType)
              .sort(([, a], [, b]) => b - a)
              .map(([type, count]) => ({ key: type, label: TYPES.find((t) => t.value === type)?.label ?? type, value: count }))}
          />
        </Panel>
      )}

      <div className="relative mb-4 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          className={`${inputClass} pl-9`}
          placeholder="Search by name or code"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {list.error && <ErrorState error={list.error} onRetry={() => list.refetch()} />}
      <Table
        data={list.data?.items ?? []}
        isLoading={list.isLoading}
        keyExtractor={(row) => row._id}
        columns={[
          {
            header: 'Institution',
            accessorKey: 'name',
            cell: (row) => (
              <PersonCell name={row.name} sub={<>{row.code}</>} />
            ),
          },
          { header: 'Type', accessorKey: 'type', cell: (row) => <span className="capitalize">{row.type.replace('_', ' ')}</span> },
          { header: 'City', accessorKey: 'address', cell: (row) => row.address?.city ?? '—' },
          { header: 'Students', accessorKey: 'studentCount', cell: (row) => row.studentCount ?? 0 },
          { header: 'Created', accessorKey: 'createdAt', cell: (row) => date(row.createdAt) },
          { header: 'Status', accessorKey: 'isActive', cell: (row) => <StatusBadge status={row.isActive ? 'active' : 'suspended'} /> },
          {
            header: '',
            accessorKey: 'actions',
            cell: (row) => (
              <div className="flex justify-end gap-2">
                <Button size="sm" variant="outline" onClick={() => toggle.mutate(row)}>
                  {row.isActive ? 'Suspend' : 'Activate'}
                </Button>
                <Button size="sm" leftIcon={<LogIn className="w-3.5 h-3.5" />} onClick={() => enter(row)} disabled={!row.isActive}>
                  Open
                </Button>
              </div>
            ),
          },
        ]}
      />
      <Pagination currentPage={page} totalPages={list.data?.meta.totalPages ?? 1} onPageChange={setPage} />

      {creating && (
        <CreateInstitutionModal
          onClose={() => setCreating(false)}
          onCreated={(credential) => {
            setCreating(false);
            if (credential) setCredentials([credential]);
            queryClient.invalidateQueries({ queryKey: ['platform-institutions'] });
            queryClient.invalidateQueries({ queryKey: ['platform-stats'] });
          }}
        />
      )}
      <CredentialsDialog
        credentials={credentials}
        onClose={() => setCredentials([])}
        note="The institution admin can sign in with this phone number using OTP, or with the temporary password below (shown only once)."
      />
    </Page>
  );
};

const CreateInstitutionModal: React.FC<{ onClose: () => void; onCreated: (credential: Credential | null) => void }> = ({ onClose, onCreated }) => {
  const [form, setForm] = useState({
    name: '',
    type: 'school' as InstitutionType,
    affiliation: '',
    city: '',
    state: '',
    phone: '',
    adminName: '',
    adminPhone: '',
    adminEmail: '',
    adminPassword: '',
  });
  const set = (key: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm({ ...form, [key]: event.target.value });

  const mutation = useMutation({
    mutationFn: () =>
      platformApi.create({
        institution: {
          name: form.name,
          type: form.type,
          affiliation: form.affiliation || undefined,
          city: form.city || undefined,
          state: form.state || undefined,
          phone: form.phone || undefined,
        },
        admin: {
          name: form.adminName,
          phone: form.adminPhone,
          email: form.adminEmail || undefined,
          password: form.adminPassword || undefined,
        },
      }),
    onSuccess: (result) => {
      toast.success(`${result.institution.name} created`);
      onCreated(result.credential);
    },
    onError: (error) => toast.error(errorMessage(error)),
  });

  return (
    <Modal isOpen onClose={onClose} title="New institution" maxWidth="2xl">
      <form
        className="space-y-6"
        onSubmit={(event) => {
          event.preventDefault();
          mutation.mutate();
        }}
      >
        <div>
          <h4 className="text-sm font-bold text-slate-800 mb-3">Institution</h4>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Name">
              <input className={inputClass} value={form.name} onChange={set('name')} required minLength={2} />
            </Field>
            <Field label="Type">
              <select className={inputClass} value={form.type} onChange={set('type')}>
                {TYPES.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </Field>
            <Field label="Board / University" hint="e.g. CBSE, UP Board, AKTU">
              <input className={inputClass} value={form.affiliation} onChange={set('affiliation')} />
            </Field>
            <Field label="Office phone">
              <input className={inputClass} value={form.phone} onChange={set('phone')} />
            </Field>
            <Field label="City">
              <input className={inputClass} value={form.city} onChange={set('city')} />
            </Field>
            <Field label="State">
              <input className={inputClass} value={form.state} onChange={set('state')} />
            </Field>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-800 mb-3">Institution admin (owner)</h4>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Full name">
              <input className={inputClass} value={form.adminName} onChange={set('adminName')} required minLength={2} />
            </Field>
            <Field label="Mobile number" hint="Used for OTP login">
              <input className={inputClass} value={form.adminPhone} onChange={set('adminPhone')} required inputMode="tel" />
            </Field>
            <Field label="Email (optional)">
              <input className={inputClass} type="email" value={form.adminEmail} onChange={set('adminEmail')} />
            </Field>
            <Field label="Password (optional)" hint="Leave empty to generate a temporary one">
              <input className={inputClass} type="text" value={form.adminPassword} onChange={set('adminPassword')} minLength={6} />
            </Field>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={mutation.isPending}>Create institution</Button>
        </div>
      </form>
    </Modal>
  );
};
