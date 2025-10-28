'use client';

import { useState } from 'react';
import { AnimatedCard, FadeInText } from '@/components/ui';
import { Star, Clock, Users, DollarSign, TrendingUp, ArrowRight, CheckCircle, Calendar } from 'lucide-react';

interface Package {
  id: string;
  name: string;
  image: string;
  description: string;
  price: string;
  originalPrice: string;
  duration: string;
  rating: number;
  travelers: string;
  category: string;
  tags: string[];
  mbaScore: number;
  confidence: number;
  lift: number;
  includes: string[];
  relatedPackages: string[];
  seasonalRules: Record<string, string>;
}

interface PackageCardProps {
  package: Package;
}

export function PackageCard({ package: pkg }: PackageCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const savings = parseInt(pkg.originalPrice.replace('$', '')) - parseInt(pkg.price.replace('$', ''));
  const savingsPercent = Math.round((savings / parseInt(pkg.originalPrice.replace('$', ''))) * 100);

  return (
    <AnimatedCard
      className="group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <div className="w-full h-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center">
          <span className="text-6xl">📦</span>
        </div>
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* MBA Score Badge */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
          <div className="flex items-center space-x-1">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm font-bold text-green-600">
              {(pkg.mbaScore * 100).toFixed(0)}%
            </span>
          </div>
        </div>

        {/* Savings Badge */}
        <div className="absolute top-4 left-4 bg-red-500 text-white rounded-full px-3 py-1">
          <span className="text-sm font-bold">-{savingsPercent}%</span>
        </div>

        {/* Category Badge */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
          <span className="text-sm font-medium text-gray-700 capitalize">
            {pkg.category}
          </span>
        </div>

        {/* Hover Overlay */}
        <div className={`absolute inset-0 bg-blue-600/20 transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white rounded-full p-3 transform scale-0 group-hover:scale-100 transition-transform duration-300">
              <ArrowRight className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
              {pkg.name}
            </h3>
            <p className="text-sm text-gray-600">{pkg.travelers} • {pkg.duration}</p>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium text-gray-700">{pkg.rating}</span>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {pkg.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {pkg.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-2xl font-bold text-green-600">{pkg.price}</span>
            <span className="text-sm text-gray-500 line-through ml-2">{pkg.originalPrice}</span>
          </div>
          <div className="text-right">
            <p className="text-sm text-green-600 font-medium">Save ${savings}</p>
          </div>
        </div>

        {/* MBA Insights */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">MBA Confidence</span>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-blue-600 font-medium">
                {(pkg.confidence * 100).toFixed(0)}%
              </span>
              <span className="text-sm text-green-600 font-medium">
                Lift: {pkg.lift.toFixed(2)}
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-600">
            This package is chosen by <strong>{(pkg.mbaScore * 100).toFixed(0)}%</strong> of travelers
            with similar preferences
          </p>
        </div>

        {/* What's Included */}
        <div className="mb-4">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            {showDetails ? 'Hide Details' : 'What\'s Included'} ({pkg.includes.length} items)
          </button>
          
          {showDetails && (
            <div className="mt-2 space-y-1">
              {pkg.includes.slice(0, 4).map((item, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span>{item}</span>
                </div>
              ))}
              {pkg.includes.length > 4 && (
                <p className="text-xs text-gray-500">
                  +{pkg.includes.length - 4} more items
                </p>
              )}
            </div>
          )}
        </div>

        {/* Seasonal Rules */}
        <div className="mb-4">
          <h5 className="text-sm font-medium text-gray-900 mb-2">Best Time to Book</h5>
          <div className="flex flex-wrap gap-1">
            {Object.entries(pkg.seasonalRules).slice(0, 2).map(([season, rule], index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded-full"
              >
                {season}: {rule}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Book Now
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            Details
          </button>
        </div>

        {/* Related Packages */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-2">Travelers also viewed:</p>
          <div className="flex flex-wrap gap-1">
            {pkg.relatedPackages.slice(0, 2).map((related, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
              >
                {related}
              </span>
            ))}
          </div>
        </div>
      </div>
    </AnimatedCard>
  );
}
