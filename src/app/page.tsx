'use client';

import { useRef, useState, useCallback } from 'react';
import { HeroSection } from '@/components/HeroSection';
import { DestinationCatalog } from '@/components/DestinationCatalog';
import { BentoExperiencesSection } from '@/components/BentoExperiencesSection';
import { Footer } from '@/components/layout/Footer';
import { useSearch } from '@/hooks/useSearch';
import { suggestionToCatalogId } from '@/lib/catalogSearchBridge';
import { SearchSuggestion } from '@/types';

export default function Home() {
  const destinationsRef = useRef<HTMLElement | null>(null);
  const [catalogFocusId, setCatalogFocusId] = useState<string | null>(null);

  const onSuggestionPicked = useCallback((suggestion: SearchSuggestion) => {
    const catalogId = suggestionToCatalogId(suggestion);
    destinationsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (catalogId) setCatalogFocusId(catalogId);
  }, []);

  const {
    suggestions,
    marketBasketResults,
    isLoading: isSearchLoading,
    showSuggestions,
    updateQuery,
    handleSuggestionClick: onSuggestionClick,
  } = useSearch({ onSuggestionPicked });

  const handleSearch = (query: string) => updateQuery(query);
  const handleStartJourney = () => {
    destinationsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <HeroSection onStartJourney={handleStartJourney} />
      <DestinationCatalog
        sectionRef={destinationsRef}
        catalogFocusId={catalogFocusId}
        onCatalogFocusConsumed={() => setCatalogFocusId(null)}
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
