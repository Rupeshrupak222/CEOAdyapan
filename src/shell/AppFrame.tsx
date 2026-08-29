import React, { useState, useEffect, useRef } from 'react';
import {
  RefreshCw,
  Maximize2,
  Minimize2,
  ExternalLink,
  Lock,
  AppWindow,
  KeyRound,
  Check,
  Copy
} from 'lucide-react';
import { AppConfig } from '../config/apps';
import { useWorkspaceStore } from '../store/useWorkspaceStore';

interface AppFrameProps {
  app: AppConfig;
}

export const AppFrame: React.FC<AppFrameProps> = ({ app }) => {
  const {
    isFullscreen,
    toggleFullscreen,
    refreshKey,
    reloadApp,
    setFrameStatus,
  } = useWorkspaceStore();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const currentKey = refreshKey[app.id] || 1;

  useEffect(() => {
    setIsLoading(true);
    setFrameStatus(app.id, 'loading');
  }, [app.id, currentKey]);

  const handleFrameLoad = () => {
    setIsLoading(false);
    setFrameStatus(app.id, 'loaded');

    // Prevent logo or home click from breaking out or causing recursive shells
    try {
      const iframeDoc = iframeRef.current?.contentDocument || iframeRef.current?.contentWindow?.document;
      if (iframeDoc) {
        iframeDoc.addEventListener(
          'click',
          (e: MouseEvent) => {
            const anchor = (e.target as HTMLElement)?.closest('a');
            if (anchor) {
              const href = anchor.getAttribute('href');
              if (href === '/' || href === '/#home' || href === '') {
                e.preventDefault();
                e.stopPropagation();
              }
            }
          },
          true
        );
      }
    } catch {
      // Safe fallback
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const openAppWindow = () => {
    const width = 1440;
    const height = 920;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    window.open(
      app.externalUrl,
      `_adyapan_${app.id}`,
      `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes,status=yes`
    );
  };

  return (
    <div className={`flex flex-col w-full bg-slate-950 overflow-hidden relative transition-all duration-300 ${
      isFullscreen
        ? 'fixed inset-0 z-[99999] w-screen h-screen m-0 p-0 rounded-none border-none'
        : 'h-full rounded-xl sm:rounded-2xl border border-slate-800 shadow-2xl'
    }`}>
      {/* ========================================================================= */}
      {/* 1. TOP UTILITY APP TOOLBAR (Responsive across mobile & desktop) */}
      {/* ========================================================================= */}
      <div className="min-h-12 py-1.5 px-2.5 sm:px-4 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 shrink-0 select-none z-30">
        {/* Left: App Identity & Address Badge */}
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-800 border border-slate-700/60 text-xs font-mono text-slate-300">
            <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
            <span className="truncate max-w-[100px] sm:max-w-[180px] md:max-w-[240px] font-medium text-[11px] text-slate-400">
              {app.externalUrl}
            </span>
          </div>

          <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live App
          </span>
        </div>

        {/* Center: Executive 1-Click Copy Chips */}
        {app.credentials && (
          <div className="flex items-center gap-1 sm:gap-1.5 bg-slate-950/90 px-2 sm:px-3 py-1 rounded-xl border border-slate-800 text-[11px] font-mono shadow-inner">
            <KeyRound className="w-3 h-3 text-orange-400 shrink-0" />
            
            {/* Copy Email / Username Button */}
            <button
              onClick={() => copyToClipboard(app.credentials.email, 'email')}
              title="Click to copy ID/Email"
              className={`flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-lg font-bold transition-all cursor-pointer ${
                copiedField === 'email'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span className="truncate max-w-[90px] sm:max-w-[140px] md:max-w-[180px]">{app.credentials.email}</span>
              {copiedField === 'email' ? <Check className="w-3 h-3 text-emerald-400 shrink-0" /> : <Copy className="w-3 h-3 text-slate-400 shrink-0" />}
            </button>

            <span className="text-slate-600 font-bold">•</span>

            {/* Copy Password Button */}
            <button
              onClick={() => copyToClipboard(app.credentials.password, 'password')}
              title="Click to copy Password"
              className={`flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-lg font-bold transition-all cursor-pointer ${
                copiedField === 'password'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>{copiedField === 'password' ? 'Copied!' : '••••••••'}</span>
              {copiedField === 'password' ? <Check className="w-3 h-3 text-emerald-400 shrink-0" /> : <Copy className="w-3 h-3 text-slate-400 shrink-0" />}
            </button>
          </div>
        )}

        {/* Right: Frame Controls */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Reload Frame Button */}
          <button
            onClick={() => reloadApp(app.id)}
            title="Reload Application Frame"
            className="p-1.5 sm:p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-orange-400' : ''}`} />
          </button>

          {/* Standalone Window Option */}
          <button
            onClick={openAppWindow}
            title="Open in Dedicated Popout Window"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold transition-all cursor-pointer"
          >
            <AppWindow className="w-3.5 h-3.5 text-orange-400" />
            <span className="hidden xl:inline">Popout Window</span>
          </button>

          {/* Open Dedicated Tab */}
          <a
            href={app.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Launch in Dedicated Browser Tab"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Open Tab</span>
          </a>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            className="p-1.5 sm:p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer"
          >
            {isFullscreen ? (
              <Minimize2 className="w-3.5 h-3.5 text-orange-400" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. IFRAME VIEWPORT (100% Mobile & Desktop Expansion) */}
      {/* ========================================================================= */}
      <div className="relative flex-1 w-full min-h-0 bg-slate-900 overflow-hidden">
        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 sm:p-6 text-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-700 border border-slate-700 flex items-center justify-center shadow-xl mb-3 sm:mb-4 relative">
              <RefreshCw className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500 animate-spin" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-950" />
            </div>

            <h3 className="text-sm sm:text-base font-bold text-white mb-1">
              Connecting to {app.name}...
            </h3>
            <p className="text-xs text-slate-400 max-w-xs sm:max-w-sm">
              Establishing live session with {app.externalUrl}
            </p>
          </div>
        )}

        {/* Native Iframe */}
        <iframe
          key={`${app.id}-${currentKey}`}
          ref={iframeRef}
          src={app.url}
          title={app.name}
          onLoad={handleFrameLoad}
          className="w-full h-full border-0 bg-white block"
          allow="camera; microphone; geolocation; clipboard-read; clipboard-write; fullscreen; encrypted-media; display-capture; web-share"
        />
      </div>
    </div>
  );
};
