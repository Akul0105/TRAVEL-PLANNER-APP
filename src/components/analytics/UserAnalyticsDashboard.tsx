'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import type { UserBundle, SuggestedPackage, VisitedDestination } from '@/lib/supabase';
import { Package, MapPin, Sparkles, BarChart3, PieChart as PieChartIcon, Info } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#2c2825', '#6b6560', '#9c958f', '#c4bdb5', '#e8e4df', '#4a4541'];

type TopRule = { rule: string; support: number; confidence: number; lift: number };
type TopRulesResponse = { rules: TopRule[]; formulas?: { support: string; confidence: string; lift: string } };

function ensureStringArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.filter((x): x is string => typeof x === 'string');
  return [];
}

export function UserAnalyticsDashboard() {
  const { user, profile } = useAuth();
  const [bundles, setBundles] = useState<UserBundle[]>([]);
  const [packages, setPackages] = useState<SuggestedPackage[]>([]);
  const [visited, setVisited] = useState<VisitedDestination[]>([]);
  const [topRules, setTopRules] = useState<TopRule[]>([]);
  const [formulas, setFormulas] = useState<TopRulesResponse['formulas']>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    const fetchData = async () => {
      const [bRes, pRes, vRes, rulesRes] = await Promise.all([
        supabase.from('user_bundles').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('suggested_packages').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('visited_destinations').select('*').eq('user_id', user.id),
        fetch('/api/mba/top-rules?limit=5').then((r) => r.json()).catch(() => ({ rules: [], formulas: null })),
      ]);
      if (!bRes.error) setBundles((bRes.data as UserBundle[]) ?? []);
      if (!pRes.error) setPackages((pRes.data as SuggestedPackage[]) ?? []);
      if (!vRes.error) setVisited((vRes.data as VisitedDestination[]) ?? []);
      if (rulesRes?.rules) setTopRules(rulesRes.rules);
      if (rulesRes?.formulas) setFormulas(rulesRes.formulas);
      setLoading(false);
    };
    fetchData();
  }, [user?.id]);

  if (!user) {
    return (
      <div className="bg-white rounded-lg border border-[#e8e4df] p-8 text-center">
        <p className="text-[#6b6560]">Sign in to see your personalised analytics and MBA insights.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-[#e8e4df] p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-[#e8e4df] rounded w-1/3" />
          <div className="h-48 bg-[#e8e4df] rounded" />
          <div className="h-48 bg-[#e8e4df] rounded" />
        </div>
      </div>
    );
  }

  const activities = ensureStringArray(profile?.activities_liked ?? []);
  const food = ensureStringArray(profile?.food_preferences ?? []);
  const bucket = ensureStringArray(profile?.bucket_list ?? []);

  const bundlesWithMetrics = bundles.filter(
    (b) =>
      b.bundle_data.support != null ||
      b.bundle_data.confidence != null ||
      b.bundle_data.lift != null,
  );
  const bundleMetricsData = bundlesWithMetrics.slice(0, 10).map((b, i) => ({
    name: `Bundle ${i + 1}`,
    support: b.bundle_data.support != null ? (b.bundle_data.support * 100) : 0,
    confidence: b.bundle_data.confidence != null ? (b.bundle_data.confidence * 100) : 0,
    lift: b.bundle_data.lift ?? 0,
  }));
  const bundlesWithRealRule = bundles.filter(
    (b) =>
      b.bundle_data.ruleSummary &&
      (b.bundle_data.ruleSummary.startsWith('IF ') || b.bundle_data.support != null),
  );

  const preferencesPie = [
    ...activities.map((a) => ({ name: a, value: 1 })),
    ...food.map((f) => ({ name: f, value: 1 })),
    ...bucket.map((b) => ({ name: b, value: 1 })),
  ].reduce<{ name: string; value: number }[]>((acc, curr) => {
    const existing = acc.find((x) => x.name === curr.name);
    if (existing) existing.value += 1;
    else acc.push({ ...curr });
    return acc;
  }, []);

  const summaryCards = [
    { label: 'Your bundles (MBA)', value: bundles.length, icon: Package },
    { label: 'Suggested packages', value: packages.length, icon: Sparkles },
    { label: 'Destinations visited', value: visited.length, icon: MapPin },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-[#2c2825] mb-4">
          Your analytics
        </h2>
        <p className="text-sm text-[#6b6560] mb-6">
          Data from your Scrapbook and market basket recommendations. All metrics below are from your stored bundles and preferences.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {summaryCards.map((card) => (
            <div key={card.label} className="bg-white rounded-lg border border-[#e8e4df] p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#e8e4df] flex items-center justify-center">
                <card.icon className="w-5 h-5 text-[#2c2825]" />
              </div>
              <div>
                <p className="text-xs text-[#6b6560] font-medium">{card.label}</p>
                <p className="text-2xl font-semibold text-[#2c2825]">{card.value}</p>
              </div>
            </div>
          ))}
        </div>

        {bundleMetricsData.length > 0 && (
          <div className="bg-white rounded-lg border border-[#e8e4df] p-6 mb-8">
            <h3 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-[#2c2825] mb-2 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" /> Bundle metrics (Support, Confidence, Lift)
            </h3>
            <p className="text-sm text-[#6b6560] mb-4">
              MBA metrics for the bundles generated for you. Support = frequency in transactions; Confidence = P(consequent|antecedent); Lift = Confidence / Support(consequent).
            </p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={bundleMetricsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8e4df" />
                <XAxis dataKey="name" stroke="#6b6560" fontSize={12} />
                <YAxis stroke="#6b6560" fontSize={12} />
                <Tooltip />
                <Legend />
                <Bar dataKey="support" fill="#9c958f" name="Support %" />
                <Bar dataKey="confidence" fill="#2c2825" name="Confidence %" />
                <Bar dataKey="lift" fill="#6b6560" name="Lift" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {(preferencesPie.length > 0) && (
          <div className="bg-white rounded-lg border border-[#e8e4df] p-6 mb-8">
            <h3 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-[#2c2825] mb-2 flex items-center gap-2">
              <PieChartIcon className="w-5 h-5" /> Your preferences (Scrapbook)
            </h3>
            <p className="text-sm text-[#6b6560] mb-4">
              Activities, food, and bucket list items used to personalise your bundles.
            </p>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={preferencesPie}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name }) => name}
                >
                  {preferencesPie.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Top 5 association rules from Apriori engine (real formulas) */}
        {topRules.length > 0 && (
          <div className="bg-white rounded-lg border border-[#e8e4df] p-6 mb-8">
            <h3 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-[#2c2825] mb-2 flex items-center gap-2">
              Top 5 association rules (Apriori)
            </h3>
            <p className="text-sm text-[#6b6560] mb-4">
              Rules computed from transaction data. Support = (# transactions containing A and B) / total; Confidence = P(B|A); Lift = Confidence / Support(B).
            </p>
            {formulas && (
              <div className="flex items-start gap-2 p-3 mb-4 rounded-lg bg-[#faf8f5] border border-[#e8e4df] text-xs text-[#6b6560]">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <ul className="list-disc list-inside space-y-0.5">
                  <li>{formulas.support}</li>
                  <li>{formulas.confidence}</li>
                  <li>{formulas.lift}</li>
                </ul>
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#e8e4df]">
                    <th className="text-left py-3 px-2 font-medium text-[#2c2825]">Rule</th>
                    <th className="text-right py-3 px-2 font-medium text-[#2c2825]">Support</th>
                    <th className="text-right py-3 px-2 font-medium text-[#2c2825]">Confidence</th>
                    <th className="text-right py-3 px-2 font-medium text-[#2c2825]">Lift</th>
                  </tr>
                </thead>
                <tbody>
                  {topRules.map((r, i) => (
                    <tr key={i} className="border-b border-[#e8e4df]">
                      <td className="py-3 px-2 text-[#2c2825] font-medium">{r.rule}</td>
                      <td className="py-3 px-2 text-right text-[#6b6560]">{(r.support * 100).toFixed(1)}%</td>
                      <td className="py-3 px-2 text-right text-[#6b6560]">{(r.confidence * 100).toFixed(0)}%</td>
                      <td className="py-3 px-2 text-right text-[#6b6560]">{r.lift.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {bundles.length > 0 && (
          <div className="bg-white rounded-lg border border-[#e8e4df] p-6 mb-8">
            <h3 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-[#2c2825] mb-4">
              Rules applied to your bundles
            </h3>
            <p className="text-sm text-[#6b6560] mb-4">
              Association rules (IF antecedent → consequent) that matched your personalised bundles. Each row shows the rule and its computed Support, Confidence, and Lift.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#e8e4df]">
                    <th className="text-left py-3 px-2 font-medium text-[#2c2825]">Rule</th>
                    <th className="text-right py-3 px-2 font-medium text-[#2c2825]">Support</th>
                    <th className="text-right py-3 px-2 font-medium text-[#2c2825]">Confidence</th>
                    <th className="text-right py-3 px-2 font-medium text-[#2c2825]">Lift</th>
                  </tr>
                </thead>
                <tbody>
                  {bundlesWithRealRule.length > 0 ? (
                    bundlesWithRealRule.map((b) => (
                      <tr key={b.id} className="border-b border-[#e8e4df]">
                        <td className="py-3 px-2 text-[#2c2825] font-medium">{b.bundle_data.ruleSummary}</td>
                        <td className="py-3 px-2 text-right text-[#6b6560]">
                          {b.bundle_data.support != null ? `${(b.bundle_data.support * 100).toFixed(1)}%` : '—'}
                        </td>
                        <td className="py-3 px-2 text-right text-[#6b6560]">
                          {b.bundle_data.confidence != null ? `${(b.bundle_data.confidence * 100).toFixed(0)}%` : '—'}
                        </td>
                        <td className="py-3 px-2 text-right text-[#6b6560]">
                          {b.bundle_data.lift != null ? b.bundle_data.lift.toFixed(2) : '—'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-4 px-2 text-center text-[#6b6560]">
                        No rule matched your current bundles yet. Click &quot;Suggest bundles&quot; on Scrapbook to generate new bundles; matching rules will show real IF … → … and metrics here.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {bundles.length === 0 && packages.length === 0 && preferencesPie.length === 0 && (
          <div className="bg-[#faf8f5] rounded-lg border border-[#e8e4df] p-8 text-center">
            <p className="text-[#6b6560]">
              No data yet. Add preferences in your <a href="/scrapbook" className="text-[#2c2825] underline">Scrapbook</a> and click &quot;Suggest bundles&quot; / &quot;Suggest package&quot; to see your analytics here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
