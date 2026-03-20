import React from 'react';
import { Topbar } from '../components/layout/Topbar';

export const Classes: React.FC = () => {
  const classesData = [
    {
      name: 'Class 1',
      sections: '2 Sections',
      students: '48 Students',
      color: 'from-green-600 to-emerald-600'
    },
    {
      name: 'Class 2',
      sections: '2 Sections',
      students: '52 Students',
      color: 'from-blue-600 to-cyan-600'
    },
    {
      name: 'Class 3',
      sections: '3 Sections',
      students: '63 Students',
      color: 'from-purple-600 to-pink-600'
    },
    {
      name: 'Class 4',
      sections: '3 Sections',
      students: '71 Students',
      color: 'from-amber-600 to-orange-600'
    },
    {
      name: 'Class 5',
      sections: '3 Sections',
      students: '68 Students',
      color: 'from-rose-600 to-red-600'
    },
    {
      name: 'Class 6',
      sections: '3 Sections',
      students: '75 Students',
      color: 'from-indigo-600 to-blue-600'
    },
    {
      name: 'Class 7',
      sections: '3 Sections',
      students: '82 Students',
      color: 'from-teal-600 to-cyan-600'
    },
    {
      name: 'Class 8',
      sections: '3 Sections',
      students: '79 Students',
      color: 'from-blue-600 to-indigo-600'
    }
  ];

  const classSections = [
    {
      class: 'Class 1',
      sections: ['1-A', '1-B'],
      teachers: {
        '1-A': 'Mrs. Sunita Devi',
        '1-B': 'Ms. Anita Kumari'
      },
      students: {
        '1-A': 24,
        '1-B': 24
      }
    },
    {
      class: 'Class 2',
      sections: ['2-A', '2-B'],
      teachers: {
        '2-A': 'Mrs. Pooja Singh',
        '2-B': 'Ms. Rekha Gupta'
      },
      students: {
        '2-A': 26,
        '2-B': 26
      }
    },
    {
      class: 'Class 3',
      sections: ['3-A', '3-B', '3-C'],
      teachers: {
        '3-A': 'Mr. Rajesh Kumar',
        '3-B': 'Mrs. Meera Devi',
        '3-C': 'Ms. Anita Sharma'
      },
      students: {
        '3-A': 21,
        '3-B': 21,
        '3-C': 21
      }
    },
    {
      class: 'Class 4',
      sections: ['4-A', '4-B', '4-C'],
      teachers: {
        '4-A': 'Mr. Amit Singh',
        '4-B': 'Mrs. Priya Verma',
        '4-C': 'Ms. Sunita Kumari'
      },
      students: {
        '4-A': 24,
        '4-B': 23,
        '4-C': 24
      }
    },
    {
      class: 'Class 5',
      sections: ['5-A', '5-B', '5-C'],
      teachers: {
        '5-A': 'Mr. Ramesh Prasad',
        '5-B': 'Mrs. Anjali Devi',
        '5-C': 'Ms. Pooja Singh'
      },
      students: {
        '5-A': 22,
        '5-B': 23,
        '5-C': 23
      }
    },
    {
      class: 'Class 6',
      sections: ['6-A', '6-B', '6-C'],
      teachers: {
        '6-A': 'Mr. Suresh Kumar',
        '6-B': 'Mrs. Meera Singh',
        '6-C': 'Mr. Rajesh Verma'
      },
      students: {
        '6-A': 25,
        '6-B': 25,
        '6-C': 25
      }
    },
    {
      class: 'Class 7',
      sections: ['7-A', '7-B', '7-C'],
      teachers: {
        '7-A': 'Mr. Amit Kumar',
        '7-B': 'Mrs. Priya Mishra',
        '7-C': 'Ms. Anita Verma'
      },
      students: {
        '7-A': 27,
        '7-B': 27,
        '7-C': 28
      }
    },
    {
      class: 'Class 8',
      sections: ['8-A', '8-B', '8-C'],
      teachers: {
        '8-A': 'Mr. Rajesh Verma',
        '8-B': 'Ms. Priya Mishra',
        '8-C': 'Mrs. Anjali Singh'
      },
      students: {
        '8-A': 26,
        '8-B': 26,
        '8-C': 27
      }
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Topbar 
        title="Classes & Sections" 
        subtitle="Manage academic structure"
        actions={
          <button className="px-4.5 py-2.5 rounded-xl btn-primary text-sm font-semibold cursor-pointer font-inherit">
            ➕ Add Class
          </button>
        }
      />
      
      <div className="px-8 py-7">
        {/* Class Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          {classesData.map((classItem, index) => (
            <div key={index} className="kpi-card cursor-pointer hover:translate-y-[-2px] transition-transform">
              <div className={`text-2xl font-extrabold mb-1 bg-gradient-to-br ${classItem.color} bg-clip-text text-transparent`}>
                {classItem.name}
              </div>
              <div className="text-xs text-slate-500">{classItem.sections} • {classItem.students}</div>
            </div>
          ))}
        </div>

        {/* Detailed Class Sections */}
        <div className="table-card">
          <h3 className="text-sm font-bold mb-4">Class Sections Details</h3>
          
          <div className="space-y-4">
            {classSections.map((classData, classIndex) => (
              <div key={classIndex} className="border border-slate-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-base font-bold">{classData.class}</h4>
                  <span className="text-xs text-slate-500">{classData.sections.length} Sections</span>
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  {classData.sections.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                          {section}
                        </div>
                        <div>
                          <div className="text-sm font-semibold">{section}</div>
                          <div className="text-xs text-slate-500">{classData.teachers[section as keyof typeof classData.teachers]}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold">{classData.students[section as keyof typeof classData.students]}</div>
                        <div className="text-xs text-slate-500">Students</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
