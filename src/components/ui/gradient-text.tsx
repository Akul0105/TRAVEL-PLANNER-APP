/**
 * Magic UI Gradient Text Component
 * Beautiful animated gradient text with multiple color schemes
 * Perfect for headings and call-to-action text
 */

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'blue-purple' | 'emerald-teal' | 'rose-pink' | 'orange-yellow' | 'travel';
  animate?: boolean;
  delay?: number;
}

/**
 * Gradient text component with Magic UI styling
 * @param children - Text content
 * @param className - Additional CSS classes
 * @param variant - Color scheme variant
 * @param animate - Whether to animate the gradient
 * @param delay - Animation delay in seconds
 */
export function GradientText({
  children,
  className,
  variant = 'blue-purple',
  animate = true,
  delay = 0,
}: GradientTextProps) {
  const gradientClasses = {
    'blue-purple': 'bg-gradient-to-r from-blue-600 to-purple-600',
    'emerald-teal': 'bg-gradient-to-r from-emerald-600 to-teal-600',
    'rose-pink': 'bg-gradient-to-r from-rose-600 to-pink-600',
    'orange-yellow': 'bg-gradient-to-r from-orange-600 to-yellow-600',
    'travel': 'bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600',
  };

  const animationClasses = animate
    ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-[length:200%_auto] animate-gradient-x'
    : gradientClasses[variant];

  return (
    <motion.span
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className={cn(
        "inline-block bg-clip-text text-transparent font-bold",
        animationClasses,
        className
      )}
    >
      {children}
    </motion.span>
  );
}

/**
 * Animated gradient text with shimmer effect
 */
export function ShimmerText({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className={cn(
        "inline-block bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600",
        "bg-[length:200%_auto] bg-clip-text text-transparent",
        "animate-gradient-x font-bold",
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
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className={cn(
        "inline-block bg-gradient-to-r from-blue-600 via-emerald-600 to-teal-600",
        "bg-[length:200%_auto] bg-clip-text text-transparent",
        "animate-gradient-x font-bold",
        className
      )}
    >
      {children}
    </motion.span>
  );
}
