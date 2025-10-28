'use client';

import { useState } from 'react';
import { Filter, X } from 'lucide-react';

export function FilterSidebar() {
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    duration: '',
    rating: '',
    tags: [] as string[]
  });

  const categories = ['beach', 'city', 'mountain', 'cultural', 'adventure', 'luxury'];
  const priceRanges = ['Under $500', '$500-$1000', '$1000-$2000', 'Over $2000'];
  const durations = ['1-3 days', '4-7 days', '8-14 days', '15+ days'];
  const ratings = ['4.5+', '4.0+', '3.5+', '3.0+'];
  const tags = ['luxury', 'budget', 'family', 'romantic', 'adventure', 'cultural'];

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleTagToggle = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      priceRange: '',
      duration: '',
      rating: '',
      tags: []
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Filters</h3>
        <button
          onClick={clearFilters}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          Clear All
        </button>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
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
      <div className="mb-6">
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
      <div className="mb-6">
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
      <div className="mb-6">
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

      {/* Tags Filter */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Tags</h4>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagToggle(tag)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                filters.tags.includes(tag)
                  ? 'bg-blue-100 text-blue-700 border border-blue-300'
                  : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Apply Filters Button */}
      <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
        Apply Filters
      </button>
    </div>
  );
}
