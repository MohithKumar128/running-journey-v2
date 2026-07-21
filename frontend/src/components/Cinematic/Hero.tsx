import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Timer, Zap, TrendingUp, ArrowUpRight } from 'lucide-react';
import { API_URL } from '../../data/statsProvider';
import type { Stats } from '../../data/types';

const InstagramIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

interface HeroProps {
  stats: Stats;
  onRefreshSuccess?: () => Promise<void>;
}

interface AnimatedCounterProps {
  value: number | string;
  duration?: number;
  decimals?: number;
  label: string;
  icon: React.ElementType;
}

const AnimatedCounter = ({ value, duration = 2000, decimals = 2, label, icon: Icon }: AnimatedCounterProps) => {
  const [displayValue, setDisplayValue] = useState<string | number>("");

  useEffect(() => {
    if (typeof value === "string") {
      // Check if it's formatted_time: e.g. "56h 17m"
      const timeMatch = value.match(/^(\d+)h\s*(\d+)m$/);
      if (timeMatch) {
        const targetHours = parseInt(timeMatch[1], 10);
        const targetMinutes = parseInt(timeMatch[2], 10);
        let start = 0;
        const totalSteps = duration / 16;
        const timer = setInterval(() => {
          start += 1;
          const currentHours = Math.min(Math.round((start / totalSteps) * targetHours), targetHours);
          const currentMinutes = Math.min(Math.round((start / totalSteps) * targetMinutes), targetMinutes);
          setDisplayValue(`${currentHours}h ${currentMinutes}m`);
          if (start >= totalSteps) {
            setDisplayValue(`${targetHours}h ${targetMinutes}m`);
            clearInterval(timer);
          }
        }, 16);
        return () => clearInterval(timer);
      }

      // Check if it's avg_pace: e.g. "5:35/km"
      const paceMatch = value.match(/^(\d+):(\d+)\/km$/);
      if (paceMatch) {
        const targetMin = parseInt(paceMatch[1], 10);
        const targetSec = parseInt(paceMatch[2], 10);
        let start = 0;
        const totalSteps = duration / 16;
        const timer = setInterval(() => {
          start += 1;
          const currentMin = Math.min(Math.round((start / totalSteps) * targetMin), targetMin);
          const currentSec = Math.min(Math.round((start / totalSteps) * targetSec), targetSec);
          setDisplayValue(`${currentMin}:${currentSec.toString().padStart(2, '0')}/km`);
          if (start >= totalSteps) {
            setDisplayValue(`${targetMin}:${targetSec.toString().padStart(2, '0')}/km`);
            clearInterval(timer);
          }
        }, 16);
        return () => clearInterval(timer);
      }

      // Fallback
      setDisplayValue(value);
    } else {
      let start = 0;
      const end = value;
      const increment = end / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setDisplayValue(end.toFixed(decimals));
          clearInterval(timer);
        } else {
          setDisplayValue(start.toFixed(decimals));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [value, duration, decimals]);

  return (
    <div className="flex flex-col items-center">
      <div className="text-brand-orange mb-2"><Icon size={24} /></div>
      <div className="text-2xl md:text-4xl font-black text-brand-white">
        {displayValue}
      </div>
      <div className="text-[10px] font-bold text-brand-white/40 uppercase tracking-widest">{label}</div>
    </div>
  );
};

const Hero: React.FC<HeroProps> = ({ stats, onRefreshSuccess }) => {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2], [0, -100]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1.1, 1.3]);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshStatus, setRefreshStatus] = useState<'success' | 'error' | null>(null);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setRefreshStatus(null);
    try {
      const response = await fetch(`${API_URL}/refresh`, {
        method: "POST"
      });
      if (!response.ok) {
        throw new Error("Refresh failed");
      }
      if (onRefreshSuccess) {
        await onRefreshSuccess();
      }
      setRefreshStatus("success");
    } catch (err) {
      console.error("Hero: Refresh failed", err);
      setRefreshStatus("error");
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollDown = () => {
    const heroElement = document.getElementById('hero');
    if (heroElement && heroElement.nextElementSibling) {
      heroElement.nextElementSibling.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <motion.section 
      id="hero"
      style={{ opacity, y }}
      className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-brand-black"
    >
      <motion.div 
        style={{ 
          backgroundImage: `url('${import.meta.env.BASE_URL}images/main photo starting page.jpeg')`,
          scale,
          filter: "grayscale(100%) contrast(1.2)"
        }}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 transition-all duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-brand-black/90 via-transparent to-brand-black" />
      <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none" />

      <div className="relative z-10 text-center px-4 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 1, ease: "circOut" }}
            className="h-1 bg-brand-orange w-24 mx-auto mb-8"
          />
          <h1 className="text-5xl sm:text-7xl md:text-[clamp(7rem,12vw,12rem)] font-black tracking-tighter text-brand-white mb-4 leading-[0.8] uppercase">
            Running<br />
            <span className="text-brand-orange italic drop-shadow-[0_0_30px_rgba(255,87,34,0.3)]">Journey</span>
          </h1>
          <p className="text-brand-white/40 text-sm md:text-xl font-black tracking-[0.8em] uppercase mb-10 ml-[0.8em]">
            Andhra Pradesh • Transformation • 2026
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 1 }}
          className="flex flex-wrap justify-center gap-6 mb-16 relative z-20"
        >
          <motion.a
            href="https://www.strava.com/athletes/185228136"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ 
              scale: 1.05, 
              boxShadow: "0 0 20px rgba(255, 87, 34, 0.4)",
              borderColor: "rgba(255, 87, 34, 0.8)",
              color: "#ff5722"
            }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-3 bg-brand-black/40 backdrop-blur-sm border border-brand-white/10 text-brand-white font-black uppercase tracking-[0.2em] text-xs transition-colors duration-300 rounded-full flex items-center gap-2 cursor-pointer"
          >
            <Zap size={14} className="text-brand-orange" />
            Strava
            <ArrowUpRight size={14} className="opacity-60" />
          </motion.a>
          <motion.a
            href="https://www.instagram.com/mohith_0410/"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ 
              scale: 1.05, 
              boxShadow: "0 0 20px rgba(255, 87, 34, 0.4)",
              borderColor: "rgba(255, 87, 34, 0.8)",
              color: "#ff5722"
            }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-3 bg-brand-black/40 backdrop-blur-sm border border-brand-white/10 text-brand-white font-black uppercase tracking-[0.2em] text-xs transition-colors duration-300 rounded-full flex items-center gap-2 cursor-pointer"
          >
            <InstagramIcon size={14} className="text-brand-orange" />
            Instagram
            <ArrowUpRight size={14} className="opacity-60" />
          </motion.a>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-24 border-y border-brand-white/5 py-16 px-8 relative"
        >
          <div className="absolute inset-0 bg-brand-white/[0.02] -z-10" />
          <AnimatedCounter value={stats.summary.running.distance} label="RUNNING KM" icon={TrendingUp} />
          <AnimatedCounter value={stats.summary.running.activities} decimals={0} label="RUNS" icon={Zap} />
          <AnimatedCounter value={stats.summary.running.formatted_time} label="RUNNING TIME" icon={Timer} />
          <AnimatedCounter value={stats.summary.running.avg_pace} label="AVG PACE" icon={TrendingUp} />
        </motion.div>

        {/* Refresh from Strava Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 1 }}
          className="flex flex-col items-center mt-8 gap-3 relative z-20"
        >
          <motion.button
            onClick={handleRefresh}
            disabled={isRefreshing}
            whileHover={!isRefreshing ? { 
              scale: 1.05, 
              boxShadow: "0 0 20px rgba(255, 87, 34, 0.4)",
              borderColor: "rgba(255, 87, 34, 0.8)",
              color: "#ff5722"
            } : {}}
            whileTap={!isRefreshing ? { scale: 0.98 } : {}}
            className={`px-8 py-3 bg-brand-black/40 backdrop-blur-sm border border-brand-white/10 text-brand-white font-black uppercase tracking-[0.2em] text-xs transition-colors duration-300 rounded-full flex items-center gap-2 cursor-pointer ${
              isRefreshing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isRefreshing ? 'Refreshing...' : '🔄 Refresh from Strava'}
          </motion.button>
          
          {refreshStatus === 'success' && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-emerald-400 font-bold text-sm tracking-wide"
            >
              ✅ Updated Successfully
            </motion.p>
          )}
          {refreshStatus === 'error' && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-rose-500 font-bold text-sm tracking-wide"
            >
              ❌ Refresh Failed
            </motion.p>
          )}
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-12 z-10 flex flex-col items-center gap-4"
      >
        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-white/20">Scroll to Explore</span>
        <motion.button 
          onClick={handleScrollDown}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-brand-orange bg-transparent border-0 outline-none flex items-center justify-center cursor-pointer hover:scale-110 transition-transform duration-300"
          aria-label="Scroll to next section"
        >
          <ChevronDown size={32} strokeWidth={3} />
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            whileHover={{ 
              scale: 1.1,
              boxShadow: "0 0 15px rgba(255, 87, 34, 0.4)",
            }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 p-4 rounded-full bg-brand-black/80 border border-brand-white/15 text-brand-white hover:text-brand-orange hover:border-brand-orange transition-colors duration-300 backdrop-blur-md flex items-center justify-center cursor-pointer"
            aria-label="Back to top"
          >
            <ChevronUp size={24} strokeWidth={2.5} />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.section>
  );
};

export default Hero;
