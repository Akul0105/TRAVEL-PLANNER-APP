/**
 * Magic UI Text Animation Components
 * Beautiful animated text effects for travel agency branding
 * Includes typewriter, fade-in, and gradient animations
 */

'use client';

import { motion, useAnimation } from 'framer-motion';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface TextAnimationProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}

/**
 * Typewriter effect for text
 */
export function TypewriterText({
  text,
  className,
  speed = 50,
  delay = 0,
}: {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
}) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentIndex < text.length) {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [currentIndex, text, speed]);

  useEffect(() => {
    const initialDelay = setTimeout(() => {
      setCurrentIndex(0);
      setDisplayText('');
    }, delay);

    return () => clearTimeout(initialDelay);
  }, [delay]);

  return (
    <span className={className}>
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="ml-1"
      >
        |
      </motion.span>
    </span>
  );
}

/**
 * Fade in text with stagger effect
 */
export function FadeInText({
  children,
  className,
  delay = 0,
  duration = 0.6,
}: TextAnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Slide in text from different directions
 */
export function SlideInText({
  children,
  className,
  direction = 'left',
  delay = 0,
  duration = 0.6,
}: TextAnimationProps & { direction?: 'left' | 'right' | 'up' | 'down' }) {
  const directionMap = {
    left: { x: -50, y: 0 },
    right: { x: 50, y: 0 },
    up: { x: 0, y: 50 },
    down: { x: 0, y: -50 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...directionMap[direction] }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Bounce in text effect
 */
export function BounceInText({
  children,
  className,
  delay = 0,
  duration = 0.8,
}: TextAnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.3 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 10,
        duration,
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Gradient text with animated colors
 */
export function AnimatedGradientText({
  children,
  className,
  delay = 0,
}: TextAnimationProps) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className={cn(
        'bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600',
        'bg-[length:200%_auto] bg-clip-text text-transparent',
        'animate-gradient-x font-bold',
        className
      )}
    >
      {children}
    </motion.span>
  );
}

/**
 * Travel-themed gradient text
 */
export function TravelGradientText({
  children,
  className,
  delay = 0,
}: TextAnimationProps) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className={cn(
        'bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600',
        'bg-[length:200%_auto] bg-clip-text text-transparent',
        'animate-gradient-x font-bold',
        className
      )}
    >
      {children}
    </motion.span>
  );
}

/**
 * Shimmer text effect
 */
export function ShimmerText({
  children,
  className,
  delay = 0,
}: TextAnimationProps) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className={cn(
        'inline-block bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600',
        'bg-[length:200%_auto] bg-clip-text text-transparent',
        'animate-gradient-x font-bold',
        className
      )}
    >
      {children}
    </motion.span>
  );
}

/**
 * Floating text with subtle animation
 */
export function FloatingText({
  children,
  className,
  delay = 0,
}: TextAnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{
        y: -5,
        transition: { duration: 0.2 },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Reveal text with mask effect
 */
export function RevealText({
  children,
  className,
  delay = 0,
  duration = 1,
}: TextAnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, clipPath: 'inset(0 100% 0 0)' }}
      animate={{ opacity: 1, clipPath: 'inset(0 0% 0 0)' }}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Glitch text effect
 */
export function GlitchText({
  children,
  className,
  delay = 0,
}: TextAnimationProps) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay }}
      className={cn(
        'relative inline-block font-bold',
        'before:absolute before:inset-0 before:bg-gradient-to-r before:from-red-500 before:to-blue-500',
        'before:animate-pulse before:opacity-0 hover:before:opacity-20',
        'after:absolute after:inset-0 after:bg-gradient-to-r after:from-blue-500 after:to-purple-500',
        'after:animate-pulse after:opacity-0 hover:after:opacity-20',
        'after:delay-100',
        className
      )}
    >
      {children}
    </motion.span>
  );
}
