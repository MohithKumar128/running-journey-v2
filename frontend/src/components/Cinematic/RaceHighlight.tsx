import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';


interface RaceHighlightProps {
  title: string;
  content: string[];
  imagePath: string;
  imageCaption?: string;
}

const RaceHighlight: React.FC<RaceHighlightProps> = ({ 
  title, 
  content, 
  imagePath, 
  imageCaption 
}) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5], [1.05, 1]);
  
  // Split title for the requested hierarchy
  // "THIS IS WHAT I WANT" -> "THIS IS" and "WHAT I WANT"
  // If title is different, we can try to split it or just use it.
  const titleParts = title === "THIS IS WHAT I WANT" 
    ? ["THIS IS", "WHAT I WANT"] 
    : [title, ""];

  return (
    <section 
      ref={containerRef} 
      className="min-h-screen w-full bg-brand-black flex items-center py-12 md:py-24 px-4 md:px-8 lg:px-12 overflow-hidden relative"
    >
      <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none" />
      
      {/* Background Depth Text */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.05 }}
          className="absolute -right-20 top-20 text-[10rem] md:text-[20rem] font-black text-brand-white uppercase tracking-tighter select-none whitespace-nowrap"
        >
          RACE
        </motion.div>
      </div>

      <motion.div 
        style={{ opacity }}
        className="max-w-[1600px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center relative z-10"
      >
        {/* LEFT: Large Image (approx 60-65%) */}
        <div className="lg:col-span-7 xl:col-span-8">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative rounded-sm overflow-hidden bg-brand-white/[0.02] shadow-2xl border border-brand-white/5 group"
          >
            <motion.div style={{ scale: imageScale }} className="w-full h-full">
              <img 
                src={imagePath} 
                alt="1.5K Race Moment" 
                className="w-full h-auto object-contain max-h-[85vh] mx-auto grayscale group-hover:grayscale-0 transition-all duration-1000 ease-in-out"
              />
            </motion.div>
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            
            {imageCaption && (
              <div className="absolute bottom-6 left-6">
                <p className="text-brand-white/70 text-[10px] md:text-xs font-black tracking-[0.5em] uppercase bg-black/60 backdrop-blur-md px-4 py-2 rounded-sm border border-brand-white/10">
                  {imageCaption}
                </p>
              </div>
            )}
          </motion.div>
        </div>

        {/* RIGHT: Headline + Story (approx 35-40%) */}
        <div className="lg:col-span-5 xl:col-span-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col"
          >
            <div className="w-16 h-1 bg-brand-orange mb-8 md:mb-12" />
            
            <h2 className="flex flex-col mb-8 md:mb-12">
              <span className="text-4xl sm:text-5xl md:text-7xl xl:text-[clamp(6rem,8vw,10rem)] font-black leading-[0.85] tracking-tighter uppercase text-brand-white">
                {titleParts[0]}
              </span>
              <span className="text-4xl sm:text-5xl md:text-7xl xl:text-[clamp(6rem,8vw,10rem)] font-black leading-[0.85] tracking-tighter uppercase text-brand-orange">
                {titleParts[1]}
              </span>
            </h2>

            <div className="space-y-6 md:space-y-8 text-base md:text-lg xl:text-xl text-brand-white/80 font-medium leading-relaxed max-w-md">
              {content.map((paragraph, index) => (
                <p key={index} className="relative">
                  {paragraph}
                </p>
              ))}
            </div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-12 md:mt-16"
            >
              <div className="text-brand-white/20 text-[10px] font-black tracking-[1em] uppercase mb-4">
                Chapter IV
              </div>
              <div className="flex items-center gap-4">
                <div className="h-[1px] flex-grow bg-brand-white/10" />
                <div className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default RaceHighlight;
