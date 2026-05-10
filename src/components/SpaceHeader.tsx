/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { useMemo } from 'react';

const QUOTES = [
  "The stars are not reachable by feet, but by study.",
  "Your potential is as vast as the cosmos.",
  "Every small step in learning is a giant leap for your mind.",
  "Navigate through knowledge, conquer the universe.",
  "Become the architect of your own constellation.",
  "Study like a star: shine bright and stay constant.",
  "The universe is waiting for your brilliance."
];

export default function SpaceHeader() {
  const dayIndex = useMemo(() => new Date().getDay(), []);
  const quote = useMemo(() => QUOTES[dayIndex % QUOTES.length], [dayIndex]);

  const nebulaColor = useMemo(() => {
    const colors = [
      'rgba(147, 51, 234, 0.3)', // Sun - Purple
      'rgba(59, 130, 246, 0.3)', // Mon - Blue
      'rgba(34, 197, 94, 0.3)',  // Tue - Green
      'rgba(20, 184, 166, 0.3)', // Wed - Teal
      'rgba(236, 72, 153, 0.3)', // Thu - Pink
      'rgba(99, 102, 241, 0.3)', // Fri - Indigo
      'rgba(139, 92, 246, 0.3)', // Sat - Violet
    ];
    return colors[dayIndex];
  }, [dayIndex]);

  // Generate random stars
  const stars = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 3}px`,
      delay: Math.random() * 3,
    }));
  }, []);

  return (
    <div className="relative h-[25vh] w-full space-gradient overflow-hidden flex flex-col items-center justify-center px-6">
      {/* Nebula Glow */}
      <div 
        className="absolute inset-0 transition-colors duration-1000"
        style={{ 
          background: `radial-gradient(circle at 50% 50%, ${nebulaColor} 0%, transparent 70%)` 
        }} 
      />

      {/* Stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}

      {/* Quote */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="relative z-10 text-center"
      >
        <p className="text-white font-display text-lg md:text-xl font-light italic tracking-wide opacity-90">
          "{quote}"
        </p>
        <div className="mt-2 h-0.5 w-12 bg-cosmic-yellow mx-auto rounded-full opacity-50" />
      </motion.div>
    </div>
  );
}
