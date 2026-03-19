import React from 'react';
import { Menu, Search, Bell } from 'lucide-react';
import { useUiStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';

export const Topbar: React.FC = () => {
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);
  const user = useAuthStore((state) => state.user);

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center gap-4 border-b border-gray-200 bg-white/80 backdrop-blur-md px-4 sm:px-6 lg:px-8 shadow-sm">
      <button
        onClick={toggleSidebar}
        className="p-2 -ml-2 text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <Menu className="w-6 h-6" />
      </button>

      <div className="flex-1 flex items-center justify-between">
        <div className="max-w-md w-full hidden md:block group">
          <div className="relative flex items-center w-full h-11 rounded-xl bg-gray-100 hover:bg-gray-200/50 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 border border-transparent transition-all duration-200">
            <div className="grid place-items-center h-full w-12 text-gray-400 group-focus-within:text-blue-500">
              <Search className="w-5 h-5" />
            </div>
            <input
              className="peer h-full w-full outline-none text-sm text-gray-700 bg-transparent pr-4 font-medium placeholder-gray-400"
              type="text"
              id="search"
              placeholder="Search students, teachers, or classes..."
            />
          </div>
        </div>

        <div className="flex items-center gap-4 ml-auto">
          <button className="relative p-2 text-gray-400 rounded-full hover:bg-gray-100 hover:text-gray-600 transition-colors">
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <Bell className="w-6 h-6" />
          </button>
          
          <div className="h-8 w-px bg-gray-200 hidden sm:block mx-1"></div>

          <div className="flex items-center gap-3 pl-2">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-semibold text-gray-900 leading-none">{user?.name || 'Admin User'}</span>
              <span className="text-xs font-medium text-blue-600 mt-1 capitalize">{user?.role?.toLowerCase() || 'Administrator'}</span>
            </div>
            <div className="relative">
              <img
                className="h-10 w-10 rounded-full object-cover border-2 border-white shadow-md ring-1 ring-gray-100"
                src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'Admin'}&background=0D8ABC&color=fff`}
                alt="User avatar"
              />
              <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
