'use client';
import { useState, useRef } from 'react';
import { Search, Loader2, MapPin, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchBarProps, SearchSuggestion } from '@/types';
import { cn } from '@/lib/utils';

function getSuggestionIcon(type: SearchSuggestion['type']) {
  const iconClass = 'w-4 h-4 text-neutral-500';
  if (type === 'activity') return <Activity className={iconClass} />;
  return <MapPin className={iconClass} />;
}

export function SearchBar({
  onSearch,
  suggestions,
  isLoading,
  showSuggestions,
  onSuggestionClick,
  variant = 'dark',
  className,
  showPopularPills = true,
  dense = false,
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

  const isDark = variant === 'dark';

  return (
    <div className={cn('relative w-full max-w-2xl mx-auto', className)}>
      {/* Search Input */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search
            className={cn(
              'absolute top-1/2 -translate-y-1/2 text-neutral-500',
              dense ? 'left-3 h-4 w-4' : 'left-4 h-5 w-5'
            )}
          />
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder="Search destinations & activities (MBA-powered)…"
            className={cn(
              'w-full rounded-lg border text-base',
              dense ? 'h-11 pl-10 pr-14 text-sm' : 'h-14 pl-12 pr-16',
              "backdrop-blur text-black placeholder-neutral-500",
              "transition-all duration-200",
              isDark
                ? "bg-white/95 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/50"
                : "bg-white focus:outline-none focus:ring-2 focus:ring-neutral-950/10 focus:border-neutral-950/25",
              isDark
                ? (isFocused ? "border-white/40" : "border-white/30 hover:border-white/50")
                : (isFocused ? "border-neutral-950/25" : "border-neutral-200 hover:border-neutral-300")
            )}
          />
          
          {isLoading && (
            <div className={cn('absolute top-1/2 -translate-y-1/2', dense ? 'right-3' : 'right-4')}>
              <Loader2 className={cn(dense ? 'h-4 w-4' : 'h-5 w-5', 'animate-spin', isDark ? 'text-white' : 'text-neutral-950')} />
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
                <div className="flex-1 min-w-0">
                  <p className="text-black font-medium text-base">{suggestion.text}</p>
                  <p className="text-sm text-neutral-500 line-clamp-2">
                    {suggestion.subtitle
                      ? suggestion.subtitle
                      : `${suggestion.type === 'activity' ? 'Activity' : 'Destination'}${suggestion.popularity != null ? ` · match score ${suggestion.popularity}%` : ''}`}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Popular Searches */}
      {showPopularPills && !isFocused && inputValue === '' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-5 text-center">
          <p className={cn('text-sm font-medium mb-3', isDark ? 'text-white/80' : 'text-neutral-600')}>Popular searches</p>
          <div className="flex flex-wrap gap-2.5 justify-center">
            {['Mauritius', 'Paris', 'Tokyo', 'Bali', 'Dubai'].map((term) => (
              <button
                key={term}
                onClick={() => {
                  handleSuggestionClick({ id: term.toLowerCase().replace(' ', '-'), text: term, type: 'destination', popularity: 85 });
                }}
                className={cn(
                  'px-4 py-2 text-sm rounded-full transition-colors font-medium',
                  isDark
                    ? 'bg-white/20 hover:bg-white/30 text-white'
                    : 'bg-neutral-950/[0.06] hover:bg-neutral-950/10 text-neutral-950'
                )}
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
