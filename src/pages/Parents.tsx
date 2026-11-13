import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Search, ShieldBan, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { guardiansApi } from '../api';
import { errorMessage } from '../api/client';
import { Button } from '../components/ui/Button';
import { Table } from '../components/ui/Table';
import { Pagination } from '../components/ui/Pagination';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { inputClass, Page, PageHeader, StatusBadge, PersonCell, ErrorState } from '../components/ui/Kit';
import { useBatches, useInstitution } from '../hooks/useInstitution';
import { plural, refName } from '../lib/format';
import { AccessBadge } from './Teachers';
import type { ParentRow } from '../types';

export const Parents: React.FC = () => {
  const { terms } = useInstitution();
  const batches = useBatches();
  const [filters, setFilters] = useState({ page: 1, search: '', batchId: '', status: '' });
  const [blocking, setBlocking] = useState<ParentRow | null>(null);
  const queryClient = useQueryClient();

  const params = { page: filters.page, limit: 25, search: filters.search || undefined, batchId: filters.batchId || undefined, status: filters.status || undefined };
  const list = useQuery({ queryKey: ['guardians', params], queryFn: () => guardiansApi.list(params) });

  const toggle = useMutation({
    mutationFn: (row: ParentRow) => (row.status === 'active' ? guardiansApi.block(row.userId) : guardiansApi.unblock(row.userId)),
    onSuccess: (_data, row) => {
      toast.success(row.status === 'active' ? 'Access blocked' : 'Access restored');
      setBlocking(null);
      queryClient.invalidateQueries({ queryKey: ['guardians'] });
    },
    onError: (error) => toast.error(errorMessage(error)),
  });

  return (
    <Page>
      <PageHeader
        title={plural(terms.guardian)}
        subtitle={`${terms.guardian} accounts are created when you add a ${terms.student.toLowerCase()}. They sign in with their mobile number (OTP).`}
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input className={`${inputClass} pl-9`} placeholder="Search name or mobile" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })} />
        </div>
        <select className={`${inputClass} sm:w-56`} value={filters.batchId} onChange={(e) => setFilters({ ...filters, batchId: e.target.value, page: 1 })}>
          <option value="">All {plural(terms.batch).toLowerCase()}</option>
          {batches.data?.map((batch) => (
            <option key={batch._id} value={batch._id}>{refName(batch.programId)} · {batch.name}</option>
          ))}
        </select>
        <select className={`${inputClass} sm:w-40`} value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}>
          <option value="">All</option>
          <option value="active">Active</option>
          <option value="suspended">Blocked</option>
        </select>
      </div>

      {list.error && <ErrorState error={list.error} onRetry={() => list.refetch()} />}
      <Table
        data={list.data?.items ?? []}
        isLoading={list.isLoading}
        keyExtractor={(row) => row.userId}
        columns={[
          {
            header: terms.guardian,
            accessorKey: 'name',
            cell: (row) => (
              <PersonCell name={row.name} sub={<>{row.phone}</>} />
            ),
          },
          {
            header: plural(terms.student),
            accessorKey: 'children',
            cell: (row) => (
              <div className="space-y-0.5">
                {row.children.map((child) => (
                  <div key={child._id} className="text-sm">
                    <span className="font-medium text-slate-700">{child.name}</span>{' '}
                    <span className="text-xs text-slate-500">({refName(child.batch)}{child.relation ? ` · ${child.relation}` : ''})</span>
                  </div>
                ))}
              </div>
            ),
          },
          { header: 'App access', accessorKey: 'phoneVerified', cell: (row) => <AccessBadge access={{ phoneVerified: row.phoneVerified, lastLoginAt: row.lastLoginAt }} /> },
          { header: 'Status', accessorKey: 'status', cell: (row) => <StatusBadge status={row.status === 'active' ? 'active' : 'blocked'} /> },
          {
            header: '',
            accessorKey: 'actions',
            cell: (row) =>
              row.status === 'active' ? (
                <Button size="sm" variant="outline" leftIcon={<ShieldBan className="w-3.5 h-3.5" />} onClick={() => setBlocking(row)}>Block</Button>
              ) : (
                <Button size="sm" variant="success" leftIcon={<ShieldCheck className="w-3.5 h-3.5" />} onClick={() => toggle.mutate(row)}>Unblock</Button>
              ),
          },
        ]}
      />
      <Pagination currentPage={filters.page} totalPages={list.data?.meta.totalPages ?? 1} onPageChange={(page) => setFilters({ ...filters, page })} />

      <ConfirmDialog
        isOpen={Boolean(blocking)}
        onClose={() => setBlocking(null)}
        onConfirm={() => blocking && toggle.mutate(blocking)}
        isLoading={toggle.isPending}
        title={`Block ${blocking?.name}?`}
        description={`They will be logged out and won't be able to sign in or receive OTP for this institution until you unblock them.`}
        confirmText="Block"
      />
    </Page>
  );
};
