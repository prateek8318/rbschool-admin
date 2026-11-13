import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { institutionApi } from '../api';
import { errorMessage } from '../api/client';
import { Button } from '../components/ui/Button';
import {Field, inputClass, Page, PageHeader, Panel, Tabs } from '../components/ui/Kit';
import { chipClass } from '../lib/ui';
import { useInstitution } from '../hooks/useInstitution';
import { date } from '../lib/format';
import type { Institution, Terminology } from '../types';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const Settings: React.FC = () => {
  const [tab, setTab] = useState('profile');
  const { institution } = useInstitution();
  return (
    <Page>
      <PageHeader title="Settings" subtitle={institution?.name} />
      <Tabs active={tab} onChange={setTab} tabs={[{ id: 'profile', label: 'Profile' }, { id: 'academic', label: 'Academic rules' }, { id: 'terms', label: 'Labels' }, { id: 'sessions', label: 'Sessions' }]} />
      {institution && tab === 'profile' && <Profile institution={institution} />}
      {institution && tab === 'academic' && <AcademicRules institution={institution} />}
      {institution && tab === 'terms' && <Labels key={institution._id} institution={institution} />}
      {tab === 'sessions' && <Sessions />}
    </Page>
  );
};

const useSave = (fn: (body: unknown) => Promise<unknown>) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: () => {
      toast.success('Saved');
      queryClient.invalidateQueries({ queryKey: ['institution'] });
    },
    onError: (error) => toast.error(errorMessage(error)),
  });
};

const Profile: React.FC<{ institution: Institution }> = ({ institution }) => {
  const [form, setForm] = useState({
    name: institution.name,
    affiliation: institution.affiliation ?? '',
    email: institution.email ?? '',
    phone: institution.phone ?? '',
    website: institution.website ?? '',
    logoUrl: institution.logoUrl ?? '',
    line1: institution.address?.line1 ?? '',
    city: institution.address?.city ?? '',
    state: institution.address?.state ?? '',
    pincode: institution.address?.pincode ?? '',
  });
  const save = useSave(institutionApi.update);
  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [key]: e.target.value });
  const opt = (value: string) => value || undefined;
  return (
    <Panel>
      <form className="space-y-4" onSubmit={(e) => {
        e.preventDefault();
        save.mutate({
          name: form.name, affiliation: opt(form.affiliation), email: opt(form.email), phone: opt(form.phone), website: opt(form.website), logoUrl: opt(form.logoUrl),
          address: { line1: opt(form.line1), city: opt(form.city), state: opt(form.state), pincode: opt(form.pincode) },
        });
      }}>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Name"><input className={inputClass} value={form.name} onChange={set('name')} required /></Field>
          <Field label="Board / University"><input className={inputClass} value={form.affiliation} onChange={set('affiliation')} /></Field>
          <Field label="Email"><input type="email" className={inputClass} value={form.email} onChange={set('email')} /></Field>
          <Field label="Phone"><input className={inputClass} value={form.phone} onChange={set('phone')} /></Field>
          <Field label="Website"><input type="url" className={inputClass} value={form.website} onChange={set('website')} placeholder="https://" /></Field>
          <Field label="Logo URL"><input type="url" className={inputClass} value={form.logoUrl} onChange={set('logoUrl')} placeholder="https://" /></Field>
          <Field label="Address"><input className={inputClass} value={form.line1} onChange={set('line1')} /></Field>
          <Field label="City"><input className={inputClass} value={form.city} onChange={set('city')} /></Field>
          <Field label="State"><input className={inputClass} value={form.state} onChange={set('state')} /></Field>
          <Field label="PIN code"><input className={inputClass} value={form.pincode} onChange={set('pincode')} /></Field>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-500">Institution code: <code>{institution.code}</code> · Type: {institution.type}</span>
          <Button type="submit" isLoading={save.isPending}>Save</Button>
        </div>
      </form>
    </Panel>
  );
};

