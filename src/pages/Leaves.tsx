import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Check, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { leavesApi } from '../api';
import { errorMessage } from '../api/client';
import { Button } from '../components/ui/Button';
import { Table } from '../components/ui/Table';
import { Pagination } from '../components/ui/Pagination';
import { inputClass, Page, PageHeader, StatusBadge, Tabs } from '../components/ui/Kit';
import { useInstitution } from '../hooks/useInstitution';
import { date, refName, roleLabel } from '../lib/format';

export const Leaves: React.FC = () => {
  const { terms } = useInstitution();
  const queryClient = useQueryClient();
  const [kind, setKind] = useState('staff');
  const [status, setStatus] = useState('pending');
  const [page, setPage] = useState(1);
  const params = { page, limit: 25, kind, status: status || undefined };
  const list = useQuery({ queryKey: ['leaves', params], queryFn: () => leavesApi.list(params) });

  const review = useMutation({
    mutationFn: ({ id, decision }: { id: string; decision: 'approved' | 'rejected' }) => leavesApi.review(id, decision),
    onSuccess: (_d, { decision }) => {
      toast.success(`Leave ${decision}. The applicant is notified.`);
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: (error) => toast.error(errorMessage(error)),
  });

  return (
    <Page>
      <PageHeader title="Leave requests" subtitle={`Staff leave and ${terms.student.toLowerCase()} leave applied from the app`} />
      <div className="flex flex-wrap items-center gap-3">
        <Tabs active={kind} onChange={(id) => { setKind(id); setPage(1); }} tabs={[{ id: 'staff', label: 'Staff' }, { id: 'student', label: `${terms.student}s` }]} />
        <select className={`${inputClass} w-40 mb-5`} value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="">All</option>
        </select>
      </div>
      <Table
        data={list.data?.items ?? []}
        isLoading={list.isLoading}
        keyExtractor={(row) => row._id}
        columns={[
          {
            header: 'Applicant',
            accessorKey: 'applicantUserId',
            cell: (row) => (
              <div>
                <div className="font-semibold text-slate-800">{kind === 'student' ? refName(row.studentId) : refName(row.applicantUserId)}</div>
                <div className="text-xs text-slate-500">
                  {kind === 'student' ? `${refName(row.batchId)} · by ${refName(row.applicantUserId)} (${roleLabel[row.applicantRole]})` : roleLabel[row.applicantRole]}
                </div>
              </div>
            ),
          },
          { header: 'Type', accessorKey: 'type', cell: (row) => <span className="capitalize">{row.type}</span> },
          { header: 'Dates', accessorKey: 'fromDate', cell: (row) => (row.fromDate === row.toDate ? date(row.fromDate) : `${date(row.fromDate)} → ${date(row.toDate)}`) },
          { header: 'Reason', accessorKey: 'reason', cell: (row) => <span className="whitespace-normal block max-w-xs text-slate-600">{row.reason}</span> },
          { header: 'Status', accessorKey: 'status', cell: (row) => <StatusBadge status={row.status} /> },
          {
            header: '',
            accessorKey: 'actions',
            cell: (row) =>
              row.status === 'pending' ? (
                <div className="flex gap-2 justify-end">
                  <Button size="sm" variant="success" leftIcon={<Check className="w-3.5 h-3.5" />} onClick={() => review.mutate({ id: row._id, decision: 'approved' })}>Approve</Button>
                  <Button size="sm" variant="outline" leftIcon={<X className="w-3.5 h-3.5" />} onClick={() => review.mutate({ id: row._id, decision: 'rejected' })}>Reject</Button>
                </div>
              ) : null,
          },
        ]}
      />
      <Pagination currentPage={page} totalPages={list.data?.meta.totalPages ?? 1} onPageChange={setPage} />
    </Page>
  );
};
