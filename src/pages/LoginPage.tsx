import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  ChevronLeft,
  ChevronRight,
  Building2,
  Users,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  Zap,
  Activity,
  Layers,
  RotateCw,
  Compass
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useUIStore } from '../store/useUIStore';
import { authApi } from '../api/apiClient';

// 6 Interactive 360-degree Carousel Cards (Cleaned — No Stats)
interface CarouselCard {
  id: string;
  category: string;
  badge: string;
  badgeIcon: any;
  badgeColor: string;
  title: string;
  subtitle: string;
  quote: string;
  image?: string;
  icon?: any;
  accentColor: string;
  gradient: string;
}

const CAROUSEL_CARDS: CarouselCard[] = [
  {
    id: 'ceo',
    category: 'Visionary Leadership',
    badge: 'CEO & FOUNDER',
    badgeIcon: Crown,
    badgeColor: 'from-amber-500 to-orange-500 text-white',
    title: 'Sai Charan',
    subtitle: 'Chief Executive Officer & Founder',
    quote:
      'Building an unyielding standard of executive speed, intelligent synergy, and institutional excellence across the Adyapan ecosystem.',
    image: '/saicharan.jpeg',
    accentColor: '#f59e0b',
    gradient: 'from-amber-500/15 via-orange-500/5 to-transparent',
  },
  {
    id: 'co-founder',
    category: 'Operations & Scale',
    badge: 'CO-FOUNDER & COO',
    badgeIcon: Award,
    badgeColor: 'from-indigo-600 to-purple-600 text-white',
    title: 'Niranjan Reddy',
    subtitle: 'CO-FOUNDER',
    quote:
      'Transforming complex multi-tiered enterprise operations into frictionless, synchronized performance and exponential global scale.',
    image: '/Niranjan.jpeg',
    accentColor: '#6366f1',
    gradient: 'from-indigo-500/15 via-purple-500/5 to-transparent',
  },
  {
    id: 'it-tech',
    category: 'Technology & Innovation',
    badge: 'HEAD OF IT & TECH',
    badgeIcon: Zap,
    badgeColor: 'from-blue-600 to-cyan-600 text-white',
    title: 'Head of IT & Technology',
    subtitle: 'Enterprise Systems & Cloud Architecture',
    quote:
      'Architecting resilient cloud ecosystems, intelligent DevOps pipelines, and high-performance digital infrastructure for Adyapan Hub.',
    image: '/Rupesh.jpeg',
    icon: Zap,
    accentColor: '#0284c7',
    gradient: 'from-blue-500/15 via-cyan-500/5 to-transparent',
  },
  {
    id: 'atl-it',
    category: 'IT Operations',
    badge: 'DEPARTMENT OF IT',
    badgeIcon: Building2,
    badgeColor: 'from-emerald-600 to-teal-600 text-white',
    title: 'ATL of IT & Technology',
    subtitle: 'IT Operations & Systems Delivery',
    quote:
      'Driving seamless technical execution, agile team coordination, and standardizing IT operational excellence across all platforms.',
    image: '/jagadeesh.jpeg',
    icon: Building2,
    accentColor: '#10b981',
    gradient: 'from-emerald-500/15 via-teal-500/5 to-transparent',
  },
  {
    id: 'hrms',
    category: 'Workforce & Talent',
    badge: "HR's of Adyapan",
    badgeIcon: Users,
    badgeColor: 'from-orange-500 to-rose-500 text-white',
    title: 'Human Resource Department',
    subtitle: 'Intelligent Talent Logistics',
        quote:
      'Cultivating a culture of high performance, organizational synergy, and dynamic talent development to drive sustainable institutional growth.',
    image: '/hr.jpeg',
    icon: Users,
    accentColor: '#f97316',
    gradient: 'from-orange-500/15 via-rose-500/5 to-transparent',
  },
  {
    id: 'tech-members',
    category: 'Engineering & Innovation',
    badge: 'TECH TEAM',
    badgeIcon: Layers,
    badgeColor: 'from-cyan-600 to-blue-700 text-white',
    title: 'Tech Department',
    subtitle: 'Core Engineering & Development Squad',
    quote:
      'Powering Adyapan Hub with full-stack innovation, reliable system scalability, and continuous deployment excellence.',
    image: '/tech.jpeg',
    icon: Layers,
    accentColor: '#06b6d4',
    gradient: 'from-cyan-500/15 via-blue-500/5 to-transparent',
  },
];

