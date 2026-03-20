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
  Clock
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
    { icon: Plus, label: 'Add Student', color: 'from-blue-600/12 to-indigo-500/12', iconColor: 'from-blue-600 to-indigo-500' },
    { icon: Calendar, label: 'Create Exam', color: 'from-sky-500/12 to-blue-600/12', iconColor: 'from-sky-500 to-blue-600' },
    { icon: Send, label: 'Send Notice', color: 'from-purple-500/12 to-purple-600/12', iconColor: 'from-purple-500 to-purple-600' },
    { icon: BarChart3, label: 'Generate Report', color: 'from-green-500/12 to-emerald-600/12', iconColor: 'from-green-500 to-emerald-600' }
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
          <h2 className="text-2xl font-black text-gradient mb-2">Welcome back! 👋</h2>
          <p className="text-sm text-slate-600">Here's what's happening at your school today.</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpiData.map((kpi, index) => (
            <div 
              key={index} 
              className={`kpi-card animate-scale-in ${isLoading ? 'skeleton' : ''}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-4 bg-gradient-to-br ${kpi.iconColor} shadow-lg`}>
                <kpi.icon className="w-7 h-7" />
              </div>
              <div className="text-3xl font-black leading-none mb-2">{kpi.value}</div>
              <div className="text-sm text-slate-600 font-medium mb-3">{kpi.title}</div>
              <div className={`flex items-center gap-2 text-sm font-semibold ${getTrendColor(kpi.trendType)}`}>
                {getTrendIcon(kpi.trendType)}
                <span>{kpi.trend}</span>
              </div>
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
            <h3 className="text-lg font-bold text-slate-800 mb-6">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action.label)}
                  className="kpi-card cursor-pointer text-center group hover:scale-105 transition-transform duration-200"
                  style={{ animationDelay: `${300 + index * 100}ms` }}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white mx-auto mb-3 bg-gradient-to-br ${action.iconColor} shadow-lg group-hover:shadow-xl transition-shadow duration-200`}>
                    <action.icon className="w-7 h-7" />
                  </div>
                  <div className="text-xs font-bold text-slate-700">{action.label}</div>
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
              <h3 className="text-lg font-bold text-slate-800">Recent Activity</h3>
              <button className="text-sm text-indigo-600 font-semibold hover:text-indigo-700 transition-colors">
                View all →
              </button>
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
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors duration-200 animate-fade-in"
                    style={{ animationDelay: `${600 + index * 100}ms` }}
                  >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg" style={{ backgroundColor: activity.color }}>
                      {activity.initials}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-slate-800">{activity.student}</div>
                      <div className="text-xs text-slate-500">{activity.action} • {activity.class}</div>
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
