import React, { useState } from 'react';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (studentData: any) => void;
}

export const AddStudentModal: React.FC<AddStudentModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'Male',
    class: 'Class 8',
    section: 'A',
    parentMobile: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
    // Reset form
    setFormData({
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: 'Male',
      class: 'Class 8',
      section: 'A',
      parentMobile: ''
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/45 backdrop-blur-sm z-[1000] flex items-center justify-center" onClick={onClose}>
      <div className="bg-white rounded-3xl p-7 w-[540px] max-w-[90vw] shadow-[0_20px_60px_rgba(30,58,138,0.2)]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-extrabold">Add New Student</h3>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-xl border border-slate-200 bg-none cursor-pointer text-slate-500 text-sm hover:bg-slate-50"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-3.5 mb-3.5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Aarav"
                className="px-3.5 py-2.5 border-[1.5px] border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-indigo-500 bg-transparent"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Kumar"
                className="px-3.5 py-2.5 border-[1.5px] border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-indigo-500 bg-transparent"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5 mb-3.5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500">Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="px-3.5 py-2.5 border-[1.5px] border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-indigo-500 bg-transparent"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="px-3.5 py-2.5 border-[1.5px] border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-indigo-500 bg-transparent"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5 mb-3.5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500">Class</label>
              <select
                name="class"
                value={formData.class}
                onChange={handleChange}
                className="px-3.5 py-2.5 border-[1.5px] border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-indigo-500 bg-transparent"
              >
                <option value="Class 8">Class 8</option>
                <option value="Class 9">Class 9</option>
                <option value="Class 10">Class 10</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500">Section</label>
              <select
                name="section"
                value={formData.section}
                onChange={handleChange}
                className="px-3.5 py-2.5 border-[1.5px] border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-indigo-500 bg-transparent"
              >
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 mb-5">
            <label className="text-xs font-semibold text-slate-500">Parent Mobile Number</label>
            <input
              type="tel"
              name="parentMobile"
              value={formData.parentMobile}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              className="px-3.5 py-2.5 border-[1.5px] border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-indigo-500 bg-transparent"
              required
            />
          </div>

          <div className="flex gap-2.5 mt-5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border-[1.5px] border-slate-200 rounded-xl bg-none text-sm font-semibold cursor-pointer font-inherit hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-2 py-3 bg-gradient-to-br from-blue-600 to-indigo-600 border-none rounded-xl text-white text-sm font-bold cursor-pointer font-inherit"
            >
              ✅ Add Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
