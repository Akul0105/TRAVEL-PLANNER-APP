'use client';

import { useState } from 'react';
import { Search, Filter, SortAsc } from 'lucide-react';

interface SearchHeaderProps {
  searchParams: Record<string, any>;
}

export function SearchHeader({ searchParams }: SearchHeaderProps) {
  const [searchQuery, setSearchQuery] = useState(searchParams.search || '');
  const [sortBy, setSortBy] = useState('popularity');

  const sortOptions = [
    { value: 'popularity', label: 'Most Popular' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'duration', label: 'Duration' }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search destinations, activities, or experiences..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center space-x-2">
          <SortAsc className="w-5 h-5 text-gray-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Filter Button */}
        <button className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <Filter className="w-5 h-5 text-gray-400" />
          <span className="text-gray-700">Filters</span>
        </button>
      </div>

      {/* Active Filters */}
      {(searchParams.category || searchParams.price || searchParams.duration) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {searchParams.category && (
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
              Category: {searchParams.category}
            </span>
          )}
          {searchParams.price && (
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
              Price: {searchParams.price}
            </span>
          )}
          {searchParams.duration && (
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
              Duration: {searchParams.duration}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