const AcademicRules: React.FC<{ institution: Institution }> = ({ institution }) => {
  const s = institution.settings;
  const [form, setForm] = useState({
    attendanceMode: s.attendanceMode,
    workingDays: s.workingDays,
    passPercentage: String(s.passPercentage),
    lowAttendanceThreshold: String(s.lowAttendanceThreshold),
    notifyGuardiansOnAbsence: s.notifyGuardiansOnAbsence,
    sendFeeReminders: s.sendFeeReminders,
    gradingScale: s.gradingScale.map((band) => ({ ...band, min: String(band.min) })),
  });
  const save = useSave(institutionApi.updateSettings);
  return (
    <form className="space-y-6" onSubmit={(e) => {
      e.preventDefault();
      save.mutate({
        attendanceMode: form.attendanceMode,
        workingDays: form.workingDays,
        passPercentage: Number(form.passPercentage),
        lowAttendanceThreshold: Number(form.lowAttendanceThreshold),
        notifyGuardiansOnAbsence: form.notifyGuardiansOnAbsence,
        sendFeeReminders: form.sendFeeReminders,
        gradingScale: form.gradingScale.map((band) => ({ grade: band.grade, min: Number(band.min), gradePoint: band.gradePoint })),
      });
    }}>
      <Panel title="Attendance">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Attendance is taken" hint="Colleges usually take it per lecture">
            <select className={inputClass} value={form.attendanceMode} onChange={(e) => setForm({ ...form, attendanceMode: e.target.value as 'daily' | 'per_period' })}>
              <option value="daily">Once a day</option>
              <option value="per_period">Every period / lecture</option>
            </select>
          </Field>
          <Field label="Low attendance warning below (%)"><input type="number" min={0} max={100} className={inputClass} value={form.lowAttendanceThreshold} onChange={(e) => setForm({ ...form, lowAttendanceThreshold: e.target.value })} /></Field>
        </div>
        <div className="mt-4">
          <span className="block text-sm font-semibold text-slate-700 mb-2">Working days</span>
          <div className="flex flex-wrap gap-2">
            {DAYS.map((day, index) => {
              const on = form.workingDays.includes(index);
              return <button type="button" key={day} onClick={() => setForm({ ...form, workingDays: on ? form.workingDays.filter((d) => d !== index) : [...form.workingDays, index].sort() })} className={`${chipClass(on)} w-12 rounded-lg`}>{day}</button>;
            })}
          </div>
        </div>
      </Panel>
      <Panel title="Notifications">
        <label className="flex items-center gap-3 text-sm mb-3"><input type="checkbox" checked={form.notifyGuardiansOnAbsence} onChange={(e) => setForm({ ...form, notifyGuardiansOnAbsence: e.target.checked })} /> Notify parents when their child is marked absent</label>
        <label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={form.sendFeeReminders} onChange={(e) => setForm({ ...form, sendFeeReminders: e.target.checked })} /> Send overdue fee reminders to parents</label>
      </Panel>
      <Panel title="Exams & grading">
        <Field label="Pass percentage"><input type="number" min={0} max={100} className={`${inputClass} w-40`} value={form.passPercentage} onChange={(e) => setForm({ ...form, passPercentage: e.target.value })} /></Field>
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2"><span className="text-sm font-semibold text-slate-700">Grading scale (minimum % for each grade)</span>
            <Button type="button" size="sm" variant="outline" leftIcon={<Plus className="w-3.5 h-3.5" />} onClick={() => setForm({ ...form, gradingScale: [...form.gradingScale, { grade: '', min: '0', gradePoint: undefined }] })}>Grade</Button></div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {form.gradingScale.map((band, index) => (
              <div key={index} className="flex gap-1">
                <input className={inputClass} value={band.grade} placeholder="Grade" onChange={(e) => setForm({ ...form, gradingScale: form.gradingScale.map((b, i) => (i === index ? { ...b, grade: e.target.value } : b)) })} />
                <input type="number" className={inputClass} value={band.min} placeholder="Min %" onChange={(e) => setForm({ ...form, gradingScale: form.gradingScale.map((b, i) => (i === index ? { ...b, min: e.target.value } : b)) })} />
              </div>
            ))}
          </div>
        </div>
      </Panel>
      <div className="flex justify-end"><Button type="submit" isLoading={save.isPending}>Save settings</Button></div>
    </form>
  );
};

