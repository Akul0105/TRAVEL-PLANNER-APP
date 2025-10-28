'use client';

import { useState, useEffect } from 'react';
import { mbaEngine } from '@/lib/mba/engine';
import { AnimatedCard, FadeInText } from '@/components/ui';
import { TrendingUp, Users, Star, ArrowRight, Target } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function TopRulesDashboard() {
  const [topRules, setTopRules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTopRules = () => {
      setLoading(true);
      const rules = mbaEngine.getTopRules(10);
      setTopRules(rules);
      setLoading(false);
    };

    loadTopRules();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const ruleMetricsData = topRules.map((rule, index) => ({
    rule: `Rule ${index + 1}`,
    support: (rule.support * 100).toFixed(1),
    confidence: (rule.confidence * 100).toFixed(1),
    lift: rule.lift.toFixed(2)
  }));

  const scatterData = topRules.map((rule, index) => ({
    support: rule.support * 100,
    confidence: rule.confidence * 100,
    lift: rule.lift
  }));

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <FadeInText className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Top Association Rules</h3>
        <p className="text-gray-600">Most influential market basket patterns</p>
      </FadeInText>

      {/* Top Rules Chart */}
      <div className="mb-8 bg-gray-50 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Rule Metrics Comparison</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={ruleMetricsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="rule" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="confidence" fill="#10b981" name="Confidence %" />
            <Bar dataKey="support" fill="#3b82f6" name="Support %" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Support vs Confidence Scatter Chart */}
      <div className="mb-8 bg-gray-50 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Support vs Confidence Analysis</h4>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart data={scatterData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" dataKey="support" name="Support" unit="%" />
            <YAxis type="number" dataKey="confidence" name="Confidence" unit="%" />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Legend />
            <Scatter name="Rules" data={scatterData} fill="#8b5cf6" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Top Rules List */}
      <div className="space-y-4">
        {topRules.slice(0, 5).map((rule, index) => (
          <AnimatedCard
            key={index}
            delay={index * 0.1}
            className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Rule #{index + 1}</h4>
                  <p className="text-sm text-gray-600">
                    {rule.antecedent.map((item: any) => item.name).join(', ')} → {' '}
                    {rule.consequent.map((item: any) => item.name).join(', ')}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-green-600">
                  Lift: {rule.lift.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Rule Metrics */}
            <div className="grid grid-cols-3 gap-4 mb-3">
              <div className="text-center p-2 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-600 font-medium">Support</p>
                <p className="text-lg font-bold text-blue-900">
                  {(rule.support * 100).toFixed(1)}%
                </p>
              </div>
              <div className="text-center p-2 bg-green-50 rounded-lg">
                <p className="text-sm text-green-600 font-medium">Confidence</p>
                <p className="text-lg font-bold text-green-900">
                  {(rule.confidence * 100).toFixed(1)}%
                </p>
              </div>
              <div className="text-center p-2 bg-purple-50 rounded-lg">
                <p className="text-sm text-purple-600 font-medium">Conviction</p>
                <p className="text-lg font-bold text-purple-900">
                  {rule.conviction.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Rule Interpretation */}
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-700">
                <strong>Interpretation:</strong> When travelers book{' '}
                <span className="font-medium text-blue-600">
                  {rule.antecedent.map((item: any) => item.name).join(', ')}
                </span>, they also book{' '}
                <span className="font-medium text-green-600">
                  {rule.consequent.map((item: any) => item.name).join(', ')}
                </span>{' '}
                with <strong>{(rule.confidence * 100).toFixed(1)}%</strong> confidence.
                This rule appears in <strong>{(rule.support * 100).toFixed(1)}%</strong> of transactions.
              </p>
            </div>

            {/* Business Impact */}
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-gray-600">
                    {Math.round(rule.support * 1000)} travelers
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Target className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-600">
                    {rule.lift > 2 ? 'High Impact' : rule.lift > 1.5 ? 'Medium Impact' : 'Low Impact'}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium text-gray-700">
                  {rule.lift > 2 ? '⭐⭐⭐' : rule.lift > 1.5 ? '⭐⭐' : '⭐'}
                </span>
              </div>
            </div>
          </AnimatedCard>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">High Impact Rules</p>
              <p className="text-2xl font-bold text-blue-900">
                {topRules.filter(rule => rule.lift > 2).length}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Avg Confidence</p>
              <p className="text-2xl font-bold text-green-900">
                {(topRules.reduce((sum, rule) => sum + rule.confidence, 0) / topRules.length * 100).toFixed(1)}%
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
                {(topRules.reduce((sum, rule) => sum + rule.lift, 0) / topRules.length).toFixed(2)}
              </p>
            </div>
            <Target className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
