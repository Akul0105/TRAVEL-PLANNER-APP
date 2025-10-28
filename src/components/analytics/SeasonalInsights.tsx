'use client';

import { useState, useEffect } from 'react';
import { mbaEngine } from '@/lib/mba/engine';
import { AnimatedCard, FadeInText } from '@/components/ui';
import { Calendar, TrendingUp, Sun, Snowflake, Leaf, Flower } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function SeasonalInsights() {
  const [seasonalData, setSeasonalData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSeasonalData = () => {
      setLoading(true);
      const data = [
        {
          season: 'Summer',
          month: 6,
          icon: Sun,
          color: 'yellow',
          demandMultiplier: 1.5,
          ruleCount: 45,
          topDestinations: ['Mauritius', 'Bali', 'Dubai'],
          topActivities: ['Snorkeling', 'Beach Resort', 'Water Sports'],
          revenue: 450000,
          growth: 0.25
        },
        {
          season: 'Winter',
          month: 12,
          icon: Snowflake,
          color: 'blue',
          demandMultiplier: 1.3,
          ruleCount: 38,
          topDestinations: ['Paris', 'London', 'Tokyo'],
          topActivities: ['Luxury Hotels', 'Spa Treatments', 'Cultural Tours'],
          revenue: 380000,
          growth: 0.18
        },
        {
          season: 'Spring',
          month: 3,
          icon: Flower,
          color: 'pink',
          demandMultiplier: 1.2,
          ruleCount: 32,
          topDestinations: ['Paris', 'Tokyo', 'Bali'],
          topActivities: ['Cultural Tours', 'Nature Walks', 'Photography'],
          revenue: 320000,
          growth: 0.15
        },
        {
          season: 'Fall',
          month: 9,
          icon: Leaf,
          color: 'orange',
          demandMultiplier: 1.1,
          ruleCount: 28,
          topDestinations: ['London', 'Paris', 'Tokyo'],
          topActivities: ['Museum Tours', 'Food Tours', 'City Walks'],
          revenue: 280000,
          growth: 0.12
        }
      ];
      setSeasonalData(data);
      setLoading(false);
    };

    loadSeasonalData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const seasonalChartData = seasonalData.map(season => ({
    season: season.season,
    demand: season.demandMultiplier,
    rules: season.ruleCount,
    revenue: season.revenue / 1000, // Convert to thousands
    growth: season.growth * 100
  }));

  // Monthly breakdown simulation
  const monthlyData = [
    { month: 'Jan', revenue: 280, demand: 1.1 },
    { month: 'Feb', revenue: 290, demand: 1.1 },
    { month: 'Mar', revenue: 320, demand: 1.2 },
    { month: 'Apr', revenue: 350, demand: 1.3 },
    { month: 'May', revenue: 410, demand: 1.4 },
    { month: 'Jun', revenue: 450, demand: 1.5 },
    { month: 'Jul', revenue: 480, demand: 1.5 },
    { month: 'Aug', revenue: 460, demand: 1.4 },
    { month: 'Sep', revenue: 380, demand: 1.2 },
    { month: 'Oct', revenue: 350, demand: 1.2 },
    { month: 'Nov', revenue: 340, demand: 1.25 },
    { month: 'Dec', revenue: 380, demand: 1.3 }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <FadeInText className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Seasonal Travel Patterns</h3>
        <p className="text-gray-600">MBA analysis of seasonal travel behavior and demand patterns</p>
      </FadeInText>

      {/* Monthly Revenue & Demand Chart */}
      <div className="mb-8 bg-gray-50 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue & Demand Trends</h4>
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Area yAxisId="left" type="monotone" dataKey="revenue" fill="#3b82f6" fillOpacity={0.3} stroke="#3b82f6" name="Revenue ($k)" />
            <Line yAxisId="right" type="monotone" dataKey="demand" stroke="#10b981" strokeWidth={3} name="Demand Multiplier" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Seasonal Comparison Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Seasonal Demand Bar Chart */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Seasonal Demand Comparison</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={seasonalChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="season" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="demand" fill="#8b5cf6" name="Demand Multiplier" />
              <Bar dataKey="rules" fill="#f59e0b" name="Rules Count" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue by Season */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Season</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={seasonalChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="season" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#10b981" name="Revenue ($k)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Seasonal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {seasonalData.map((season, index) => {
          const Icon = season.icon;
          return (
            <AnimatedCard
              key={season.season}
              delay={index * 0.1}
              className={`p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                season.color === 'yellow' ? 'border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50' :
                season.color === 'blue' ? 'border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50' :
                season.color === 'pink' ? 'border-pink-200 bg-gradient-to-br from-pink-50 to-rose-50' :
                'border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    season.color === 'yellow' ? 'bg-yellow-100' :
                    season.color === 'blue' ? 'bg-blue-100' :
                    season.color === 'pink' ? 'bg-pink-100' :
                    'bg-orange-100'
                  }`}>
                    <Icon className={`w-6 h-6 ${
                      season.color === 'yellow' ? 'text-yellow-600' :
                      season.color === 'blue' ? 'text-blue-600' :
                      season.color === 'pink' ? 'text-pink-600' :
                      'text-orange-600'
                    }`} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">{season.season}</h4>
                    <p className="text-sm text-gray-600">Month {season.month}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium text-green-600">
                      +{(season.growth * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Demand Multiplier:</span>
                  <span className="text-sm font-bold text-gray-900">
                    {season.demandMultiplier}x
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Association Rules:</span>
                  <span className="text-sm font-bold text-gray-900">{season.ruleCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Revenue:</span>
                  <span className="text-sm font-bold text-gray-900">
                    ${(season.revenue / 1000).toFixed(0)}k
                  </span>
                </div>
              </div>

              {/* Top Destinations */}
              <div className="mb-4">
                <h5 className="font-medium text-gray-900 mb-2">Top Destinations</h5>
                <div className="flex flex-wrap gap-1">
                  {season.topDestinations.map((dest: string, destIndex: number) => (
                    <span
                      key={destIndex}
                      className="px-2 py-1 text-xs bg-white/60 text-gray-700 rounded-full"
                    >
                      {dest}
                    </span>
                  ))}
                </div>
              </div>

              {/* Top Activities */}
              <div className="mb-4">
                <h5 className="font-medium text-gray-900 mb-2">Popular Activities</h5>
                <div className="flex flex-wrap gap-1">
                  {season.topActivities.map((activity: string, actIndex: number) => (
                    <span
                      key={actIndex}
                      className="px-2 py-1 text-xs bg-white/60 text-gray-700 rounded-full"
                    >
                      {activity}
                    </span>
                  ))}
                </div>
              </div>

              {/* MBA Insights */}
              <div className="bg-white/60 rounded-lg p-3">
                <h6 className="font-medium text-gray-900 mb-1">Seasonal Insights</h6>
                <p className="text-xs text-gray-600">
                  {season.season === 'Summer' && 'Beach destinations and water activities dominate with high demand for luxury resorts.'}
                  {season.season === 'Winter' && 'Cultural cities and luxury experiences are preferred with focus on indoor activities.'}
                  {season.season === 'Spring' && 'Cultural exploration and nature activities are trending with moderate demand.'}
                  {season.season === 'Fall' && 'City breaks and cultural tours are popular with steady demand patterns.'}
                </p>
              </div>
            </AnimatedCard>
          );
        })}
      </div>

      {/* Business Recommendations */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Business Recommendations</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-medium text-gray-900 mb-2">Peak Season Strategy</h5>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Increase inventory for beach destinations in summer</li>
              <li>• Premium pricing for luxury packages in winter</li>
              <li>• Cultural tour promotions in spring and fall</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-gray-900 mb-2">Cross-Seasonal Opportunities</h5>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Bundle beach + city experiences year-round</li>
              <li>• Promote indoor activities during winter</li>
              <li>• Create seasonal loyalty programs</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
