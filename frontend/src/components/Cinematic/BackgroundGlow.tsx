import React from 'react';
import { motion } from 'framer-motion';

const BackgroundGlow: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.05, 0.1, 0.05],
          x: [0, 100, 0],
          y: [0, 50, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-brand-orange/20 blur-[150px] rounded-full"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.03, 0.08, 0.03],
          x: [0, -50, 0],
          y: [0, 100, 0]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute top-[30%] -right-[10%] w-[50%] h-[50%] bg-brand-orange/15 blur-[180px] rounded-full"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.04, 0.07, 0.04],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-[10%] left-[20%] w-[40%] h-[40%] bg-brand-orange/10 blur-[120px] rounded-full"
      />
      <div className="absolute inset-0 bg-noise opacity-[0.015]" />
    </div>
  );
};

export default BackgroundGlow;
