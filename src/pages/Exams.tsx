import React from 'react';
import { Topbar } from '../components/layout/Topbar';

export const Exams: React.FC = () => {
  const examSchedule = [
    {
      subject: 'Mathematics',
      date: 'April 1, 2026',
      time: '9:00 – 12:00',
      maxMarks: 100,
      status: 'Scheduled'
    },
    {
      subject: 'Science',
      date: 'April 3, 2026',
      time: '9:00 – 12:00',
      maxMarks: 100,
      status: 'Scheduled'
    },
    {
      subject: 'English',
      date: 'April 5, 2026',
      time: '9:00 – 12:00',
      maxMarks: 100,
      status: 'Scheduled'
    },
    {
      subject: 'Hindi',
      date: 'April 7, 2026',
      time: '9:00 – 12:00',
      maxMarks: 100,
      status: 'Scheduled'
    },
    {
      subject: 'Social Studies',
      date: 'April 9, 2026',
      time: '9:00 – 12:00',
      maxMarks: 100,
      status: 'Scheduled'
    }
  ];

  const examTypes = [
    {
      name: 'Mid-Term',
      dates: 'Apr 1–10, 2026',
      status: 'Upcoming',
      color: 'border-amber-500',
      bgColor: 'bg-amber-100',
      icon: '📅'
    },
    {
      name: 'Unit Test 1',
      dates: 'Feb 15–20, 2026',
      status: 'Results Published',
      color: 'border-green-500',
      bgColor: 'bg-green-100',
      icon: '✅'
    },
    {
      name: 'Final Exam',
      dates: 'Jun 1–15, 2026',
      status: 'Scheduled',
      color: 'border-blue-500',
      bgColor: 'bg-blue-100',
      icon: '📝'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Scheduled':
        return 'badge-pending';
      case 'Completed':
        return 'badge-paid';
      case 'Cancelled':
        return 'badge-overdue';
      default:
        return 'badge-pending';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Upcoming':
        return 'text-amber-500';
      case 'Results Published':
        return 'text-green-600';
      case 'Scheduled':
        return 'text-blue-600';
      default:
        return 'text-slate-500';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Topbar 
        title="Exams & Results" 
        subtitle="Academic Year 2025–26"
        actions={
          <button className="px-4.5 py-2.5 rounded-xl btn-primary text-sm font-semibold cursor-pointer font-inherit">
            ➕ Create Exam
          </button>
        }
      />
      
      <div className="px-8 py-7">
        {/* Exam Types */}
        <div className="grid grid-cols-3 gap-5 mb-6">
          {examTypes.map((exam, index) => (
            <div key={index} className={`kpi-card border-t-4 ${exam.color} cursor-pointer`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3.5 ${exam.bgColor}`}>
                {exam.icon}
              </div>
              <div className="text-2xl font-extrabold leading-none">{exam.name}</div>
              <div className="text-xs text-slate-500 mt-1">{exam.dates}</div>
              <div className={`flex items-center gap-1 text-xs font-semibold mt-2 ${getStatusColor(exam.status)}`}>
                {exam.status === 'Upcoming' && '⏳'} {exam.status}
              </div>
            </div>
          ))}
        </div>

        {/* Exam Schedule */}
        <div className="table-card">
          <div className="flex items-center justify-between mb-4.5">
            <h3 className="text-sm font-bold">Exam Schedule — Mid-Term 2026</h3>
            <select className="px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-medium outline-none bg-slate-50">
              <option>Class 9-A</option>
              <option>Class 9-B</option>
              <option>Class 10-A</option>
              <option>Class 10-B</option>
              <option>Class 8-A</option>
              <option>Class 8-B</option>
            </select>
          </div>

          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-slate-200">
                <th className="text-xs font-semibold text-slate-500 uppercase tracking-[0.04em] py-2.5 px-3.5 text-left">Subject</th>
                <th className="text-xs font-semibold text-slate-500 uppercase tracking-[0.04em] py-2.5 px-3.5 text-left">Date</th>
                <th className="text-xs font-semibold text-slate-500 uppercase tracking-[0.04em] py-2.5 px-3.5 text-left">Time</th>
                <th className="text-xs font-semibold text-slate-500 uppercase tracking-[0.04em] py-2.5 px-3.5 text-left">Max Marks</th>
                <th className="text-xs font-semibold text-slate-500 uppercase tracking-[0.04em] py-2.5 px-3.5 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {examSchedule.map((exam, index) => (
                <tr key={index} className="border-b border-slate-200 hover:bg-blue-50/50 transition-colors">
                  <td className="py-3.5 px-3.5">
                    <strong className="text-sm font-semibold">{exam.subject}</strong>
                  </td>
                  <td className="py-3.5 px-3.5 text-sm">{exam.date}</td>
                  <td className="py-3.5 px-3.5 text-sm">{exam.time}</td>
                  <td className="py-3.5 px-3.5 text-sm">{exam.maxMarks}</td>
                  <td className="py-3.5 px-3.5">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getStatusBadge(exam.status)}`}>
                      {exam.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
