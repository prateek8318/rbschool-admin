import React from 'react';
import { EmptyState } from '../components/ui/EmptyState';
import { Bell } from 'lucide-react';

export const Announcements: React.FC = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Announcements Board</h1>
      </div>
      <EmptyState 
        title="No announcements" 
        description="Broadcast your first message to students or staff."
        icon={<Bell className="w-12 h-12 text-blue-400" />}
      />
    </div>
  );
};
