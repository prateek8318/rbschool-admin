import React from 'react';
import { EmptyState } from '../components/ui/EmptyState';
import { Users } from 'lucide-react';

export const Students: React.FC = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Students Management</h1>
      </div>
      <EmptyState 
        title="No students added yet" 
        description="Get started by adding your first student to the system."
        icon={<Users className="w-12 h-12 text-blue-400" />}
      />
    </div>
  );
};
