import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Flame, Star, Rocket } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

const titleLetters = ['A', 'D', 'Y', 'A', 'P', 'A', 'N'];
const hubLetters = ['H', 'U', 'B'];

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const confettiTimer = setTimeout(() => {
      confetti({
        particleCount: 45,
        angle: 60,
        spread: 60,
        origin: { x: 0.15, y: 0.55 },
        colors: ['#F59E0B', '#EF4444', '#6366F1', '#8B5CF6', '#10B981', '#FBBF24'],
      });
      confetti({
        particleCount: 45,
        angle: 120,
        spread: 60,
        origin: { x: 0.85, y: 0.55 },
        colors: ['#F59E0B', '#EF4444', '#6366F1', '#8B5CF6', '#10B981', '#FBBF24'],
      });
      confetti({
        particleCount: 65,
        spread: 85,
        origin: { x: 0.5, y: 0.4 },
        colors: ['#FFD700', '#FF8C00', '#FF4500', '#6366F1', '#EC4899'],
      });
    }, 400);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(onComplete, 450);
          return 100;
        }
        return prev + 1;
      });
    }, 25);

    return () => {
      clearTimeout(confettiTimer);
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 sm:p-8 md:p-12 bg-gradient-to-br from-amber-500/10 via-white to-orange-500/10 text-slate-900 overflow-hidden select-none"
    >
      {/* Ambient Glow Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.35, 0.55, 0.35],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[32rem] sm:w-[42rem] h-[32rem] sm:h-[42rem] rounded-full bg-gradient-to-tr from-amber-400/30 via-orange-400/20 to-yellow-200/30 blur-[100px] sm:blur-[120px]"
        />
        <div className="absolute inset-0 grid-pattern-light opacity-50" />
      </div>

      {/* Centerpiece: Clean 3D Logo with Glowing Circular Auras + Spaced 3D Letters */}
      <div className="relative z-10 flex flex-col items-center max-w-3xl w-full text-center my-auto py-4">
        
        {/* LOGO with Circular Glowing Auras */}
        <div className="relative mb-6 sm:mb-8 md:mb-10 flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute w-32 h-32 sm:w-44 sm:h-44 md:w-56 md:h-56 rounded-full bg-gradient-to-tr from-amber-400/40 to-orange-400/30 blur-2xl pointer-events-none"
          />

          <motion.div
            animate={{ scale: [1.2, 0.9, 1.2], opacity: [0.2, 0.45, 0.2] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            className="absolute w-44 h-44 sm:w-56 sm:h-56 md:w-72 md:h-72 rounded-full bg-gradient-to-br from-yellow-300/30 via-amber-300/20 to-transparent blur-3xl pointer-events-none"
          />

          {/* Main 3D Glossy Logo */}
          <motion.div
            initial={{ scale: 0, rotate: -180, y: 40 }}
            animate={{ scale: 1, rotate: 0, y: 0 }}
            transition={{
              type: 'spring',
              stiffness: 280,
              damping: 18,
              mass: 0.8,
            }}
            className="relative z-10"
          >
            <motion.div
              animate={{
                y: [-5, 5, -5],
                rotateZ: [-1.5, 1.5, -1.5],
              }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-24 h-24 sm:w-36 sm:h-36 md:w-44 md:h-44 flex items-center justify-center"
            >
              <img
                src="/logo.png"
                alt="Adyapan Hub Official Logo"
                className="w-full h-full object-contain drop-shadow-2xl"
              />
            </motion.div>
          </motion.div>
        </div>

        {/* KINETIC 3D PAPERCRAFT LETTERS: "ADYAPAN HUB" (Mobile Protected Word Layout) */}
        <div className="flex flex-wrap items-center justify-center gap-y-2.5 gap-x-2 sm:gap-x-4 mb-4 sm:mb-6 px-1 max-w-full">
          {/* Word 1: ADYAPAN */}
          <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 shrink-0">
            {titleLetters.map((letter, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 35, rotateX: 90, scale: 0.3 }}
                animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 350,
                  damping: 15,
                  delay: 0.2 + index * 0.05,
                }}
                whileHover={{
                  scale: 1.15,
                  rotate: index % 2 === 0 ? 6 : -6,
                  transition: { duration: 0.2 },
                }}
                className="relative group cursor-pointer"
              >
                {/* Shadow backing */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-700 to-orange-800 rounded-lg sm:rounded-2xl transform translate-y-1 translate-x-0.5 sm:translate-y-1.5 sm:translate-x-1 opacity-80" />
                
                {/* Main Card */}
                <div className="relative w-7 h-10 min-[380px]:w-8 min-[380px]:h-11 sm:w-11 sm:h-14 md:w-14 md:h-18 rounded-lg sm:rounded-2xl bg-gradient-to-b from-white via-amber-50 to-orange-100 border sm:border-2 border-amber-300 shadow-md sm:shadow-lg flex items-center justify-center overflow-hidden">
                  <span className="text-base min-[380px]:text-lg sm:text-2xl md:text-4xl font-black font-sans bg-clip-text text-transparent bg-gradient-to-b from-amber-700 via-orange-600 to-amber-900 drop-shadow-sm">
                    {letter}
                  </span>
                  <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/40 pointer-events-none" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Word 2: HUB */}
          <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 shrink-0">
            {hubLetters.map((letter, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 35, rotateX: -90, scale: 0.3 }}
                animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 380,
                  damping: 14,
                  delay: 0.6 + index * 0.06,
                }}
                whileHover={{
                  scale: 1.2,
                  rotate: index % 2 === 0 ? -8 : 8,
                  transition: { duration: 0.2 },
                }}
                className="relative group cursor-pointer"
              >
                <div className="absolute inset-0 bg-orange-900 rounded-lg sm:rounded-2xl transform translate-y-1 translate-x-0.5 sm:translate-y-1.5 sm:translate-x-1 opacity-90" />
                
                <div className="relative w-7 h-10 min-[380px]:w-8 min-[380px]:h-11 sm:w-11 sm:h-14 md:w-14 md:h-18 rounded-lg sm:rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 border sm:border-2 border-amber-300 shadow-lg sm:shadow-xl flex items-center justify-center overflow-hidden">
                  <span className="text-base min-[380px]:text-lg sm:text-2xl md:text-4xl font-black font-sans text-white drop-shadow-md">
                    {letter}
                  </span>
                  <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/30 pointer-events-none" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* VIBRANT ANIMATED SLOGAN BADGE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            type: 'spring',
            stiffness: 280,
            damping: 18,
            delay: 0.85,
          }}
          className="mb-6 sm:mb-8"
        >
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-black text-xs sm:text-sm md:text-base tracking-wide shadow-xl shadow-amber-500/30 border border-amber-200 transform hover:scale-105 transition-all">
            <Flame className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-300 text-yellow-200 animate-bounce" />
            <span className="uppercase tracking-wider">Welcome to Adyapan Hub</span>
            <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-yellow-300 text-yellow-200" />
          </div>
        </motion.div>

        {/* High-Precision Progress Bar */}
        <div className="w-full max-w-xs sm:max-w-sm space-y-2 px-2">
          <div className="w-full h-2 sm:h-2.5 bg-slate-200/90 rounded-full overflow-hidden p-0.5 border border-amber-300 shadow-inner">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 rounded-full shadow-md"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut' }}
            />
          </div>

          <div className="flex justify-between items-center text-[11px] sm:text-xs font-mono font-bold text-slate-700">
            <span className="flex items-center gap-1">
              <Rocket className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-orange-500 animate-pulse" />
              <span>Initializing Hub...</span>
            </span>
            <span className="text-amber-800 text-xs sm:text-sm font-black">{progress}%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
