import React from 'react';
import { Topbar } from '../components/layout/Topbar';

export const Fees: React.FC = () => {
  const feeTransactions = [
    {
      student: 'Aarav Kumar',
      initials: 'AK',
      class: '9-A',
      amount: '₹12,000',
      quarter: 'Q4',
      status: 'Paid',
      date: 'Mar 26',
      color: '#6366F1'
    },
    {
      student: 'Diya Verma',
      initials: 'DV',
      class: '8-B',
      amount: '₹10,000',
      quarter: 'Q4',
      status: 'Pending',
      date: 'Due Apr 15',
      color: '#10B981'
    },
    {
      student: 'Raj Joshi',
      initials: 'RJ',
      class: '10-A',
      amount: '₹12,000',
      quarter: 'Q3',
      status: 'Overdue',
      date: 'Due Jan 15',
      color: '#EF4444'
    },
    {
      student: 'Priya Singh',
      initials: 'PS',
      class: '9-A',
      amount: '₹12,000',
      quarter: 'Q4',
      status: 'Paid',
      date: 'Mar 20',
      color: '#F59E0B'
    },
    {
      student: 'Arjun Nair',
      initials: 'AN',
      class: '9-B',
      amount: '₹11,000',
      quarter: 'Q4',
      status: 'Pending',
      date: 'Due Apr 10',
      color: '#8B5CF6'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'badge-paid';
      case 'Pending':
        return 'badge-pending';
      case 'Overdue':
        return 'badge-overdue';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Topbar 
        title="Fee Management" 
        subtitle="Academic Year 2025–26"
        actions={
          <button className="px-4.5 py-2.5 rounded-xl btn-primary text-sm font-semibold cursor-pointer font-inherit">
            ➕ Record Payment
          </button>
        }
      />
      
      <div className="px-8 py-7">
        {/* Fee Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="kpi-card">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3.5 bg-blue-100">
              💳
            </div>
            <div className="text-2xl font-extrabold leading-none">₹59.9L</div>
            <div className="text-xs text-slate-500 mt-1">Total Annual Due</div>
          </div>
          
          <div className="kpi-card">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3.5 bg-green-100">
              ✅
            </div>
            <div className="text-2xl font-extrabold leading-none">₹42.0L</div>
            <div className="text-xs text-slate-500 mt-1">Collected</div>
            <div className="flex items-center gap-1 text-xs font-semibold mt-2 text-green-600">
              70.1% collected
            </div>
          </div>
          
          <div className="kpi-card">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3.5 bg-red-100">
              ⏳
            </div>
            <div className="text-2xl font-extrabold leading-none">₹17.9L</div>
            <div className="text-xs text-slate-500 mt-1">Pending</div>
            <div className="flex items-center gap-1 text-xs font-semibold mt-2 text-red-500">
              248 students
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="table-card">
          <div className="flex items-center justify-between mb-4.5">
            <h3 className="text-sm font-bold">Recent Transactions</h3>
            <input 
              type="text" 
              placeholder="🔍 Search student..."
              className="px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-indigo-500 bg-slate-50 w-[220px]"
            />
          </div>

          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-slate-200">
                <th className="text-xs font-semibold text-slate-500 uppercase tracking-[0.04em] py-2.5 px-3.5 text-left">Student</th>
                <th className="text-xs font-semibold text-slate-500 uppercase tracking-[0.04em] py-2.5 px-3.5 text-left">Class</th>
                <th className="text-xs font-semibold text-slate-500 uppercase tracking-[0.04em] py-2.5 px-3.5 text-left">Amount</th>
                <th className="text-xs font-semibold text-slate-500 uppercase tracking-[0.04em] py-2.5 px-3.5 text-left">Quarter</th>
                <th className="text-xs font-semibold text-slate-500 uppercase tracking-[0.04em] py-2.5 px-3.5 text-left">Status</th>
                <th className="text-xs font-semibold text-slate-500 uppercase tracking-[0.04em] py-2.5 px-3.5 text-left">Date</th>
                <th className="text-xs font-semibold text-slate-500 uppercase tracking-[0.04em] py-2.5 px-3.5 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {feeTransactions.map((transaction, index) => (
                <tr key={index} className="border-b border-slate-200 hover:bg-blue-50/50 transition-colors">
                  <td className="py-3.5 px-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8.5 h-8.5 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: transaction.color }}>
                        {transaction.initials}
                      </div>
                      <div className="text-sm font-semibold">{transaction.student}</div>
                    </div>
                  </td>
                  <td className="py-3.5 px-3.5 text-sm">{transaction.class}</td>
                  <td className="py-3.5 px-3.5 text-sm font-bold">{transaction.amount}</td>
                  <td className="py-3.5 px-3.5 text-sm">{transaction.quarter}</td>
                  <td className="py-3.5 px-3.5">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getStatusBadge(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-3.5 text-sm">{transaction.date}</td>
                  <td className="py-3.5 px-3.5">
                    <div className="flex gap-1.5">
                      <button className="w-7.5 h-7.5 rounded-xl border-none cursor-pointer flex items-center justify-center text-sm bg-sky-500/10 text-sky-500 hover:bg-sky-500/20 transition-colors">
                        👁️
                      </button>
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
