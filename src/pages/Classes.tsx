import React from 'react';
import { EmptyState } from '../components/ui/EmptyState';
import { BookOpen } from 'lucide-react';

export const Classes: React.FC = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Classes Management</h1>
      </div>
      <EmptyState 
        title="No classes defined" 
        description="Create your first class and assign teachers and students."
        icon={<BookOpen className="w-12 h-12 text-blue-400" />}
      />
    </div>
  );
};
