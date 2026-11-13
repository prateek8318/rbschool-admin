import React from 'react';
import { FolderOpen } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, icon, action, className = '' }) => (
  <div className={`flex flex-col items-center justify-center py-14 px-4 glass rounded-2xl border-dashed text-center ${className}`}>
    <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center mb-4 text-indigo-600">{icon ?? <FolderOpen className="w-6 h-6" />}</div>
    <h3 className="text-base font-semibold text-slate-900">{title}</h3>
    <p className="text-sm text-slate-500 max-w-sm mt-1">{description}</p>
    {action && <div className="mt-5">{action}</div>}
  </div>
);
