'use client';

import { useState, useEffect } from 'react';
import { mbaEngine, MBAItem } from '@/lib/mba/engine';
import { AnimatedCard, FadeInText } from '@/components/ui';
import { TrendingUp, Users, Star, ArrowRight } from 'lucide-react';

interface MBARecommendationsProps {
  type: 'destinations' | 'packages' | 'booking' | 'insights';
  context: Record<string, any>;
  title: string;
  subtitle: string;
  showConfidence?: boolean;
  showLift?: boolean;
  showAnalytics?: boolean;
}

export function MBARecommendations({
  type,
  context,
  title,
  subtitle,
  showConfidence = false,
  showLift = false,
  showAnalytics = false
}: MBARecommendationsProps) {
  const [recommendations, setRecommendations] = useState<MBAItem[]>([]);
  const [rules, setRules] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateRecommendations = () => {
      setLoading(true);
      
      // Convert context to MBA items
      const contextItems: MBAItem[] = [];
      
      if (context.destination) {
        const destItem = mbaEngine['items'].find(item => 
          item.name.toLowerCase().includes(context.destination.toLowerCase())
        );
        if (destItem) contextItems.push(destItem);
      }
      
      if (context.category) {
        const categoryItem = mbaEngine['items'].find(item => 
          item.category === context.category
        );
        if (categoryItem) contextItems.push(categoryItem);
      }
      
      // Get recommendations based on type
      let recs: MBAItem[] = [];
      
      switch (type) {
        case 'destinations':
          recs = mbaEngine.getRecommendations(contextItems, 6);
          break;
        case 'packages':
          recs = mbaEngine.getRecommendations(contextItems, 4);
          break;
        case 'booking':
          recs = mbaEngine.getRecommendations(contextItems, 5);
          break;
        case 'insights':
          recs = mbaEngine.getTopRules(5).flatMap(rule => 
            [...rule.antecedent, ...rule.consequent]
          ).filter((item, index, self) => 
            index === self.findIndex(t => t.id === item.id)
          );
          break;
      }
      
      setRecommendations(recs);
      setRules(mbaEngine.getTopRules(5));
      setAnalytics(mbaEngine.getAnalytics());
      setLoading(false);
    };

    generateRecommendations();
  }, [type, context]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
      <FadeInText className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{subtitle}</p>
      </FadeInText>

      {/* Analytics Dashboard */}
      {showAnalytics && analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Rules</p>
                <p className="text-2xl font-bold text-blue-900">{analytics.totalRules}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-500" />
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
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          
          <div className="bg-orange-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">Segments</p>
                <p className="text-2xl font-bold text-orange-900">{analytics.totalSegments}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>
      )}

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map((item, index) => (
          <AnimatedCard
            key={item.id}
            delay={index * 0.1}
            className="p-4 border border-gray-200 rounded-lg hover:shadow-lg transition-all duration-300 cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {item.name}
                </h4>
                <p className="text-sm text-gray-600 capitalize">{item.category}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-blue-600">${item.price}</p>
                {showConfidence && (
                  <p className="text-xs text-gray-500">Confidence: 85%</p>
                )}
                {showLift && (
                  <p className="text-xs text-gray-500">Lift: 2.3</p>
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-1 mb-3">
              {item.tags.slice(0, 3).map((tag, tagIndex) => (
                <span
                  key={tagIndex}
                  className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-500">
                <Users className="w-4 h-4 mr-1" />
                <span>72% of travelers</span>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
            </div>
          </AnimatedCard>
        ))}
      </div>

      {/* Top Association Rules */}
      {type === 'insights' && rules.length > 0 && (
        <div className="mt-8">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Top Association Rules</h4>
          <div className="space-y-3">
            {rules.slice(0, 3).map((rule, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">
                      {rule.antecedent.map(item => item.name).join(', ')}
                    </span>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">
                      {rule.consequent.map(item => item.name).join(', ')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Conf: {(rule.confidence * 100).toFixed(1)}%</span>
                    <span>Lift: {rule.lift.toFixed(2)}</span>
                    <span>Support: {(rule.support * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
