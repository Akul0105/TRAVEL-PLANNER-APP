'use client';

import { useState, useEffect } from 'react';
import { mbaEngine } from '@/lib/mba/engine';
import { AnimatedCard, FadeInText } from '@/components/ui';
import { TrendingUp, Users, Star, BarChart3, PieChart, Activity } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart as RePieChart, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4'];

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
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
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

  const seasonalData = analytics.seasonalInsights.map((insight: any) => ({
    season: insight.season,
    demand: insight.demandMultiplier,
    rules: insight.ruleCount
  }));

  // Simulate time series data for confidence trends
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
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <FadeInText className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">MBA Analytics Overview</h3>
        <p className="text-gray-600">Comprehensive market basket analysis insights</p>
      </FadeInText>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Rules</p>
              <p className="text-2xl font-bold text-blue-900">{analytics.totalRules}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Avg Confidence</p>
              <p className="text-2xl font-bold text-green-900">
                {(analytics.avgConfidence * 100).toFixed(1)}%
              </p>
            </div>
            <Star className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Avg Lift</p>
              <p className="text-2xl font-bold text-purple-900">
                {analytics.avgLift.toFixed(2)}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-orange-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">Segments</p>
              <p className="text-2xl font-bold text-orange-900">{analytics.totalSegments}</p>
            </div>
            <Users className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Category Distribution Pie Chart */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Category Distribution</h4>
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

        {/* Category Price Bar Chart */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Average Price by Category</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Confidence Trend Line Chart */}
      <div className="bg-gray-50 rounded-xl p-6 mb-8">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Confidence Trend Over Time</h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={confidenceTrendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="confidence" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Seasonal Demand Line Chart */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Seasonal Demand Patterns</h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={seasonalData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="season" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="demand" stroke="#8b5cf6" strokeWidth={3} name="Demand Multiplier" />
            <Line type="monotone" dataKey="rules" stroke="#f59e0b" strokeWidth={3} name="Rules Count" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
