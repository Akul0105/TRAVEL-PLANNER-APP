/**
 * Custom hook for managing search functionality
 * This hook handles search state, suggestions, and debounced API calls
 */

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SearchSuggestion, SearchState } from '@/types';
import { getSearchSuggestions } from '@/services/mystralService';
import { debounce, generateId } from '@/lib/utils';

/**
 * Custom hook for search functionality
 * Manages search state, suggestions, and debounced API calls
 * @returns Object containing search state and functions
 */
export function useSearch() {
  const router = useRouter();
  const [state, setState] = useState<SearchState>({
    query: '',
    suggestions: [],
    results: [],
    isLoading: false,
    showSuggestions: false,
  });

  const [marketBasketResults, setMarketBasketResults] = useState<SearchSuggestion[]>([]);

  /**
   * Debounced function to fetch search suggestions
   * This prevents excessive API calls while user is typing
   */
  const debouncedFetchSuggestions = useCallback(
    debounce(async (query: string) => {
      if (!query.trim()) {
        setState(prev => ({
          ...prev,
          suggestions: [],
          showSuggestions: false,
          isLoading: false,
        }));
        return;
      }

      setState(prev => ({ ...prev, isLoading: true }));

      try {
        const { suggestions, marketBasket } = await getSearchSuggestions(query);
        
        // Convert string suggestions to SearchSuggestion objects
        const searchSuggestions: SearchSuggestion[] = suggestions.map((suggestion, index) => ({
          id: generateId(),
          text: suggestion,
          type: getSuggestionType(suggestion),
          popularity: Math.floor(Math.random() * 100), // Simulate popularity score
        }));

        // Convert market basket results to SearchSuggestion objects
        const marketBasketSuggestions: SearchSuggestion[] = marketBasket.map((item, index) => ({
          id: generateId(),
          text: item,
          type: getSuggestionType(item),
          popularity: Math.floor(Math.random() * 100),
        }));

        setState(prev => ({
          ...prev,
          suggestions: searchSuggestions,
          showSuggestions: true,
          isLoading: false,
        }));

        setMarketBasketResults(marketBasketSuggestions);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setState(prev => ({
          ...prev,
          suggestions: [],
          showSuggestions: false,
          isLoading: false,
        }));
      }
    }, 300),
    []
  );

  /**
   * Update search query and trigger suggestions
   * @param query - The new search query
   */
  const updateQuery = useCallback((query: string) => {
    setState(prev => ({ ...prev, query }));
    debouncedFetchSuggestions(query);
  }, [debouncedFetchSuggestions]);

  /**
   * Handle search submission
   * @param query - The search query to submit
   */
  const performSearch = useCallback((query: string) => {
    setState(prev => ({
      ...prev,
      query,
      showSuggestions: false,
      isLoading: true,
    }));

    // Simulate search results (in a real app, this would call a search API)
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        isLoading: false,
        showSuggestions: false,
      }));
    }, 1000);
  }, []);

  /**
   * Handle suggestion click - Navigate to details page
   * @param suggestion - The clicked suggestion
   */
  const handleSuggestionClick = useCallback((suggestion: SearchSuggestion) => {
    setState(prev => ({
      ...prev,
      query: suggestion.text,
      showSuggestions: false,
    }));
    
    // Navigate to details page with the suggestion information
    const params = new URLSearchParams({
      query: suggestion.text,
      type: suggestion.type,
      id: suggestion.id,
    });
    
    router.push(`/details?${params.toString()}`);
  }, [router]);

  /**
   * Hide suggestions
   */
  const hideSuggestions = useCallback(() => {
    setState(prev => ({
      ...prev,
      showSuggestions: false,
    }));
  }, []);

  /**
   * Clear search
   */
  const clearSearch = useCallback(() => {
    setState(prev => ({
      ...prev,
      query: '',
      suggestions: [],
      results: [],
      showSuggestions: false,
      isLoading: false,
    }));
  }, []);

  /**
   * Determine suggestion type based on content
   * @param suggestion - The suggestion text
   * @returns The suggestion type
   */
  function getSuggestionType(suggestion: string): SearchSuggestion['type'] {
    const lowerSuggestion = suggestion.toLowerCase();
    
    if (lowerSuggestion.includes('hotel') || lowerSuggestion.includes('resort')) {
      return 'hotel';
    }
    if (lowerSuggestion.includes('flight') || lowerSuggestion.includes('airline')) {
      return 'flight';
    }
    if (lowerSuggestion.includes('package') || lowerSuggestion.includes('deal')) {
      return 'package';
    }
    if (lowerSuggestion.includes('tour') || lowerSuggestion.includes('activity')) {
      return 'activity';
    }
    
    return 'destination';
  }

  // Cleanup debounced function on unmount
  useEffect(() => {
    return () => {
      // Cleanup is handled by the debounce function itself
    };
  }, []);

  return {
    // State
    query: state.query,
    suggestions: state.suggestions,
    marketBasketResults,
    results: state.results,
    isLoading: state.isLoading,
    showSuggestions: state.showSuggestions,
    
    // Actions
    updateQuery,
    performSearch,
    handleSuggestionClick,
    hideSuggestions,
    clearSearch,
  };
}
