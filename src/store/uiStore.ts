import { create } from 'zustand';

interface UiState {
  sidebarOpen: boolean;
  isMobile: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setIsMobile: (isMobile: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  sidebarOpen: false, // Default to closed on mobile
  isMobile: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setIsMobile: (isMobile) => set({ isMobile, sidebarOpen: !isMobile }),
}));
