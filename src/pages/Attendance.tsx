import React from 'react';
import { EmptyState } from '../components/ui/EmptyState';
import { CalendarClock } from 'lucide-react';

export const Attendance: React.FC = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Attendance Tracker</h1>
      </div>
      <EmptyState 
        title="No attendance records" 
        description="Select a class to start marking daily attendance for students."
        icon={<CalendarClock className="w-12 h-12 text-blue-400" />}
      />
    </div>
  );
};
