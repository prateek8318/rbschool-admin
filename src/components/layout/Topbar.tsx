import React from 'react';
import { Menu, Bell, Search, Settings, User, LogOut, ChevronDown, HelpCircle, Zap, Crown, Star } from 'lucide-react';
import { useUiStore } from '../../store/uiStore';

interface TopbarProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export const Topbar: React.FC<TopbarProps> = ({ title, subtitle, actions }) => {
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);
  const [profileOpen, setProfileOpen] = React.useState(false);

  const notifications = [
    { id: 1, title: 'New student registration', description: 'Aarav Kumar joined Class 9-A', time: '2m ago', type: 'success' },
    { id: 2, title: 'Fee payment received', description: '₹12,000 from Priya Singh', time: '1h ago', type: 'success' },
    { id: 3, title: 'Exam results published', description: 'Class 10-B results are available', time: '3h ago', type: 'info' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 flex h-18 items-center justify-between bg-white/95 backdrop-blur-xl px-6 border-b border-slate-200/50 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="p-2.5 -ml-2.5 text-slate-600 rounded-xl lg:hidden hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:scale-105"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-600/10 to-indigo-600/10">
              <div className="w-5 h-5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800">{title}</h2>
              {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Bar */}
          <div className="relative">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2.5 text-slate-600 rounded-xl hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:scale-105"
            >
              <Search className="w-5 h-5" />
            </button>
            {searchOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-4 animate-fade-in">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search students, teachers, classes..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    autoFocus
                  />
                </div>
              </div>
            )}
          </div>

          {actions}

          {/* Quick Actions */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl border border-amber-500/20">
            <Zap className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-semibold text-amber-700">Quick Actions</span>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2.5 text-slate-600 rounded-xl hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:scale-105"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse" />
            </button>
            {notificationsOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 animate-fade-in">
                <div className="p-4 border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-800">Notifications</h3>
                    <button className="text-xs text-blue-600 hover:text-blue-700">Mark all read</button>
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="p-4 hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-100 last:border-b-0">
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          notification.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                          <Star className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-slate-800">{notification.title}</div>
                          <div className="text-xs text-slate-500 mt-1">{notification.description}</div>
                          <div className="text-xs text-slate-400 mt-2">{notification.time}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-slate-200">
                  <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-semibold">View all notifications</button>
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            >
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-sm font-bold text-white shadow-lg">
                  VS
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Crown className="w-1.5 h-1.5 text-white" />
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 animate-fade-in">
                <div className="p-4 border-b border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-sm font-bold text-white">
                      VS
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-800">Vikram Singh</div>
                      <div className="text-xs text-slate-500">Administrator</div>
                    </div>
                  </div>
                </div>
                <div className="py-2">
                  <button className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-3">
                    <User className="w-4 h-4 text-slate-400" />
                    Profile
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-3">
                    <Settings className="w-4 h-4 text-slate-400" />
                    Settings
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-3">
                    <HelpCircle className="w-4 h-4 text-slate-400" />
                    Help & Support
                  </button>
                </div>
                <div className="border-t border-slate-200 p-2">
                  <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3 rounded-lg">
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
      
      {/* Overlay for dropdowns */}
      {(searchOpen || notificationsOpen || profileOpen) && (
        <div 
          className="fixed inset-0 z-30 bg-black/10 backdrop-blur-sm"
          onClick={() => {
            setSearchOpen(false);
            setNotificationsOpen(false);
            setProfileOpen(false);
          }}
        />
      )}
    </>
  );
};
