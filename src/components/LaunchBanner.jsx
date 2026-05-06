import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function LaunchBanner() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0
  });

  useEffect(() => {
    const targetDate = new Date('May 30, 2026 00:00:00').getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference < 0) {
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-[56px] z-[100] bg-[#1A1A1A] text-white flex items-center justify-center overflow-hidden border-b border-emerald-500/20 shadow-2xl">
      {/* Background Animated Glint */}
      <motion.div 
        animate={{ x: ['-100%', '100%'] }}
        transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
        className="absolute inset-0 w-1/3 h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 pointer-events-none"
      />
      
      <div className="relative z-10 flex items-center gap-4 md:gap-8 px-4">
        <div className="hidden lg:flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 whitespace-nowrap">Countdown to Launch</span>
        </div>
        
        <div className="h-4 w-px bg-white/10 hidden lg:block" />

        {/* Live Countdown Ticker */}
        <div className="flex items-center gap-2 md:gap-4">
          {[
            { label: 'D', value: timeLeft.days },
            { label: 'H', value: timeLeft.hours },
            { label: 'M', value: timeLeft.minutes },
            { label: 'S', value: timeLeft.seconds },
          ].map((unit, idx) => (
            <React.Fragment key={unit.label}>
              <div className="flex items-center gap-1.5">
                <span className="text-[14px] md:text-lg font-black text-emerald-400 font-mono w-6 md:w-8 text-center">
                  {unit.value.toString().padStart(2, '0')}
                </span>
                <span className="text-[8px] font-black text-white/30 uppercase tracking-tighter">{unit.label}</span>
              </div>
              {idx < 3 && <span className="text-white/10 font-light text-xs">:</span>}
            </React.Fragment>
          ))}
        </div>

        <div className="h-4 w-px bg-white/10 hidden md:block" />

        <div className="flex items-center gap-3">
          <span className="hidden sm:block text-[10px] font-black uppercase tracking-[0.2em] text-white/60">
            Launching 30.05.2026
          </span>
          <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded text-[9px] font-black text-emerald-500 uppercase tracking-widest">
            Live
          </span>
        </div>
      </div>
    </div>
  );
}
