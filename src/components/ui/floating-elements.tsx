/**
 * Magic UI Floating Elements Component
 * Beautiful floating animated elements for backgrounds
 * Creates a dynamic, engaging visual experience
 */

'use client';

import { motion } from 'framer-motion';
import { Plane, MapPin, Star, Heart, Compass, Camera } from 'lucide-react';

interface FloatingElementProps {
  icon: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  className?: string;
}

/**
 * Individual floating element
 */
function FloatingElement({
  icon,
  size = 'md',
  color = 'text-blue-400',
  delay = 0,
  duration = 4,
  x = 0,
  y = 0,
  className = '',
}: FloatingElementProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: [0.3, 0.6, 0.3],
        scale: [0.8, 1.2, 0.8],
        x: [x, x + 20, x - 10, x],
        y: [y, y - 30, y + 20, y],
        rotate: [0, 180, 360],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={`absolute ${sizeClasses[size]} ${color} ${className}`}
    >
      {icon}
    </motion.div>
  );
}

/**
 * Floating elements background container
 */
export function FloatingElementsBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden">
      {/* Floating travel icons */}
      <FloatingElement
        icon={<Plane />}
        size="lg"
        color="text-blue-400/30"
        delay={0}
        duration={6}
        x={50}
        y={100}
        className="top-20 left-10"
      />
      
      <FloatingElement
        icon={<MapPin />}
        size="md"
        color="text-purple-400/30"
        delay={1}
        duration={5}
        x={-30}
        y={80}
        className="top-40 right-20"
      />
      
      <FloatingElement
        icon={<Star />}
        size="sm"
        color="text-yellow-400/30"
        delay={2}
        duration={7}
        x={40}
        y={-20}
        className="top-60 left-1/3"
      />
      
      <FloatingElement
        icon={<Heart />}
        size="md"
        color="text-pink-400/30"
        delay={0.5}
        duration={4}
        x={-20}
        y={60}
        className="top-80 right-1/3"
      />
      
      <FloatingElement
        icon={<Compass />}
        size="lg"
        color="text-emerald-400/30"
        delay={1.5}
        duration={6}
        x={30}
        y={-40}
        className="top-32 left-2/3"
      />
      
      <FloatingElement
        icon={<Camera />}
        size="sm"
        color="text-orange-400/30"
        delay={2.5}
        duration={5}
        x={-40}
        y={40}
        className="top-72 left-1/4"
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

/**
 * Floating particles effect
 */
export function FloatingParticles({ count = 20 }: { count?: number }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-blue-400/20 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 10,
            opacity: 0,
          }}
          animate={{
            y: -10,
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
}

/**
 * Animated background shapes
 */
export function AnimatedShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Large background shapes */}
      <motion.div
        className="absolute top-20 left-10 w-32 h-32 bg-blue-200/20 rounded-full"
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          rotate: [0, 180, 360],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      
      <motion.div
        className="absolute top-40 right-20 w-24 h-24 bg-purple-200/20 rounded-full"
        animate={{
          x: [0, -80, 0],
          y: [0, 60, 0],
          rotate: [360, 180, 0],
          scale: [1, 0.8, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      
      <motion.div
        className="absolute bottom-40 left-1/4 w-20 h-20 bg-green-200/20 rounded-full"
        animate={{
          x: [0, 60, 0],
          y: [0, -40, 0],
          rotate: [0, -180, -360],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
}
