import React from 'react';
import {
  Sparkles,
  Command,
  Globe,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  ExternalLink,
  Layers,
  Search,
  Activity,
  CheckCircle2
} from 'lucide-react';
import { APP_LIST, AppConfig } from '../config/apps';
import { AppStatusCard } from './AppStatusCard';
import { useWorkspaceStore } from '../store/useWorkspaceStore';

export const Workspace: React.FC = () => {
  const { setActiveTab, searchQuery, setSearchQuery } = useWorkspaceStore();

  const filteredApps = APP_LIST.filter((app) =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8 p-4 sm:p-8 max-w-7xl mx-auto font-sans">
      {/* ========================================================================= */}
      {/* 1. ENTERPRISE HERO HEADER BANNER */}
      {/* ========================================================================= */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-10 text-white shadow-2xl">
        {/* Background Ambient Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-orange-500/20 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-gradient-to-tr from-blue-500/15 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-semibold text-orange-400 border border-white/10">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Adyapan Executive Workspace • Unified Console</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black leading-tight tracking-normal">
            Centralized Executive Application Hub
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Direct executive launcher and embedded gateway for Adyapan enterprise production systems. Access verified sales pipelines, academic cohorts, workforce management, and hiring funnels from one single workspace.
          </p>

          {/* Quick Subsystem Pill Highlights */}
          <div className="pt-4 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs font-mono text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>4 Production Systems Operational</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs font-mono text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Enterprise Zero-Data Duplication</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SEARCH & WORKSPACE FILTER BAR */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            Executive Applications
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Select an application to launch within the workspace frame or open in a dedicated browser tab.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search applications, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9.5 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 shadow-sm transition-all"
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. FOUR APPLICATION CARDS GRID */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredApps.map((app) => (
          <AppStatusCard
            key={app.id}
            app={app}
            onLaunch={(id) => setActiveTab(id)}
          />
        ))}
      </div>

      {/* ========================================================================= */}
      {/* 4. ENTERPRISE SHORTCUTS & SPECIFICATIONS FOOTER */}
      {/* ========================================================================= */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
          <Zap className="w-4 h-4 text-amber-500 shrink-0" />
          <span>
            <strong>Pro Tip:</strong> Use the sidebar navigation to toggle seamlessly between embedded applications without losing active session state.
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
          <span>Adyapan Executive Shell v2.0</span>
          <span>•</span>
          <span className="text-emerald-500 font-bold">Encrypted TLS</span>
        </div>
      </div>
    </div>
  );
};
