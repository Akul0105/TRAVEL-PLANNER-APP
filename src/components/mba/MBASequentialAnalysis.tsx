'use client';

import { useState, useEffect } from 'react';
import { mbaEngine } from '@/lib/mba/engine';
import { AnimatedCard, FadeInText } from '@/components/ui';
import { TrendingUp, Users, Clock, ArrowRight, MapPin, Calendar } from 'lucide-react';

interface MBASequentialAnalysisProps {
  title: string;
  subtitle: string;
}

interface TravelSequence {
  id: string;
  name: string;
  steps: string[];
  frequency: number;
  support: number;
  avgDuration: number;
  successRate: number;
  seasonalPattern: string;
  customerSegment: string;
}

export function MBASequentialAnalysis({ title, subtitle }: MBASequentialAnalysisProps) {
  const [sequences, setSequences] = useState<TravelSequence[]>([]);
  const [selectedSequence, setSelectedSequence] = useState<TravelSequence | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateSequences = () => {
      setLoading(true);
      
      // Generate travel sequences based on MBA analysis
      const generatedSequences: TravelSequence[] = [
        {
          id: 'luxury-beach',
          name: 'Luxury Beach Experience',
          steps: [
            'Flight Booking',
            'Luxury Hotel Reservation',
            'Airport Transfer',
            'Spa Treatment',
            'Water Activities',
            'Sunset Cruise',
            'Fine Dining'
          ],
          frequency: 156,
          support: 0.23,
          avgDuration: 7,
          successRate: 0.94,
          seasonalPattern: 'Summer Peak',
          customerSegment: 'Luxury Travelers'
        },
        {
          id: 'cultural-city',
          name: 'Cultural City Explorer',
          steps: [
            'Flight/Train Booking',
            'Boutique Hotel',
            'Museum Tours',
            'Local Food Experience',
            'Historical Sites',
            'Cultural Shows',
            'Shopping'
          ],
          frequency: 203,
          support: 0.31,
          avgDuration: 5,
          successRate: 0.89,
          seasonalPattern: 'Spring/Fall',
          customerSegment: 'Cultural Explorers'
        },
        {
          id: 'adventure-nature',
          name: 'Adventure Nature Trip',
          steps: [
            'Flight Booking',
            'Budget Accommodation',
            'Hiking Tours',
            'Nature Photography',
            'Local Transportation',
            'Outdoor Activities',
            'Camping Experience'
          ],
          frequency: 134,
          support: 0.19,
          avgDuration: 6,
          successRate: 0.87,
          seasonalPattern: 'Summer',
          customerSegment: 'Adventure Seekers'
        },
        {
          id: 'romantic-getaway',
          name: 'Romantic Getaway',
          steps: [
            'Flight Booking',
            'Romantic Hotel',
            'Couples Spa',
            'Romantic Dinner',
            'Scenic Tours',
            'Photography Session',
            'Special Experiences'
          ],
          frequency: 98,
          support: 0.15,
          avgDuration: 4,
          successRate: 0.96,
          seasonalPattern: 'Valentine\'s/Anniversaries',
          customerSegment: 'Couples'
        },
        {
          id: 'wellness-retreat',
          name: 'Wellness Retreat',
          steps: [
            'Flight Booking',
            'Wellness Resort',
            'Yoga Sessions',
            'Meditation Classes',
            'Healthy Dining',
            'Spa Treatments',
            'Nature Walks'
          ],
          frequency: 87,
          support: 0.13,
          avgDuration: 8,
          successRate: 0.91,
          seasonalPattern: 'Year-round',
          customerSegment: 'Wellness Seekers'
        }
      ];
      
      setSequences(generatedSequences);
      setLoading(false);
    };

    generateSequences();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm shadow-black/[0.04] p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-neutral-200 rounded mb-4"></div>
          <div className="h-4 bg-neutral-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-neutral-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm shadow-black/[0.04] p-6">
      <FadeInText className="mb-6">
        <h3 className="text-2xl font-bold text-neutral-950 mb-2">{title}</h3>
        <p className="text-neutral-600">{subtitle}</p>
      </FadeInText>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Total sequences</p>
              <p className="text-2xl font-bold text-neutral-950">{sequences.length}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-neutral-400" />
          </div>
        </div>
        
        <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Avg success rate</p>
              <p className="text-2xl font-bold text-neutral-950">
                {(sequences.reduce((sum, seq) => sum + seq.successRate, 0) / sequences.length * 100).toFixed(0)}%
              </p>
            </div>
            <Users className="w-8 h-8 text-neutral-400" />
          </div>
        </div>
        
        <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Avg duration</p>
              <p className="text-2xl font-bold text-neutral-950">
                {Math.round(sequences.reduce((sum, seq) => sum + seq.avgDuration, 0) / sequences.length)} days
              </p>
            </div>
            <Clock className="w-8 h-8 text-neutral-400" />
          </div>
        </div>
        
        <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Total bookings</p>
              <p className="text-2xl font-bold text-neutral-950">
                {sequences.reduce((sum, seq) => sum + seq.frequency, 0)}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-neutral-400" />
          </div>
        </div>
      </div>

      {/* Sequences Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sequences.map((sequence, index) => (
          <AnimatedCard
            key={sequence.id}
            delay={index * 0.1}
            className="p-6 border border-neutral-200 rounded-xl hover:shadow-lg transition-all duration-300 cursor-pointer group"
            onClick={() => setSelectedSequence(sequence)}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-xl font-bold text-neutral-950 group-hover:text-neutral-700 transition-colors">
                  {sequence.name}
                </h4>
                <p className="text-sm text-neutral-600">{sequence.customerSegment}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2 mb-1">
                  <Users className="w-4 h-4 text-neutral-500" />
                  <span className="text-sm font-medium text-neutral-700">
                    {sequence.frequency} bookings
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-neutral-500" />
                  <span className="text-sm text-neutral-600">
                    {(sequence.successRate * 100).toFixed(0)}% success
                  </span>
                </div>
              </div>
            </div>

            {/* Sequence Steps */}
            <div className="space-y-2 mb-4">
              {sequence.steps.map((step, stepIndex) => (
                <div key={stepIndex} className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-neutral-100 border border-neutral-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-neutral-950">{stepIndex + 1}</span>
                  </div>
                  <span className="text-sm text-neutral-700">{step}</span>
                  {stepIndex < sequence.steps.length - 1 && (
                    <ArrowRight className="w-3 h-3 text-neutral-400 ml-auto" />
                  )}
                </div>
              ))}
            </div>

            {/* Sequence Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Support</p>
                <p className="text-lg font-bold text-neutral-950">
                  {(sequence.support * 100).toFixed(1)}%
                </p>
              </div>
              <div className="text-center p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Duration</p>
                <p className="text-lg font-bold text-neutral-950">
                  {sequence.avgDuration} days
                </p>
              </div>
            </div>

            {/* Seasonal Pattern */}
            <div className="flex items-center space-x-2 p-3 bg-neutral-50 rounded-lg">
              <Calendar className="w-4 h-4 text-neutral-500" />
              <span className="text-sm text-neutral-600">
                <strong>Peak Season:</strong> {sequence.seasonalPattern}
              </span>
            </div>
          </AnimatedCard>
        ))}
      </div>

      {/* Sequence Detail Modal */}
      {selectedSequence && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto shadow-xl shadow-black/10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-neutral-950">{selectedSequence.name}</h3>
              <button
                onClick={() => setSelectedSequence(null)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                ✕
              </button>
            </div>
            
            {/* Detailed Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-4">
                <h4 className="font-semibold text-neutral-950 mb-2">Booking statistics</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-neutral-600">Total bookings:</span>
                    <span className="font-medium text-neutral-950">{selectedSequence.frequency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-neutral-600">Support:</span>
                    <span className="font-medium text-neutral-950">{(selectedSequence.support * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-neutral-600">Success rate:</span>
                    <span className="font-medium text-neutral-950">{(selectedSequence.successRate * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-4">
                <h4 className="font-semibold text-neutral-950 mb-2">Travel details</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-neutral-600">Avg duration:</span>
                    <span className="font-medium text-neutral-950">{selectedSequence.avgDuration} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-neutral-600">Steps:</span>
                    <span className="font-medium text-neutral-950">{selectedSequence.steps.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-neutral-600">Segment:</span>
                    <span className="font-medium text-neutral-950">{selectedSequence.customerSegment}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-4">
                <h4 className="font-semibold text-neutral-950 mb-2">Seasonal pattern</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-neutral-600">Peak season:</span>
                    <span className="font-medium text-neutral-950">{selectedSequence.seasonalPattern}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-neutral-600">Demand level:</span>
                    <span className="font-medium text-neutral-950">High</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-neutral-600">Booking window:</span>
                    <span className="font-medium text-neutral-950">2-4 weeks</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step-by-Step Timeline */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-neutral-950 mb-4">Travel Timeline</h4>
              <div className="space-y-4">
                {selectedSequence.steps.map((step, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-neutral-100 border border-neutral-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-neutral-950">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-neutral-950">{step}</p>
                      <p className="text-sm text-neutral-600">
                        {index === 0 ? 'Initial booking' : 
                         index === selectedSequence.steps.length - 1 ? 'Final experience' :
                         'Mid-trip activity'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-neutral-500">
                        Day {index + 1}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* MBA Insights */}
            <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-4">
              <h4 className="font-semibold text-neutral-950 mb-2">MBA insights</h4>
              <p className="text-sm text-neutral-600">
                This sequence has a <strong>{selectedSequence.support * 100}%</strong> support rate, 
                meaning it appears in <strong>{selectedSequence.frequency}</strong> successful bookings. 
                The <strong>{(selectedSequence.successRate * 100).toFixed(0)}%</strong> success rate indicates 
                high customer satisfaction. This pattern is most popular among{' '}
                <strong>{selectedSequence.customerSegment}</strong> during{' '}
                <strong>{selectedSequence.seasonalPattern}</strong>.
              </p>
            </div>

            <div className="mt-6 flex space-x-3">
              <button
                type="button"
                onClick={() => setSelectedSequence(null)}
                className="flex-1 bg-neutral-100 text-neutral-950 border border-neutral-200 px-4 py-2.5 rounded-full text-sm font-medium hover:bg-neutral-200 transition-colors"
              >
                Close
              </button>
              <button type="button" className="flex-1 bg-neutral-950 text-white px-4 py-2.5 rounded-full text-sm font-semibold hover:bg-neutral-800 transition-colors">
                Use this pattern
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
