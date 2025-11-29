
import React from 'react';

// This component is deprecated in favor of GlowingText.tsx for better stability and visual effects.
// Keeping a shell to prevent import errors if referenced elsewhere (though Hero.tsx no longer uses it).
export const TextRipple: React.FC<{ text: string; className?: string; charClassName?: string }> = ({ text }) => {
  return <span>{text}</span>;
};
