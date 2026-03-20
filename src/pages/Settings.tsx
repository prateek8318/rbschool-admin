import React, { useState } from 'react';
import { Topbar } from '../components/layout/Topbar';

export const Settings: React.FC = () => {
  const [schoolProfile, setSchoolProfile] = useState({
    schoolName: 'RBSchool Academy',
    board: 'CBSE',
    academicYear: '2025–2026',
    contactEmail: 'admin@rbschool.in'
  });

  const [appConfig, setAppConfig] = useState({
    pushNotifications: true,
    smsAlerts: false,
    autoFeeReminders: true
  });

  const handleProfileChange = (field: string, value: string) => {
    setSchoolProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleConfigToggle = (field: string) => {
    setAppConfig(prev => ({
      ...prev,
      [field]: !prev[field as keyof typeof appConfig]
    }));
  };

  const handleSaveChanges = () => {
    console.log('Saving settings:', { schoolProfile, appConfig });
    // Add save functionality here
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Topbar 
        title="Settings" 
        subtitle="School profile & configuration"
        actions={
          <button 
            onClick={handleSaveChanges}
            className="px-4.5 py-2.5 rounded-xl btn-primary text-sm font-semibold cursor-pointer font-inherit"
          >
            💾 Save Changes
          </button>
        }
      />
      
      <div className="px-8 py-7">
        <div className="grid grid-cols-2 gap-6">
          {/* School Profile */}
          <div className="table-card">
            <h3 className="text-sm font-bold mb-4.5">School Profile</h3>
            
            <div className="mb-3.5">
              <label className="text-xs font-semibold text-slate-500 block mb-1.5">School Name</label>
              <input
                type="text"
                value={schoolProfile.schoolName}
                onChange={(e) => handleProfileChange('schoolName', e.target.value)}
                className="w-full px-3.5 py-2.5 border-[1.5px] border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-indigo-500 bg-transparent"
              />
            </div>

            <div className="mb-3.5">
              <label className="text-xs font-semibold text-slate-500 block mb-1.5">Board</label>
              <select
                value={schoolProfile.board}
                onChange={(e) => handleProfileChange('board', e.target.value)}
                className="w-full px-3.5 py-2.5 border-[1.5px] border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-indigo-500 bg-transparent"
              >
                <option value="CBSE">CBSE</option>
                <option value="ICSE">ICSE</option>
                <option value="State Board">State Board</option>
              </select>
            </div>

            <div className="mb-3.5">
              <label className="text-xs font-semibold text-slate-500 block mb-1.5">Academic Year</label>
              <select
                value={schoolProfile.academicYear}
                onChange={(e) => handleProfileChange('academicYear', e.target.value)}
                className="w-full px-3.5 py-2.5 border-[1.5px] border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-indigo-500 bg-transparent"
              >
                <option value="2025–2026">2025–2026</option>
                <option value="2026–2027">2026–2027</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1.5">Contact Email</label>
              <input
                type="email"
                value={schoolProfile.contactEmail}
                onChange={(e) => handleProfileChange('contactEmail', e.target.value)}
                className="w-full px-3.5 py-2.5 border-[1.5px] border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-indigo-500 bg-transparent"
              />
            </div>
          </div>

          {/* App Configuration */}
          <div className="table-card">
            <h3 className="text-sm font-bold mb-4.5">App Configuration</h3>
            
            <div className="flex items-center justify-between py-3.5 border-b border-slate-200">
              <div>
                <div className="text-sm font-semibold">Push Notifications</div>
                <div className="text-xs text-slate-500 mt-0.5">Send alerts to parents & teachers</div>
              </div>
              <button
                onClick={() => handleConfigToggle('pushNotifications')}
                className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${
                  appConfig.pushNotifications 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600' 
                    : 'bg-slate-200'
                }`}
              >
                <div 
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-[0_1px_4px_rgba(0,0,0,0.2)] transition-transform ${
                    appConfig.pushNotifications ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between py-3.5 border-b border-slate-200">
              <div>
                <div className="text-sm font-semibold">SMS Alerts</div>
                <div className="text-xs text-slate-500 mt-0.5">Low attendance warning SMS</div>
              </div>
              <button
                onClick={() => handleConfigToggle('smsAlerts')}
                className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${
                  appConfig.smsAlerts 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600' 
                    : 'bg-slate-200'
                }`}
              >
                <div 
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-[0_1px_4px_rgba(0,0,0,0.2)] transition-transform ${
                    appConfig.smsAlerts ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between py-3.5">
              <div>
                <div className="text-sm font-semibold">Auto Fee Reminders</div>
                <div className="text-xs text-slate-500 mt-0.5">7 days before due date</div>
              </div>
              <button
                onClick={() => handleConfigToggle('autoFeeReminders')}
                className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${
                  appConfig.autoFeeReminders 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600' 
                    : 'bg-slate-200'
                }`}
              >
                <div 
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-[0_1px_4px_rgba(0,0,0,0.2)] transition-transform ${
                    appConfig.autoFeeReminders ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
