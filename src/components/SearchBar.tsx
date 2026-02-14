'use client';
import { useState, useRef } from 'react';
import { Search, Loader2, MapPin, Plane, Hotel, Package, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchBarProps, SearchSuggestion } from '@/types';
import { cn } from '@/lib/utils';

function getSuggestionIcon(type: SearchSuggestion['type']) {
  switch (type) {
    case 'destination':
      return <MapPin className="w-4 h-4 text-blue-500" />;
    case 'flight':
      return <Plane className="w-4 h-4 text-green-500" />;
    case 'hotel':
      return <Hotel className="w-4 h-4 text-purple-500" />;
    case 'package':
      return <Package className="w-4 h-4 text-orange-500" />;
    case 'activity':
      return <Activity className="w-4 h-4 text-red-500" />;
    default:
      return <Search className="w-4 h-4 text-gray-500" />;
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
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
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
              "w-full h-14 pl-12 pr-16 rounded-2xl border-2",
              "bg-white shadow-lg focus:shadow-xl",
              "text-gray-900 placeholder-gray-500",
              "transition-all duration-300 ease-in-out",
              "focus:outline-none focus:ring-4 focus:ring-blue-100",
              isFocused 
                ? "border-blue-500" 
                : "border-gray-200 hover:border-gray-300"
            )}
          />
          
          {isLoading && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
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
              "bg-white rounded-xl shadow-xl border border-gray-200",
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
                  "hover:bg-gray-50 cursor-pointer",
                  "transition-colors duration-150",
                  "first:rounded-t-xl last:rounded-b-xl"
                )}
              >
                {getSuggestionIcon(suggestion.type)}
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">
                    {suggestion.text}
                  </p>
                  <p className="text-sm text-gray-500 capitalize">
                    {suggestion.type} • {suggestion.popularity}% popular
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Popular Searches */}
      {!isFocused && inputValue === '' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-center"
        >
          <p className="text-sm text-gray-500 mb-2">Popular searches:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {['Paris', 'Tokyo', 'Bali', 'New York', 'London'].map((term) => (
              <button
                key={term}
                onClick={() => {
                  const suggestion: SearchSuggestion = {
                    id: term.toLowerCase().replace(' ', '-'),
                    text: term,
                    type: 'destination',
                    popularity: 85
                  };
                  handleSuggestionClick(suggestion);
                }}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
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
