import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  const button = 'press inline-flex items-center gap-1 h-9 px-3 rounded-xl border border-slate-300/80 bg-white/70 backdrop-blur text-sm text-slate-700 hover:bg-white disabled:opacity-40 disabled:pointer-events-none';
  return (
    <div className="flex items-center justify-between mt-4">
      <p className="text-sm text-slate-500">
        Page <span className="font-medium text-slate-700">{currentPage}</span> of <span className="font-medium text-slate-700">{totalPages}</span>
      </p>
      <div className="flex gap-2">
        <button className={button} onClick={() => onPageChange(currentPage - 1)} disabled={currentPage <= 1}>
          <ChevronLeft className="h-4 w-4" /> Previous
        </button>
        <button className={button} onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= totalPages}>
          Next <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
