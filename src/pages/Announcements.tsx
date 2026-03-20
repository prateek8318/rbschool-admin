import React, { useState } from 'react';
import { Topbar } from '../components/layout/Topbar';

export const Announcements: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    sendTo: 'All'
  });

  const [announcements] = useState([
    {
      title: 'School closed — Holi',
      message: 'School will remain closed on March 25, 2026 for Holi. Classes resume on March 26.',
      audience: 'All users',
      time: '2 days ago',
      delivered: '1,248 delivered',
      status: 'Sent'
    },
    {
      title: 'Parent-Teacher Meeting',
      message: 'PTM scheduled for March 28 at 10:00 AM. All parents are requested to attend.',
      audience: 'Parents only',
      time: '3 days ago',
      delivered: '892 delivered',
      status: 'Sent'
    },
    {
      title: 'Mid-Term Schedule Released',
      message: 'Mid-Term examination schedule for April 2026 has been published. Check the Exams section.',
      audience: 'All users',
      time: '5 days ago',
      delivered: '1,248 delivered',
      status: 'Sent'
    }
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSendAnnouncement = () => {
    console.log('Sending announcement:', formData);
    // Reset form
    setFormData({
      title: '',
      message: '',
      sendTo: 'All'
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Topbar 
        title="Announcements" 
        subtitle="Send notices to students & parents"
        actions={
          <button className="px-4.5 py-2.5 rounded-xl btn-primary text-sm font-semibold cursor-pointer font-inherit">
            ➕ New Announcement
          </button>
        }
      />
      
      <div className="px-8 py-7">
        <div className="grid grid-cols-[1fr_1.5fr] gap-5">
          {/* Compose Notice */}
          <div className="table-card">
            <h3 className="text-sm font-bold mb-4">Compose Notice</h3>
            
            <div className="mb-3">
              <label className="text-xs font-semibold text-slate-500 block mb-1.5">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Announcement title..."
                className="w-full px-3.5 py-2.5 border-[1.5px] border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-indigo-500 bg-transparent"
              />
            </div>

            <div className="mb-3">
              <label className="text-xs font-semibold text-slate-500 block mb-1.5">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Type your message..."
                rows={5}
                className="w-full px-3.5 py-2.5 border-[1.5px] border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-indigo-500 bg-transparent resize-none"
              />
            </div>

            <div className="mb-4">
              <label className="text-xs font-semibold text-slate-500 block mb-1.5">Send To</label>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setFormData(prev => ({ ...prev, sendTo: 'All' }))}
                  className={`px-3.5 py-1.5 rounded-[20px] border-[1.5px] text-xs font-semibold cursor-pointer font-inherit transition-colors ${
                    formData.sendTo === 'All' 
                      ? 'border-indigo-500 bg-gradient-to-br from-blue-600 to-indigo-600 text-white' 
                      : 'border-slate-200 bg-none text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFormData(prev => ({ ...prev, sendTo: 'Parents' }))}
                  className={`px-3.5 py-1.5 rounded-[20px] border-[1.5px] text-xs font-semibold cursor-pointer font-inherit transition-colors ${
                    formData.sendTo === 'Parents' 
                      ? 'border-indigo-500 bg-gradient-to-br from-blue-600 to-indigo-600 text-white' 
                      : 'border-slate-200 bg-none text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Parents
                </button>
                <button
                  onClick={() => setFormData(prev => ({ ...prev, sendTo: 'Teachers' }))}
                  className={`px-3.5 py-1.5 rounded-[20px] border-[1.5px] text-xs font-semibold cursor-pointer font-inherit transition-colors ${
                    formData.sendTo === 'Teachers' 
                      ? 'border-indigo-500 bg-gradient-to-br from-blue-600 to-indigo-600 text-white' 
                      : 'border-slate-200 bg-none text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Teachers
                </button>
              </div>
            </div>

            <button
              onClick={handleSendAnnouncement}
              className="w-full py-3 bg-gradient-to-br from-blue-600 to-indigo-600 border-none rounded-xl text-white text-sm font-bold cursor-pointer font-inherit hover:opacity-90 transition-opacity"
            >
              📤 Send Announcement
            </button>
          </div>

          {/* Recent Announcements */}
          <div className="table-card">
            <h3 className="text-sm font-bold mb-4">Recent Announcements</h3>
            
            {announcements.map((announcement, index) => (
              <div key={index} className={`${index < announcements.length - 1 ? 'border-b border-slate-200 pb-3.5 mb-3.5' : ''}`}>
                <div className="flex items-center justify-between mb-1.5">
                  <strong className="text-sm font-semibold">{announcement.title}</strong>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-[20px] bg-green-100 text-green-700">
                    Sent
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-6 mb-2">{announcement.message}</p>
                <div className="text-xs text-slate-500">
                  {announcement.audience} • {announcement.time} • {announcement.delivered}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
