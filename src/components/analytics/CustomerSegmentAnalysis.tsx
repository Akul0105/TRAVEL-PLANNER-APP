'use client';

import { useState, useEffect } from 'react';
import { mbaEngine } from '@/lib/mba/engine';
import { AnimatedCard, FadeInText } from '@/components/ui';
import { Users, TrendingUp, DollarSign, Star, Target, BarChart3 } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, RadialBarChart, RadialBar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b'];

export function CustomerSegmentAnalysis() {
  const [segments, setSegments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSegments = () => {
      setLoading(true);
      // Get segments from MBA engine
      const segmentData = [
        {
          id: 'luxury-travelers',
          name: 'Luxury Travelers',
          characteristics: ['high-budget', 'premium-services', 'exclusive-experiences'],
          avgSpend: 3000,
          size: 150,
          rules: mbaEngine.getSegmentRules('luxury-travelers'),
          growth: 0.15,
          satisfaction: 0.94
        },
        {
          id: 'budget-travelers',
          name: 'Budget Travelers',
          characteristics: ['cost-conscious', 'value-seeking', 'backpacker-style'],
          avgSpend: 800,
          size: 300,
          rules: mbaEngine.getSegmentRules('budget-travelers'),
          growth: 0.08,
          satisfaction: 0.87
        },
        {
          id: 'adventure-seekers',
          name: 'Adventure Seekers',
          characteristics: ['outdoor-activities', 'nature-focused', 'active-lifestyle'],
          avgSpend: 1200,
          size: 200,
          rules: mbaEngine.getSegmentRules('adventure-seekers'),
          growth: 0.12,
          satisfaction: 0.91
        },
        {
          id: 'cultural-explorers',
          name: 'Cultural Explorers',
          characteristics: ['history-interested', 'museum-lovers', 'local-experiences'],
          avgSpend: 1000,
          size: 250,
          rules: mbaEngine.getSegmentRules('cultural-explorers'),
          growth: 0.10,
          satisfaction: 0.89
        }
      ];
      setSegments(segmentData);
      setLoading(false);
    };

    loadSegments();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const segmentComparisonData = segments.map(seg => ({
    name: seg.name,
    spend: seg.avgSpend,
    size: seg.size,
    satisfaction: seg.satisfaction * 100,
    growth: seg.growth * 100
  }));

  const segmentSizeData = segments.map(seg => ({
    name: seg.name,
    value: seg.size
  }));

  const satisfactionData = segments.map(seg => ({
    name: seg.name,
    satisfaction: seg.satisfaction * 100
  }));

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <FadeInText className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Customer Segment Analysis</h3>
        <p className="text-gray-600">MBA-driven customer segmentation and behavior patterns</p>
      </FadeInText>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Segment Size Pie Chart */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Segment Distribution</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={segmentSizeData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                {segmentSizeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Satisfaction Radial Chart */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Customer Satisfaction by Segment</h4>
          <ResponsiveContainer width="100%" height={300}>
            <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="80%" data={satisfactionData}>
              <RadialBar minAngle={15} label={{ position: 'insideStart', fill: '#fff' }} background clockWise dataKey="satisfaction" />
              <Legend />
              <Tooltip />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Segment Comparison Bar Chart */}
      <div className="bg-gray-50 rounded-xl p-6 mb-8">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Segment Comparison</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={segmentComparisonData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="spend" fill="#3b82f6" name="Avg Spend ($)" />
            <Bar dataKey="growth" fill="#10b981" name="Growth %" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Segment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {segments.map((segment, index) => (
          <AnimatedCard
            key={segment.id}
            delay={index * 0.1}
            className="p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">{segment.name}</h4>
                <p className="text-sm text-gray-600">{segment.size} customers</p>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-green-600">
                    +{(segment.growth * 100).toFixed(0)}% growth
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-yellow-600">
                    {(segment.satisfaction * 100).toFixed(0)}% satisfaction
                  </span>
                </div>
              </div>
            </div>

            {/* Characteristics */}
            <div className="mb-4">
              <h5 className="font-medium text-gray-900 mb-2">Characteristics</h5>
              <div className="flex flex-wrap gap-2">
                {segment.characteristics.map((char: string, charIndex: number) => (
                  <span
                    key={charIndex}
                    className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full"
                  >
                    {char.replace('-', ' ')}
                  </span>
                ))}
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-600 font-medium">Avg Spend</p>
                <p className="text-lg font-bold text-green-900">${segment.avgSpend}</p>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-600 font-medium">Rules</p>
                <p className="text-lg font-bold text-blue-900">{segment.rules.length}</p>
              </div>
            </div>

            {/* Top Rules for Segment */}
            <div className="mb-4">
              <h5 className="font-medium text-gray-900 mb-2">Top Association Rules</h5>
              <div className="space-y-2">
                {segment.rules.slice(0, 2).map((rule: any, ruleIndex: number) => (
                  <div key={ruleIndex} className="p-2 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">
                        {rule.antecedent.map((item: any) => item.name).join(', ')}
                      </span>{' '}
                      →{' '}
                      <span className="font-medium">
                        {rule.consequent.map((item: any) => item.name).join(', ')}
                      </span>
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500">
                        Confidence: {(rule.confidence * 100).toFixed(1)}%
                      </span>
                      <span className="text-xs text-gray-500">
                        Lift: {rule.lift.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Business Insights */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3">
              <h6 className="font-medium text-gray-900 mb-1">Business Insights</h6>
              <p className="text-sm text-gray-600">
                This segment shows strong preference for{' '}
                <strong>{segment.characteristics[0].replace('-', ' ')}</strong> experiences
                with <strong>{(segment.satisfaction * 100).toFixed(0)}%</strong> satisfaction rate.
                Average transaction value is <strong>${segment.avgSpend}</strong>.
              </p>
            </div>
          </AnimatedCard>
        ))}
      </div>

      {/* Segment Comparison Table */}
      <div className="mt-8">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Segment Comparison</h4>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Segment</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Size</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Avg Spend</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Growth</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Satisfaction</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Rules</th>
              </tr>
            </thead>
            <tbody>
              {segments.map((segment, index) => (
                <tr key={segment.id} className="border-b border-gray-100">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                      <span className="font-medium text-gray-900">{segment.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-700">{segment.size}</td>
                  <td className="py-3 px-4 text-gray-700">${segment.avgSpend}</td>
                  <td className="py-3 px-4">
                    <span className="text-green-600 font-medium">
                      +{(segment.growth * 100).toFixed(0)}%
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-blue-600 font-medium">
                      {(segment.satisfaction * 100).toFixed(0)}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-700">{segment.rules.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
