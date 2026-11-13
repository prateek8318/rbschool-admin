import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Megaphone, Pin, Send, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { announcementsApi } from '../api';
import { errorMessage } from '../api/client';
import { Button } from '../components/ui/Button';
import { Pagination } from '../components/ui/Pagination';
import { EmptyState } from '../components/ui/EmptyState';
import {Field, inputClass, Page, PageHeader, Panel } from '../components/ui/Kit';
import { chipClass } from '../lib/ui';
import { useBatches, useInstitution } from '../hooks/useInstitution';
import { dateTime, plural, refName, roleLabel } from '../lib/format';
import type { Role } from '../types';

const AUDIENCE_ROLES: Role[] = ['guardian', 'student', 'teacher', 'staff', 'accountant', 'admin'];

export const Announcements: React.FC = () => {
  const { terms } = useInstitution();
  const batches = useBatches();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [form, setForm] = useState({ title: '', body: '', roles: [] as Role[], batchIds: [] as string[], isPinned: false });
  const list = useQuery({ queryKey: ['announcements', page], queryFn: () => announcementsApi.list({ page, limit: 10 }) });

  const create = useMutation({
    mutationFn: () => announcementsApi.create({ title: form.title, body: form.body, isPinned: form.isPinned, audience: { roles: form.roles, batchIds: form.batchIds, programIds: [] } }),
    onSuccess: (result) => {
      toast.success(`Posted · ${result.recipients ?? 0} people notified`);
      setForm({ title: '', body: '', roles: [], batchIds: [], isPinned: false });
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: (error) => toast.error(errorMessage(error)),
  });
  const remove = useMutation({
    mutationFn: announcementsApi.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['announcements'] }),
    onError: (error) => toast.error(errorMessage(error)),
  });

  const toggle = <T,>(list: T[], value: T) => (list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);
  const chip = chipClass;
  const labelFor = (role: Role) => (role === 'guardian' ? plural(terms.guardian) : role === 'student' ? plural(terms.student) : role === 'teacher' ? plural(terms.teacher) : `${roleLabel[role]}s`);

  return (
    <Page>
      <PageHeader title="Announcements" subtitle="Notices go to the app inbox of everyone in the audience" />
      <div className="grid lg:grid-cols-5 gap-6">
        <Panel title="New announcement" className="lg:col-span-2 h-fit">
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); create.mutate(); }}>
            <Field label="Title"><input className={inputClass} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required minLength={2} /></Field>
            <Field label="Message"><textarea className={`${inputClass} min-h-32`} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} required /></Field>
            <Field label="Who should see it?" hint="Nothing selected = everyone">
              <div className="flex flex-wrap gap-2">
                {AUDIENCE_ROLES.map((role) => <button type="button" key={role} className={chip(form.roles.includes(role))} onClick={() => setForm({ ...form, roles: toggle(form.roles, role) })}>{labelFor(role)}</button>)}
              </div>
            </Field>
            <Field label={`Only these ${plural(terms.batch).toLowerCase()}`} hint="Nothing selected = all">
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                {batches.data?.map((b) => <button type="button" key={b._id} className={chip(form.batchIds.includes(b._id))} onClick={() => setForm({ ...form, batchIds: toggle(form.batchIds, b._id) })}>{refName(b.programId)} · {b.name}</button>)}
              </div>
            </Field>
            <label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={form.isPinned} onChange={(e) => setForm({ ...form, isPinned: e.target.checked })} /> Pin to top</label>
            <Button type="submit" fullWidth leftIcon={<Send className="w-4 h-4" />} isLoading={create.isPending}>Post & notify</Button>
          </form>
        </Panel>

        <div className="lg:col-span-3 space-y-3 stagger">
          {list.data?.items.length ? list.data.items.map((item) => (
            <div key={item._id} className="glass lift rounded-2xl p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">{item.isPinned ? <Pin className="w-4 h-4" /> : <Megaphone className="w-4 h-4" />}</div>
                  <div>
                    <div className="font-bold text-slate-800">{item.title}</div>
                    <div className="text-xs text-slate-500">{refName(item.createdBy)} · {dateTime(item.createdAt)} · {item.audience.roles.length ? item.audience.roles.map(labelFor).join(', ') : 'Everyone'}</div>
                  </div>
                </div>
                <button className="p-2 text-slate-400 hover:text-red-600" onClick={() => remove.mutate(item._id)} title="Delete"><Trash2 className="w-4 h-4" /></button>
              </div>
              <p className="text-sm text-slate-600 mt-3 whitespace-pre-line">{item.body}</p>
            </div>
          )) : !list.isLoading && <EmptyState title="No announcements yet" description="Post a notice for parents, students or staff." />}
          <Pagination currentPage={page} totalPages={list.data?.meta.totalPages ?? 1} onPageChange={setPage} />
        </div>
      </div>
    </Page>
  );
};
