'use client';

import { useState } from 'react';
import { Filter, X, Search, SortAsc } from 'lucide-react';

interface PackageFilterProps {
  searchParams: Record<string, any>;
}

export function PackageFilter({ searchParams }: PackageFilterProps) {
  const [filters, setFilters] = useState({
    category: searchParams.category || '',
    priceRange: searchParams.price || '',
    duration: searchParams.duration || '',
    rating: '',
    search: searchParams.search || ''
  });

  const categories = ['luxury', 'budget', 'adventure', 'cultural', 'romantic', 'family', 'wellness'];
  const priceRanges = ['Under Rs 45,000', 'Rs 45,000-Rs 90,000', 'Rs 90,000-Rs 135,000', 'Over Rs 135,000'];
  const durations = ['3-5 days', '6-8 days', '9-12 days', '13+ days'];
  const ratings = ['4.5+', '4.0+', '3.5+', '3.0+'];

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      priceRange: '',
      duration: '',
      rating: '',
      search: ''
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Filter Packages</h3>
        <button
          onClick={clearFilters}
          className="text-sm text-blue-600 hover:text-blue-700"
          suppressHydrationWarning
        >
          Clear All
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            placeholder="Search packages..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            suppressHydrationWarning
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Category Filter */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Category</h4>
          <div className="space-y-2">
            {categories.map((category) => (
              <label key={category} className="flex items-center">
                <input
                  type="radio"
                  name="category"
                  value={category}
                  checked={filters.category === category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="mr-3 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 capitalize">{category}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range Filter */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
          <div className="space-y-2">
            {priceRanges.map((range) => (
              <label key={range} className="flex items-center">
                <input
                  type="radio"
                  name="priceRange"
                  value={range}
                  checked={filters.priceRange === range}
                  onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                  className="mr-3 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{range}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Duration Filter */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Duration</h4>
          <div className="space-y-2">
            {durations.map((duration) => (
              <label key={duration} className="flex items-center">
                <input
                  type="radio"
                  name="duration"
                  value={duration}
                  checked={filters.duration === duration}
                  onChange={(e) => handleFilterChange('duration', e.target.value)}
                  className="mr-3 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{duration}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Rating Filter */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Minimum Rating</h4>
          <div className="space-y-2">
            {ratings.map((rating) => (
              <label key={rating} className="flex items-center">
                <input
                  type="radio"
                  name="rating"
                  value={rating}
                  checked={filters.rating === rating}
                  onChange={(e) => handleFilterChange('rating', e.target.value)}
                  className="mr-3 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{rating}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Sort Options */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            <select 
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              suppressHydrationWarning
            >
              <option value="popularity">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="duration">Duration</option>
              <option value="mba-score">MBA Score</option>
            </select>
          </div>
          
          <button 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            suppressHydrationWarning
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* Active Filters */}
      {(filters.category || filters.priceRange || filters.duration || filters.rating) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {filters.category && (
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center space-x-2">
              <span>Category: {filters.category}</span>
              <button
                onClick={() => handleFilterChange('category', '')}
                className="text-blue-500 hover:text-blue-700"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.priceRange && (
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center space-x-2">
              <span>Price: {filters.priceRange}</span>
              <button
                onClick={() => handleFilterChange('priceRange', '')}
                className="text-green-500 hover:text-green-700"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.duration && (
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm flex items-center space-x-2">
              <span>Duration: {filters.duration}</span>
              <button
                onClick={() => handleFilterChange('duration', '')}
                className="text-purple-500 hover:text-purple-700"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.rating && (
            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm flex items-center space-x-2">
              <span>Rating: {filters.rating}</span>
              <button
                onClick={() => handleFilterChange('rating', '')}
                className="text-yellow-500 hover:text-yellow-700"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
