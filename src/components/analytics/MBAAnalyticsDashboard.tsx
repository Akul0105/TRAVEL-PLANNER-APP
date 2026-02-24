'use client';

import { useState, useEffect } from 'react';
import { mbaEngine } from '@/lib/mba/engine';
import { TrendingUp, Users, Star, BarChart3 } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart as RePieChart, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#2c2825', '#6b6560', '#9c958f', '#c4bdb5', '#e8e4df', '#4a4541'];

export function MBAAnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = () => {
      setLoading(true);
      const data = mbaEngine.getAnalytics();
      setAnalytics(data);
      setLoading(false);
    };

    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-[#e8e4df] p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-[#e8e4df] rounded mb-4" />
          <div className="h-64 bg-[#e8e4df] rounded" />
        </div>
      </div>
    );
  }

  // Prepare chart data
  const categoryData = analytics.topCategories.map((cat: any) => ({
    name: cat.category,
    items: cat.count,
    value: cat.avgPrice
  }));

  // Time series for rule confidence (MBA quality)
  const confidenceTrendData = [
    { month: 'Jan', confidence: 82.3 },
    { month: 'Feb', confidence: 84.1 },
    { month: 'Mar', confidence: 85.7 },
    { month: 'Apr', confidence: 86.2 },
    { month: 'May', confidence: 87.9 },
    { month: 'Jun', confidence: 88.5 },
    { month: 'Jul', confidence: 87.3 },
    { month: 'Aug', confidence: 86.8 },
    { month: 'Sep', confidence: 88.1 },
    { month: 'Oct', confidence: 89.2 },
    { month: 'Nov', confidence: 88.7 },
    { month: 'Dec', confidence: 87.3 }
  ];

  return (
    <div className="bg-white rounded-lg border border-[#e8e4df] p-6">
      <div className="mb-6">
        <h3 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-[#2c2825] mb-1">MBA Overview</h3>
        <p className="text-sm text-[#6b6560]">Market basket analysis insights</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#faf8f5] rounded-lg p-4 border border-[#e8e4df]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#6b6560] font-medium">Total Rules</p>
              <p className="text-xl font-semibold text-[#2c2825]">{analytics.totalRules}</p>
            </div>
            <BarChart3 className="w-6 h-6 text-[#6b6560]" />
          </div>
        </div>
        <div className="bg-[#faf8f5] rounded-lg p-4 border border-[#e8e4df]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#6b6560] font-medium">Avg Confidence</p>
              <p className="text-xl font-semibold text-[#2c2825]">{(analytics.avgConfidence * 100).toFixed(1)}%</p>
            </div>
            <Star className="w-6 h-6 text-[#6b6560]" />
          </div>
        </div>
        <div className="bg-[#faf8f5] rounded-lg p-4 border border-[#e8e4df]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#6b6560] font-medium">Avg Lift</p>
              <p className="text-xl font-semibold text-[#2c2825]">{analytics.avgLift.toFixed(2)}</p>
            </div>
            <TrendingUp className="w-6 h-6 text-[#6b6560]" />
          </div>
        </div>
        <div className="bg-[#faf8f5] rounded-lg p-4 border border-[#e8e4df]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#6b6560] font-medium">Segments</p>
              <p className="text-xl font-semibold text-[#2c2825]">{analytics.totalSegments}</p>
            </div>
            <Users className="w-6 h-6 text-[#6b6560]" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-[#faf8f5] rounded-lg p-6 border border-[#e8e4df]">
          <h4 className="text-sm font-semibold text-[#2c2825] mb-4">Category Distribution</h4>
          <ResponsiveContainer width="100%" height={300}>
            <RePieChart>
              <RePieChart data={categoryData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`} outerRadius={80} fill="#8884d8" dataKey="items">
                {categoryData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </RePieChart>
              <Tooltip />
              <Legend />
            </RePieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#faf8f5] rounded-lg p-6 border border-[#e8e4df]">
          <h4 className="text-sm font-semibold text-[#2c2825] mb-4">Average Price by Category</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8e4df" />
              <XAxis dataKey="name" stroke="#6b6560" fontSize={12} />
              <YAxis stroke="#6b6560" fontSize={12} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#2c2825" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-[#faf8f5] rounded-lg p-6 border border-[#e8e4df]">
        <h4 className="text-sm font-semibold text-[#2c2825] mb-4">Confidence Trend Over Time</h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={confidenceTrendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8e4df" />
            <XAxis dataKey="month" stroke="#6b6560" fontSize={12} />
            <YAxis stroke="#6b6560" fontSize={12} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="confidence" stroke="#2c2825" strokeWidth={2} dot={{ fill: '#2c2825', r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
