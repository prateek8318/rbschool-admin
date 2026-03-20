import React, { useState, useEffect } from 'react';
import { Topbar } from '../components/layout/Topbar';
import { AddStudentModal } from '../components/ui/AddStudentModal';
import { 
  Search, 
  Download, 
  Plus, 
  Edit, 
  Trash2, 
  Users,
  GraduationCap,
  Mail,
  Phone,
  Calendar
} from 'lucide-react';

export const Students: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedSection, setSelectedSection] = useState('all');
  const [students, setStudents] = useState<{
    name: string;
    roll: string;
    cls: string;
    parent: string;
    fee: 'paid' | 'pending' | 'overdue';
    color: string;
    email?: string;
    phone?: string;
    admissionDate?: string;
  }[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    paid: 0,
    pending: 0,
    overdue: 0
  });

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      const loadedStudents = [
        { name: 'Aarav Kumar', roll: '001', cls: '9-A', parent: 'Rajesh Kumar', fee: 'paid' as const, color: '#6366F1', email: 'aarav.k@rbschool.in', phone: '+91 98765 43210', admissionDate: '2024-06-15' },
        { name: 'Priya Singh', roll: '002', cls: '9-A', parent: 'Anita Singh', fee: 'paid' as const, color: '#10B981', email: 'priya.s@rbschool.in', phone: '+91 98765 43211', admissionDate: '2024-06-16' },
        { name: 'Rohan Patel', roll: '003', cls: '10-B', parent: 'Suresh Patel', fee: 'pending' as const, color: '#F59E0B', email: 'rohan.p@rbschool.in', phone: '+91 98765 43212', admissionDate: '2024-06-17' },
        { name: 'Diya Verma', roll: '004', cls: '8-B', parent: 'Mohan Verma', fee: 'pending' as const, color: '#EF4444', email: 'diya.v@rbschool.in', phone: '+91 98765 43213', admissionDate: '2024-06-18' },
        { name: 'Arjun Nair', roll: '005', cls: '9-B', parent: 'Ravi Nair', fee: 'overdue' as const, color: '#8B5CF6', email: 'arjun.n@rbschool.in', phone: '+91 98765 43214', admissionDate: '2024-06-19' },
        { name: 'Simran Kaur', roll: '006', cls: '10-A', parent: 'Gurpreet Kaur', fee: 'paid' as const, color: '#0EA5E9', email: 'simran.k@rbschool.in', phone: '+91 98765 43215', admissionDate: '2024-06-20' },
        { name: 'Kabir Mehta', roll: '007', cls: '8-A', parent: 'Amit Mehta', fee: 'paid' as const, color: '#EC4899', email: 'kabir.m@rbschool.in', phone: '+91 98765 43216', admissionDate: '2024-06-21' },
        { name: 'Neha Joshi', roll: '008', cls: '9-C', parent: 'Vikas Joshi', fee: 'pending' as const, color: '#14B8A6', email: 'neha.j@rbschool.in', phone: '+91 98765 43217', admissionDate: '2024-06-22' }
      ];

      setStudents(loadedStudents);
      setStats({
        total: loadedStudents.length,
        paid: loadedStudents.filter(s => s.fee === 'paid').length,
        pending: loadedStudents.filter(s => s.fee === 'pending').length,
        overdue: loadedStudents.filter(s => s.fee === 'overdue').length
      });
      setIsLoading(false);
    }, 1200);
  }, []);

  const handleAddStudent = (studentData: any) => {
    const newStudent = {
      name: `${studentData.firstName} ${studentData.lastName}`,
      roll: String(students.length + 1).padStart(3, '0'),
      cls: `${studentData.class}-${studentData.section}`,
      parent: 'Parent Name',
      fee: 'pending' as const,
      color: '#' + Math.floor(Math.random()*16777215).toString(16),
      email: `${studentData.firstName.toLowerCase()}.${studentData.lastName.toLowerCase()}@rbschool.in`,
      phone: '+91 98765 43218',
      admissionDate: new Date().toISOString().split('T')[0]
    };
    setStudents([...students, newStudent]);
    setStats(prev => ({
      ...prev,
      total: prev.total + 1,
      pending: prev.pending + 1
    }));
  };

  const getBadgeClass = (status: string) => {
    switch (status) {
      case 'paid': return 'badge-success';
      case 'pending': return 'badge-warning';
      case 'overdue': return 'badge-error';
      default: return '';
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.roll.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.parent.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === 'all' || student.cls.includes(selectedClass);
    const matchesSection = selectedSection === 'all' || student.cls.includes(selectedSection);
    return matchesSearch && matchesClass && matchesSection;
  });

  const handleDeleteStudent = (roll: string) => {
    if (confirm('Are you sure you want to delete this student?')) {
      const studentToDelete = students.find(s => s.roll === roll);
      setStudents(students.filter(s => s.roll !== roll));
      if (studentToDelete) {
        setStats(prev => ({
          ...prev,
          total: prev.total - 1,
          [studentToDelete.fee]: prev[studentToDelete.fee as keyof typeof prev] - 1
        }));
      }
    }
  };

  return (
    <div className="min-h-screen bg-pattern">
      <Topbar 
        title="Students" 
        subtitle={`${stats.total} total students enrolled`}
        actions={
          <>
            <button className="group flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white/50 backdrop-blur-sm text-sm font-semibold hover:bg-white hover:shadow-md transition-all duration-200">
              <Download className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
              <span>Export</span>
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="btn-primary flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
            >
              <Plus className="w-4 h-4" />
              <span>Add Student</span>
            </button>
          </>
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
                <div className="text-xs text-slate-600">Total Students</div>
              </div>
            </div>
          </div>
          <div className="kpi-card animate-scale-in" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.paid}</div>
                <div className="text-xs text-slate-600">Fee Paid</div>
              </div>
            </div>
          </div>
          <div className="kpi-card animate-scale-in" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center text-white">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.pending}</div>
                <div className="text-xs text-slate-600">Fee Pending</div>
              </div>
            </div>
          </div>
          <div className="kpi-card animate-scale-in" style={{ animationDelay: '400ms' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center text-white">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.overdue}</div>
                <div className="text-xs text-slate-600">Fee Overdue</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="table-card animate-fade-in">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Search student by name, roll, or parent..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10 w-full"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <select 
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="select-field"
              >
                <option value="all">All Classes</option>
                <option value="8">Class 8</option>
                <option value="9">Class 9</option>
                <option value="10">Class 10</option>
              </select>
              <select 
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="select-field"
              >
                <option value="all">All Sections</option>
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
              </select>
            </div>
          </div>

          {/* Students Table */}
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-3 p-4 rounded-xl skeleton h-16" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-xs font-semibold text-slate-600 uppercase tracking-wider py-4 px-6 text-left">Student</th>
                    <th className="text-xs font-semibold text-slate-600 uppercase tracking-wider py-4 px-6 text-left">Roll No.</th>
                    <th className="text-xs font-semibold text-slate-600 uppercase tracking-wider py-4 px-6 text-left">Class</th>
                    <th className="text-xs font-semibold text-slate-600 uppercase tracking-wider py-4 px-6 text-left">Parent</th>
                    <th className="text-xs font-semibold text-slate-600 uppercase tracking-wider py-4 px-6 text-left">Fee Status</th>
                    <th className="text-xs font-semibold text-slate-600 uppercase tracking-wider py-4 px-6 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student, index) => (
                    <tr 
                      key={student.roll} 
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors duration-200 animate-fade-in"
                      style={{ animationDelay: `${500 + index * 50}ms` }}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg" style={{ backgroundColor: student.color }}>
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-slate-800">{student.name}</div>
                            <div className="text-xs text-slate-500 flex items-center gap-2">
                              <Mail className="w-3 h-3" />
                              {student.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm font-medium text-slate-700">{student.roll}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm font-medium text-slate-700">{student.cls}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <div className="text-sm font-medium text-slate-700">{student.parent}</div>
                          <div className="text-xs text-slate-500 flex items-center gap-2">
                            <Phone className="w-3 h-3" />
                            {student.phone}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${getBadgeClass(student.fee)}`}>
                          {student.fee.charAt(0).toUpperCase() + student.fee.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          <button className="w-8 h-8 rounded-xl border-none cursor-pointer flex items-center justify-center text-sm bg-sky-500/10 text-sky-600 hover:bg-sky-500/20 transition-all duration-200 group">
                            <Edit className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                          </button>
                          <button 
                            onClick={() => handleDeleteStudent(student.roll)}
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

              {filteredStudents.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">No students found matching your criteria.</p>
                </div>
              )}
            </div>
          )}

          {/* Pagination */}
          {!isLoading && filteredStudents.length > 0 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-200">
              <span className="text-sm text-slate-500">
                Showing {filteredStudents.length} of {stats.total} students
              </span>
              <div className="flex gap-2">
                <button className="w-8 h-8 rounded-xl border border-slate-200 bg-white text-sm font-semibold hover:bg-slate-50 transition-colors duration-200">‹</button>
                <button className="w-8 h-8 rounded-xl btn-primary text-sm font-semibold border-transparent">1</button>
                <button className="w-8 h-8 rounded-xl border border-slate-200 bg-white text-sm font-semibold hover:bg-slate-50 transition-colors duration-200">2</button>
                <button className="w-8 h-8 rounded-xl border border-slate-200 bg-white text-sm font-semibold hover:bg-slate-50 transition-colors duration-200">3</button>
                <button className="w-8 h-8 rounded-xl border border-slate-200 bg-white text-sm font-semibold hover:bg-slate-50 transition-colors duration-200">›</button>
              </div>
            </div>
          )}
        </div>
      </div>

      <AddStudentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddStudent}
      />
    </div>
  );
};
