'use client';

import { useState } from 'react';
import { Calendar, Users, MapPin, DollarSign, Clock } from 'lucide-react';

interface BookingSummaryProps {
  searchParams: Record<string, any>;
}

export function BookingSummary({ searchParams }: BookingSummaryProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const bookingDetails = {
    destination: searchParams.destination || 'Mauritius',
    travelers: searchParams.travelers || '2',
    duration: searchParams.duration || '7 days',
    checkIn: '2024-03-15',
    checkOut: '2024-03-22',
    roomType: 'Deluxe Ocean View',
    flightClass: 'Economy',
    totalPrice: 1299,
    breakdown: {
      accommodation: 800,
      flights: 400,
      activities: 99
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Booking Summary</h3>
      
      {/* Main Details */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center space-x-3">
          <MapPin className="w-5 h-5 text-blue-600" />
          <div>
            <p className="font-medium text-gray-900">{bookingDetails.destination}</p>
            <p className="text-sm text-gray-600">Destination</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Users className="w-5 h-5 text-green-600" />
          <div>
            <p className="font-medium text-gray-900">{bookingDetails.travelers} Travelers</p>
            <p className="text-sm text-gray-600">Group Size</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Calendar className="w-5 h-5 text-purple-600" />
          <div>
            <p className="font-medium text-gray-900">{bookingDetails.duration}</p>
            <p className="text-sm text-gray-600">Duration</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Clock className="w-5 h-5 text-orange-600" />
          <div>
            <p className="font-medium text-gray-900">{bookingDetails.checkIn} - {bookingDetails.checkOut}</p>
            <p className="text-sm text-gray-600">Travel Dates</p>
          </div>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Accommodation</span>
          <span className="text-sm font-medium">${bookingDetails.breakdown.accommodation}</span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Flights</span>
          <span className="text-sm font-medium">${bookingDetails.breakdown.flights}</span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Activities</span>
          <span className="text-sm font-medium">${bookingDetails.breakdown.activities}</span>
        </div>
        <div className="border-t border-gray-200 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-gray-900">Total</span>
            <span className="text-lg font-bold text-blue-600">${bookingDetails.totalPrice}</span>
          </div>
        </div>
      </div>

      {/* MBA Insights */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Smart Recommendations</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Travel Insurance</span>
            <span className="text-green-600 font-medium">+$30</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Airport Transfer</span>
            <span className="text-green-600 font-medium">+$50</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Spa Package</span>
            <span className="text-green-600 font-medium">+$120</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Based on 87% of travelers who booked similar trips
        </p>
      </div>

      {/* Expandable Details */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700"
      >
        {isExpanded ? 'Show Less' : 'Show More Details'}
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-3">
          <div className="p-3 bg-gray-50 rounded-lg">
            <h5 className="font-medium text-gray-900 mb-1">Room Details</h5>
            <p className="text-sm text-gray-600">{bookingDetails.roomType}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <h5 className="font-medium text-gray-900 mb-1">Flight Class</h5>
            <p className="text-sm text-gray-600">{bookingDetails.flightClass}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <h5 className="font-medium text-gray-900 mb-1">Cancellation Policy</h5>
            <p className="text-sm text-gray-600">Free cancellation up to 24 hours before travel</p>
          </div>
        </div>
      )}
    </div>
  );
}
