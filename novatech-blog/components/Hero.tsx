
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { GlowingText } from './GlowingText';
import { CONFIG } from '../config';

export const Hero: React.FC = () => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"]
  });

  const yText = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacityText = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={targetRef} className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4 md:px-6 overflow-hidden">
      
      {/* Background Ambience Lines */}
      <div className="absolute inset-0 pointer-events-none select-none">
         <div className="absolute top-[30%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent"></div>
         <div className="absolute bottom-[30%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/10 to-transparent"></div>
      </div>

      <motion.div 
        style={{ y: yText, opacity: opacityText }}
        className="relative z-10 max-w-7xl mx-auto flex flex-col items-center"
      >
        {/* System Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-12"
        >
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-slate-900/60 backdrop-blur-md border border-cyan-500/20 text-cyan-400 text-xs md:text-sm font-mono tracking-widest uppercase shadow-[0_0_15px_rgba(6,182,212,0.1)]">
            <Sparkles className="w-3 h-3 animate-pulse" />
            <span>{CONFIG.SYSTEM_STATUS}</span>
          </div>
        </motion.div>

        {/* Main Title Block */}
        <div className="flex flex-col items-center justify-center mb-10">
            {/* Row 1: High Intensity Tech Text */}
            <div className="flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-8 flex-wrap lg:flex-nowrap">
                <GlowingText 
                  text={CONFIG.HERO.TITLE_LINE_1} 
                  variant="cyan"
                  speed={4}
                  stagger={0.15}
                  className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tighter"
                />
                <GlowingText 
                  text={CONFIG.HERO.TITLE_LINE_2} 
                  variant="purple"
                  speed={4}
                  stagger={0.15}
                  className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tighter"
                />
            </div>

            {/* Row 2: Subtle Ghost Text */}
            <div className="pt-4 md:pt-6">
               <GlowingText 
                  text={CONFIG.HERO.SUBTITLE} 
                  variant="ghost" 
                  speed={3}
                  stagger={0.1}
                  className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold tracking-widest uppercase opacity-80"
               />
            </div>
        </div>

        {/* Description Card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="relative max-w-2xl mb-12 group"
        >
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>
            <p className="relative text-base md:text-xl text-slate-400 leading-relaxed text-center px-4">
               {CONFIG.HERO.DESCRIPTION_PREFIX}
               {' '}
               {CONFIG.HERO.HIGHLIGHTS.map((highlight, index) => (
                 <React.Fragment key={highlight.text}>
                    <span className={highlight.color}>{highlight.text}</span>
                    {index < CONFIG.HERO.HIGHLIGHTS.length - 1 ? ', ' : '.'}
                 </React.Fragment>
               ))}
            </p>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <button
            onClick={() => {
              const el = document.getElementById('posts-grid');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group relative px-8 py-4 bg-transparent overflow-hidden rounded-lg"
          >
            {/* Button Background/Border Effect */}
            <div className="absolute inset-0 border border-cyan-500/50 rounded-lg group-hover:bg-cyan-500/10 transition-colors duration-300"></div>
            <div className="absolute inset-0 bg-cyan-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <span className="relative flex items-center space-x-3 text-cyan-400 group-hover:text-cyan-200 transition-colors font-bold tracking-wide">
              <span>Initialize Reading</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
};
