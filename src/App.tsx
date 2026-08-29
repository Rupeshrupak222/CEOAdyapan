import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { SplashScreen } from './components/common/SplashScreen';
import { ExecutiveLayout } from './shell/ExecutiveLayout';
import { LoginPage } from './pages/LoginPage';
import { useAuthStore } from './store/useAuthStore';
import { useThemeStore } from './store/useThemeStore';

export function App() {
  const { isAuthenticated } = useAuthStore();
  const { theme, setTheme } = useThemeStore();

  const [showSplash, setShowSplash] = useState(() => {
    try {
      const isAuth = localStorage.getItem('adyapan_authenticated') === 'true';
      return !isAuth;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    setTheme(theme || 'light');
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-orange-500 selection:text-white">
      {/* Animated Splash Screen - only for first-time entry */}
      <AnimatePresence>
        {showSplash && (
          <SplashScreen onComplete={() => setShowSplash(false)} />
        )}
      </AnimatePresence>

      {/* Main Executive Workspace Experience */}
      {!showSplash && (
        <>
          {isAuthenticated ? (
            <ExecutiveLayout />
          ) : (
            <LoginPage />
          )}
        </>
      )}
    </div>
  );
}

export default App;
