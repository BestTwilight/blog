
import React from 'react';
import { motion } from 'framer-motion';

type ColorVariant = 'cyan' | 'purple' | 'ghost';

interface GlowingTextProps {
  text: string;
  className?: string;
  variant?: ColorVariant;
  speed?: number; // Speed of the wave
  stagger?: number; // Delay between letters
}

export const GlowingText: React.FC<GlowingTextProps> = ({ 
  text, 
  className, 
  variant = 'ghost',
  speed = 3,
  stagger = 0.1 
}) => {
  const letters = text.split("");

  // Configuration for different visual styles
  const variants = {
    cyan: {
      initial: { color: '#334155', textShadow: '0 0 0px rgba(0,0,0,0)', opacity: 0.6 }, // slate-700
      animate: {
        color: ['#334155', '#22d3ee', '#cffafe', '#22d3ee', '#334155'], // slate -> cyan-400 -> cyan-100 -> cyan-400 -> slate
        textShadow: [
          '0 0 0px rgba(34,211,238,0)',
          '0 0 15px rgba(34,211,238,0.6)',
          '0 0 30px rgba(34,211,238,0.8)',
          '0 0 15px rgba(34,211,238,0.6)',
          '0 0 0px rgba(34,211,238,0)'
        ],
        opacity: [0.6, 1, 1, 1, 0.6]
      }
    },
    purple: {
      initial: { color: '#334155', textShadow: '0 0 0px rgba(0,0,0,0)', opacity: 0.6 },
      animate: {
        color: ['#334155', '#a78bfa', '#ede9fe', '#a78bfa', '#334155'], // slate -> violet-400 -> violet-100 -> violet-400 -> slate
        textShadow: [
          '0 0 0px rgba(139,92,246,0)',
          '0 0 15px rgba(139,92,246,0.6)',
          '0 0 30px rgba(139,92,246,0.8)',
          '0 0 15px rgba(139,92,246,0.6)',
          '0 0 0px rgba(139,92,246,0)'
        ],
        opacity: [0.6, 1, 1, 1, 0.6]
      }
    },
    ghost: {
      initial: { color: '#475569', textShadow: '0 0 0px rgba(0,0,0,0)', opacity: 0.2 }, // slate-600
      animate: {
        color: ['#475569', '#f8fafc', '#475569'], // slate-600 -> white -> slate-600
        textShadow: [
          '0 0 0px rgba(255,255,255,0)',
          '0 0 10px rgba(255,255,255,0.3)',
          '0 0 0px rgba(255,255,255,0)'
        ],
        opacity: [0.2, 1, 0.2]
      }
    }
  };

  const activeVariant = variants[variant];

  return (
    <div className={`inline-flex justify-center items-center whitespace-nowrap ${className}`}>
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          initial={activeVariant.initial}
          animate={activeVariant.animate}
          transition={{
            duration: speed,
            repeat: Infinity,
            delay: index * stagger,
            ease: "easeInOut",
            times: variant === 'ghost' ? [0, 0.5, 1] : [0, 0.2, 0.5, 0.8, 1]
          }}
          className="inline-block whitespace-pre"
        >
          {letter}
        </motion.span>
      ))}
    </div>
  );
};
