import React from 'react';
import { Menu } from 'lucide-react';
import { useUiStore } from '../../store/uiStore';

interface TopbarProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export const Topbar: React.FC<TopbarProps> = ({ title, subtitle, actions }) => {
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);

  return (
    <header className="sticky top-0 z-50 flex h-17 items-center justify-between bg-white px-8 border-b border-slate-200 shadow-sm">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 -ml-2 text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Menu className="w-6 h-6" />
        </button>
        
        <div>
          <h2 className="text-lg font-extrabold">{title}</h2>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {actions}
        
        <div className="relative w-9.5 h-9.5 bg-slate-100 rounded-xl flex items-center justify-center cursor-pointer hover:bg-slate-200 transition-colors">
          <span className="text-lg">🔔</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </div>
        
        <div className="w-9.5 h-9.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-sm font-bold text-white cursor-pointer">
          VS
        </div>
      </div>
    </header>
  );
};
