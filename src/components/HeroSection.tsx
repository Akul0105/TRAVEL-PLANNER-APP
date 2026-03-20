'use client';

import { ChevronDown } from 'lucide-react';

interface HeroSectionProps {
  onStartJourney: () => void;
}

export function HeroSection({ onStartJourney }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen overflow-hidden flex flex-col justify-center -mt-16 md:-mt-[4.25rem] pt-16 md:pt-[4.25rem]">
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/WhatsApp Video 2025-10-16 at 17.40.21.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36">
        <div className="max-w-4xl">
          <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.28em] text-white/70 mb-6">
            Travel intelligence
          </p>
          <h1 className="text-[2.25rem] sm:text-5xl md:text-6xl lg:text-[4rem] font-semibold text-white mb-10 md:mb-14 leading-[1.05] tracking-[-0.03em]">
            Your trusted partner for quality travel planning
          </h1>

          <button
            type="button"
            onClick={onStartJourney}
            className="group inline-flex items-center gap-3 rounded-full bg-white text-neutral-950 px-8 py-4 md:px-10 md:py-5 text-base md:text-lg font-semibold tracking-tight shadow-[0_24px_80px_-20px_rgba(0,0,0,0.5)] transition-all duration-300 hover:bg-neutral-100 hover:-translate-y-0.5"
          >
            Start your journey
            <ChevronDown className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-300 group-hover:translate-y-0.5 opacity-80" />
          </button>
        </div>
      </div>
    </section>
  );
}
