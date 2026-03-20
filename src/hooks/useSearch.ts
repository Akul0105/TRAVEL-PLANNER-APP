/**
 * Search: debounced POST /api/search — MBA destinations & activities + optional Mistral blurb.
 * Picking a result does not navigate to /details; parent handles catalog focus via onSuggestionPicked.
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { SearchSuggestion, SearchState } from '@/types';
import { debounce, generateId } from '@/lib/utils';

type SearchApiRow = {
  id: string;
  text: string;
  type: SearchSuggestion['type'];
  subtitle?: string;
  popularity?: number;
};

type SearchApiResponse = {
  suggestions: SearchApiRow[];
  marketBasket: SearchApiRow[];
};

export type UseSearchOptions = {
  /** Called when user picks a dropdown row — scroll catalog, etc. (no route change here). */
  onSuggestionPicked?: (suggestion: SearchSuggestion) => void;
};

export function useSearch(options?: UseSearchOptions) {
  const onPickRef = useRef(options?.onSuggestionPicked);
  onPickRef.current = options?.onSuggestionPicked;

  const [state, setState] = useState<SearchState>({
    query: '',
    suggestions: [],
    results: [],
    isLoading: false,
    showSuggestions: false,
  });

  const [marketBasketResults, setMarketBasketResults] = useState<SearchSuggestion[]>([]);

  const debouncedFetchSuggestions = useCallback(
    debounce(async (query: string) => {
      if (!query.trim()) {
        setState((prev) => ({
          ...prev,
          suggestions: [],
          showSuggestions: false,
          isLoading: false,
        }));
        setMarketBasketResults([]);
        return;
      }

      setState((prev) => ({ ...prev, isLoading: true }));

      try {
        const res = await fetch('/api/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: query.trim() }),
        });
        if (!res.ok) throw new Error(String(res.status));
        const data = (await res.json()) as SearchApiResponse;

        const toSuggestion = (row: SearchApiRow): SearchSuggestion => ({
          id: row.id || generateId(),
          text: row.text,
          type: row.type === 'activity' ? 'activity' : 'destination',
          subtitle: row.subtitle,
          popularity: row.popularity,
        });

        const primary = (data.suggestions ?? []).map(toSuggestion);
        const basket = (data.marketBasket ?? []).map(toSuggestion);

        const seen = new Set(primary.map((s) => s.id));
        const merged: SearchSuggestion[] = [...primary];
        for (const b of basket) {
          if (seen.has(b.id)) continue;
          seen.add(b.id);
          merged.push({ ...b, id: `mba-bundle-${b.id}` });
        }

        setState((prev) => ({
          ...prev,
          suggestions: merged,
          showSuggestions: merged.length > 0,
          isLoading: false,
        }));
        setMarketBasketResults(basket);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setState((prev) => ({
          ...prev,
          suggestions: [],
          showSuggestions: false,
          isLoading: false,
        }));
        setMarketBasketResults([]);
      }
    }, 300),
    []
  );

  const updateQuery = useCallback(
    (query: string) => {
      setState((prev) => ({ ...prev, query }));
      debouncedFetchSuggestions(query);
    },
    [debouncedFetchSuggestions]
  );

  const performSearch = useCallback((query: string) => {
    setState((prev) => ({
      ...prev,
      query,
      showSuggestions: false,
      isLoading: true,
    }));
    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        showSuggestions: false,
      }));
    }, 400);
  }, []);

  const handleSuggestionClick = useCallback((suggestion: SearchSuggestion) => {
    const label = suggestion.text;
    setState((prev) => ({
      ...prev,
      query: label,
      showSuggestions: false,
    }));
    onPickRef.current?.(suggestion);
  }, []);

  const hideSuggestions = useCallback(() => {
    setState((prev) => ({
      ...prev,
      showSuggestions: false,
    }));
  }, []);

  const clearSearch = useCallback(() => {
    setState((prev) => ({
      ...prev,
      query: '',
      suggestions: [],
      results: [],
      showSuggestions: false,
      isLoading: false,
    }));
    setMarketBasketResults([]);
  }, []);

  useEffect(() => {
    return () => {};
  }, []);

  return {
    query: state.query,
    suggestions: state.suggestions,
    marketBasketResults,
    results: state.results,
    isLoading: state.isLoading,
    showSuggestions: state.showSuggestions,
    updateQuery,
    performSearch,
    handleSuggestionClick,
    hideSuggestions,
    clearSearch,
  };
}
