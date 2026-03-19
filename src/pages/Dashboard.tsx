import React from 'react';

export const Dashboard: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-slate-500 text-sm font-medium">Total Students</h3>
          <p className="text-3xl font-bold text-slate-900 mt-2">1,245</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-slate-500 text-sm font-medium">Total Teachers</h3>
          <p className="text-3xl font-bold text-slate-900 mt-2">84</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-slate-500 text-sm font-medium">Total Classes</h3>
          <p className="text-3xl font-bold text-slate-900 mt-2">32</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-slate-500 text-sm font-medium">Revenue</h3>
          <p className="text-3xl font-bold text-slate-900 mt-2">₹4.2M</p>
        </div>
      </div>
    </div>
  );
};
