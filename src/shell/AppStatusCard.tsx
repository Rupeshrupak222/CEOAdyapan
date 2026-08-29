import React from 'react';
import {
  Building2,
  GraduationCap,
  Users,
  Briefcase,
  ExternalLink,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Activity,
  Globe
} from 'lucide-react';
import { AppConfig } from '../config/apps';
import { useWorkspaceStore } from '../store/useWorkspaceStore';

interface AppStatusCardProps {
  app: AppConfig;
  onLaunch: (id: AppConfig['id']) => void;
}

export const AppStatusCard: React.FC<AppStatusCardProps> = ({ app, onLaunch }) => {
  const { appStatuses } = useWorkspaceStore();

  const statusInfo = appStatuses[app.id] || { status: 'online', lastChecked: 'Just now' };

  const getIcon = () => {
    switch (app.icon) {
      case 'Building2':
        return Building2;
      case 'GraduationCap':
        return GraduationCap;
      case 'Users':
        return Users;
      case 'Briefcase':
        return Briefcase;
      default:
        return Globe;
    }
  };

  const IconComponent = getIcon();

  return (
    <div className="group relative rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden">
      {/* Top Accent Gradient Bar */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${app.color}`} />

      <div>
        {/* Top Header Row: Icon + Badge + Status */}
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${app.color} text-white flex items-center justify-center shadow-md shadow-orange-500/10 group-hover:scale-105 transition-transform`}>
            <IconComponent className="w-6 h-6" />
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Online</span>
            </span>
          </div>
        </div>

        {/* Title & Badge */}
        <div className="mb-2">
          <div className="text-[11px] font-bold text-slate-400 uppercase">
            {app.category}
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white mt-0.5 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
            {app.name}
          </h3>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
          {app.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {app.tags.map((tag, idx) => (
            <span
              key={idx}
              className="px-2.5 py-0.5 rounded-md bg-slate-50 dark:bg-slate-800/60 text-[10px] font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3">
        {/* Direct Link Info */}
        <span className="text-[11px] font-mono text-slate-400 truncate max-w-[140px]">
          {app.externalUrl.replace('https://', '')}
        </span>

        <div className="flex items-center gap-2">
          {/* External Tab */}
          <a
            href={app.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Open in dedicated tab"
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </a>

          {/* Launch In Workspace */}
          <button
            onClick={() => onLaunch(app.id)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-orange-600 dark:bg-white dark:hover:bg-orange-500 dark:text-slate-900 text-white hover:text-white dark:hover:text-white text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            <span>Launch</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
