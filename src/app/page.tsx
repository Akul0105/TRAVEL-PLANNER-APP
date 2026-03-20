'use client';

import { useRef } from 'react';
import { HeroSection } from '@/components/HeroSection';
import { DestinationCatalog } from '@/components/DestinationCatalog';
import { BentoExperiencesSection } from '@/components/BentoExperiencesSection';
import { Footer } from '@/components/layout/Footer';
import { useSearch } from '@/hooks/useSearch';
import { SearchSuggestion } from '@/types';

export default function Home() {
  const destinationsRef = useRef<HTMLElement | null>(null);

  const {
    suggestions,
    marketBasketResults,
    isLoading: isSearchLoading,
    showSuggestions,
    updateQuery,
    handleSuggestionClick: onSuggestionClick,
  } = useSearch();

  const handleSearch = (query: string) => updateQuery(query);
  const handleStartJourney = () => {
    destinationsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <HeroSection onStartJourney={handleStartJourney} />
      <DestinationCatalog
        sectionRef={destinationsRef}
        onSearch={handleSearch}
        suggestions={suggestions}
        marketBasketResults={marketBasketResults}
        isLoading={isSearchLoading}
        showSuggestions={showSuggestions}
        onSuggestionClick={(suggestion: SearchSuggestion) => onSuggestionClick(suggestion)}
      />
      <BentoExperiencesSection />
      <Footer />
    </>
  );
}
