import React from 'react';
import { motion } from 'framer-motion';

interface AchievementChapterProps {
  featuredImage: string;
  secondaryImages: string[];
}

const AchievementChapter: React.FC<AchievementChapterProps> = ({ featuredImage, secondaryImages }) => {
  return (
    <section className="relative bg-brand-black py-16 md:py-24 overflow-hidden">

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-brand-orange text-lg md:text-2xl font-black uppercase tracking-[0.5em] mb-4">Achievement Gallery</h2>
          <p className="text-brand-white/60 text-sm md:text-lg font-bold uppercase tracking-widest italic max-w-2xl mx-auto">
            The virtual run was the first step. The medal was the proof.
          </p>
        </div>

        {/* Featured Large Card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="group relative mb-12 md:mb-20"
        >
          <div className="relative aspect-[16/10] rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-brand-white/10 shadow-2xl bg-brand-white/[0.03] shadow-brand-orange/5">
            <img 
              src={featuredImage} 
              alt="TCS World 10K Completion" 
              className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-1000 p-4 md:p-8"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-black/90 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none" />
            
            <div className="absolute bottom-8 left-8 right-8 md:bottom-12 md:left-12">
              <div className="h-1 w-24 bg-brand-orange mb-6" />
              <h3 className="text-brand-white text-3xl md:text-6xl font-black uppercase tracking-tighter mb-4 italic">
                Personal Best 10K • 53:00
              </h3>
              <p className="text-brand-white/60 text-xs md:text-base font-bold uppercase tracking-[0.3em] leading-relaxed max-w-2xl">
                TCS World 10K Bengaluru Virtual Run • The Dream Officially Started
              </p>
            </div>
          </div>
        </motion.div>

        {/* Supporting Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {secondaryImages.slice(0, 2).map((img, i) => {
            const labels = [
              "The Physical Proof",
              "Official Medal"
            ];
            const titles = [
              "Me with Bib No and Medal",
              "TCS World 10K Bengaluru Virtual Run Finisher Medal"
            ];
            const descriptions = [
              "The first physical proof that the dream was real.",
              "This was my first official running medal. A symbol of transformation."
            ];
            
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 1 }}
                className="group relative flex flex-col"
              >
                <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden border border-brand-white/10 shadow-2xl bg-brand-white/[0.03] mb-8">
                  <img 
                    src={img} 
                    alt={titles[i]} 
                    className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-1000 p-8 md:p-12"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                </div>
                
                <div className="px-4">
                  <div className="text-brand-orange text-[10px] font-black uppercase tracking-[0.4em] mb-3">{labels[i]}</div>
                  <h3 className="text-brand-white text-xl md:text-2xl font-black uppercase tracking-tight mb-2 italic">
                    {titles[i]}
                  </h3>
                  <p className="text-brand-white/40 text-xs md:text-sm font-bold uppercase tracking-widest leading-relaxed">
                    {descriptions[i]}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AchievementChapter;
