import React from 'react';
import { Topbar } from '../components/layout/Topbar';

export const Classes: React.FC = () => {
  const classesData = [
    {
      name: 'Class 8',
      sections: '3 Sections',
      students: '127 Students',
      color: 'from-blue-600 to-indigo-600'
    },
    {
      name: 'Class 9',
      sections: '3 Sections',
      students: '134 Students',
      color: 'from-blue-600 to-indigo-600'
    },
    {
      name: 'Class 10',
      sections: '4 Sections',
      students: '148 Students',
      color: 'from-blue-600 to-indigo-600'
    },
    {
      name: 'Class 11',
      sections: '2 Sections',
      students: '96 Students',
      color: 'from-blue-600 to-indigo-600'
    }
  ];

  const classSections = [
    {
      class: 'Class 8',
      sections: ['8-A', '8-B', '8-C'],
      teachers: {
        '8-A': 'Mr. Rajesh Verma',
        '8-B': 'Ms. Priya Mishra',
        '8-C': 'Mrs. Anjali Singh'
      },
      students: {
        '8-A': 45,
        '8-B': 42,
        '8-C': 40
      }
    },
    {
      class: 'Class 9',
      sections: ['9-A', '9-B', '9-C'],
      teachers: {
        '9-A': 'Mr. Suresh Sharma',
        '9-B': 'Mrs. Anjali Singh',
        '9-C': 'Mr. Amit Kumar'
      },
      students: {
        '9-A': 42,
        '9-B': 40,
        '9-C': 52
      }
    },
    {
      class: 'Class 10',
      sections: ['10-A', '10-B', '10-C', '10-D'],
      teachers: {
        '10-A': 'Mr. Amit Kumar',
        '10-B': 'Ms. Priya Mishra',
        '10-C': 'Mr. Suresh Sharma',
        '10-D': 'Mr. Rajesh Verma'
      },
      students: {
        '10-A': 39,
        '10-B': 38,
        '10-C': 35,
        '10-D': 36
      }
    },
    {
      class: 'Class 11',
      sections: ['11-A', '11-B'],
      teachers: {
        '11-A': 'Mr. Suresh Sharma',
        '11-B': 'Ms. Priya Mishra'
      },
      students: {
        '11-A': 48,
        '11-B': 48
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
        <div className="grid grid-cols-4 gap-4 mb-6">
          {classesData.map((classItem, index) => (
            <div key={index} className="kpi-card cursor-pointer hover:translate-y-[-2px] transition-transform">
              <div className="text-2xl font-extrabold mb-1 bg-gradient-to-br from-blue-600 to-indigo-600 bg-clip-text text-transparent">
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
