import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { MobileNav } from './MobileNav';
import { ErrorBoundary } from '../ErrorBoundary';

export const AppLayout: React.FC<{ mode: 'platform' | 'institution' }> = ({ mode }) => {
  const location = useLocation();
  return (
    <div className="flex min-h-screen">
      <div className="app-bg" aria-hidden />
      <Sidebar mode={mode} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar mode={mode} />
        <main className="flex-1">
          {/* Keyed by path so every page change animates in and errors reset */}
          <ErrorBoundary key={location.pathname}>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
      <MobileNav mode={mode} />
    </div>
  );
};
