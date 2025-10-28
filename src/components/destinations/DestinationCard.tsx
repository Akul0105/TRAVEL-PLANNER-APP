'use client';

import { useState } from 'react';
import { AnimatedCard, FadeInText } from '@/components/ui';
import { Star, MapPin, Clock, DollarSign, TrendingUp, Users, ArrowRight } from 'lucide-react';

interface Destination {
  id: string;
  name: string;
  image: string;
  description: string;
  price: string;
  duration: string;
  rating: number;
  category: string;
  tags: string[];
  mbaScore: number;
  relatedItems: string[];
}

interface DestinationCardProps {
  destination: Destination;
}

export function DestinationCard({ destination }: DestinationCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <AnimatedCard
      className="group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <div className="w-full h-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center">
          <span className="text-6xl">🏝️</span>
        </div>
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* MBA Score Badge */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
          <div className="flex items-center space-x-1">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm font-bold text-green-600">
              {(destination.mbaScore * 100).toFixed(0)}%
            </span>
          </div>
        </div>

        {/* Category Badge */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
          <span className="text-sm font-medium text-gray-700 capitalize">
            {destination.category}
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
              {destination.name}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600 capitalize">{destination.category}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium text-gray-700">{destination.rating}</span>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {destination.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {destination.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Price and Duration */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="text-lg font-bold text-green-600">{destination.price}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-blue-600">{destination.duration}</span>
            </div>
          </div>
        </div>

        {/* MBA Insights */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Popular Combinations</span>
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-blue-600 font-medium">72% of travelers</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-1">
            {destination.relatedItems.slice(0, 3).map((item, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-white/60 text-gray-700 rounded-full"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
          Explore {destination.name}
        </button>
      </div>
    </AnimatedCard>
  );
}
