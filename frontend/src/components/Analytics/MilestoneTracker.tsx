import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Flame, Target, Award } from 'lucide-react';

interface MilestoneTrackerProps {
  totalDistance: number;
  personalBests: Record<string, string>;
}

const milestones = [
  { km: 100, label: "The Beginning", icon: Award },
  { km: 200, label: "Momentum", icon: Flame },
  { km: 300, label: "Discipline", icon: Target },
  { km: 400, label: "Persistence", icon: Trophy },
  { km: 500, label: "Legacy", icon: Award },
];

interface StatCardProps {
  icon: React.ElementType;
  value: string | number;
  label: string;
  sub?: string;
  delay?: number;
}

const StatCard = ({ icon: Icon, value, label, sub, delay = 0 }: StatCardProps) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    className="group relative bg-brand-white/[0.03] p-8 md:p-10 rounded-[2.5rem] border border-brand-white/10 hover:border-brand-orange transition-all duration-700 overflow-hidden"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    <div className="relative z-10">
      <div className="w-14 h-14 bg-brand-orange/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 border border-brand-orange/20">
        <Icon className="text-brand-orange" size={28} />
      </div>
      <div className="flex items-baseline gap-2 mb-3">
        <div className="text-4xl md:text-5xl lg:text-6xl font-black text-brand-white tracking-tighter group-hover:translate-x-1 transition-transform duration-500">{value}</div>
      </div>
      <div className="text-brand-white/40 text-[10px] md:text-[12px] font-black uppercase tracking-[0.4em] mb-2">{label}</div>
      {sub && <div className="text-brand-orange/60 text-[9px] font-bold uppercase tracking-widest leading-tight">{sub}</div>}
    </div>
    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/5 blur-3xl rounded-full translate-x-16 -translate-y-16 group-hover:bg-brand-orange/20 transition-all duration-700" />
  </motion.div>
);

const MilestoneTracker: React.FC<MilestoneTrackerProps> = ({ totalDistance, personalBests }) => {
  return (
    <div className="w-full max-w-7xl mx-auto py-16 md:py-24 px-6">
      <div className="relative pt-32 mb-48 md:mb-64">
        {/* Progress Line Background */}
        <div className="absolute top-[172px] left-0 w-full h-1 bg-brand-white/5 rounded-full" />
        
        {/* Glowing Progress Line */}
        <motion.div 
          initial={{ width: 0 }}
          whileInView={{ width: `${Math.min((totalDistance / 500) * 100, 100)}%` }}
          viewport={{ once: true }}
          transition={{ duration: 4, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-[172px] left-0 h-1 bg-brand-orange rounded-full shadow-[0_0_30px_rgba(255,87,34,0.8)] z-10"
        >
          <div className="absolute top-0 right-0 w-4 h-4 bg-brand-orange rounded-full -translate-y-[6px] shadow-[0_0_20px_#FF5722]" />
        </motion.div>

        {/* Milestone Nodes */}
        <div className="relative flex justify-between gap-4 overflow-x-auto pb-8 no-scrollbar">
          {milestones.map((m, idx) => {
            const isReached = totalDistance >= m.km;
            const Icon = m.icon;
            return (
              <div key={idx} className="flex flex-col items-center group min-w-[120px]">
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.2, type: "spring", stiffness: 100 }}
                  className={`relative w-20 h-20 md:w-24 md:h-24 rounded-3xl border-2 flex items-center justify-center mb-10 z-20 transition-all duration-1000 rotate-45 group-hover:rotate-[225deg] ${
                    isReached 
                      ? "bg-brand-orange border-brand-orange shadow-[0_0_50px_rgba(255,87,34,0.4)]" 
                      : "bg-brand-black border-brand-white/10"
                  }`}
                >
                  <div className="-rotate-45 group-hover:-rotate-[225deg] transition-transform duration-1000">
                    <Icon size={32} className={isReached ? "text-brand-black" : "text-brand-white/20"} />
                  </div>
                </motion.div>

                <div className="text-center">
                  <div className={`text-3xl md:text-4xl font-black mb-2 tracking-tighter ${isReached ? "text-brand-white" : "text-brand-white/10"}`}>
                    {m.km}<span className="text-xs ml-1 text-brand-orange">KM</span>
                  </div>
                  <div className={`text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] px-3 py-1 rounded-full border ${isReached ? "text-brand-orange border-brand-orange/30" : "text-brand-white/5 border-transparent"}`}>
                    {m.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Personal Best Section */}
      <div className="mb-24 md:mb-32">
        <div className="text-center mb-16">
          <h3 className="text-brand-orange text-lg md:text-2xl font-black uppercase tracking-[0.5em] mb-4">Personal Bests</h3>
          <div className="h-1 w-24 bg-brand-orange mx-auto opacity-30" />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {Object.entries(personalBests).map(([label, time], i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-brand-white/[0.03] border border-brand-white/10 p-8 rounded-3xl flex flex-col items-center justify-center text-center group hover:border-brand-orange transition-all duration-500 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-brand-orange/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="text-brand-white/40 text-[10px] font-black uppercase tracking-[0.3em] mb-3 group-hover:text-brand-orange transition-colors relative z-10">{label}</div>
              <div className="text-brand-white text-3xl md:text-4xl font-black tracking-tighter mb-1 relative z-10 group-hover:scale-110 transition-transform duration-500 italic">{time}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Premium Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        <StatCard 
          icon={Award} 
          value="500+" 
          label="Total Distance" 
          sub="Kilometers of Grit" 
          delay={0.1}
        />
        <StatCard 
          icon={Flame} 
          value="125" 
          label="Best Month" 
          sub="December 2025 Milestone" 
          delay={0.2}
        />
        <StatCard 
          icon={Target} 
          value="21.1" 
          label="Longest Run" 
          sub="Half Marathon Distance" 
          delay={0.3}
        />
        <StatCard 
          icon={Trophy} 
          value="53:00" 
          label="TCS World 10K" 
          sub="PB Virtual Run Finish" 
          delay={0.4}
        />
      </div>
      
      {/* Secondary Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mt-6 md:mt-8">
        <div className="bg-brand-white/[0.02] border border-brand-white/5 p-8 rounded-[2rem] text-center">
          <div className="text-brand-white/30 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Months Active</div>
          <div className="text-3xl font-black text-brand-white">8+</div>
        </div>
        <div className="bg-brand-white/[0.02] border border-brand-white/5 p-8 rounded-[2rem] text-center">
          <div className="text-brand-white/30 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Race Finishes</div>
          <div className="text-3xl font-black text-brand-white">3</div>
        </div>
        <div className="bg-brand-white/[0.02] border border-brand-white/5 p-8 rounded-[2rem] text-center">
          <div className="text-brand-white/30 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Daily Consistency</div>
          <div className="text-3xl font-black text-brand-white">95%</div>
        </div>
        <div className="bg-brand-white/[0.02] border border-brand-white/5 p-8 rounded-[2rem] text-center">
          <div className="text-brand-white/30 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Shoes Burned</div>
          <div className="text-3xl font-black text-brand-white">1</div>
        </div>
      </div>
    </div>
  );
};

export default MilestoneTracker;
