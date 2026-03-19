import React from 'react';
import { EmptyState } from '../components/ui/EmptyState';
import { GraduationCap } from 'lucide-react';

export const Teachers: React.FC = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Teachers Directory</h1>
      </div>
      <EmptyState 
        title="No teachers found" 
        description="Start adding teachers and building your faculty directory."
        icon={<GraduationCap className="w-12 h-12 text-blue-400" />}
      />
    </div>
  );
};
