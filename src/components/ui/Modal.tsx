import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

const widths = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg',
  xl: 'sm:max-w-xl',
  '2xl': 'sm:max-w-3xl',
  full: 'sm:max-w-6xl',
};

/**
 * Desktop: centred frosted dialog. Mobile: bottom sheet that slides up,
 * like a native app. Closes on Esc or backdrop tap.
 */
export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, description, children, maxWidth = 'md' }) => {
  useEffect(() => {
    if (!isOpen) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-6" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div
        className={`relative w-full ${widths[maxWidth]} glass-strong rounded-t-[28px] sm:rounded-2xl flex flex-col max-h-[92dvh] sm:max-h-[88vh] animate-sheet-up sm:animate-pop-in`}
      >
        <div className="sm:hidden pt-2.5 flex justify-center">
          <span className="h-1.5 w-10 rounded-full bg-slate-300" />
        </div>
        <div className="flex items-start justify-between gap-4 px-5 sm:px-6 pt-3 sm:pt-5 pb-4 border-b border-slate-900/[0.06]">
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-semibold text-slate-900 truncate">{title}</h3>
            {description && <p className="text-sm text-slate-500 mt-0.5">{description}</p>}
          </div>
          <button onClick={onClose} className="press -mr-2 rounded-full p-2 text-slate-400 hover:bg-slate-900/5 hover:text-slate-600" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="px-5 sm:px-6 py-5 overflow-y-auto overscroll-contain pb-safe sm:pb-5">{children}</div>
      </div>
    </div>,
    document.body,
  );
};
