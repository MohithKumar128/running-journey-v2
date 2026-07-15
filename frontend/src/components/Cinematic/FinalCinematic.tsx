import React from 'react';
import { motion } from 'framer-motion';

interface FinalCinematicProps {
  imagePath?: string;
}

const FinalCinematic: React.FC<FinalCinematicProps> = ({ imagePath }) => {
  const goals = [
    { city: "BENGALURU", race: "TCS WORLD 10K", year: "2028" },
    { city: "MUMBAI", race: "TATA MUMBAI MARATHON", year: "2028" },
    { city: "DELHI", race: "VEDANTA DELHI HALF MARATHON", year: "2029" },
    { city: "KOLKATA", race: "TCS WORLD 25K", year: "2029" },
  ];

  return (
    <section className="relative min-h-screen bg-brand-black flex flex-col items-center justify-center py-24 md:py-32 overflow-hidden">
      {imagePath && (
        <motion.div 
          initial={{ opacity: 0, scale: 1.1 }}
          whileInView={{ opacity: 0.15, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2 }}
          className="absolute inset-0 z-0 flex items-center justify-center p-12 md:p-24"
        >
          <img 
            src={imagePath} 
            alt="The Dream" 
            className="w-full h-full object-contain grayscale brightness-50" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-brand-black" />
        </motion.div>
      )}

      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative z-10 text-center px-6 max-w-7xl mx-auto"
      >
        <h2 className="text-brand-orange text-lg md:text-2xl font-black uppercase tracking-[0.5em] mb-8 md:mb-16">
          THE PROCAM SLAM DREAM
        </h2>
        
        <div className="max-w-5xl mx-auto mb-16 md:mb-32">
          <h1 className="text-5xl sm:text-7xl md:text-9xl lg:text-[clamp(8rem,12vw,13rem)] font-black text-brand-white tracking-tighter leading-[0.8] mb-16 uppercase italic">
            ONE CITY.<br />ONE RACE.<br /><span className="text-brand-orange not-italic drop-shadow-[0_0_50px_rgba(255,87,34,0.4)]">ONE FINISH.</span>
          </h1>
          
          <div className="space-y-8 text-xl sm:text-2xl md:text-5xl text-brand-white font-black italic uppercase tracking-tighter leading-tight max-w-4xl mx-auto">
            <p>The virtual run was the first step.</p>
            <p className="text-brand-orange">The medal was proof.</p>
            <p>500 kilometres was the foundation.</p>
            <p className="text-brand-white/40 text-lg sm:text-xl md:text-3xl mt-12">Now the goal is simple.</p>
            <p className="text-brand-orange not-italic">One city. One race. One finish line at a time.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-24 md:mb-40">
          {goals.map((goal, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.8 }}
              className="relative bg-brand-white/[0.03] border border-brand-white/10 p-10 rounded-[2.5rem] hover:border-brand-orange transition-all duration-700 group overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-brand-orange transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
              <div className="text-brand-orange font-black text-base mb-6">{goal.year}</div>
              <div className="text-brand-white font-black text-3xl mb-3 tracking-tighter group-hover:translate-x-2 transition-transform duration-500">{goal.city}</div>
              <div className="text-brand-white/40 text-[10px] font-black uppercase tracking-[0.3em] leading-tight">{goal.race}</div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative inline-block"
        >
          <div className="absolute -inset-10 bg-brand-orange/20 blur-[100px] rounded-full" />
          <div className="relative px-12 py-8 md:px-20 md:py-12 bg-black border-2 md:border-4 border-brand-orange rounded-[3rem]">
            <h3 className="text-4xl md:text-7xl lg:text-8xl font-black text-brand-white uppercase tracking-tighter italic">
              Legacy Unfolding
            </h3>
            <p className="mt-6 text-brand-orange font-black uppercase tracking-[0.5em] text-sm md:text-base">Target Period • 2028–2029</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Background Text Overlay */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none select-none overflow-hidden">
        <h1 className="text-[20rem] md:text-[50rem] font-black text-brand-white whitespace-nowrap">SLAM</h1>
      </div>
    </section>
  );
};

export default FinalCinematic;
