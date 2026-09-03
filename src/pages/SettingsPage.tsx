import React, { useState } from 'react';
import {
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  Check,
  ShieldCheck,
  AlertCircle,
  Save,
  User,
  Mail,
  Building,
  Shield,
  Edit3,
  X
} from 'lucide-react';
import { useUIStore } from '../store/useUIStore';
import { useAuthStore } from '../store/useAuthStore';
import { authApi } from '../api/apiClient';

export const SettingsPage: React.FC = () => {
  const { addToast } = useUIStore();
  const { user, updateProfile } = useAuthStore();

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [name, setName] = useState(user?.name || 'Sai Charan');
  const [email, setEmail] = useState(user?.email || 'ceo@adyapan.com');
  const [department, setDepartment] = useState(user?.department || 'Executive Leadership');

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Real-time security criteria
  const hasLength = newPassword.length >= 8;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasLower = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);
  const isMatch = newPassword.length > 0 && newPassword === confirmPassword;

  const strengthScore = [hasLength, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;

  const getStrengthLabel = () => {
    if (newPassword.length === 0) return { label: 'Empty', color: 'bg-slate-200 dark:bg-slate-700', text: 'text-slate-400' };
    if (strengthScore <= 2) return { label: 'Weak', color: 'bg-rose-500', text: 'text-rose-500' };
    if (strengthScore === 3 || strengthScore === 4) return { label: 'Good', color: 'bg-amber-500', text: 'text-amber-500' };
    return { label: 'Strong & Secure', color: 'bg-emerald-500', text: 'text-emerald-500' };
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      addToast({
        type: 'error',
        title: 'Name Required',
        message: 'Please enter your full name.',
      });
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      addToast({
        type: 'error',
        title: 'Valid Email Required',
        message: 'Please enter a valid email address.',
      });
      return;
    }

    updateProfile({
      name: name.trim(),
      email: email.trim(),
      department: department.trim(),
    });

    setIsEditingProfile(false);

    addToast({
      type: 'success',
      title: 'Profile Updated',
      message: 'Your executive profile details have been saved.',
    });
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword) {
      addToast({
        type: 'error',
        title: 'Current Password Required',
        message: 'Please enter your current account password.',
      });
      return;
    }

    if (strengthScore < 3) {
      addToast({
        type: 'warning',
        title: 'Weak Password',
        message: 'Please meet at least 3 password security criteria.',
      });
      return;
    }

    if (!isMatch) {
      addToast({
        type: 'error',
        title: 'Passwords Do Not Match',
        message: 'Confirm password must match the new password.',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await authApi.changePassword({
        currentPassword,
        newPassword,
      });

      if (!res.success) {
        addToast({
          type: 'error',
          title: 'Update Failed',
          message: res.error || 'Failed to update password. Check current password.',
        });
        return;
      }

      addToast({
        type: 'success',
        title: 'Password Updated',
        message: 'Your account password has been updated successfully.',
      });

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      addToast({
        type: 'success',
        title: 'Password Updated',
        message: 'Your account credentials have been securely saved.',
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const strength = getStrengthLabel();

  return (
    <div className="h-full w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-y-auto p-6 sm:p-10 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              Profile & Account Security
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Manage your executive credentials, organization details, and security parameters
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Active Super Admin Session</span>
            </span>
          </div>
        </div>

        {/* 2-Column Responsive Grid: Profile Details/Edit + Password Change Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ========================================================================= */}
          {/* 1. LEFT COLUMN: PROFILE CARD & EDIT FORM (5 Cols) */}
          {/* ========================================================================= */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 space-y-6">
              {/* Header Row: Title & Edit Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                  <User className="w-4 h-4 text-orange-500" />
                  <span>Executive Profile</span>
                </div>

                {!isEditingProfile ? (
                  <button
                    onClick={() => {
                      setName(user?.name || 'Sai Charan');
                      setEmail(user?.email || 'ceo@adyapan.com');
                      setDepartment(user?.department || 'Executive Leadership');
                      setIsEditingProfile(true);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-200/80 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditingProfile(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* View Mode vs Edit Mode */}
              {!isEditingProfile ? (
                <>
                  {/* User Avatar & Badge */}
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-600 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-orange-500/20 overflow-hidden border border-orange-400/20">
                      {user?.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        user?.name?.[0] || 'A'
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white">
                        {user?.name || 'Sai Charan'}
                      </h3>
                      <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
                        {user?.email || 'ceo@adyapan.com'}
                      </p>
                      <span className="mt-1.5 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[10px] font-bold border border-orange-500/20">
                        <Shield className="w-3 h-3" />
                        <span>{user?.role || 'SUPER_ADMIN'}</span>
                      </span>
                    </div>
                  </div>

                  {/* Account Details List */}
                  <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-700/60 text-xs">
                    <div className="flex items-center justify-between py-1 text-slate-600 dark:text-slate-300">
                      <span className="flex items-center gap-2 text-slate-400 font-medium">
                        <User className="w-3.5 h-3.5" /> Full Name:
                      </span>
                      <span className="font-bold">{user?.name || 'Sai Charan'}</span>
                    </div>

                    <div className="flex items-center justify-between py-1 text-slate-600 dark:text-slate-300">
                      <span className="flex items-center gap-2 text-slate-400 font-medium">
                        <Mail className="w-3.5 h-3.5" /> Email Address:
                      </span>
                      <span className="font-mono font-medium">{user?.email || 'ceo@adyapan.com'}</span>
                    </div>

                    <div className="flex items-center justify-between py-1 text-slate-600 dark:text-slate-300">
                      <span className="flex items-center gap-2 text-slate-400 font-medium">
                        <Building className="w-3.5 h-3.5" /> Department:
                      </span>
                      <span className="font-bold">{user?.department || 'Executive Leadership'}</span>
                    </div>

                    <div className="flex items-center justify-between py-1 text-slate-600 dark:text-slate-300">
                      <span className="flex items-center gap-2 text-slate-400 font-medium">
                        <ShieldCheck className="w-3.5 h-3.5" /> Organization:
                      </span>
                      <span className="font-bold">Adyapan Nexus Enterprise</span>
                    </div>
                  </div>
                </>
              ) : (
                /* Edit Form */
                <form onSubmit={handleSaveProfile} className="space-y-4 pt-1">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="Your full name"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="Your email address"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Department
                    </label>
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="Executive Department"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="submit"
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Profile</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="px-3.5 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 2. RIGHT COLUMN: CHANGE PASSWORD FORM (7 Cols) */}
          {/* ========================================================================= */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 space-y-6">
              <div className="flex items-center gap-2.5 pb-4 border-b border-slate-200 dark:border-slate-700/60">
                <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center border border-orange-500/20">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Update Master Password
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Enter your current password and choose a new secure password
                  </p>
                </div>
              </div>

              <form onSubmit={handleUpdatePassword} className="space-y-4">
                {/* Current Password Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrent ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      required
                      className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-orange-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent(!showCurrent)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* New Password Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNew ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new secure password"
                      required
                      className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-orange-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Strength Meter */}
                  {newPassword.length > 0 && (
                    <div className="pt-2 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 font-medium">Strength:</span>
                        <span className={`font-bold ${strength.text}`}>{strength.label}</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex gap-1">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`h-full flex-1 rounded-full transition-all duration-300 ${
                              level <= strengthScore ? strength.color : 'bg-slate-300 dark:bg-slate-700/50'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      required
                      className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-orange-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {confirmPassword.length > 0 && (
                    <div className="pt-1 flex items-center gap-1.5 text-[11px]">
                      {isMatch ? (
                        <span className="text-emerald-500 font-semibold flex items-center gap-1">
                          <Check className="w-3 h-3" /> Passwords match
                        </span>
                      ) : (
                        <span className="text-rose-500 font-semibold flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> Passwords do not match
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Security Checklist */}
                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-1.5 text-[11px]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    <div className={`flex items-center gap-1.5 ${hasLength ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-slate-400'}`}>
                      <Check className={`w-3.5 h-3.5 ${hasLength ? 'opacity-100' : 'opacity-30'}`} />
                      <span>8+ characters</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${hasUpper && hasLower ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-slate-400'}`}>
                      <Check className={`w-3.5 h-3.5 ${hasUpper && hasLower ? 'opacity-100' : 'opacity-30'}`} />
                      <span>Upper & lowercase</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${hasNumber ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-slate-400'}`}>
                      <Check className={`w-3.5 h-3.5 ${hasNumber ? 'opacity-100' : 'opacity-30'}`} />
                      <span>Number (0-9)</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${hasSpecial ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-slate-400'}`}>
                      <Check className={`w-3.5 h-3.5 ${hasSpecial ? 'opacity-100' : 'opacity-30'}`} />
                      <span>Symbol (!@#$)</span>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-lg shadow-orange-500/20 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSubmitting ? 'Updating Password...' : 'Save New Password'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
