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
      <div className="bg-white rounded-lg border border-[#e8e4df] p-8">
        <div className="animate-pulse">
          <div className="h-6 bg-[#e8e4df] rounded mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-[#e8e4df] rounded" />
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
    <div className="bg-white rounded-lg border border-[#e8e4df] p-8">
      <h3 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-[#2c2825] mb-6">Insights</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-[#faf8f5] rounded-lg border border-[#e8e4df]">
          <div className="flex items-center space-x-2 mb-3">
            <Target className="w-5 h-5 text-[#6b6560]" />
            <h4 className="text-sm font-semibold text-[#2c2825]">Cross-Sell</h4>
          </div>
          <div className="space-y-2">
            {crossSellOps.slice(0, 3).map((op, index) => (
              <div key={index} className="flex justify-between">
                <span className="text-sm text-[#6b6560]">{op.combo}</span>
                <span className="text-sm font-medium text-[#2c2825]">+{op.revenue}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="p-6 bg-[#faf8f5] rounded-lg border border-[#e8e4df]">
          <div className="flex items-center space-x-2 mb-3">
            <TrendingUp className="w-5 h-5 text-[#6b6560]" />
            <h4 className="text-sm font-semibold text-[#2c2825]">Seasonal</h4>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between"><span className="text-sm text-[#6b6560]">Summer: Beach</span><span className="text-sm text-[#2c2825]">Peak</span></div>
            <div className="flex justify-between"><span className="text-sm text-[#6b6560]">Winter: Luxury</span><span className="text-sm text-[#2c2825]">High value</span></div>
            <div className="flex justify-between"><span className="text-sm text-[#6b6560]">Spring: Cultural</span><span className="text-sm text-[#2c2825]">Trending</span></div>
          </div>
        </div>
        <div className="p-6 bg-[#faf8f5] rounded-lg border border-[#e8e4df]">
          <div className="flex items-center space-x-2 mb-3">
            <DollarSign className="w-5 h-5 text-[#6b6560]" />
            <h4 className="text-sm font-semibold text-[#2c2825]">Customers</h4>
          </div>
          <div className="space-y-2">
            {segments.map((segment, index) => (
              <div key={index} className="flex justify-between">
                <span className="text-sm text-[#6b6560]">{segment.name}</span>
                <span className="text-sm font-medium text-[#2c2825]">Rs {segment.avgSpend.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

