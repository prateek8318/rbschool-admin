import React from 'react';
import { Menu } from 'lucide-react';
import { useUiStore } from '../../store/uiStore';
import logoImage from '../../assets/R. B. LOGO.png';

export const Header: React.FC = () => {
  const { sidebarOpen, setSidebarOpen } = useUiStore();

  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 lg:hidden">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-6 h-6 text-slate-700" />
        </button>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <img 
              src={logoImage} 
              alt="RB School Logo" 
              className="w-8 h-8 rounded-lg shadow-lg object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="hidden w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
              RB
            </div>
          </div>
          <span className="font-bold text-slate-900 text-sm">RB School Admin</span>
        </div>
        
        <div className="w-10" /> {/* Spacer for centering */}
      </div>
    </header>
  );
};
