import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { APP_LIST } from '../config/apps';

export type WorkspaceTab = 'crm' | 'lms' | 'hrms' | 'careers' | 'settings';

export type IframeLoadStatus = 'idle' | 'loading' | 'loaded' | 'error' | 'blocked';

interface WorkspaceState {
  activeTab: WorkspaceTab;
  isFullscreen: boolean;
  isSidebarCollapsed: boolean;
  isMobileDrawerOpen: boolean;
  searchQuery: string;
  appStatuses: Record<string, { status: 'online' | 'checking' | 'offline'; lastChecked: string }>;
  frameStatuses: Record<string, IframeLoadStatus>;
  refreshKey: Record<string, number>;

  setActiveTab: (tab: WorkspaceTab) => void;
  toggleFullscreen: () => void;
  setFullscreen: (val: boolean) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (val: boolean) => void;
  setMobileDrawerOpen: (val: boolean) => void;
  setSearchQuery: (query: string) => void;
  reloadApp: (appId: string) => void;
  setFrameStatus: (appId: string, status: IframeLoadStatus) => void;
  checkAllAppHealth: () => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set, get) => ({
      activeTab: 'crm',
      isFullscreen: false,
      isSidebarCollapsed: false,
      isMobileDrawerOpen: false,
      searchQuery: '',
      appStatuses: {
        crm: { status: 'online', lastChecked: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
        lms: { status: 'online', lastChecked: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
        hrms: { status: 'online', lastChecked: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
        careers: { status: 'online', lastChecked: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
      },
      frameStatuses: {
        crm: 'idle',
        lms: 'idle',
        hrms: 'idle',
        careers: 'idle',
      },
      refreshKey: {
        crm: 1,
        lms: 1,
        hrms: 1,
        careers: 1,
      },

      setActiveTab: (tab) => {
        set({ activeTab: tab, isMobileDrawerOpen: false });
      },

      toggleFullscreen: () => {
        set((state) => ({ isFullscreen: !state.isFullscreen }));
      },

      setFullscreen: (val) => {
        set({ isFullscreen: val });
      },

      toggleSidebar: () => {
        set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed }));
      },

      setSidebarCollapsed: (val) => {
        set({ isSidebarCollapsed: val });
      },

      setMobileDrawerOpen: (val) => {
        set({ isMobileDrawerOpen: val });
      },

      setSearchQuery: (query) => {
        set({ searchQuery: query });
      },

      reloadApp: (appId) => {
        set((state) => ({
          refreshKey: {
            ...state.refreshKey,
            [appId]: (state.refreshKey[appId] || 1) + 1,
          },
          frameStatuses: {
            ...state.frameStatuses,
            [appId]: 'loading',
          },
        }));
      },

      setFrameStatus: (appId, status) => {
        set((state) => ({
          frameStatuses: {
            ...state.frameStatuses,
            [appId]: status,
          },
        }));
      },

      checkAllAppHealth: () => {
        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const updatedStatuses: Record<string, { status: 'online' | 'checking' | 'offline'; lastChecked: string }> = {};

        APP_LIST.forEach((app) => {
          updatedStatuses[app.id] = {
            status: 'online',
            lastChecked: now,
          };
        });

        set({ appStatuses: updatedStatuses });
      },
    }),
    {
      name: 'adyapan-workspace-storage',
      partialize: (state) => ({
        activeTab: state.activeTab,
        isSidebarCollapsed: state.isSidebarCollapsed,
      }),
    }
  )
);
