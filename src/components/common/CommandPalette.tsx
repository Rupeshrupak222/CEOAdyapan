import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  Briefcase, 
  Settings, 
  UserPlus, 
  PlusCircle, 
  Moon, 
  Sun, 
  Sparkles,
  Command,
  ArrowRight,
  Shield
} from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';
import { useThemeStore } from '../../store/useThemeStore';
import { EcosystemModule } from '../../types';

interface CommandPaletteProps {
  onNavigate: (module: EcosystemModule) => void;
  onOpenQuickAction: () => void;
  onOpenAddLead: () => void;
  onOpenPostJob: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  onNavigate,
  onOpenQuickAction,
  onOpenAddLead,
  onOpenPostJob,
}) => {
  const { isCommandPaletteOpen, setCommandPaletteOpen, addToast } = useUIStore();
  const { isDark, toggleTheme } = useThemeStore();
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!isCommandPaletteOpen);
      }
      if (e.key === 'Escape' && isCommandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setCommandPaletteOpen]);

  const items = [
    {
      id: 'nav-dash',
      title: 'Go to Executive Dashboard',
      category: 'Navigation',
      icon: LayoutDashboard,
      shortcut: 'G D',
      action: () => {
        onNavigate('dashboard');
        setCommandPaletteOpen(false);
      },
    },
    {
      id: 'nav-crm',
      title: 'Go to CRM & Pipeline',
      category: 'Navigation',
      icon: Users,
      shortcut: 'G C',
      action: () => {
        onNavigate('crm');
        setCommandPaletteOpen(false);
      },
    },
    {
      id: 'nav-lms',
      title: 'Go to LMS & Academy',
      category: 'Navigation',
      icon: GraduationCap,
      shortcut: 'G L',
      action: () => {
        onNavigate('lms');
        setCommandPaletteOpen(false);
      },
    },
    {
      id: 'nav-hrms',
      title: 'Go to HRMS & Workforce',
      category: 'Navigation',
      icon: Users,
      shortcut: 'G H',
      action: () => {
        onNavigate('hrms');
        setCommandPaletteOpen(false);
      },
    },
    {
      id: 'nav-careers',
      title: 'Go to Careers & Recruitment',
      category: 'Navigation',
      icon: Briefcase,
      shortcut: 'G J',
      action: () => {
        onNavigate('careers');
        setCommandPaletteOpen(false);
      },
    },
    {
      id: 'nav-settings',
      title: 'Go to Settings & Preferences',
      category: 'Navigation',
      icon: Settings,
      shortcut: 'G S',
      action: () => {
        onNavigate('settings');
        setCommandPaletteOpen(false);
      },
    },
    {
      id: 'act-lead',
      title: 'Create Enterprise Lead',
      category: 'Actions',
      icon: UserPlus,
      shortcut: 'C L',
      action: () => {
        setCommandPaletteOpen(false);
        onOpenAddLead();
      },
    },
    {
      id: 'act-job',
      title: 'Post New Job Requisition',
      category: 'Actions',
      icon: PlusCircle,
      shortcut: 'P J',
      action: () => {
        setCommandPaletteOpen(false);
        onOpenPostJob();
      },
    },
    {
      id: 'act-quick',
      title: 'Open Ecosystem Quick Action Hub',
      category: 'Actions',
      icon: Sparkles,
      shortcut: 'Q A',
      action: () => {
        setCommandPaletteOpen(false);
        onOpenQuickAction();
      },
    },
    {
      id: 'theme-toggle',
      title: isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode',
      category: 'Preferences',
      icon: isDark ? Sun : Moon,
      shortcut: 'T T',
      action: () => {
        toggleTheme();
        addToast({
          type: 'info',
          title: `Theme changed to ${isDark ? 'Light' : 'Dark'} Mode`,
        });
        setCommandPaletteOpen(false);
      },
    },
  ];

  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  return (
    <AnimatePresence>
      {isCommandPaletteOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCommandPaletteOpen(false)}
            className="fixed inset-0 bg-nexus-950/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -15 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-xl glass-card bg-nexus-900/95 rounded-2xl shadow-2xl overflow-hidden border border-slate-700/60 z-10"
          >
            {/* Search Input */}
            <div className="flex items-center px-4 py-3.5 border-b border-slate-800/80 gap-3">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                autoFocus
                type="text"
                placeholder="Type a command or search modules..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 outline-none"
              />
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                ESC
              </span>
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto p-2 divide-y divide-slate-800/30">
              {filteredItems.length === 0 ? (
                <div className="p-8 text-center text-sm text-slate-500">
                  No commands matching &quot;{search}&quot;
                </div>
              ) : (
                filteredItems.map((item, idx) => {
                  const Icon = item.icon;
                  const isSelected = idx === selectedIndex;
                  return (
                    <button
                      key={item.id}
                      onClick={item.action}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all ${
                        isSelected
                          ? 'bg-brand-indigo/15 text-white border border-brand-indigo/30'
                          : 'text-slate-300 hover:bg-slate-800/50 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-1.5 rounded-lg ${
                            isSelected ? 'bg-brand-indigo text-white' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">{item.title}</div>
                          <div className="text-[11px] text-slate-500">{item.category}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.shortcut && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-400 border border-slate-700/60">
                            {item.shortcut}
                          </span>
                        )}
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-2 bg-nexus-950/60 border-t border-slate-800/80 text-[11px] text-slate-400 font-mono">
              <span className="flex items-center gap-1.5">
                <Command className="w-3 h-3 text-brand-indigo" /> Adyapan Quick Navigator
              </span>
              <div className="flex items-center gap-3">
                <span>↑↓ navigate</span>
                <span>↵ select</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
