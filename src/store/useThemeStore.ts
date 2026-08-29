import { create } from 'zustand';

export type ThemeMode = 'light' | 'dark' | 'system';
export type AccentColor = 'indigo' | 'purple' | 'cyan' | 'emerald' | 'amber' | 'rose';
export type InterfaceDensity = 'comfortable' | 'compact';

interface ThemeState {
  theme: ThemeMode;
  accent: AccentColor;
  density: InterfaceDensity;
  isDark: boolean;
  setTheme: (theme: ThemeMode) => void;
  setAccent: (accent: AccentColor) => void;
  setDensity: (density: InterfaceDensity) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: 'light',
  accent: 'indigo',
  density: 'comfortable',
  isDark: false,
  setTheme: (theme) => {
    let isDark = false;
    if (theme === 'dark') isDark = true;
    else if (theme === 'light') isDark = false;
    else if (theme === 'system') {
      isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
    
    set({ theme, isDark });
  },
  setAccent: (accent) => {
    set({ accent });
  },
  setDensity: (density) => {
    set({ density });
  },
  toggleTheme: () => {
    const current = get().isDark;
    get().setTheme(current ? 'light' : 'dark');
  }
}));
