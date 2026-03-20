import React, { useState, useEffect } from 'react';
import { Topbar } from '../components/layout/Topbar';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Mail,
  Phone,
  GraduationCap,
  Users,
  Calendar,
  Award,
  BookOpen
} from 'lucide-react';

export const Teachers: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [teachers, setTeachers] = useState<{
    name: string;
    initials: string;
    email: string;
    subject: string;
    classes: string;
    experience: string;
    status: 'Active' | 'On Leave' | 'Inactive';
    color: string;
    phone?: string;
    joinDate?: string;
    qualification?: string;
  }[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    onLeave: 0,
    inactive: 0
  });

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      const loadedTeachers = [
        {
          name: 'Mr. Suresh Sharma',
          initials: 'SS',
          email: 'suresh@rbschool.in',
          subject: 'Mathematics',
          classes: '9-A, 10-B, 8-A',
          experience: '9 years',
          status: 'Active' as const,
          color: '#6366F1',
          phone: '+91 98765 43210',
          joinDate: '2015-06-15',
          qualification: 'M.Sc. Mathematics'
        },
        {
          name: 'Ms. Priya Mishra',
          initials: 'PM',
          email: 'priya@rbschool.in',
          subject: 'Science',
          classes: '9-A, 9-B, 8-B',
          experience: '6 years',
          status: 'Active' as const,
          color: '#10B981',
          phone: '+91 98765 43211',
          joinDate: '2018-07-20',
          qualification: 'M.Sc. Physics'
        },
        {
          name: 'Mr. Rajesh Verma',
          initials: 'RV',
          email: 'rajesh@rbschool.in',
          subject: 'English',
          classes: '10-A, 10-B, 9-C',
          experience: '12 years',
          status: 'On Leave' as const,
          color: '#F59E0B',
          phone: '+91 98765 43212',
          joinDate: '2012-04-10',
          qualification: 'M.A. English'
        },
        {
          name: 'Mrs. Anjali Singh',
          initials: 'AS',
          email: 'anjali@rbschool.in',
          subject: 'Hindi',
          classes: '8-A, 8-B, 9-A',
          experience: '8 years',
          status: 'Active' as const,
          color: '#8B5CF6',
          phone: '+91 98765 43213',
          joinDate: '2016-08-25',
          qualification: 'M.A. Hindi'
        },
        {
          name: 'Mr. Amit Kumar',
          initials: 'AK',
          email: 'amit@rbschool.in',
          subject: 'Social Studies',
          classes: '10-A, 10-B, 9-C',
          experience: '15 years',
          status: 'Active' as const,
          color: '#0EA5E9',
          phone: '+91 98765 43214',
          joinDate: '2009-03-15',
          qualification: 'M.A. History'
        },
        {
          name: 'Ms. Kavita Reddy',
          initials: 'KR',
          email: 'kavita@rbschool.in',
          subject: 'Computer Science',
          classes: '9-A, 9-B, 10-A',
          experience: '5 years',
          status: 'Active' as const,
          color: '#EC4899',
          phone: '+91 98765 43215',
          joinDate: '2019-06-01',
          qualification: 'B.Tech. CSE'
        }
      ];

      setTeachers(loadedTeachers);
      setStats({
        total: loadedTeachers.length,
        active: loadedTeachers.filter(t => t.status === 'Active').length,
        onLeave: loadedTeachers.filter(t => t.status === 'On Leave').length,
        inactive: loadedTeachers.filter(t => t.status === 'On Leave').length
      });
      setIsLoading(false);
    }, 1000);
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return 'badge-success';
      case 'On Leave':
        return 'badge-warning';
      case 'Inactive':
        return 'badge-error';
      default:
        return '';
    }
  };

  const filteredTeachers = teachers.filter(teacher => 
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteTeacher = (email: string) => {
    if (confirm('Are you sure you want to remove this teacher?')) {
      const teacherToDelete = teachers.find(t => t.email === email);
      setTeachers(teachers.filter(t => t.email !== email));
      if (teacherToDelete) {
        setStats(prev => ({
          ...prev,
          total: prev.total - 1,
          [teacherToDelete.status.toLowerCase().replace(' ', '')]: prev[teacherToDelete.status.toLowerCase().replace(' ', '') as keyof typeof prev] - 1
        }));
      }
    }
  };

  return (
    <div className="min-h-screen bg-pattern">
      <Topbar 
        title="Teachers" 
        subtitle={`${stats.total} teaching staff`}
        actions={
          <button className="btn-primary flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold">
            <Plus className="w-4 h-4" />
            <span>Add Teacher</span>
          </button>
        }
      />
      
      <div className="px-6 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="kpi-card animate-scale-in" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-xs text-slate-600">Total Teachers</div>
              </div>
            </div>
          </div>
          <div className="kpi-card animate-scale-in" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.active}</div>
                <div className="text-xs text-slate-600">Active</div>
              </div>
            </div>
          </div>
          <div className="kpi-card animate-scale-in" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center text-white">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.onLeave}</div>
                <div className="text-xs text-slate-600">On Leave</div>
              </div>
            </div>
          </div>
          <div className="kpi-card animate-scale-in" style={{ animationDelay: '400ms' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.inactive}</div>
                <div className="text-xs text-slate-600">Inactive</div>
              </div>
            </div>
          </div>
        </div>

        {/* Teachers Table */}
        <div className="table-card animate-fade-in">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Search teacher by name, subject, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10 w-full"
                />
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-3 p-4 rounded-xl skeleton h-20" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-xs font-semibold text-slate-600 uppercase tracking-wider py-3 px-4 text-left">Teacher</th>
                    <th className="text-xs font-semibold text-slate-600 uppercase tracking-wider py-3 px-4 text-left">Subject</th>
                    <th className="text-xs font-semibold text-slate-600 uppercase tracking-wider py-3 px-4 text-left">Classes</th>
                    <th className="text-xs font-semibold text-slate-600 uppercase tracking-wider py-3 px-4 text-left">Experience</th>
                    <th className="text-xs font-semibold text-slate-600 uppercase tracking-wider py-3 px-4 text-left">Status</th>
                    <th className="text-xs font-semibold text-slate-600 uppercase tracking-wider py-3 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTeachers.map((teacher, index) => (
                    <tr 
                      key={teacher.email} 
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors duration-200 animate-fade-in"
                      style={{ animationDelay: `${300 + index * 50}ms` }}
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-lg" style={{ backgroundColor: teacher.color }}>
                            {teacher.initials}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-slate-800">{teacher.name}</div>
                            <div className="text-xs text-slate-500 flex items-center gap-2">
                              <Mail className="w-3 h-3" />
                              {teacher.email}
                            </div>
                            <div className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                              <Phone className="w-3 h-3" />
                              {teacher.phone}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <div className="text-sm font-medium text-slate-700 flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-slate-400" />
                            {teacher.subject}
                          </div>
                          <div className="text-xs text-slate-500 mt-1">{teacher.qualification}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm font-medium text-slate-700">{teacher.classes}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <div>
                            <div className="text-sm font-medium text-slate-700">{teacher.experience}</div>
                            <div className="text-xs text-slate-500">Since {teacher.joinDate?.split('-')[0]}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${getStatusBadge(teacher.status)}`}>
                          {teacher.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <button className="w-8 h-8 rounded-xl border-none cursor-pointer flex items-center justify-center text-sm bg-sky-500/10 text-sky-600 hover:bg-sky-500/20 transition-all duration-200 group">
                            <Edit className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                          </button>
                          <button 
                            onClick={() => handleDeleteTeacher(teacher.email)}
                            className="w-8 h-8 rounded-xl border-none cursor-pointer flex items-center justify-center text-sm bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-all duration-200 group"
                          >
                            <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredTeachers.length === 0 && (
                <div className="text-center py-12">
                  <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">No teachers found matching your search.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
