import { useEffect } from 'react';
import { useUiStore } from '../store/uiStore';

export const useResponsive = () => {
  const { setIsMobile, setSidebarOpen } = useUiStore();

  useEffect(() => {
    const checkMobile = () => {
      const isMobileView = window.innerWidth < 1024; // lg breakpoint
      setIsMobile(isMobileView);
      if (!isMobileView) {
        setSidebarOpen(true); // Always open on desktop
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [setIsMobile, setSidebarOpen]);
};
