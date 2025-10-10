/**
 * Magic UI Background Component
 * Beautiful animated background with travel-themed elements
 * Creates an immersive travel agency atmosphere
 */

'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Plane, MapPin, Star, Heart, Compass, Camera, Mountain, Waves } from 'lucide-react';

/**
 * Animated background particles
 */
function FloatingParticles() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="absolute inset-0 overflow-hidden pointer-events-none"></div>;
  }

  const particles = Array.from({ length: 20 }, (_, i) => (
    <motion.div
      key={i}
      className="absolute w-2 h-2 bg-blue-400/20 rounded-full"
      initial={{
        x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
        y: (typeof window !== 'undefined' ? window.innerHeight : 800) + 10,
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
  ));

  return <div className="absolute inset-0 overflow-hidden pointer-events-none">{particles}</div>;
}

/**
 * Travel-themed floating icons
 */
function TravelIcons() {
  const icons = [
    { Icon: Plane, delay: 0, duration: 6, x: 50, y: 100, className: "top-20 left-10 text-blue-400/30" },
    { Icon: MapPin, delay: 1, duration: 5, x: -30, y: 80, className: "top-40 right-20 text-purple-400/30" },
    { Icon: Star, delay: 2, duration: 7, x: 40, y: -20, className: "top-60 left-1/3 text-yellow-400/30" },
    { Icon: Heart, delay: 0.5, duration: 4, x: -20, y: 60, className: "top-80 right-1/3 text-pink-400/30" },
    { Icon: Compass, delay: 1.5, duration: 6, x: 30, y: -40, className: "top-32 left-2/3 text-emerald-400/30" },
    { Icon: Camera, delay: 2.5, duration: 5, x: -40, y: 40, className: "top-72 left-1/4 text-orange-400/30" },
    { Icon: Mountain, delay: 3, duration: 8, x: 60, y: -60, className: "top-16 right-1/4 text-green-400/30" },
    { Icon: Waves, delay: 1.2, duration: 5.5, x: -50, y: 30, className: "top-96 left-1/2 text-cyan-400/30" },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {icons.map(({ Icon, delay, duration, x, y, className }, index) => (
        <motion.div
          key={index}
          className={`absolute ${className}`}
          animate={{
            x: [0, x, 0],
            y: [0, y, 0],
            rotate: [0, 180, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration,
            delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Icon className="w-8 h-8" />
        </motion.div>
      ))}
    </div>
  );
}

/**
 * Gradient mesh background
 */
function GradientMesh() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <motion.div
        className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-teal-600/20 rounded-full blur-3xl"
        animate={{
          x: [0, -100, 0],
          y: [0, 50, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-pink-400/10 to-orange-600/10 rounded-full blur-3xl"
        animate={{
          rotate: [0, 360],
          scale: [1, 1.3, 1],
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

/**
 * Main Magic Background Component
 */
export function MagicBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50" />
      
      {/* Gradient mesh overlay */}
      <GradientMesh />
      
      {/* Floating particles */}
      <FloatingParticles />
      
      {/* Travel icons */}
      <TravelIcons />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

/**
 * Hero section specific background
 */
export function HeroBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Enhanced gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50" />
      
      {/* Animated shapes */}
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

      {/* Travel icons */}
      <TravelIcons />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
