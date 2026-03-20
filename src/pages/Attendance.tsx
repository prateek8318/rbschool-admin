import React from 'react';
import { Topbar } from '../components/layout/Topbar';

export const Attendance: React.FC = () => {
  const attendanceData = [
    {
      class: 'Class 9-A',
      teacher: 'Mr. Suresh Sharma',
      total: 42,
      present: 40,
      absent: 2,
      percentage: 95.2,
      color: '#10B981'
    },
    {
      class: 'Class 10-B',
      teacher: 'Ms. Priya Mishra',
      total: 38,
      present: 35,
      absent: 3,
      percentage: 92.1,
      color: '#10B981'
    },
    {
      class: 'Class 8-A',
      teacher: 'Mr. Rajesh Verma',
      total: 45,
      present: 36,
      absent: 9,
      percentage: 80.0,
      color: '#F59E0B'
    },
    {
      class: 'Class 9-B',
      teacher: 'Mrs. Anjali Singh',
      total: 40,
      present: 38,
      absent: 2,
      percentage: 95.0,
      color: '#10B981'
    },
    {
      class: 'Class 10-A',
      teacher: 'Mr. Amit Kumar',
      total: 39,
      present: 37,
      absent: 2,
      percentage: 94.9,
      color: '#10B981'
    }
  ];

  const getProgressBarColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-gradient-to-r from-sky-500 to-green-500';
    if (percentage >= 80) return 'bg-gradient-to-r from-amber-500 to-orange-500';
    return 'bg-gradient-to-r from-red-500 to-pink-500';
  };

  const getPercentageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-amber-500';
    return 'text-red-500';
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Topbar 
        title="Attendance Reports" 
        subtitle="Overview for March 2026"
        actions={
          <button className="px-4.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold cursor-pointer font-inherit hover:bg-slate-100">
            📊 Export Report
          </button>
        }
      />
      
      <div className="px-8 py-7">
        {/* KPI Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="kpi-card">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3.5 bg-green-100">
              ✅
            </div>
            <div className="text-2xl font-extrabold leading-none">94.2%</div>
            <div className="text-xs text-slate-500 mt-1">Today's Attendance</div>
            <div className="flex items-center gap-1 text-xs font-semibold mt-2 text-green-600">
              1,174 / 1,248 present
            </div>
          </div>
          
          <div className="kpi-card">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3.5 bg-red-100">
              ❌
            </div>
            <div className="text-2xl font-extrabold leading-none">74</div>
            <div className="text-xs text-slate-500 mt-1">Absent Today</div>
            <div className="flex items-center gap-1 text-xs font-semibold mt-2 text-slate-500">
              Across all classes
            </div>
          </div>
          
          <div className="kpi-card">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3.5 bg-sky-100">
              📊
            </div>
            <div className="text-2xl font-extrabold leading-none">91.8%</div>
            <div className="text-xs text-slate-500 mt-1">Monthly Average</div>
            <div className="flex items-center gap-1 text-xs font-semibold mt-2 text-green-600">
              ↑ 1.2% vs Feb
            </div>
          </div>
        </div>

        {/* Class-wise Attendance Table */}
        <div className="table-card">
          <div className="flex items-center justify-between mb-4.5">
            <h3 className="text-sm font-bold">Class-wise Attendance</h3>
            <div className="flex gap-2.5">
              <input 
                type="date" 
                defaultValue="2026-03-26"
                className="px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-medium outline-none bg-slate-50"
              />
              <select className="px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-medium outline-none bg-slate-50">
                <option>All Classes</option>
                <option>Class 8</option>
                <option>Class 9</option>
                <option>Class 10</option>
              </select>
            </div>
          </div>

          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-slate-200">
                <th className="text-xs font-semibold text-slate-500 uppercase tracking-[0.04em] py-2.5 px-3.5 text-left">Class</th>
                <th className="text-xs font-semibold text-slate-500 uppercase tracking-[0.04em] py-2.5 px-3.5 text-left">Teacher</th>
                <th className="text-xs font-semibold text-slate-500 uppercase tracking-[0.04em] py-2.5 px-3.5 text-left">Total</th>
                <th className="text-xs font-semibold text-slate-500 uppercase tracking-[0.04em] py-2.5 px-3.5 text-left">Present</th>
                <th className="text-xs font-semibold text-slate-500 uppercase tracking-[0.04em] py-2.5 px-3.5 text-left">Absent</th>
                <th className="text-xs font-semibold text-slate-500 uppercase tracking-[0.04em] py-2.5 px-3.5 text-left">Attendance %</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((data, index) => (
                <tr key={index} className="border-b border-slate-200 hover:bg-blue-50/50 transition-colors">
                  <td className="py-3.5 px-3.5">
                    <strong className="text-sm font-semibold">{data.class}</strong>
                  </td>
                  <td className="py-3.5 px-3.5 text-sm">{data.teacher}</td>
                  <td className="py-3.5 px-3.5 text-sm">{data.total}</td>
                  <td className="py-3.5 px-3.5 text-sm">{data.present}</td>
                  <td className="py-3.5 px-3.5 text-sm">{data.absent}</td>
                  <td className="py-3.5 px-3.5">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${getProgressBarColor(data.percentage)} rounded-full`}
                          style={{ width: `${data.percentage}%` }}
                        />
                      </div>
                      <strong className={`text-sm font-semibold ${getPercentageColor(data.percentage)}`}>
                        {data.percentage}%
                      </strong>
                    </div>
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
