/**
 * Hero Section Component
 * Main landing section with travel agency branding and search functionality
 * Features animated elements and call-to-action buttons
 */

'use client';

import { SearchBar } from './SearchBar';
import { SearchSuggestion } from '@/types';
import { FadeInText, SlideInText, AnimatedGradientText } from './ui/text-animations';

interface HeroSectionProps {
  onSearch: (query: string) => void;
  suggestions: SearchSuggestion[];
  marketBasketResults?: SearchSuggestion[];
  isLoading: boolean;
  showSuggestions: boolean;
  onSuggestionClick: (suggestion: SearchSuggestion) => void;
}

/**
 * Hero section component with travel agency branding
 * @param onSearch - Function to handle search queries
 * @param suggestions - Array of search suggestions
 * @param isLoading - Whether suggestions are loading
 * @param showSuggestions - Whether to show suggestions
 * @param onSuggestionClick - Function to handle suggestion clicks
 */
export function HeroSection({
  onSearch,
  suggestions,
  marketBasketResults = [],
  isLoading,
  showSuggestions,
  onSuggestionClick,
}: HeroSectionProps) {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Video Background */}
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
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Heading */}
          <FadeInText delay={0.2} className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Your Dream{' '}
              <AnimatedGradientText className="text-5xl md:text-7xl">
                Travel
              </AnimatedGradientText>{' '}
              Awaits
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Discover amazing destinations, get personalized recommendations, and plan your perfect trip 
              with our AI-powered travel agent. Experience the future of travel planning.
            </p>
          </FadeInText>

          {/* Search Bar */}
          <SlideInText direction="up" delay={0.4} className="mb-12">
            <SearchBar
              onSearch={onSearch}
              suggestions={suggestions}
              marketBasketResults={marketBasketResults}
              isLoading={isLoading}
              showSuggestions={showSuggestions}
              onSuggestionClick={onSuggestionClick}
            />
          </SlideInText>

        </div>
      </div>

    </section>
  );
}
