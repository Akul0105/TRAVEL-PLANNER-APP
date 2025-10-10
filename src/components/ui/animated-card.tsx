/**
 * Magic UI Animated Card Component
 * A beautiful card with hover animations and glass-morphism effects
 * Perfect for showcasing travel destinations and features
 */

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  hoverScale?: number;
  hoverRotate?: number;
  delay?: number;
  duration?: number;
}

/**
 * Animated card component with Magic UI styling
 * @param children - Card content
 * @param className - Additional CSS classes
 * @param hoverScale - Scale factor on hover (default: 1.05)
 * @param hoverRotate - Rotation angle on hover (default: 0)
 * @param delay - Animation delay in seconds
 * @param duration - Animation duration in seconds
 */
export function AnimatedCard({
  children,
  className,
  hoverScale = 1.05,
  hoverRotate = 0,
  delay = 0,
  duration = 0.3,
}: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, delay }}
      whileHover={{ 
        scale: hoverScale, 
        rotate: hoverRotate,
        transition: { duration: 0.2 }
      }}
      className={cn(
        "relative overflow-hidden rounded-2xl",
        "bg-white/80 backdrop-blur-sm border border-white/20",
        "shadow-lg hover:shadow-2xl",
        "transition-all duration-300 ease-out",
        "group cursor-pointer",
        className
      )}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Shine effect */}
      <div className="absolute inset-0 -top-2 -left-2 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shine transition-opacity duration-500" />
    </motion.div>
  );
}

/**
 * Travel destination card with specific styling
 */
export function TravelCard({ children, className, ...props }: AnimatedCardProps) {
  return (
    <AnimatedCard
      className={cn(
        "bg-gradient-to-br from-white to-blue-50/30",
        "border-blue-200/50",
        className
      )}
      hoverScale={1.03}
      {...props}
    >
      {children}
    </AnimatedCard>
  );
}

/**
 * Feature card with purple accent
 */
export function FeatureCard({ children, className, ...props }: AnimatedCardProps) {
  return (
    <AnimatedCard
      className={cn(
        "bg-gradient-to-br from-white to-purple-50/30",
        "border-purple-200/50",
        className
      )}
      hoverScale={1.02}
      {...props}
    >
      {children}
    </AnimatedCard>
  );
}