const Labels: React.FC<{ institution: Institution }> = ({ institution }) => {
  const [terms, setTerms] = useState<Terminology>(institution.settings.terminology);
  const save = useSave(institutionApi.updateSettings);
  const fields: Array<[keyof Terminology, string, string]> = [
    ['program', 'Program', 'Class / Course / Programme'],
    ['batch', 'Group', 'Section / Batch / Division'],
    ['session', 'Session', 'Academic Year / Session'],
    ['student', 'Learner', 'Student / Trainee'],
    ['guardian', 'Guardian', 'Parent / Guardian'],
    ['teacher', 'Teacher', 'Teacher / Faculty / Trainer'],
    ['enrollmentNo', 'ID number', 'Admission No. / Roll No.'],
  ];
  return (
    <Panel>
      <p className="text-sm text-slate-600 mb-4">These words are shown across the admin panel and the mobile apps.</p>
      <form className="grid sm:grid-cols-2 gap-4" onSubmit={(e) => { e.preventDefault(); save.mutate({ terminology: terms }); }}>
        {fields.map(([key, label, hint]) => (
          <Field key={key} label={label} hint={hint}><input className={inputClass} value={terms[key]} onChange={(e) => setTerms({ ...terms, [key]: e.target.value })} required /></Field>
        ))}
        <div className="sm:col-span-2 flex justify-end"><Button type="submit" isLoading={save.isPending}>Save labels</Button></div>
      </form>
    </Panel>
  );
};

const Sessions: React.FC = () => {
  const queryClient = useQueryClient();
  const sessions = useQuery({ queryKey: ['sessions'], queryFn: institutionApi.sessions });
  const [form, setForm] = useState({ name: '', startDate: '', endDate: '' });
  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['sessions'] });
    queryClient.invalidateQueries();
  };
  const create = useMutation({
    mutationFn: () => institutionApi.createSession(form),
    onSuccess: () => { toast.success('Session added'); setForm({ name: '', startDate: '', endDate: '' }); refresh(); },
    onError: (error) => toast.error(errorMessage(error)),
  });
  const activate = useMutation({
    mutationFn: institutionApi.activateSession,
    onSuccess: () => { toast.success('Current session changed'); refresh(); },
    onError: (error) => toast.error(errorMessage(error)),
  });
  return (
    <div className="space-y-4">
      <Panel title="Add session">
        <form className="grid sm:grid-cols-4 gap-3" onSubmit={(e) => { e.preventDefault(); create.mutate(); }}>
          <input className={inputClass} placeholder="e.g. 2027-28" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input type="date" className={inputClass} value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required />
          <input type="date" className={inputClass} value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} required />
          <Button type="submit" isLoading={create.isPending}>Add</Button>
        </form>
      </Panel>
      <Panel title="Sessions">
        <ul className="divide-y divide-slate-100">
          {sessions.data?.map((s) => (
            <li key={s._id} className="py-3 flex items-center justify-between">
              <div><div className="font-semibold text-slate-800">{s.name}</div><div className="text-xs text-slate-500">{date(s.startDate)} → {date(s.endDate)}</div></div>
              {s.isCurrent ? <span className="flex items-center gap-1 text-sm font-semibold text-emerald-700"><CheckCircle2 className="w-4 h-4" /> Current</span>
                : <Button size="sm" variant="outline" onClick={() => activate.mutate(s._id)}>Make current</Button>}
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
};
