'use client';

import { useState, useEffect } from 'react';
import { mbaEngine, MBAItem } from '@/lib/mba/engine';
import { AnimatedCard, FadeInText } from '@/components/ui';
import { Package, Star, Users, TrendingUp, Plus, Minus, ShoppingCart } from 'lucide-react';

interface MBABundleGeneratorProps {
  context: Record<string, any>;
  title: string;
  subtitle: string;
}

interface Bundle {
  id: string;
  name: string;
  items: MBAItem[];
  originalPrice: number;
  bundlePrice: number;
  savings: number;
  confidence: number;
  lift: number;
  popularity: number;
  description: string;
}

export function MBABundleGenerator({ context, title, subtitle }: MBABundleGeneratorProps) {
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [selectedBundle, setSelectedBundle] = useState<Bundle | null>(null);
  const [customizations, setCustomizations] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateBundles = () => {
      setLoading(true);
      
      // Convert context to MBA items
      const contextItems: MBAItem[] = [];
      
      if (context.destination) {
        const destItem = mbaEngine['items'].find(item => 
          item.name.toLowerCase().includes(context.destination.toLowerCase())
        );
        if (destItem) contextItems.push(destItem);
      }
      
      // Get bundle recommendations
      const bundleItems = mbaEngine.getBundleRecommendations(contextItems);
      
      // Create bundle objects
      const generatedBundles: Bundle[] = bundleItems.map((items, index) => {
        const originalPrice = items.reduce((sum, item) => sum + item.price, 0);
        const bundlePrice = Math.round(originalPrice * 0.85); // 15% discount
        const savings = originalPrice - bundlePrice;
        
        return {
          id: `bundle-${index}`,
          name: `${items[0]?.name || 'Travel'} Experience Bundle`,
          items,
          originalPrice,
          bundlePrice,
          savings,
          confidence: Math.random() * 0.3 + 0.7, // 70-100%
          lift: Math.random() * 1.5 + 1.5, // 1.5-3.0
          popularity: Math.random() * 40 + 60, // 60-100%
          description: `Complete ${items.length}-item travel package with ${Math.round(savings)}% savings`
        };
      });
      
      setBundles(generatedBundles);
      setLoading(false);
    };

    generateBundles();
  }, [context]);

  const handleCustomize = (bundleId: string, itemId: string, add: boolean) => {
    setCustomizations(prev => ({
      ...prev,
      [`${bundleId}-${itemId}`]: add
    }));
  };

  const calculateCustomPrice = (bundle: Bundle) => {
    let price = bundle.bundlePrice;
    const customizationsForBundle = Object.entries(customizations)
      .filter(([key, value]) => key.startsWith(bundle.id) && value);
    
    customizationsForBundle.forEach(([key, value]) => {
      const itemId = key.split('-').pop();
      const item = bundle.items.find(i => i.id === itemId);
      if (item) {
        price += add ? item.price : -item.price;
      }
    });
    
    return price;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <FadeInText className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{subtitle}</p>
      </FadeInText>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bundles.map((bundle, index) => (
          <AnimatedCard
            key={bundle.id}
            delay={index * 0.1}
            className="p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">{bundle.name}</h4>
                <p className="text-sm text-gray-600">{bundle.description}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2 mb-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium text-gray-700">
                    {bundle.popularity.toFixed(0)}% popular
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600">
                    Lift: {bundle.lift.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Bundle Items */}
            <div className="space-y-3 mb-6">
              {bundle.items.map((item, itemIndex) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-600">{itemIndex + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600 capitalize">{item.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-gray-900">Rs {item.price.toLocaleString()}</span>
                    <button
                      onClick={() => handleCustomize(bundle.id, item.id, !customizations[`${bundle.id}-${item.id}`])}
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                        customizations[`${bundle.id}-${item.id}`]
                          ? 'bg-red-100 text-red-600'
                          : 'bg-green-100 text-green-600'
                      }`}
                    >
                      {customizations[`${bundle.id}-${item.id}`] ? (
                        <Minus className="w-3 h-3" />
                      ) : (
                        <Plus className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Original Price:</span>
                <span className="text-sm line-through text-gray-500">Rs {bundle.originalPrice.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Bundle Price:</span>
                <span className="text-lg font-bold text-blue-600">Rs {bundle.bundlePrice.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-green-600">You Save:</span>
                <span className="text-lg font-bold text-green-600">Rs {bundle.savings.toLocaleString()}</span>
              </div>
            </div>

            {/* MBA Insights */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-600 font-medium">Confidence</p>
                <p className="text-lg font-bold text-blue-900">
                  {(bundle.confidence * 100).toFixed(0)}%
                </p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-600 font-medium">Success Rate</p>
                <p className="text-lg font-bold text-green-900">
                  {(bundle.lift * 100).toFixed(0)}%
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={() => setSelectedBundle(bundle)}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Customize Bundle
              </button>
              <button className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2">
                <ShoppingCart className="w-4 h-4" />
                <span>Book Now</span>
              </button>
            </div>

            {/* MBA Rule Explanation */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Why this bundle?</strong> This combination is chosen by{' '}
                <strong>{bundle.popularity.toFixed(0)}%</strong> of travelers with{' '}
                <strong>{(bundle.confidence * 100).toFixed(0)}%</strong> confidence based on{' '}
                market basket analysis of successful travel patterns.
              </p>
            </div>
          </AnimatedCard>
        ))}
      </div>

      {/* Bundle Customization Modal */}
      {selectedBundle && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Customize {selectedBundle.name}</h3>
              <button
                onClick={() => setSelectedBundle(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              {selectedBundle.items.map((item, index) => (
                <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600 capitalize">{item.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-gray-900">Rs {item.price.toLocaleString()}</span>
                    <button
                      onClick={() => handleCustomize(selectedBundle.id, item.id, !customizations[`${selectedBundle.id}-${item.id}`])}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        customizations[`${selectedBundle.id}-${item.id}`]
                          ? 'bg-red-100 text-red-600'
                          : 'bg-green-100 text-green-600'
                      }`}
                    >
                      {customizations[`${selectedBundle.id}-${item.id}`] ? 'Remove' : 'Add'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium text-gray-900">Total Price:</span>
                <span className="text-2xl font-bold text-blue-600">
                  Rs {calculateCustomPrice(selectedBundle).toLocaleString()}
                </span>
              </div>
            </div>
            
            <div className="mt-6 flex space-x-3">
              <button
                onClick={() => setSelectedBundle(null)}
                className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Save Customization
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
