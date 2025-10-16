/**
 * Main Page Component - Travel Agent Planner
 * This is the main landing page that integrates all components:
 * - Hero section with search functionality
 * - Floating chat icon
 * - Chatbot interface
 * 
 * The page demonstrates:
 * - AI-powered travel recommendations
 * - Market basket analysis simulation
 * - Google-like search suggestions
 * - Modern, aesthetic UI design
 */

'use client';

import { useEffect } from 'react';
import { HeroSection } from '@/components/HeroSection';
import { FloatingChatIcon } from '@/components/FloatingChatIcon';
import { Chatbot } from '@/components/Chatbot';
import { useChatbot } from '@/hooks/useChatbot';
import { useSearch } from '@/hooks/useSearch';
import { AnimatedCard } from '@/components/ui/animated-card';
import { SearchSuggestion } from '@/types';
import { MagicButton } from '@/components/ui/magic-button';
import { FadeInText, AnimatedGradientText } from '@/components/ui/text-animations';

export default function Home() {
  // Initialize chatbot and search hooks
  const {
    isOpen: isChatbotOpen,
    toggleChatbot,
    closeChatbot,
    initializeChatbot,
  } = useChatbot();

  const {
    query,
    suggestions,
    marketBasketResults,
    isLoading: isSearchLoading,
    showSuggestions,
    updateQuery,
    performSearch,
    handleSuggestionClick: onSuggestionClick,
  } = useSearch();

  // Initialize chatbot with welcome message when component mounts
  useEffect(() => {
    initializeChatbot();
  }, [initializeChatbot]);

  /**
   * Handle search query updates
   * This function is called when user types in the search bar
   * @param query - The search query string
   */
  const handleSearch = (query: string) => {
    updateQuery(query);
  };

  /**
   * Handle search submission
   * This function is called when user submits a search
   * @param query - The search query string
   */
  const handleSearchSubmit = (query: string) => {
    performSearch(query);
  };

  /**
   * Handle suggestion clicks
   * This function is called when user clicks on a search suggestion
   * @param suggestion - The clicked suggestion object
   */
  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    onSuggestionClick(suggestion);
  };

  return (
    <>
      {/* Main Hero Section with Video Background */}
      <HeroSection
        onSearch={handleSearch}
        suggestions={suggestions}
        marketBasketResults={marketBasketResults}
        isLoading={isSearchLoading}
        showSuggestions={showSuggestions}
        onSuggestionClick={handleSuggestionClick}
      />

      {/* Floating Chat Icon */}
      <FloatingChatIcon
        onClick={toggleChatbot}
        isOpen={isChatbotOpen}
      />

      {/* Chatbot Interface */}
      <Chatbot
        isOpen={isChatbotOpen}
        onToggle={toggleChatbot}
        onClose={closeChatbot}
      />

      {/* Popular Destinations Section */}
      <section className="py-20 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <FadeInText className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                <AnimatedGradientText>Popular Destinations</AnimatedGradientText>
              </h2>
              <p className="text-lg text-gray-600">
                Discover amazing places around the world with our AI-powered recommendations
              </p>
            </FadeInText>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { name: 'Mauritius', image: '🏝️', description: 'Tropical paradise with pristine beaches' },
                { name: 'London', image: '🏛️', description: 'Historic city with royal heritage' },
                { name: 'Paris', image: '🗼', description: 'City of lights and romance' },
                { name: 'Tokyo', image: '🏯', description: 'Modern metropolis with ancient traditions' },
                { name: 'Bali', image: '🌺', description: 'Island of gods and spiritual retreats' },
                { name: 'Dubai', image: '🏙️', description: 'Luxury destination in the desert' },
              ].map((destination, index) => (
                <AnimatedCard
                  key={destination.name}
                  delay={index * 0.1}
                  className="p-6 text-center hover:scale-105 transition-transform duration-300"
                >
                  <div className="text-6xl mb-4">{destination.image}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{destination.name}</h3>
                  <p className="text-gray-600 mb-4">{destination.description}</p>
                  <MagicButton variant="travel" size="sm">
                    Explore {destination.name}
                  </MagicButton>
                </AnimatedCard>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
