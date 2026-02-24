'use client';

import { HeroSection } from '@/components/HeroSection';
import { PopularDestinations } from '@/components/PopularDestinations';
import { UserDetailsForm } from '@/components/UserDetailsForm';
import { Footer } from '@/components/layout/Footer';
import { useSearch } from '@/hooks/useSearch';
import { SearchSuggestion } from '@/types';

export default function Home() {
  const {
    suggestions,
    marketBasketResults,
    isLoading: isSearchLoading,
    showSuggestions,
    updateQuery,
    performSearch,
    handleSuggestionClick: onSuggestionClick,
  } = useSearch();

  const handleSearch = (query: string) => updateQuery(query);

  return (
    <>
      <HeroSection
        onSearch={handleSearch}
        suggestions={suggestions}
        marketBasketResults={marketBasketResults}
        isLoading={isSearchLoading}
        showSuggestions={showSuggestions}
        onSuggestionClick={(suggestion: SearchSuggestion) => onSuggestionClick(suggestion)}
      />
      <PopularDestinations />
      <UserDetailsForm />
      <Footer />
    </>
  );
}
