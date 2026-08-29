import { create } from 'zustand';
import { UserProfile } from '../types';

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (userData?: Partial<UserProfile>) => void;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const defaultCEOUser: UserProfile = {
  id: 'usr-adyapan-ceo',
  name: 'Sai Charan',
  email: 'ceo@adyapan.io',
  role: 'CEO',
  avatar: '/saicharan.jpeg',
  organization: 'Adyapan Hub Ecosystems',
  department: 'Executive Leadership',
  timezone: 'Asia/Kolkata (GMT+5:30)',
  twoFactorEnabled: true,
};

const getInitialAuthState = (): { isAuthenticated: boolean; user: UserProfile | null } => {
  try {
    const isAuth = localStorage.getItem('adyapan_authenticated') === 'true';
    if (isAuth) {
      const savedUser = localStorage.getItem('adyapan_user');
      return {
        isAuthenticated: true,
        user: savedUser ? JSON.parse(savedUser) : defaultCEOUser,
      };
    }
  } catch (e) {
    // ignore storage error
  }
  return { isAuthenticated: false, user: null };
};

const initialAuth = getInitialAuthState();

export const useAuthStore = create<AuthState>((set) => ({
  user: initialAuth.user,
  isAuthenticated: initialAuth.isAuthenticated,
  login: (userData) => {
    const fullUser: UserProfile = userData ? { ...defaultCEOUser, ...userData } : defaultCEOUser;
    localStorage.setItem('adyapan_authenticated', 'true');
    localStorage.setItem('adyapan_user', JSON.stringify(fullUser));
    set({
      user: fullUser,
      isAuthenticated: true,
    });
  },
  logout: () => {
    localStorage.removeItem('adyapan_authenticated');
    localStorage.removeItem('adyapan_user');
    localStorage.removeItem('adyapan_access_token');
    localStorage.removeItem('adyapan_refresh_token');
    localStorage.removeItem('adyapan_active_module');
    set({
      user: null,
      isAuthenticated: false,
    });
  },
  updateProfile: (updates) => {
    set((state) => {
      const updated = state.user ? { ...state.user, ...updates } : null;
      if (updated) {
        localStorage.setItem('adyapan_user', JSON.stringify(updated));
      }
      return { user: updated };
    });
  },
}));
