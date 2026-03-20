import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useResponsive } from '../../hooks/useResponsive';

export const AppLayout: React.FC = () => {
  useResponsive(); // Initialize responsive behavior

  return (
    <div className="flex min-h-screen bg-pattern font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto overflow-x-hidden lg:pt-0 pt-16">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
