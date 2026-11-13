import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variants = {
  primary: 'bg-gradient-to-b from-indigo-500 to-indigo-600 text-white hover:from-indigo-600 hover:to-indigo-700 shadow-md shadow-indigo-600/25 ring-1 ring-inset ring-white/10',
  secondary: 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm',
  outline: 'bg-white/70 backdrop-blur text-slate-700 border border-slate-300/80 hover:bg-white hover:border-slate-400 shadow-sm',
  ghost: 'bg-transparent text-slate-600 hover:bg-slate-900/5 hover:text-slate-900',
  danger: 'bg-rose-600 text-white hover:bg-rose-700 shadow-sm',
  success: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm',
};

const sizes = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-11 px-5 text-sm gap-2',
  xl: 'h-12 px-6 text-base gap-2',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', isLoading = false, leftIcon, rightIcon, fullWidth = false, children, disabled, type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center whitespace-nowrap font-medium rounded-xl transition-all duration-150 active:scale-[0.97]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 focus-visible:ring-offset-1
        disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : leftIcon}
      {children}
      {!isLoading && rightIcon}
    </button>
  ),
);

Button.displayName = 'Button';
