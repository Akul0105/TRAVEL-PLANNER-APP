'use client';

import { useState, useEffect } from 'react';
import { mbaEngine } from '@/lib/mba/engine';
import { Sun, Snowflake, Leaf, Flower } from 'lucide-react';
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
      <div className="bg-white rounded-lg border border-[#e8e4df] p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-[#e8e4df] rounded mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-48 bg-[#e8e4df] rounded" />
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
    <div className="bg-white rounded-lg border border-[#e8e4df] p-6">
      <div className="mb-6">
        <h3 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-[#2c2825] mb-1">Seasonal Patterns</h3>
        <p className="text-sm text-[#6b6560]">Seasonal travel behavior and demand</p>
      </div>

      <div className="mb-8 bg-[#faf8f5] rounded-lg p-6 border border-[#e8e4df]">
        <h4 className="text-sm font-semibold text-[#2c2825] mb-4">Monthly Revenue & Demand</h4>
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8e4df" />
            <XAxis dataKey="month" stroke="#6b6560" fontSize={12} />
            <YAxis yAxisId="left" stroke="#6b6560" fontSize={12} />
            <YAxis yAxisId="right" orientation="right" stroke="#6b6560" fontSize={12} />
            <Tooltip />
            <Legend />
            <Area yAxisId="left" type="monotone" dataKey="revenue" fill="#2c2825" fillOpacity={0.2} stroke="#2c2825" name="Revenue ($k)" />
            <Line yAxisId="right" type="monotone" dataKey="demand" stroke="#6b6560" strokeWidth={2} name="Demand Multiplier" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-[#faf8f5] rounded-lg p-6 border border-[#e8e4df]">
          <h4 className="text-sm font-semibold text-[#2c2825] mb-4">Seasonal Demand</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={seasonalChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8e4df" />
              <XAxis dataKey="season" stroke="#6b6560" fontSize={12} />
              <YAxis stroke="#6b6560" fontSize={12} />
              <Tooltip />
              <Legend />
              <Bar dataKey="demand" fill="#2c2825" name="Demand Multiplier" />
              <Bar dataKey="rules" fill="#6b6560" name="Rules Count" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-[#faf8f5] rounded-lg p-6 border border-[#e8e4df]">
          <h4 className="text-sm font-semibold text-[#2c2825] mb-4">Revenue by Season</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={seasonalChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8e4df" />
              <XAxis dataKey="season" stroke="#6b6560" fontSize={12} />
              <YAxis stroke="#6b6560" fontSize={12} />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#2c2825" name="Revenue ($k)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {seasonalData.map((season) => {
          const Icon = season.icon;
          return (
            <div
              key={season.season}
              className="p-6 rounded-lg border border-[#e8e4df] bg-[#faf8f5]"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#e8e4df]">
                    <Icon className="w-5 h-5 text-[#6b6560]" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-[#2c2825]">{season.season}</h4>
                    <p className="text-sm text-[#6b6560]">Month {season.month}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-[#2c2825]">+{(season.growth * 100).toFixed(0)}%</span>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm text-[#6b6560]">Demand Multiplier:</span>
                  <span className="text-sm font-semibold text-[#2c2825]">
                    {season.demandMultiplier}x
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-[#6b6560]">Association Rules:</span>
                  <span className="text-sm font-semibold text-[#2c2825]">{season.ruleCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-[#6b6560]">Revenue:</span>
                  <span className="text-sm font-semibold text-[#2c2825]">
                    ${(season.revenue / 1000).toFixed(0)}k
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <h5 className="text-sm font-medium text-[#2c2825] mb-2">Top Destinations</h5>
                <div className="flex flex-wrap gap-1">
                  {season.topDestinations.map((dest: string, destIndex: number) => (
                    <span key={destIndex} className="px-2 py-1 text-xs bg-white border border-[#e8e4df] text-[#6b6560] rounded-full">
                      {dest}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <h5 className="text-sm font-medium text-[#2c2825] mb-2">Popular Activities</h5>
                <div className="flex flex-wrap gap-1">
                  {season.topActivities.map((activity: string, actIndex: number) => (
                    <span key={actIndex} className="px-2 py-1 text-xs bg-white border border-[#e8e4df] text-[#6b6560] rounded-full">
                      {activity}
                    </span>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-lg p-3 border border-[#e8e4df]">
                <h6 className="text-sm font-medium text-[#2c2825] mb-1">Insights</h6>
                <p className="text-xs text-[#6b6560]">
                  {season.season === 'Summer' && 'Beach destinations and water activities dominate with high demand for luxury resorts.'}
                  {season.season === 'Winter' && 'Cultural cities and luxury experiences are preferred with focus on indoor activities.'}
                  {season.season === 'Spring' && 'Cultural exploration and nature activities are trending with moderate demand.'}
                  {season.season === 'Fall' && 'City breaks and cultural tours are popular with steady demand patterns.'}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-[#faf8f5] rounded-lg p-6 border border-[#e8e4df]">
        <h4 className="text-sm font-semibold text-[#2c2825] mb-4">Recommendations</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="text-sm font-medium text-[#2c2825] mb-2">Peak Season</h5>
            <ul className="text-sm text-[#6b6560] space-y-1">
              <li>• Increase inventory for beach destinations in summer</li>
              <li>• Premium pricing for luxury packages in winter</li>
              <li>• Cultural tour promotions in spring and fall</li>
            </ul>
          </div>
          <div>
            <h5 className="text-sm font-medium text-[#2c2825] mb-2">Cross-Seasonal</h5>
            <ul className="text-sm text-[#6b6560] space-y-1">
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
