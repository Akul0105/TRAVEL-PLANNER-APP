'use client';

import { useState, useEffect } from 'react';
import { mbaEngine } from '@/lib/mba/engine';
import { TrendingUp, Target, DollarSign } from 'lucide-react';

export function BusinessIntelligence() {
  const [segments, setSegments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = () => {
      setLoading(true);
      const segmentData = [
        {
          id: 'luxury-travelers',
          name: 'Luxury Travelers',
          avgSpend: 3000
        },
        {
          id: 'budget-travelers',
          name: 'Budget Travelers',
          avgSpend: 800
        },
        {
          id: 'adventure-seekers',
          name: 'Adventure Seekers',
          avgSpend: 1200
        }
      ];
      setSegments(segmentData);
      setLoading(false);
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Calculate top rules for cross-sell opportunities
  const topRules = mbaEngine.getTopRules(5);
  
  const crossSellOps = topRules.map((rule, index) => ({
    combo: `${rule.antecedent.map((item: any) => item.name).join(' + ')}`,
    revenue: (Math.random() * 50 + 25).toFixed(0) + '%'
  }));

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Business Intelligence Insights</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
          <div className="flex items-center space-x-2 mb-3">
            <Target className="w-5 h-5 text-blue-600" />
            <h4 className="font-semibold text-gray-900">Cross-Sell Opportunities</h4>
          </div>
          <div className="space-y-2">
            {crossSellOps.slice(0, 3).map((op, index) => (
              <div key={index} className="flex justify-between">
                <span className="text-sm text-gray-600">{op.combo}</span>
                <span className="text-sm font-medium text-green-600">+{op.revenue} revenue</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
          <div className="flex items-center space-x-2 mb-3">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h4 className="font-semibold text-gray-900">Seasonal Patterns</h4>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Summer: Beach destinations</span>
              <span className="text-sm font-medium text-blue-600">Peak demand</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Winter: Luxury packages</span>
              <span className="text-sm font-medium text-blue-600">High value</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Spring: Cultural tours</span>
              <span className="text-sm font-medium text-blue-600">Growing trend</span>
            </div>
          </div>
        </div>

        <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
          <div className="flex items-center space-x-2 mb-3">
            <DollarSign className="w-5 h-5 text-purple-600" />
            <h4 className="font-semibold text-gray-900">Customer Insights</h4>
          </div>
          <div className="space-y-2">
            {segments.map((segment, index) => (
              <div key={index} className="flex justify-between">
                <span className="text-sm text-gray-600">{segment.name.toLowerCase()}</span>
                <span className="text-sm font-medium text-purple-600">${segment.avgSpend.toLocaleString()} avg</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

