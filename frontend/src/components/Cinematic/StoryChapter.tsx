import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { cn } from '../../utils/cn';

interface StoryChapterProps {
  title: string;
  content: string[];
  imagePath?: string;
  imageCaption?: string;
  reverse?: boolean;
  isHighImpact?: boolean;
  id?: string;
  aspectRatio?: 'portrait' | 'landscape' | 'square';
}

const StoryChapter: React.FC<StoryChapterProps> = ({ 
  title, 
  content, 
  imagePath, 
  imageCaption,
  reverse,
  isHighImpact,
  id,
  aspectRatio = 'portrait'
}) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["5%", "-5%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const aspectClass = aspectRatio === 'portrait' 
    ? "aspect-[3/4]" 
    : aspectRatio === 'landscape' 
      ? "aspect-[16/10]" 
      : "aspect-square";

  return (
    <section ref={containerRef} id={id} className={cn(
      "min-h-[70vh] w-full flex flex-col justify-center py-16 md:py-24 px-6 md:px-20 overflow-hidden relative",
      isHighImpact ? "bg-brand-orange text-brand-black" : "bg-brand-black text-brand-white"
    )}>
      {/* Background Depth Elements */}
      {!isHighImpact && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            style={{ y: imageY, opacity: 0.05 }}
            className="absolute -right-20 top-0 text-[15rem] md:text-[25rem] font-black text-brand-white/10 uppercase tracking-tighter select-none whitespace-nowrap"
          >
            {title.split(' ')[0]}
          </motion.div>
          <div className="absolute inset-0 bg-noise opacity-[0.02]" />
        </div>
      )}

      <motion.div 
        style={{ opacity }}
        className={cn(
          "max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center relative z-10",
          reverse && "md:flex-row-reverse"
        )}
      >
        <motion.div 
          style={{ y: textY }}
          className={cn(reverse ? "md:order-2" : "md:order-1")}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            <div className={cn(
              "h-1 w-20 mb-8 md:mb-10",
              isHighImpact ? "bg-brand-black" : "bg-brand-orange"
            )} />
            <h2 className="text-4xl sm:text-5xl md:text-[clamp(4rem,7vw,8rem)] font-black mb-8 md:mb-10 leading-[0.9] uppercase tracking-[-0.05em] whitespace-normal md:whitespace-nowrap">
              {title}
            </h2>
            <div className="space-y-4 md:space-y-6 text-base md:text-xl lg:text-2xl opacity-90 leading-relaxed font-medium max-w-xl">
              {content.map((paragraph, index) => (
                <p key={index} className="relative">
                  {paragraph}
                </p>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {imagePath && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "relative rounded-3xl overflow-hidden shadow-2xl bg-brand-white/[0.03] w-full",
              aspectClass,
              reverse ? "md:order-1" : "md:order-2",
              isHighImpact ? "shadow-black/40" : "shadow-brand-orange/10 border border-brand-white/5"
            )}
          >
            <motion.img 
              src={imagePath} 
              alt={title} 
              className="absolute inset-0 w-full h-full object-contain object-center grayscale hover:grayscale-0 transition-all duration-1000 ease-in-out p-2 md:p-4"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            {imageCaption && (
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-white text-[10px] font-black tracking-[0.4em] uppercase opacity-80 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full inline-block">{imageCaption}</p>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default StoryChapter;
