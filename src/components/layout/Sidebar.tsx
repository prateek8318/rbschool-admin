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
  UserCheck,
  Sparkles,
  Crown
} from 'lucide-react';
import logoImage from '../../assets/R. B. LOGO.png';

export const Sidebar: React.FC = () => {
  const { sidebarOpen, setSidebarOpen } = useUiStore();
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home, description: 'Overview & Analytics', badge: 'New', color: 'from-blue-600 to-indigo-600' },
    { name: 'Students', href: '/students', icon: Users, description: 'Student Management', count: '1,248', color: 'from-emerald-600 to-teal-600' },
    { name: 'Teachers', href: '/teachers', icon: GraduationCap, description: 'Faculty Management', count: '87', color: 'from-purple-600 to-pink-600' },
    { name: 'Classes', href: '/classes', icon: Building2, description: 'Class & Section', count: '24', color: 'from-amber-600 to-orange-600' },
  ];

  const academicNav = [
    { name: 'Attendance', href: '/attendance', icon: UserCheck, description: 'Track Attendance', percentage: '94.2%', color: 'from-green-600 to-emerald-600' },
    { name: 'Exams', href: '/exams', icon: FileText, description: 'Exams & Results', badge: 'Active', color: 'from-blue-600 to-cyan-600' },
    { name: 'Fees', href: '/fees', icon: DollarSign, description: 'Fee Management', amount: '₹4.2L', color: 'from-amber-600 to-yellow-600' },
  ];

  const communicationNav = [
    { name: 'Announcements', href: '/announcements', icon: Megaphone, description: 'Notices & Updates', count: '3', color: 'from-rose-600 to-pink-600' },
    { name: 'Settings', href: '/settings', icon: Settings, description: 'System Settings', color: 'from-slate-600 to-gray-600' },
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
        <div className="px-6 py-8 border-b border-slate-700/50">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img 
                src={logoImage} 
                alt="RB School Logo" 
                className="w-20 h-20 rounded-full shadow-xl shadow-blue-500/30 object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="hidden w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl shadow-xl shadow-blue-500/30">
                RB
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Crown className="w-2 h-2 text-white" />
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm font-black text-white flex items-center gap-2">RB KENDRIYA VIDYALAYA
               {/* <span className="text-blue-400 text-xl">  </span> */}
                <Sparkles className="w-4 h-4 text-yellow-400" />
              </div>
              <div className="text-sm text-slate-500 font-medium">SIDHAUT GHAZIPUR</div>
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
                    `group flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 relative overflow-hidden ${
                      isActive
                        ? `bg-gradient-to-r ${item.color} text-white font-semibold shadow-lg shadow-blue-500/30`
                        : 'text-slate-300 hover:bg-slate-800/50 hover:text-white hover:shadow-md'
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
                  <div className="flex items-center gap-2">
                    {item.badge && (
                      <span className="px-2 py-1 text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-full animate-pulse">
                        {item.badge}
                      </span>
                    )}
                    {item.count && (
                      <span className="px-2 py-1 text-xs font-bold text-slate-300 bg-slate-700 rounded-full">
                        {item.count}
                      </span>
                    )}
                    {item.name === 'Dashboard' && (
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
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
                    `group flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 relative overflow-hidden ${
                      isActive
                        ? `bg-gradient-to-r ${item.color} text-white font-semibold shadow-lg`
                        : 'text-slate-300 hover:bg-slate-800/50 hover:text-white hover:shadow-md'
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
                  <div className="flex items-center gap-2">
                    {item.badge && (
                      <span className="px-2 py-1 text-xs font-bold text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-full">
                        {item.badge}
                      </span>
                    )}
                    {item.percentage && (
                      <span className="px-2 py-1 text-xs font-bold text-green-400 bg-green-500/20 rounded-full">
                        {item.percentage}
                      </span>
                    )}
                    {item.amount && (
                      <span className="px-2 py-1 text-xs font-bold text-amber-400 bg-amber-500/20 rounded-full">
                        {item.amount}
                      </span>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
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
                    `group flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 relative overflow-hidden ${
                      isActive
                        ? `bg-gradient-to-r ${item.color} text-white font-semibold shadow-lg`
                        : 'text-slate-300 hover:bg-slate-800/50 hover:text-white hover:shadow-md'
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
                  <div className="flex items-center gap-2">
                    {item.count && (
                      <span className="px-2 py-1 text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-pink-600 rounded-full animate-pulse">
                        {item.count}
                      </span>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
                </NavLink>
              ))}
            </nav>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-slate-700/50">
          <button
            onClick={handleLogout}
            className="group flex items-center gap-4 px-4 py-3 rounded-xl text-slate-400 text-base font-semibold hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 w-full relative overflow-hidden"
          >
            <LogOut className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
            <span>Logout</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
          </button>
        </div>
      </div>
    </>
  );
};
