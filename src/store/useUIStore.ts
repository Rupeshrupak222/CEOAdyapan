import { create } from 'zustand';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message?: string;
  duration?: number;
}

interface UIState {
  isSidebarCollapsed: boolean;
  isMobileSidebarOpen: boolean;
  isCommandPaletteOpen: boolean;
  isNotificationDrawerOpen: boolean;
  isQuickActionModalOpen: boolean;
  
  // State simulation for demoing requirements
  isSimulatedLoading: boolean;
  isSimulatedEmpty: boolean;
  isSimulatedError: boolean;
  
  toasts: ToastMessage[];
  
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setMobileSidebarOpen: (open: boolean) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setNotificationDrawerOpen: (open: boolean) => void;
  setQuickActionModalOpen: (open: boolean) => void;
  
  setSimulatedLoading: (loading: boolean) => void;
  setSimulatedEmpty: (empty: boolean) => void;
  setSimulatedError: (error: boolean) => void;
  
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarCollapsed: false,
  isMobileSidebarOpen: false,
  isCommandPaletteOpen: false,
  isNotificationDrawerOpen: false,
  isQuickActionModalOpen: false,
  
  isSimulatedLoading: false,
  isSimulatedEmpty: false,
  isSimulatedError: false,
  
  toasts: [],
  
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),
  setMobileSidebarOpen: (open) => set({ isMobileSidebarOpen: open }),
  setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
  setNotificationDrawerOpen: (open) => set({ isNotificationDrawerOpen: open }),
  setQuickActionModalOpen: (open) => set({ isQuickActionModalOpen: open }),
  
  setSimulatedLoading: (loading) => set({ isSimulatedLoading: loading }),
  setSimulatedEmpty: (empty) => set({ isSimulatedEmpty: empty }),
  setSimulatedError: (error) => set({ isSimulatedError: error }),
  
  addToast: (toast) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
    
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, toast.duration || 4000);
  },
  
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
}));
