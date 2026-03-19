import React from 'react';
import { FolderSearch } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon = <FolderSearch className="w-12 h-12 text-blue-400" />,
  action,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 bg-white rounded-2xl border border-dashed border-slate-300 ${className}`}>
      <div className="flex items-center justify-center w-20 h-20 rounded-full bg-blue-50 mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-slate-900 mb-2 text-center">{title}</h3>
      <p className="text-slate-500 text-center max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
};
