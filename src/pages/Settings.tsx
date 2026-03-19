import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';

export const Settings: React.FC = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">System Settings</h1>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 flex items-center gap-4 text-slate-500">
        <SettingsIcon className="w-6 h-6" />
        <p>Configuration panel is coming soon.</p>
      </div>
    </div>
  );
};
