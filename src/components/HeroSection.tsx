'use client';

import { SearchBar } from './SearchBar';
import { SearchSuggestion } from '@/types';

interface HeroSectionProps {
  onSearch: (query: string) => void;
  suggestions: SearchSuggestion[];
  marketBasketResults?: SearchSuggestion[];
  isLoading: boolean;
  showSuggestions: boolean;
  onSuggestionClick: (suggestion: SearchSuggestion) => void;
}

export function HeroSection({
  onSearch,
  suggestions,
  marketBasketResults = [],
  isLoading,
  showSuggestions,
  onSuggestionClick,
}: HeroSectionProps) {
  return (
    <section className="relative min-h-screen overflow-hidden flex flex-col justify-center -mt-20 md:-mt-24 pt-20 md:pt-24">
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
        <div className="absolute inset-0 bg-black/55" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white mb-6 leading-[1.1] tracking-tight">
            Your trusted partner for quality travel planning
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-10 leading-relaxed">
            Planify delivers expert travel planning, creating memorable trips with personalized recommendations and AI-powered suggestions.
          </p>

          <SearchBar
            onSearch={onSearch}
            suggestions={suggestions}
            marketBasketResults={marketBasketResults}
            isLoading={isLoading}
            showSuggestions={showSuggestions}
            onSuggestionClick={onSuggestionClick}
          />
        </div>
      </div>
    </section>
  );
}
