import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { AppFrame } from './AppFrame';
import { useWorkspaceStore } from '../store/useWorkspaceStore';
import { APPLICATIONS } from '../config/apps';
import { SettingsPage } from '../pages/SettingsPage';

export const ExecutiveLayout: React.FC = () => {
  const { activeTab, isFullscreen } = useWorkspaceStore();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'crm':
        return (
          <div className="h-[calc(100dvh-64px)] p-1 sm:p-3 md:p-4">
            <AppFrame app={APPLICATIONS.crm} />
          </div>
        );
      case 'lms':
        return (
          <div className="h-[calc(100dvh-64px)] p-1 sm:p-3 md:p-4">
            <AppFrame app={APPLICATIONS.lms} />
          </div>
        );
      case 'hrms':
        return (
          <div className="h-[calc(100dvh-64px)] p-1 sm:p-3 md:p-4">
            <AppFrame app={APPLICATIONS.hrms} />
          </div>
        );
      case 'careers':
        return (
          <div className="h-[calc(100dvh-64px)] p-1 sm:p-3 md:p-4">
            <AppFrame app={APPLICATIONS.careers} />
          </div>
        );
      case 'settings':
        return (
          <div className="h-[calc(100dvh-64px)] p-1 sm:p-3 md:p-4 overflow-y-auto">
            <SettingsPage />
          </div>
        );
      default:
        return (
          <div className="h-[calc(100dvh-64px)] p-1 sm:p-3 md:p-4">
            <AppFrame app={APPLICATIONS.crm} />
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100">
      {/* 1. SIDEBAR NAVIGATION */}
      {!isFullscreen && <Sidebar />}

      {/* 2. MAIN APPLICATION CONTENT AREA */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        {!isFullscreen && <Header />}

        <main className="flex-1 overflow-hidden relative z-10">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
};
