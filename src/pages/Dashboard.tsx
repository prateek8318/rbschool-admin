import React, { useState, useEffect } from 'react';
import { Topbar } from '../components/layout/Topbar';
import { AttendanceChart } from '../components/charts/AttendanceChart';
import { FeeChart } from '../components/charts/FeeChart';
import { 
  Users, 
  GraduationCap, 
  CheckCircle, 
  DollarSign, 
  TrendingUp,
  TrendingDown,
  Minus,
  Plus,
  Send,
  BarChart3,
  Calendar,
  Clock,
  Award,
  BookOpen,
  MoreVertical,
  Filter,
  Download,
  RefreshCw,
  ChevronRight
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [kpiData, setKpiData] = useState<{
    title: string;
    value: string;
    icon: any;
    trend: string;
    trendType: 'up' | 'down' | 'flat';
    color: string;
    iconColor: string;
  }[]>([
    {
      title: 'Total Students',
      value: '0',
      icon: Users,
      trend: 'Loading...',
      trendType: 'flat',
      color: 'from-blue-500/12 to-indigo-600/12',
      iconColor: 'from-blue-500 to-indigo-600'
    },
    {
      title: 'Total Teachers',
      value: '0',
      icon: GraduationCap,
      trend: 'Loading...',
      trendType: 'flat',
      color: 'from-sky-500/12 to-blue-600/12',
      iconColor: 'from-sky-500 to-blue-600'
    },
    {
      title: 'Attendance Today',
      value: '0%',
      icon: CheckCircle,
      trend: 'Loading...',
      trendType: 'flat',
      color: 'from-green-500/12 to-emerald-600/12',
      iconColor: 'from-green-500 to-emerald-600'
    },
    {
      title: 'Fee Collected',
      value: '₹0',
      icon: DollarSign,
      trend: 'Loading...',
      trendType: 'flat',
      color: 'from-amber-500/12 to-yellow-600/12',
      iconColor: 'from-amber-500 to-yellow-600'
    }
  ]);

  const [recentActivity, setRecentActivity] = useState<{
    student: string;
    initials: string;
    color: string;
    action: string;
    class: string;
    time: string;
  }[]>([]);

  const quickActions = [
    { icon: Plus, label: 'Add Student', color: 'from-blue-600/12 to-indigo-500/12', iconColor: 'from-blue-600 to-indigo-500', glow: 'shadow-blue-500/25' },
    { icon: Calendar, label: 'Create Exam', color: 'from-sky-500/12 to-blue-600/12', iconColor: 'from-sky-500 to-blue-600', glow: 'shadow-sky-500/25' },
    { icon: Send, label: 'Send Notice', color: 'from-purple-500/12 to-purple-600/12', iconColor: 'from-purple-500 to-purple-600', glow: 'shadow-purple-500/25' },
    { icon: BarChart3, label: 'Generate Report', color: 'from-green-500/12 to-emerald-600/12', iconColor: 'from-green-500 to-emerald-600', glow: 'shadow-green-500/25' },
    { icon: Award, label: 'Awards', color: 'from-amber-500/12 to-yellow-600/12', iconColor: 'from-amber-500 to-yellow-600', glow: 'shadow-amber-500/25' },
    { icon: BookOpen, label: 'Library', color: 'from-rose-500/12 to-pink-600/12', iconColor: 'from-rose-500 to-pink-600', glow: 'shadow-rose-500/25' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Simulate data loading
    setTimeout(() => {
      setKpiData([
        {
          title: 'Total Students',
          value: '1,248',
          icon: Users,
          trend: '↑ 12 this month',
          trendType: 'up',
          color: 'from-blue-500/12 to-indigo-600/12',
          iconColor: 'from-blue-500 to-indigo-600'
        },
        {
          title: 'Total Teachers',
          value: '87',
          icon: GraduationCap,
          trend: '— No change',
          trendType: 'flat',
          color: 'from-sky-500/12 to-blue-600/12',
          iconColor: 'from-sky-500 to-blue-600'
        },
        {
          title: 'Attendance Today',
          value: '94.2%',
          icon: CheckCircle,
          trend: '↑ 2.1% vs yesterday',
          trendType: 'up',
          color: 'from-green-500/12 to-emerald-600/12',
          iconColor: 'from-green-500 to-emerald-600'
        },
        {
          title: 'Fee Collected',
          value: '₹4.2L',
          icon: DollarSign,
          trend: 'of ₹5L target',
          trendType: 'up',
          color: 'from-amber-500/12 to-yellow-600/12',
          iconColor: 'from-amber-500 to-yellow-600'
        }
      ]);

      setRecentActivity([
        {
          student: 'Aarav Kumar',
          initials: 'AK',
          color: '#6366F1',
          action: 'Fee Payment ₹12,000',
          class: '9-A',
          time: '2h ago'
        },
        {
          student: 'Priya Singh',
          initials: 'PS',
          color: '#10B981',
          action: 'Result Published',
          class: '10-B',
          time: '3h ago'
        },
        {
          student: 'Rohan Mehta',
          initials: 'RM',
          color: '#F59E0B',
          action: 'Attendance Marked',
          class: '8-A',
          time: '5h ago'
        }
      ]);

      setIsLoading(false);
    }, 1500);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getTrendIcon = (type: string) => {
    switch (type) {
      case 'up': return <TrendingUp className="w-4 h-4" />;
      case 'down': return <TrendingDown className="w-4 h-4" />;
      default: return <Minus className="w-4 h-4" />;
    }
  };

  const getTrendColor = (type: string) => {
    switch (type) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-500';
      default: return 'text-slate-500';
    }
  };

  const handleQuickAction = (action: string) => {
    console.log(`Quick action: ${action}`);
    // Add navigation or modal logic here
  };

  return (
    <div className="min-h-screen bg-pattern">
      <Topbar 
        title="Dashboard" 
        subtitle={`${formatDate(currentTime)} • ${formatTime(currentTime)}`}
      />
      
      <div className="px-6 py-6">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-black text-gradient mb-2">Welcome back! 👋</h2>
              <p className="text-sm text-slate-600">Here's what's happening at your school today.</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105">
                <Download className="w-4 h-4" />
                Export Report
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all duration-300">
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpiData.map((kpi, index) => (
            <div 
              key={index} 
              className={`kpi-card animate-scale-in group cursor-pointer ${isLoading ? 'skeleton' : ''}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white bg-gradient-to-br ${kpi.iconColor} shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
                  <kpi.icon className="w-7 h-7" />
                </div>
                <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200 opacity-0 group-hover:opacity-100">
                  <MoreVertical className="w-4 h-4 text-slate-400" />
                </button>
              </div>
              <div className="text-3xl font-black leading-none mb-2 group-hover:text-gradient transition-all duration-300">{kpi.value}</div>
              <div className="text-sm text-slate-600 font-medium mb-3">{kpi.title}</div>
              <div className={`flex items-center gap-2 text-sm font-semibold ${getTrendColor(kpi.trendType)}`}>
                {getTrendIcon(kpi.trendType)}
                <span>{kpi.trend}</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
            </div>
          ))}
        </div>

        {/* Charts and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Attendance Chart */}
          <div className="lg:col-span-2 chart-card animate-slide-in">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Weekly Attendance</h3>
                <p className="text-sm text-slate-500">Mon – Fri, This Week</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-green-600 font-semibold">
                <CheckCircle className="w-4 h-4" />
                <span>94.2%</span>
              </div>
            </div>
            <div className="h-64">
              <AttendanceChart />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="chart-card animate-slide-in" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800">Quick Actions</h3>
              <button className="text-sm text-indigo-600 font-semibold hover:text-indigo-700 transition-colors flex items-center gap-1">
                View all <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action.label)}
                  className="kpi-card cursor-pointer text-center group hover:scale-105 transition-all duration-300 relative overflow-hidden"
                  style={{ animationDelay: `${300 + index * 100}ms` }}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white mx-auto mb-3 bg-gradient-to-br ${action.iconColor} shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
                    <action.icon className="w-7 h-7" />
                  </div>
                  <div className="text-xs font-bold text-slate-700">{action.label}</div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Fee Collection Chart and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Fee Chart */}
          <div className="chart-card animate-slide-in" style={{ animationDelay: '400ms' }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Fee Collection</h3>
                <p className="text-sm text-slate-500">Academic Year 2025–26</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-amber-600 font-semibold">
                <DollarSign className="w-4 h-4" />
                <span>84%</span>
              </div>
            </div>
            <div className="h-64">
              <FeeChart />
            </div>
          </div>

          {/* Recent Activity */}
          <div className="table-card animate-slide-in" style={{ animationDelay: '500ms' }}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold text-slate-800">Recent Activity</h3>
                <span className="px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">Live</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200">
                  <Filter className="w-4 h-4 text-slate-400" />
                </button>
                <button className="text-sm text-indigo-600 font-semibold hover:text-indigo-700 transition-colors flex items-center gap-1">
                  View all <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl skeleton h-16" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-all duration-200 animate-fade-in group cursor-pointer"
                    style={{ animationDelay: `${600 + index * 100}ms` }}
                  >
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg group-hover:scale-110 transition-transform duration-200" style={{ backgroundColor: activity.color }}>
                        {activity.initials}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">{activity.student}</div>
                        <div className="w-1 h-1 bg-slate-300 rounded-full" />
                        <div className="text-xs text-slate-500">{activity.class}</div>
                      </div>
                      <div className="text-xs text-slate-500">{activity.action}</div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span>{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
