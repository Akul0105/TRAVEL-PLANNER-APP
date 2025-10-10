/**
 * Hero Section Component
 * Main landing section with travel agency branding and search functionality
 * Features animated elements and call-to-action buttons
 */

'use client';

import { Plane, MapPin, Star } from 'lucide-react';
import { SearchBar } from './SearchBar';
import { SearchSuggestion } from '@/types';
import { ShimmerText } from './ui/gradient-text';
import { AnimatedCard, FeatureCard } from './ui/animated-card';
import { HeroBackground } from './ui/magic-background';
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
    <HeroBackground>
      <section className="relative min-h-screen overflow-hidden">

      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Heading */}
          <FadeInText delay={0.2} className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              Your Dream{' '}
              <AnimatedGradientText className="text-5xl md:text-7xl">
                Travel
              </AnimatedGradientText>{' '}
              Awaits
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
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

          {/* Magic UI Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <FeatureCard delay={0.4} className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
                  <Plane className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered Planning</h3>
                <p className="text-gray-600">
                  Get personalized travel recommendations powered by advanced AI and market basket analysis.
                </p>
              </div>
            </FeatureCard>

            <FeatureCard delay={0.6} className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-4">
                  <MapPin className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Search</h3>
                <p className="text-gray-600">
                  Find destinations, hotels, and activities with intelligent search suggestions.
                </p>
              </div>
            </FeatureCard>

            <FeatureCard delay={0.8} className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-4">
                  <Star className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Guidance</h3>
                <p className="text-gray-600">
                  Chat with our AI travel agent for instant advice and recommendations.
                </p>
              </div>
            </FeatureCard>
          </div>

          {/* Magic UI Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <AnimatedCard delay={1.0} className="p-6 text-center">
              <ShimmerText className="text-3xl md:text-4xl mb-2">10K+</ShimmerText>
              <div className="text-gray-600">Happy Travelers</div>
            </AnimatedCard>
            <AnimatedCard delay={1.2} className="p-6 text-center">
              <ShimmerText className="text-3xl md:text-4xl mb-2">500+</ShimmerText>
              <div className="text-gray-600">Destinations</div>
            </AnimatedCard>
            <AnimatedCard delay={1.4} className="p-6 text-center">
              <ShimmerText className="text-3xl md:text-4xl mb-2">24/7</ShimmerText>
              <div className="text-gray-600">AI Support</div>
            </AnimatedCard>
            <AnimatedCard delay={1.6} className="p-6 text-center">
              <ShimmerText className="text-3xl md:text-4xl mb-2">98%</ShimmerText>
              <div className="text-gray-600">Satisfaction</div>
            </AnimatedCard>
          </div>
        </div>
      </div>

      </section>
    </HeroBackground>
  );
}
