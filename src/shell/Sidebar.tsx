import React from 'react';
import {
  Building2,
  GraduationCap,
  Users,
  Briefcase,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { useWorkspaceStore, WorkspaceTab } from '../store/useWorkspaceStore';
import { useAuthStore } from '../store/useAuthStore';
import { APPLICATIONS } from '../config/apps';

interface NavItem {
  id: WorkspaceTab;
  label: string;
  sublabel?: string;
  icon: any;
  externalUrl?: string;
}

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    isSidebarCollapsed,
    toggleSidebar,
    isMobileDrawerOpen,
    setMobileDrawerOpen,
  } = useWorkspaceStore();

  const { logout } = useAuthStore();

  const primaryNavItems: NavItem[] = [
    {
      id: 'crm',
      label: 'CRM',
      sublabel: 'Sales & Deals',
      icon: Building2,
      externalUrl: APPLICATIONS.crm.externalUrl,
    },
    {
      id: 'lms',
      label: 'LMS Academy',
      sublabel: 'Courses & Batches',
      icon: GraduationCap,
      externalUrl: APPLICATIONS.lms.externalUrl,
    },
    {
      id: 'hrms',
      label: 'HRMS',
      sublabel: 'People & Payroll',
      icon: Users,
      externalUrl: APPLICATIONS.hrms.externalUrl,
    },
    {
      id: 'careers',
      label: 'Careers',
      sublabel: 'Talent & Hiring',
      icon: Briefcase,
      externalUrl: APPLICATIONS.careers.externalUrl,
    },
  ];

  const secondaryNavItems: NavItem[] = [
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
    },
  ];

  const renderSidebarContent = (isMobile: boolean = false) => (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 select-none relative">
      {/* 1. BRAND LOGO HEADER */}
      <div className="h-16 px-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-600 text-white font-black text-sm flex items-center justify-center shadow-md shadow-orange-500/20 shrink-0">
            A
          </div>
          {(!isSidebarCollapsed || isMobile) && (
            <div className="truncate">
              <div className="font-black text-sm text-slate-900 dark:text-white leading-tight">
                ADYAPAN
              </div>
              <div className="text-[10px] font-bold text-orange-600 dark:text-orange-400">
                EXECUTIVE WORKSPACE
              </div>
            </div>
          )}
        </div>

        {isMobile && (
          <button
            onClick={() => setMobileDrawerOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* 2. NAVIGATION LINKS */}
      <div className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
        {/* Primary Apps Group */}
        <div>
          {(!isSidebarCollapsed || isMobile) && (
            <div className="px-3 mb-2 text-[10px] font-bold uppercase text-slate-400">
              Applications
            </div>
          )}
          <nav className="space-y-1">
            {primaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  title={isSidebarCollapsed && !isMobile ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all group relative cursor-pointer ${
                    isActive
                      ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-orange-500'}`} />

                  {(!isSidebarCollapsed || isMobile) && (
                    <span className="truncate text-left">{item.label}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* System Config Group */}
        <div>
          {(!isSidebarCollapsed || isMobile) && (
            <div className="px-3 mb-2 text-[10px] font-bold uppercase text-slate-400">
              System
            </div>
          )}
          <nav className="space-y-1">
            {secondaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  title={isSidebarCollapsed && !isMobile ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all group cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white" />

                  {(!isSidebarCollapsed || isMobile) && (
                    <span className="truncate text-left">{item.label}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* 3. LOGOUT FOOTER */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={logout}
          title={isSidebarCollapsed && !isMobile ? 'Sign Out' : undefined}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {(!isSidebarCollapsed || isMobile) && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar with Highest Z-Index (z-[200]) so toggle is strictly above Header (z-[100]) */}
      <aside className={`hidden lg:block h-screen shrink-0 sticky top-0 transition-all duration-300 relative z-[200] ${
        isSidebarCollapsed ? 'w-20' : 'w-64'
      }`}>
        {renderSidebarContent(false)}

        {/* Floating Top Divider Collapse Toggle */}
        <button
          onClick={toggleSidebar}
          title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          className="absolute -right-3.5 top-16 -translate-y-1/2 z-[210] w-7 h-7 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-orange-500 dark:hover:text-orange-400 hover:border-orange-500 shadow-md flex items-center justify-center transition-all cursor-pointer group"
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
          ) : (
            <ChevronLeft className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
          )}
        </button>
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-[300] flex">
          <div
            onClick={() => setMobileDrawerOpen(false)}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
          />
          <div className="relative w-72 h-full z-10 shadow-2xl">
            {renderSidebarContent(true)}
          </div>
        </div>
      )}
    </>
  );
};
