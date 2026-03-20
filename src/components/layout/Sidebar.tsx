import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useUiStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';
import { 
  Home, 
  Users, 
  GraduationCap, 
  Building2, 
  FileText, 
  DollarSign, 
  Megaphone, 
  Settings, 
  LogOut,
  UserCheck
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { sidebarOpen, setSidebarOpen } = useUiStore();
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, description: 'Overview & Analytics' },
    { name: 'Students', href: '/students', icon: Users, description: 'Student Management' },
    { name: 'Teachers', href: '/teachers', icon: GraduationCap, description: 'Faculty Management' },
    { name: 'Classes', href: '/classes', icon: Building2, description: 'Class & Section' },
  ];

  const academicNav = [
    { name: 'Attendance', href: '/attendance', icon: UserCheck, description: 'Track Attendance' },
    { name: 'Exams', href: '/exams', icon: FileText, description: 'Exams & Results' },
    { name: 'Fees', href: '/fees', icon: DollarSign, description: 'Fee Management' },
  ];

  const communicationNav = [
    { name: 'Announcements', href: '/announcements', icon: Megaphone, description: 'Notices & Updates' },
    { name: 'Settings', href: '/settings', icon: Settings, description: 'System Settings' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      <div 
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar component */}
      <div className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-slate-900 text-white min-h-screen overflow-y-auto lg:translate-x-0 lg:static lg:flex-shrink-0 transform transition-transform duration-300 ease-in-out w-64 border-r border-slate-700`}
      >
        {/* Logo */}
        <div className="px-6 py-8 border-b border-slate-700">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl shadow-xl">
              RB
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-white">
                RB<span className="text-blue-400">School</span>
              </div>
              <div className="text-sm text-slate-400 font-medium">Management System</div>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2 mb-4">Main Menu</div>
            <nav className="space-y-2">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `group flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg shadow-blue-500/30'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white hover:shadow-md'
                    }`
                  }
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className={`w-6 h-6 flex items-center justify-center transition-colors duration-300`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="text-base font-semibold">{item.name}</div>
                    <div className="text-xs text-slate-400 group-hover:text-slate-300 mt-1">{item.description}</div>
                  </div>
                  {item.name === 'Dashboard' && (
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  )}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Academic Navigation */}
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2 mb-4">Academic</div>
            <nav className="space-y-2">
              {academicNav.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `group flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg shadow-blue-500/30'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white hover:shadow-md'
                    }`
                  }
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className="w-6 h-6 flex items-center justify-center">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="text-base font-semibold">{item.name}</div>
                    <div className="text-xs text-slate-400 group-hover:text-slate-300 mt-1">{item.description}</div>
                  </div>
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Communication Navigation */}
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2 mb-4">Communication</div>
            <nav className="space-y-2">
              {communicationNav.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `group flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg shadow-blue-500/30'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white hover:shadow-md'
                    }`
                  }
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className="w-6 h-6 flex items-center justify-center">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="text-base font-semibold">{item.name}</div>
                    <div className="text-xs text-slate-400 group-hover:text-slate-300 mt-1">{item.description}</div>
                  </div>
                </NavLink>
              ))}
            </nav>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="group flex items-center gap-4 px-4 py-3 rounded-xl text-slate-400 text-base font-semibold hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 w-full"
          >
            <LogOut className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};
