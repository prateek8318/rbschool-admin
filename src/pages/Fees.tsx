import React from 'react';
import { EmptyState } from '../components/ui/EmptyState';
import { IndianRupee } from 'lucide-react';

export const Fees: React.FC = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Fee Collection & Invoices</h1>
      </div>
      <EmptyState 
        title="No fee records" 
        description="Generate invoices to start tracking payments and dues."
        icon={<IndianRupee className="w-12 h-12 text-blue-400" />}
      />
    </div>
  );
};
