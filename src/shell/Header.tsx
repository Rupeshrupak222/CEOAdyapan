import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Moon,
  Sun,
  LayoutGrid,
  ChevronRight,
  User,
  LogOut,
  ChevronDown,
  ShieldCheck,
  Settings
} from 'lucide-react';
import { useWorkspaceStore } from '../store/useWorkspaceStore';
import { useThemeStore } from '../store/useThemeStore';
import { useAuthStore } from '../store/useAuthStore';
import { APPLICATIONS } from '../config/apps';

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    setMobileDrawerOpen,
  } = useWorkspaceStore();

  const { theme, toggleTheme } = useThemeStore();
  const { user, logout } = useAuthStore();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const currentApp = activeTab !== 'settings' ? APPLICATIONS[activeTab] : null;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOpenProfile = () => {
    setActiveTab('settings');
    setIsDropdownOpen(false);
  };

  const handleLogout = () => {
    setIsDropdownOpen(false);
    logout();
  };

  return (
    <header className="h-16 px-4 sm:px-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between gap-4 sticky top-0 z-[100] select-none">
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileDrawerOpen(true)}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-semibold">
          <div className="flex items-center gap-1.5 text-slate-400">
            <LayoutGrid className="w-3.5 h-3.5 text-orange-500" />
            <span className="hidden sm:inline font-bold text-slate-700 dark:text-slate-300">Executive Console</span>
          </div>

          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />

          {currentApp ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 font-bold border border-orange-200/60 dark:border-orange-800/60">
              <span>{currentApp.name}</span>
            </div>
          ) : (
            <span className="text-slate-900 dark:text-white font-bold">
              Account Security & Profile
            </span>
          )}
        </div>
      </div>

      {/* Right: Actions & User Dropdown */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all cursor-pointer"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Profile Pill with Interactive Dropdown */}
        <div className="relative pl-2 border-l border-slate-200 dark:border-slate-800" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2.5 p-1.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-600 text-white font-black text-xs flex items-center justify-center shadow-sm">
              {user?.name?.[0] || 'A'}
            </div>
            <div className="hidden md:block text-left">
              <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight flex items-center gap-1">
                <span>{user?.name || 'Sai Charan'}</span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </div>
              <div className="text-[10px] text-slate-400 font-medium">
                {user?.email || 'admin@adyapan.io'}
              </div>
            </div>
          </button>

          {/* Executive Dropdown Menu with Ultra-High Z-Index */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl py-2 z-[99999] animate-in fade-in slide-in-from-top-2 duration-150">
              {/* User Header Summary */}
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800/80 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-600 text-white font-black text-sm flex items-center justify-center shadow-md shadow-orange-500/20 shrink-0">
                  {user?.name?.[0] || 'A'}
                </div>
                <div className="truncate">
                  <div className="text-xs font-black text-slate-900 dark:text-white truncate">
                    {user?.name || 'Sai Charan'}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono truncate">
                    {user?.email || 'admin@adyapan.io'}
                  </div>
                  <span className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                    <ShieldCheck className="w-2.5 h-2.5" />
                    SUPER_ADMIN
                  </span>
                </div>
              </div>

              {/* Menu Links */}
              <div className="p-1.5 space-y-0.5">
                {/* Profile & Security / Settings */}
                <button
                  onClick={handleOpenProfile}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-left"
                >
                  <User className="w-4 h-4 text-orange-500" />
                  <div className="flex-1">
                    <div>Profile & Security</div>
                    <div className="text-[10px] font-normal text-slate-400">Edit profile, change password</div>
                  </div>
                </button>

                {/* System Settings Shortcut */}
                <button
                  onClick={handleOpenProfile}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-left"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Account Settings</span>
                </button>
              </div>

              {/* Logout Divider */}
              <div className="pt-1.5 mt-1 border-t border-slate-100 dark:border-slate-800/80 p-1.5">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
