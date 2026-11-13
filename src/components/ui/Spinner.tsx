import React from 'react';
import { Loader2 } from 'lucide-react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  fullScreen?: boolean;
  label?: string;
}

const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8', xl: 'w-10 h-10' };

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className = '', fullScreen = false, label }) => {
  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <Loader2 className={`animate-spin text-indigo-600 ${sizes[size]} ${className}`} />
      {label && <span className="text-sm text-slate-500">{label}</span>}
    </div>
  );
  if (fullScreen) return <div className="min-h-[60vh] flex items-center justify-center">{spinner}</div>;
  return <div className="flex justify-center">{spinner}</div>;
};
