import React from 'react';
import { motion } from 'framer-motion';

const LoadingScreen: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 1, delay: 3 }}
      className="fixed inset-0 z-[100] bg-brand-black flex flex-col items-center justify-center"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="text-center"
      >
        <h1 className="text-4xl md:text-6xl font-black text-brand-white tracking-tighter mb-4">
          PREPARING THE <span className="text-brand-orange">JOURNEY</span>
        </h1>
        <div className="w-64 h-1 bg-brand-white/10 rounded-full overflow-hidden mx-auto">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
            className="h-full bg-brand-orange"
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LoadingScreen;
