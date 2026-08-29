import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Crown,
  Award,
  ChevronDown,
  Building2,
  Users,
  GraduationCap,
  Briefcase
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useUIStore } from '../store/useUIStore';
import { authApi } from '../api/apiClient';

export const LoginPage: React.FC = () => {
  const { login } = useAuthStore();
  const { addToast } = useUIStore();

  const [email, setEmail] = useState('admin@adyapan.io');
  const [password, setPassword] = useState('Adyapan@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showExecutiveReveal, setShowExecutiveReveal] = useState(false);

  // Strict Executive Authentication (Validates against Backend & Blocks Unauthorized Users)
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      addToast({
        type: 'error',
        title: 'Invalid Email Format',
        message: 'Please enter a valid corporate executive email address.',
      });
      return;
    }

    if (!password || password.trim().length < 3) {
      addToast({
        type: 'error',
        title: 'Password Required',
        message: 'Please enter your executive security credential.',
      });
      return;
    }

    setIsLoading(true);

    try {
      const res = await authApi.login({ email: email.trim(), password: password.trim() });

      if (res.success && res.data && (res.data.accessToken || res.data.user)) {
        if (res.data.accessToken) {
          localStorage.setItem('adyapan_access_token', res.data.accessToken);
          localStorage.setItem('adyapan_refresh_token', res.data.refreshToken || '');
        }

        setShowExecutiveReveal(true);

        setTimeout(() => {
          login(res.data?.user);
          setIsLoading(false);
          addToast({
            type: 'success',
            title: 'Executive Clearance Verified',
            message: `Welcome back, ${res.data?.user?.name || 'CEO'}. System synchronized and live.`,
          });
        }, 2200);
      } else {
        setIsLoading(false);
        setShowExecutiveReveal(false);
        addToast({
          type: 'error',
          title: 'Authentication Denied',
          message: res.error || 'Invalid credentials or Backend Server is unreachable.',
        });
      }
    } catch (err: any) {
      setIsLoading(false);
      setShowExecutiveReveal(false);
      addToast({
        type: 'error',
        title: 'Access Denied',
        message: err?.message || 'Unauthorized executive credentials.',
      });
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#050608] text-slate-100 selection:bg-amber-500 selection:text-white relative font-sans overflow-x-hidden">

      {/* ========================================================================= */}
      {/* APPLE-GRADE STANDARD CINEMATIC EXECUTIVE REVEAL (BLUR-TO-FOCUS + RIPPLES) */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showExecutiveReveal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 overflow-hidden select-none p-4"
          >
            {/* Cinematic Camera Slow Zoom & Blur-to-Focus on /saicharan.jpeg */}
            <motion.div
              initial={{ scale: 1.08, filter: 'blur(10px) brightness(1.2)' }}
              animate={{ scale: 1, filter: 'blur(0px) brightness(1)' }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <img
                src="/saicharan.jpeg"
                alt="Sai Charan"
                className="w-full h-full object-cover opacity-100 contrast-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-black/35 pointer-events-none" />
              <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/20 to-black/60 pointer-events-none" />
            </motion.div>

            {/* Expanding Concentric Golden Aura Ripples */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.6, opacity: 0.8 }}
                animate={{ scale: [0.6, 2.2], opacity: [0.6, 0] }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  delay: i * 1.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="absolute w-80 h-80 rounded-full border border-amber-400/40 pointer-events-none"
              />
            ))}

            {/* Deep Volumetric Ambient Halo */}
            <motion.div
              animate={{
                scale: [1, 1.25, 1],
                opacity: [0.35, 0.65, 0.35],
              }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute w-[45rem] h-[45rem] rounded-full bg-gradient-to-tr from-amber-500/30 via-orange-500/20 to-yellow-400/20 blur-[130px] pointer-events-none"
            />

            {/* CENTER EXECUTIVE CONTENT */}
            <div className="relative z-30 text-center flex flex-col items-center max-w-2xl px-6">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, delay: 0.2, type: 'spring', stiffness: 240, damping: 18 }}
                className="relative mb-6"
              >
                <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-yellow-300 blur-lg opacity-75 animate-pulse" />
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-tr from-amber-400 via-orange-500 to-yellow-300 p-1 shadow-2xl flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-white p-2 flex items-center justify-center shadow-inner">
                    <img
                      src="/logo.png"
                      alt="Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl sm:text-6xl font-black text-white tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)] mb-3 sm:mb-4"
              >
                Welcome back, <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-orange-400 to-yellow-300 drop-shadow-md">
                  CEO
                </span>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-black/60 border border-amber-400/60 backdrop-blur-2xl text-amber-300 font-bold text-xs sm:text-sm tracking-wide shadow-2xl"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Initializing Adyapan Hub Control Plane...</span>
                <Sparkles className="w-4 h-4 text-yellow-300" />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 1. FIRST SECTION: LOGIN CONSOLE (ON SCREEN LOAD) */}
      {/* ========================================================================= */}
      <section className="relative min-h-screen flex flex-col items-center justify-center p-6 sm:p-12 overflow-hidden">
        {/* Ambient Glowing Aura Background */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.25, 0.45, 0.25] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            className="w-[32rem] sm:w-[45rem] h-[32rem] sm:h-[45rem] rounded-full bg-gradient-to-tr from-amber-500/20 via-orange-500/15 to-transparent blur-[130px]"
          />
          <div className="absolute inset-0 bg-[radial-gradient(#f59e0b12_1px,transparent_1px)] [background-size:32px_32px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-md p-8 sm:p-10 rounded-[36px] bg-[#0c0e14]/90 border border-white/15 shadow-[0_30px_90px_rgba(0,0,0,0.9),0_0_50px_rgba(245,158,11,0.15)] backdrop-blur-3xl"
        >
          {/* Brand Logo & Headline */}
          <div className="flex flex-col items-center text-center space-y-3 mb-8">
            <motion.div
              whileHover={{ scale: 1.08, rotate: 4 }}
              className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-amber-400 via-orange-500 to-yellow-300 shadow-xl shadow-amber-500/30 flex items-center justify-center cursor-pointer"
            >
              <div className="w-full h-full rounded-full bg-slate-950 p-2.5 flex items-center justify-center">
                <img src="/logo.png" alt="Adyapan Hub" className="w-full h-full object-contain" />
              </div>
            </motion.div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-bold font-mono uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Executive Command Portal</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight pt-1">
                Sign in to <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300">Adyapan Hub</span>
              </h1>
              <p className="text-xs text-slate-400 font-medium">
                Enter your authorized credentials to launch the executive control plane
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSignIn} className="space-y-4 text-xs">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Executive Email</label>
              <div className="relative group">
                <Mail className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-amber-400 transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@adyapan.io"
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs outline-none focus:border-amber-500/80 focus:bg-white/10 focus:ring-4 focus:ring-amber-500/20 transition-all font-mono shadow-inner"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-300">Password / Access Key</label>
                <button
                  type="button"
                  onClick={() => addToast({ type: 'info', title: 'Reset Link Sent', message: `Password reset dispatched to ${email}` })}
                  className="text-xs text-amber-400 hover:text-amber-300 font-bold transition-colors cursor-pointer"
                >
                  Forgot key?
                </button>
              </div>
              <div className="relative group">
                <Lock className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-amber-400 transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter security key"
                  className="w-full pl-11 pr-11 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs outline-none focus:border-amber-500/80 focus:bg-white/10 focus:ring-4 focus:ring-amber-500/20 transition-all font-mono shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-400 p-1 cursor-pointer transition-colors"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2.5 pt-0.5">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-white/5 text-amber-500 focus:ring-0 cursor-pointer accent-amber-500"
              />
              <label htmlFor="remember" className="text-slate-400 cursor-pointer select-none text-xs font-medium">
                Keep session active for 30 days
              </label>
            </div>

            {/* Submit Action Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-black text-sm shadow-xl shadow-amber-500/30 transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 mt-4 cursor-pointer"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Scroll Down Prompt */}
          <div className="mt-8 pt-4 border-t border-white/10 flex flex-col items-center gap-1.5 text-center">
            <span className="text-[11px] font-mono text-slate-400 font-medium">
              Scroll down to explore Adyapan & Leadership
            </span>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ChevronDown className="w-4 h-4 text-amber-400" />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ========================================================================= */}
      {/* 2. SECOND SECTION: ADYAPAN ECOSYSTEM OVERVIEW */}
      {/* ========================================================================= */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center p-6 sm:p-12 lg:p-20 border-t border-white/10 bg-gradient-to-b from-transparent via-amber-950/10 to-transparent">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 flex flex-col items-center max-w-5xl mx-auto space-y-8"
        >
          {/* Main 3D Brand Core Logo */}
          <div className="relative flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.25, 0.5, 0.25] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute w-44 h-44 sm:w-64 sm:h-64 rounded-full bg-gradient-to-tr from-amber-500/40 to-orange-500/30 blur-3xl pointer-events-none"
            />
            <motion.div
              animate={{ y: [-6, 6, -6] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="w-28 h-28 sm:w-40 sm:h-40 md:w-48 md:h-48 flex items-center justify-center drop-shadow-[0_20px_50px_rgba(245,158,11,0.4)]"
            >
              <img src="/logo.png" alt="Adyapan Hub" className="w-full h-full object-contain" />
            </motion.div>
          </div>

          {/* Slogan & Title */}
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold font-mono tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>The Unified Enterprise Platform</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              Adyapan Hub
            </h2>

            <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed max-w-2xl mx-auto">
              The next-generation executive ecosystem uniting Sales CRM, LMS Academy, HRMS Workforce, and Global Careers in a single pane of glass.
            </p>
          </div>

          {/* 4 Core Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full pt-4">
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-left space-y-2">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm">Enterprise CRM</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Real-time deals telemetry, conversion pipelines, and institutional partnership tracking.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-left space-y-2">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm">LMS Academy</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Curriculum delivery, student cohort progress, learning analytics, and course metrics.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-left space-y-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm">HRMS Workforce</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Biometric attendance, specialist domain matrix, payroll reconciliations, and leaves.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-left space-y-2">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm">Global Careers</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                AI/ATS applicant scoring, interview pipelines, requisition trackers, and hiring telemetry.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ========================================================================= */}
      {/* 3. THIRD SECTION: CEO SAI CHARAN (IMAGE saicharan.jpeg + VISION) */}
      {/* ========================================================================= */}
      <section className="relative min-h-screen flex flex-col items-center justify-center p-6 sm:p-12 lg:p-20 border-t border-white/5">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-5xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14"
        >
          {/* Left: CEO Photo Frame (/saicharan.jpeg) */}
          <div className="w-full lg:w-1/2 max-w-md relative shrink-0">
            <div className="w-full aspect-[4/3] sm:aspect-square rounded-3xl p-3 bg-gradient-to-b from-amber-500/20 via-white/5 to-transparent border border-amber-500/30 shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl relative group">
              <div className="w-full h-full rounded-2xl overflow-hidden bg-slate-950 relative">
                <img
                  src="/saicharan.jpeg"
                  alt="Chief Executive Officer - Sai Charan"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-100 brightness-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs">
                  <span className="font-black text-white tracking-wide text-sm">Sai Charan</span>
                  <span className="text-[10px] font-mono text-amber-400 font-bold px-2.5 py-0.5 rounded-full bg-black/70 border border-amber-500/40">
                    CEO & FOUNDER
                  </span>
                </div>
              </div>
            </div>

            {/* Prominent Floating Satellite Badge */}
            <motion.div
              animate={{ y: [-4, 4, -4] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-3.5 right-4 z-20 px-3.5 py-1.5 rounded-2xl bg-amber-500 text-slate-950 font-black text-xs font-mono uppercase shadow-xl border border-amber-300 flex items-center gap-1.5"
            >
              <Crown className="w-4 h-4 text-slate-950" />
              <span>Visionary Leadership</span>
            </motion.div>
          </div>

          {/* Right: CEO Vision & Details */}
          <div className="w-full lg:w-1/2 space-y-4 text-left">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold font-mono">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>CHIEF EXECUTIVE OFFICER & FOUNDER</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Sai Charan
            </h2>

            <p className="text-base sm:text-lg font-semibold text-amber-400/90 leading-snug">
              "Building an unyielding standard of executive speed, intelligent synergy, and institutional excellence."
            </p>

            <p className="text-sm text-slate-400 leading-relaxed">
              Leading the architectural vision and strategic horizon of Adyapan Hub. Overseeing the synthesis of core operational engines into a unified ecosystem built for exponential scalability.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <div className="text-xs text-slate-400 font-medium">Strategic Focus</div>
                <div className="text-sm font-bold text-white mt-0.5">Ecosystem Strategy</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <div className="text-xs text-slate-400 font-medium">Leadership</div>
                <div className="text-sm font-bold text-amber-400 mt-0.5">Executive Vision</div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ========================================================================= */}
      {/* 4. FOURTH SECTION: CO-FOUNDER (IMAGE cofounder.jpg + LEADERSHIP) */}
      {/* ========================================================================= */}
      <section className="relative min-h-screen flex flex-col items-center justify-center p-6 sm:p-12 lg:p-20 border-t border-white/5">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-5xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14"
        >
          {/* Left: Co-Founder Photo Frame (/cofounder.jpg) */}
          <div className="w-full lg:w-1/2 max-w-md relative shrink-0">
            <div className="w-full aspect-[4/3] sm:aspect-square rounded-3xl p-3 bg-gradient-to-b from-indigo-500/20 via-white/5 to-transparent border border-indigo-500/30 shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl relative group">
              <div className="w-full h-full rounded-2xl overflow-hidden bg-slate-950 relative">
                <img
                  src="/cofounder.jpg"
                  alt="Co-Founder & Chief Operations Officer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-100 brightness-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs">
                  <span className="font-black text-white tracking-wide text-sm">Co-Founder</span>
                  <span className="text-[10px] font-mono text-indigo-400 font-bold px-2.5 py-0.5 rounded-full bg-black/70 border border-indigo-500/40">
                    CO-FOUNDER & COO
                  </span>
                </div>
              </div>
            </div>

            {/* Prominent Floating Satellite Badge */}
            <motion.div
              animate={{ y: [4, -4, 4] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-3.5 right-4 z-20 px-3.5 py-1.5 rounded-2xl bg-indigo-500 text-white font-black text-xs font-mono uppercase shadow-xl border border-indigo-300 flex items-center gap-1.5"
            >
              <Award className="w-4 h-4 text-white" />
              <span>Scale & Architecture</span>
            </motion.div>
          </div>

          {/* Right: Co-Founder Details */}
          <div className="w-full lg:w-1/2 space-y-4 text-left">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold font-mono">
              <Award className="w-3.5 h-3.5 text-indigo-400" />
              <span>CO-FOUNDER & CHIEF OPERATIONS OFFICER</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Leadership & Operations
            </h2>

            <p className="text-base sm:text-lg font-semibold text-indigo-400/90 leading-snug">
              "Transforming complex multi-tiered enterprise operations into frictionless, synchronized performance."
            </p>

            <p className="text-sm text-slate-400 leading-relaxed">
              Directing global execution, technical infrastructure deployment, and cross-functional operations across LMS Academy cohorts, HRMS workforce pipelines, and institutional partnerships.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <div className="text-xs text-slate-400 font-medium">Domain</div>
                <div className="text-sm font-bold text-white mt-0.5">Scale & Execution</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <div className="text-xs text-slate-400 font-medium">Operations</div>
                <div className="text-sm font-bold text-indigo-400 mt-0.5">99.99% Reliability</div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};
