'use client';
import { useState, useRef } from 'react';
import { Search, Loader2, MapPin, Plane, Hotel, Package, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchBarProps, SearchSuggestion } from '@/types';
import { cn } from '@/lib/utils';

function getSuggestionIcon(type: SearchSuggestion['type']) {
  const iconClass = 'w-4 h-4 text-neutral-500';
  switch (type) {
    case 'destination': return <MapPin className={iconClass} />;
    case 'flight': return <Plane className={iconClass} />;
    case 'hotel': return <Hotel className={iconClass} />;
    case 'package': return <Package className={iconClass} />;
    case 'activity': return <Activity className={iconClass} />;
    default: return <Search className={iconClass} />;
  }
}

export function SearchBar({
  onSearch,
  suggestions,
  isLoading,
  showSuggestions,
  onSuggestionClick,
}: SearchBarProps) {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    onSearch(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSearch(inputValue.trim());
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setInputValue(suggestion.text);
    onSuggestionClick(suggestion);
    setIsFocused(false);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setIsFocused(false);
    }, 200);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Search Input */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-500" />
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder="Search for destinations, hotels, flights, packages..."
            className={cn(
              "w-full h-14 pl-12 pr-16 rounded-lg border text-base",
              "bg-white/95 backdrop-blur text-black placeholder-neutral-500",
              "transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/50",
              isFocused ? "border-white/40" : "border-white/30 hover:border-white/50"
            )}
          />
          
          {isLoading && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <Loader2 className="w-5 h-5 text-white animate-spin" />
            </div>
          )}
        </div>
      </form>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && isFocused && (
          <motion.div
            ref={suggestionsRef}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "absolute top-full left-0 right-0 mt-2",
              "bg-white rounded-lg shadow-lg border border-black/10",
              "max-h-80 overflow-y-auto z-50"
            )}
          >
            {suggestions.map((suggestion, index) => (
              <motion.div
                key={suggestion.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleSuggestionClick(suggestion)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3",
                  "hover:bg-neutral-50 cursor-pointer transition-colors",
                  "first:rounded-t-lg last:rounded-b-lg"
                )}
              >
                {getSuggestionIcon(suggestion.type)}
                <div className="flex-1">
                  <p className="text-black font-medium text-base">{suggestion.text}</p>
                  <p className="text-base text-neutral-500 capitalize">{suggestion.type} • {suggestion.popularity}% popular</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Popular Searches */}
      {!isFocused && inputValue === '' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-5 text-center">
          <p className="text-base text-white/80 mb-3">Popular searches</p>
          <div className="flex flex-wrap gap-2.5 justify-center">
            {['Paris', 'Tokyo', 'Bali', 'New York', 'London'].map((term) => (
              <button
                key={term}
                onClick={() => {
                  handleSuggestionClick({ id: term.toLowerCase().replace(' ', '-'), text: term, type: 'destination', popularity: 85 });
                }}
                className="px-4 py-2 text-base bg-white/20 hover:bg-white/30 text-white rounded-full transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
