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
import { TravelGradientText } from '@/components/ui/gradient-text';
import { SearchSuggestion } from '@/types';
import { MagicBackground } from '@/components/ui/magic-background';
import { MagicButton, TravelCTA } from '@/components/ui/magic-button';
import { FadeInText, SlideInText, BounceInText, AnimatedGradientText } from '@/components/ui/text-animations';

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
    <MagicBackground>
      {/* Main Hero Section with Search */}
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

      {/* Services Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <FadeInText className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                <TravelGradientText>Our Services</TravelGradientText>
              </h2>
              <p className="text-lg text-gray-600">
                Everything you need for the perfect trip, powered by AI
              </p>
            </FadeInText>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <SlideInText direction="up" delay={0.2} className="text-center">
                <AnimatedCard className="p-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl">🤖</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">AI Travel Agent</h3>
                  <p className="text-gray-600 mb-6">
                    Get personalized recommendations and 24/7 assistance from our AI-powered travel agent
                  </p>
                  <MagicButton variant="primary">
                    Chat with AI
                  </MagicButton>
                </AnimatedCard>
              </SlideInText>

              <SlideInText direction="up" delay={0.4} className="text-center">
                <AnimatedCard className="p-8">
                  <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl">🔍</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Smart Search</h3>
                  <p className="text-gray-600 mb-6">
                    Find the best destinations, hotels, and activities with our intelligent search engine
                  </p>
                  <MagicButton variant="magic">
                    Start Searching
                  </MagicButton>
                </AnimatedCard>
              </SlideInText>

              <SlideInText direction="up" delay={0.6} className="text-center">
                <AnimatedCard className="p-8">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl">📊</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Market Analysis</h3>
                  <p className="text-gray-600 mb-6">
                    Discover related destinations and activities based on what other travelers love
                  </p>
                  <MagicButton variant="travel">
                    Explore More
                  </MagicButton>
                </AnimatedCard>
              </SlideInText>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-500 to-teal-600">
        <div className="container mx-auto px-4 text-center">
          <BounceInText>
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Plan Your Dream Trip?
            </h2>
            <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
              Let our AI travel agent help you discover amazing destinations and create unforgettable memories
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <TravelCTA onClick={toggleChatbot}>
                Start Planning Now
              </TravelCTA>
              <MagicButton 
                variant="secondary" 
                size="lg"
                className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/30"
              >
                View Destinations
              </MagicButton>
            </div>
          </BounceInText>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <FadeInText>
            <h3 className="text-2xl font-bold mb-4">
              <AnimatedGradientText>Travel Agent Planner</AnimatedGradientText>
            </h3>
            <p className="text-gray-400 mb-4">
              AI-powered travel planning with market basket analysis
            </p>
            <p className="text-sm text-gray-500">
              Built with Next.js, TypeScript, Tailwind CSS, and Mystral AI
            </p>
          </FadeInText>
        </div>
      </footer>
    </MagicBackground>
  );
}