export const LoginPage: React.FC = () => {
  const { login } = useAuthStore();
  const { addToast } = useUIStore();

  const [email, setEmail] = useState('admin@adyapan.io');
  const [password, setPassword] = useState('Adyapan@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showExecutiveReveal, setShowExecutiveReveal] = useState(false);

    // 360-Degree Horizontal Rotary Engine States
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [targetAngle, setTargetAngle] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const lastWheelTime = useRef<number>(0);
  const leftContainerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);

  const CARD_COUNT = CAROUSEL_CARDS.length;
  const ANGLE_STEP = 360 / CARD_COUNT; // 60 degrees per card

  // Always start strictly with Card 1 on initial load
  useEffect(() => {
    setRotationAngle(0);
    setTargetAngle(0);
  }, []);

  // Ultra-Smooth Cinematic Lerp Physics
  useEffect(() => {
    const lerp = () => {
      setRotationAngle((prev) => {
        const diff = targetAngle - prev;
        if (Math.abs(diff) < 0.02) return targetAngle;
        return prev + diff * 0.07;
      });
      animFrameRef.current = requestAnimationFrame(lerp);
    };
    animFrameRef.current = requestAnimationFrame(lerp);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [targetAngle]);

  // Calculate current active card index
  const normalizedDegrees = ((rotationAngle % 360) + 360) % 360;
  const activeIndex = Math.round(normalizedDegrees / ANGLE_STEP) % CARD_COUNT;
  const activeCard = CAROUSEL_CARDS[activeIndex] || CAROUSEL_CARDS[0];

  // Pure User-Driven Scroll: Scroll Down -> Next Card, Scroll Up -> Previous Card
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const now = Date.now();
    // Cooldown prevents skipping multiple cards on a single mouse wheel flick
    if (now - lastWheelTime.current < 280) return;

    const delta = e.deltaY || e.deltaX;
    if (Math.abs(delta) > 10) {
      lastWheelTime.current = now;
      if (delta > 0) {
        // Scroll Down -> Next Card
        setTargetAngle((prev) => prev + ANGLE_STEP);
      } else {
        // Scroll Up -> Previous Card
        setTargetAngle((prev) => prev - ANGLE_STEP);
      }
    }
  }, [ANGLE_STEP]);

  // Touch / Mobile swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = touchStartX.current - currentX;
    const diffY = touchStartY.current - currentY;
    const mainDiff = Math.abs(diffX) > Math.abs(diffY) ? diffX : diffY;

    if (Math.abs(mainDiff) > 40) {
      if (mainDiff > 0) {
        setTargetAngle((prev) => prev + ANGLE_STEP);
      } else {
        setTargetAngle((prev) => prev - ANGLE_STEP);
      }
      touchStartX.current = currentX;
      touchStartY.current = currentY;
      setIsDragging(false);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Jump to specific card with shortest path
  const rotateToCard = (index: number) => {
    const currentNorm = ((targetAngle % 360) + 360) % 360;
    const targetNorm = index * ANGLE_STEP;
    let diff = targetNorm - currentNorm;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    setTargetAngle((prev) => prev + diff);
  };

  // Strict Executive Authentication
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
            message: `Welcome back, ${res.data?.user?.name || 'Executive'}. System synchronized and live.`,
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
    <div className="w-full min-h-screen bg-[#f8fafc] text-slate-900 selection:bg-amber-500 selection:text-white relative font-sans overflow-hidden flex flex-col lg:flex-row">

      {/* ========================================================================= */}
      {/* APPLE-GRADE STANDARD CINEMATIC EXECUTIVE REVEAL (POST-LOGIN) */}
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
            <motion.div
              initial={{ scale: 1.08, filter: 'blur(10px) brightness(1.2)' }}
              animate={{ scale: 1, filter: 'blur(0px) brightness(1)' }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <img
                src="/saicharan.jpeg"
                alt="Sai Charan - CEO"
                className="w-full h-full object-cover opacity-25 brightness-75"
              />
              <div className="absolute inset-0 bg-radial-gradient from-amber-500/20 via-slate-950/80 to-slate-950" />
            </motion.div>

            <div className="relative z-10 text-center space-y-5 max-w-lg mx-auto px-4">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.2, type: 'spring' }}
                className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-amber-400 via-orange-500 to-yellow-300 mx-auto shadow-2xl shadow-amber-500/50 flex items-center justify-center"
              >
                <div className="w-full h-full rounded-full bg-slate-950 p-3 flex items-center justify-center">
                  <img src="/logo.png" alt="Adyapan Hub" className="w-full h-full object-contain" />
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-4xl font-black text-white "
              >
                Welcome back, <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-orange-400 to-yellow-300 drop-shadow-md">
                  Executive Leadership
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
      {/* LEFT SIDE: EXPANDED 360-DEGREE HORIZONTAL CYLINDER (BIGGER CARDS & CLEAN) */}
      {/* ========================================================================= */}
      <div
        ref={leftContainerRef}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="w-full lg:w-[60%] xl:w-[62%] min-h-[620px] lg:min-h-screen relative flex flex-col justify-between p-6 sm:p-10 lg:p-12 overflow-hidden select-none bg-gradient-to-br from-slate-50 via-[#fcfdfe] to-slate-100/70"
      >
        {/* Ambient Glowing Atmospheric Backdrop */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.15, 0.25, 0.15],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/4 left-1/4 w-[45rem] h-[45rem] rounded-full bg-gradient-to-tr from-amber-400/20 via-orange-400/10 to-transparent blur-[130px]"
          />
          <div className="absolute inset-0 bg-[radial-gradient(#0f172a08_1px,transparent_1px)] [background-size:24px_24px] opacity-70" />
          <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-slate-200/30 to-transparent pointer-events-none" />
        </div>

        {/* Top Header Controls / Telemetry */}
        <div className="relative z-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-white p-1.5 flex items-center justify-center shadow-inner">
                <img src="/logo.png" alt="Adyapan" className="w-full h-full object-contain" />
              </div>
            </div>
            <div>
              <div className="font-extrabold text-slate-900 text-xl sm:text-lg  flex items-center gap-2">
                <span>ADYAPAN</span>
              </div>
              <p className="text-[11px] text-slate-700 font-medium">Enterprise Leadership & Infrastructure Experience</p>
            </div>
          </div>
        </div>

        {/* Center Horizontal 3D Carousel Arena */}
        <div
          className="relative z-10 flex-1 min-h-[420px] sm:min-h-[480px] flex items-center justify-center my-4 overflow-visible [perspective:1400px]"
          
        >
          {/* Horizontal 3D Cylindrical Cards Ring */}
          <div className="relative w-full max-w-3xl h-[380px] sm:h-[420px] flex items-center justify-center [transform-style:preserve-3d]">
            {CAROUSEL_CARDS.map((card, idx) => {
              // Horizontal 360-degree cylindrical orbital math
              const rawAngle = idx * ANGLE_STEP - rotationAngle;
              let normAngle = ((rawAngle % 360) + 360) % 360;
              if (normAngle > 180) normAngle -= 360;

              const absAngle = Math.abs(normAngle);
              const isFront = absAngle < 90;

              // Horizontal cylindrical projection coordinates
              const rad = (normAngle * Math.PI) / 180;
              const translateX = Math.sin(rad) * 440; // Wider orbit displacement
              const translateZ = Math.cos(rad) * 380 - 380; // 3D depth into space
              const rotateY = normAngle * 0.72; // Curved amphitheater yaw angle
              const scale = Math.max(0.72, 1 - absAngle / 240);
              const opacity = isFront ? Math.max(0.12, Math.pow(Math.cos(rad), 1.6)) : 0.03;
              const blur = Math.max(0, (absAngle - 25) / 14);
              const zIndex = Math.round((180 - absAngle) * 10);
              const isActiveCard = absAngle < 30;

              return (
                <div
                  key={card.id}
                  onClick={() => rotateToCard(idx)}
                  style={{
                    transform: `translate3d(${translateX}px, 0px, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                    opacity,
                    filter: `blur(${blur}px)`,
                    zIndex,
                    pointerEvents: isFront ? 'auto' : 'none',
                    transition: isDragging ? 'none' : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease',
                  }}
                  className={`absolute inset-y-0 my-auto w-[92%] sm:w-[540px] md:w-[580px] h-fit p-7 sm:p-8 rounded-[32px] bg-white/95 border backdrop-blur-2xl transition-all cursor-pointer ${isActiveCard
                    ? 'border-amber-400/90 shadow-[0_30px_70px_rgba(0,0,0,0.08),0_12px_30px_rgba(245,158,11,0.18)] ring-1 ring-amber-400/40'
                    : 'border-slate-200/80 shadow-lg hover:border-slate-300'
                    }`}
                >
                  {/* Glowing Edge Gradient */}
                  <div className={`absolute inset-0 rounded-[32px] bg-gradient-to-br ${card.gradient} pointer-events-none`} />

                  <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
                    {/* Enlarged Photo / Icon Preview Frame */}
                    <div className="w-32 h-32 sm:w-44 sm:h-44 rounded-2xl overflow-hidden shrink-0 relative bg-slate-100 border border-slate-200/90 p-1 shadow-md">
                      {card.image ? (
                        <img
                          src={card.image}
                          alt={card.title}
                          className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full rounded-xl bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center text-amber-600">
                          {React.createElement(card.icon || Building2, { className: 'w-16 h-16 text-amber-600' })}
                        </div>
                      )}
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                    </div>

                    {/* Card Body Details (Cleaned — No Stats) */}
                    <div className="flex-1 space-y-2.5 text-left w-full">
                      {/* Badge & Counter */}
                      <div className="flex items-center justify-between gap-2">
                        <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase bg-gradient-to-r ${card.badgeColor} shadow-xs`}>
                          {React.createElement(card.badgeIcon || Sparkles, { className: 'w-3.5 h-3.5' })}
                          <span>{card.badge}</span>
                        </span>
                        <span className="text-xs text-slate-400 font-bold">
                          0{idx + 1} / 06
                        </span>
                      </div>

                      {/* Title & Subtitle */}
                      <div className="space-y-0.5 pt-1">
                        <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                          {card.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-amber-600 font-bold tracking-wide uppercase">
                          {card.subtitle}
                        </p>
                      </div>

                      {/* Prominent Quote / Summary */}
                      <p className="text-sm sm:text-base text-slate-600 italic leading-relaxed font-medium pt-1">
                        "{card.quote}"
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Premium Subtle Divider Line on Desktop (Right Edge of Left Container) */}
        <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 h-[75%] w-[1px] bg-gradient-to-b from-transparent via-slate-300 to-transparent pointer-events-none z-30" />
      </div>

      {/* ========================================================================= */}
      {/* RIGHT SIDE: PINNED LUXURY EXECUTIVE LOGIN CONSOLE (LIGHT THEME) */}
      {/* ========================================================================= */}
      <div className="w-full lg:w-[40%] xl:w-[38%] min-h-screen relative flex items-center justify-center p-6 sm:p-10 lg:p-12 z-20 bg-white/95 lg:bg-white/90 backdrop-blur-3xl overflow-y-auto shadow-[-20px_0_50px_rgba(0,0,0,0.02)]">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
          <div className="w-96 h-96 rounded-full bg-gradient-to-tr from-amber-400/10 via-orange-400/10 to-transparent blur-[100px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-md space-y-6 py-6"
        >
          {/* Brand Header */}
          <div className="text-center space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100/80 border border-amber-300/80 text-amber-800 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Executive Command Portal</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight pt-1">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700">Adyapan Hub</span>
            </h2>

            <p className="text-xs text-slate-500 font-medium">
              Enter your authorized executive credentials to access the central management plane
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSignIn} className="space-y-4 text-xs">
            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-800 flex items-center justify-between">
                <span>Email</span>

              </label>
              <div className="relative group">
                <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-amber-600 transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@adyapan.io"
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-xs outline-none focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/15 transition-all shadow-xs"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-800">Password </label>
                <button
                  type="button"
                  onClick={() =>
                    addToast({
                      type: 'info',
                      title: 'Reset Link Dispatched',
                      message: `Executive recovery instructions sent to ${email}`,
                    })
                  }
                  className="text-xs text-amber-600 hover:text-amber-700 font-bold transition-colors cursor-pointer"
                >
                  Forgot key?
                </button>
              </div>
              <div className="relative group">
                <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-amber-600 transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter security key"
                  className="w-full pl-11 pr-11 py-3.5 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-xs outline-none focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/15 transition-all shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-600 p-1 cursor-pointer transition-colors"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Session Persistence */}
            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center gap-2.5 cursor-pointer select-none text-xs text-slate-600 font-medium">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 bg-white text-amber-600 focus:ring-0 cursor-pointer accent-amber-500"
                />
                <span>Maintain session persistence (30 days)</span>
              </label>
            </div>

            {/* Submit Action */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-black text-sm shadow-xl shadow-amber-500/30 transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 mt-4 cursor-pointer"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Executive Clearance...</span>
                </div>
              ) : (
                <>
                  <span>Launch Control panel</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>

    </div>
  );
};
