'use client';

import { useState, useEffect } from 'react';
import { mbaEngine } from '@/lib/mba/engine';
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
      <div className="bg-white rounded-lg border border-[#e8e4df] p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-[#e8e4df] rounded mb-4" />
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-[#e8e4df] rounded" />
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
    <div className="bg-white rounded-lg border border-[#e8e4df] p-6">
      <div className="mb-6">
        <h3 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-[#2c2825] mb-1">Top Association Rules</h3>
        <p className="text-sm text-[#6b6560]">Most influential market basket patterns</p>
      </div>

      <div className="mb-8 bg-[#faf8f5] rounded-lg p-6 border border-[#e8e4df]">
        <h4 className="text-sm font-semibold text-[#2c2825] mb-4">Rule Metrics Comparison</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={ruleMetricsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8e4df" />
            <XAxis dataKey="rule" stroke="#6b6560" fontSize={12} />
            <YAxis stroke="#6b6560" fontSize={12} />
            <Tooltip />
            <Legend />
            <Bar dataKey="confidence" fill="#2c2825" name="Confidence %" />
            <Bar dataKey="support" fill="#6b6560" name="Support %" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mb-8 bg-[#faf8f5] rounded-lg p-6 border border-[#e8e4df]">
        <h4 className="text-sm font-semibold text-[#2c2825] mb-4">Support vs Confidence</h4>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart data={scatterData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8e4df" />
            <XAxis type="number" dataKey="support" name="Support" unit="%" stroke="#6b6560" fontSize={12} />
            <YAxis type="number" dataKey="confidence" name="Confidence" unit="%" stroke="#6b6560" fontSize={12} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Legend />
            <Scatter name="Rules" data={scatterData} fill="#2c2825" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-4">
        {topRules.slice(0, 5).map((rule, index) => (
          <div
            key={index}
            className="p-4 border border-[#e8e4df] rounded-lg bg-[#faf8f5]"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-[#e8e4df] rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-[#2c2825]">{index + 1}</span>
                </div>
                <div>
                  <h4 className="font-medium text-[#2c2825]">Rule #{index + 1}</h4>
                  <p className="text-sm text-[#6b6560]">
                    {rule.antecedent.map((item: any) => item.name).join(', ')} → {rule.consequent.map((item: any) => item.name).join(', ')}
                  </p>
                </div>
              </div>
              <span className="text-sm font-medium text-[#2c2825]">Lift: {rule.lift.toFixed(2)}</span>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-3">
              <div className="text-center p-2 bg-white rounded-lg border border-[#e8e4df]">
                <p className="text-xs text-[#6b6560] font-medium">Support</p>
                <p className="text-base font-semibold text-[#2c2825]">{(rule.support * 100).toFixed(1)}%</p>
              </div>
              <div className="text-center p-2 bg-white rounded-lg border border-[#e8e4df]">
                <p className="text-xs text-[#6b6560] font-medium">Confidence</p>
                <p className="text-base font-semibold text-[#2c2825]">{(rule.confidence * 100).toFixed(1)}%</p>
              </div>
              <div className="text-center p-2 bg-white rounded-lg border border-[#e8e4df]">
                <p className="text-xs text-[#6b6560] font-medium">Conviction</p>
                <p className="text-base font-semibold text-[#2c2825]">{rule.conviction.toFixed(2)}</p>
              </div>
            </div>
            <p className="text-sm text-[#6b6560]">
              When travelers book {rule.antecedent.map((item: any) => item.name).join(', ')}, they also book {rule.consequent.map((item: any) => item.name).join(', ')} with {(rule.confidence * 100).toFixed(1)}% confidence ({(rule.support * 100).toFixed(1)}% of transactions).
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#faf8f5] rounded-lg p-4 border border-[#e8e4df]">
          <p className="text-xs text-[#6b6560] font-medium">High Impact Rules</p>
          <p className="text-xl font-semibold text-[#2c2825]">{topRules.filter(rule => rule.lift > 2).length}</p>
        </div>
        <div className="bg-[#faf8f5] rounded-lg p-4 border border-[#e8e4df]">
          <p className="text-xs text-[#6b6560] font-medium">Avg Confidence</p>
          <p className="text-xl font-semibold text-[#2c2825]">{(topRules.reduce((sum, rule) => sum + rule.confidence, 0) / topRules.length * 100).toFixed(1)}%</p>
        </div>
        <div className="bg-[#faf8f5] rounded-lg p-4 border border-[#e8e4df]">
          <p className="text-xs text-[#6b6560] font-medium">Avg Lift</p>
          <p className="text-xl font-semibold text-[#2c2825]">{(topRules.reduce((sum, rule) => sum + rule.lift, 0) / topRules.length).toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
