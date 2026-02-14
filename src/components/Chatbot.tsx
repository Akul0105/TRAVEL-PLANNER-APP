'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Trash2, Minimize2, Maximize2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { ChatbotProps, ChatMessage, TripInfo, TripInfoStep } from '@/types';
import { cn } from '@/lib/utils';

const TRIP_INFO_STEPS: TripInfoStep[] = [
  'welcome',
  'destination',
  'dates',
  'travelers',
  'budget',
  'travelStyle',
  'accommodation',
  'interests',
  'complete'
];

const STEP_QUESTIONS: Record<TripInfoStep, string> = {
  welcome: "Great! I'd love to help you plan your perfect trip! 🧳✈️\n\nLet me ask you a few quick questions so I can create the best itinerary for you.",
  destination: "Where would you like to travel? 🌍",
  dates: "When are you planning to travel? Please share your travel dates (e.g., 'March 15-20' or 'Next month').",
  travelers: "How many people will be traveling? 👥",
  budget: "What's your budget range? (e.g., 'Rs 50,000', 'Rs 100,000-200,000', or 'budget-friendly')",
  travelStyle: "What's your travel style? (Adventure, Relaxation, Cultural, Business, Family, Luxury, or Budget)",
  accommodation: "What type of accommodation do you prefer? (Hotel, Resort, Apartment, Hostel, or Luxury)",
  interests: "What are you most interested in? (e.g., 'beaches, museums, nightlife' or 'hiking, food, shopping')",
  complete: "Perfect! I have all the information I need. Let me create your personalized travel plan! ✨"
};

export function Chatbot({ isOpen, onToggle, onClose }: ChatbotProps) {
  const [inputValue, setInputValue] = useState('');
  const [tripInfo, setTripInfo] = useState<TripInfo>({});
  const [currentStep, setCurrentStep] = useState<TripInfoStep>('welcome');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hey! I'm your travel planning assistant! 🧳\n\nI can help you plan your perfect trip, but first I need to gather some information about your travel preferences.\n\nWould you like to start planning a trip?",
      timestamp: new Date(),
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();
  }, [isOpen]);

  // Check if all required trip info is collected
  const isTripInfoComplete = (): boolean => {
    return !!(
      tripInfo.destination &&
      tripInfo.startDate &&
      tripInfo.numberOfTravelers &&
      tripInfo.budget &&
      tripInfo.travelStyle
    );
  };

  // Extract information from user message
  const extractTripInfo = (message: string, step: TripInfoStep): Partial<TripInfo> => {
    const lowerMessage = message.toLowerCase();
    const info: Partial<TripInfo> = {};

    switch (step) {
      case 'destination':
        // Extract destination (simple extraction - can be enhanced)
        info.destination = message.trim();
        break;
      
      case 'dates':
        // Extract dates (simple extraction - can be enhanced with date parsing)
        const dateMatch = message.match(/(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\w+\s+\d{1,2})/gi);
        if (dateMatch && dateMatch.length >= 2) {
          info.startDate = dateMatch[0];
          info.endDate = dateMatch[1];
        } else if (dateMatch && dateMatch.length === 1) {
          info.startDate = dateMatch[0];
        } else {
          info.startDate = message.trim();
        }
        break;
      
      case 'travelers':
        const travelerMatch = message.match(/\d+/);
        if (travelerMatch) {
          info.numberOfTravelers = parseInt(travelerMatch[0]);
        }
        break;
      
      case 'budget':
        info.budget = message.trim();
        break;
      
      case 'travelStyle':
        const styles = ['adventure', 'relaxation', 'cultural', 'business', 'family', 'luxury', 'budget'];
        const foundStyle = styles.find(style => lowerMessage.includes(style));
        if (foundStyle) {
          info.travelStyle = foundStyle as TripInfo['travelStyle'];
        }
        break;
      
      case 'accommodation':
        const accommodations = ['hotel', 'resort', 'apartment', 'hostel', 'luxury'];
        const foundAccommodation = accommodations.find(acc => lowerMessage.includes(acc));
        if (foundAccommodation) {
          info.accommodationPreference = foundAccommodation as TripInfo['accommodationPreference'];
        }
        break;
      
      case 'interests':
        info.interests = message.split(',').map(i => i.trim()).filter(Boolean);
        break;
    }

    return info;
  };

  // Get next step based on current step
  const getNextStep = (current: TripInfoStep): TripInfoStep => {
    const currentIndex = TRIP_INFO_STEPS.indexOf(current);
    if (currentIndex < TRIP_INFO_STEPS.length - 1) {
      return TRIP_INFO_STEPS[currentIndex + 1];
    }
    return 'complete';
  };

  // Handle user message and progress through steps
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const userInput = inputValue.trim();
    setInputValue('');
    setIsLoading(true);

    try {
      // If user wants to start planning, begin the information collection
      if (currentStep === 'welcome' && (userInput.toLowerCase().includes('yes') || userInput.toLowerCase().includes('start') || userInput.toLowerCase().includes('plan'))) {
        const nextStep = getNextStep('welcome');
        setCurrentStep(nextStep);
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: STEP_QUESTIONS[nextStep],
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
        return;
      }

      // If we're still collecting information
      if (currentStep !== 'complete' && currentStep !== 'welcome') {
        // Extract information from user's message
        const extractedInfo = extractTripInfo(userInput, currentStep);
        const updatedTripInfo = { ...tripInfo, ...extractedInfo };
        setTripInfo(updatedTripInfo);

        // Move to next step
        const nextStep = getNextStep(currentStep);
        setCurrentStep(nextStep);

        // If we've completed all steps, allow planning
        if (nextStep === 'complete' || isTripInfoComplete()) {
          const assistantMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: STEP_QUESTIONS['complete'] + '\n\nNow I can help you plan your trip! What would you like to know?',
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, assistantMessage]);
          setIsLoading(false);
          return;
        }

        // Ask next question
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `Got it! 👍\n\n${STEP_QUESTIONS[nextStep]}`,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
        return;
      }

      // If trip info is complete, allow normal chat with API
      if (isTripInfoComplete() || currentStep === 'complete') {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            messages: [...messages, userMessage],
            tripInfo: tripInfo 
          }),
        });

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response || "Hmm... I didn't quite get that. Could you ask differently?",
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, assistantMessage]);
      } else {
        // Still collecting info - guide user back
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "I still need a bit more information to plan your trip perfectly! Let me continue asking questions.\n\n" + STEP_QUESTIONS[currentStep],
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "⚠️ I apologize, but I'm having trouble connecting to our travel system. Please try again later!",
          timestamp: new Date(),
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = () => {
    setTripInfo({});
    setCurrentStep('welcome');
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: "Hey! I'm your travel planning assistant! 🧳\n\nI can help you plan your perfect trip, but first I need to gather some information about your travel preferences.\n\nWould you like to start planning a trip?",
        timestamp: new Date(),
      }
    ]);
  };

  const formatTime = (timestamp: Date) =>
    timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Calculate progress percentage
  const progressPercentage = () => {
    const requiredFields = ['destination', 'startDate', 'numberOfTravelers', 'budget', 'travelStyle'];
    const completedFields = requiredFields.filter(field => {
      if (field === 'startDate') return !!tripInfo.startDate;
      if (field === 'numberOfTravelers') return !!tripInfo.numberOfTravelers;
      return !!tripInfo[field as keyof TripInfo];
    });
    return (completedFields.length / requiredFields.length) * 100;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "fixed bottom-24 right-6 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col",
            isExpanded
              ? "w-screen h-screen bottom-0 right-0 rounded-none"
              : "w-96 h-[600px]"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Travel Agent AI</h3>
                <p className="text-blue-100 text-xs">
                  {isTripInfoComplete() ? 'Ready to plan!' : 'Collecting info...'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={clearMessages}
                className="p-1 text-white hover:bg-white/20 rounded-lg"
                title="Clear chat"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsExpanded(prev => !prev)}
                className="p-1 text-white hover:bg-white/20 rounded-lg"
                title={isExpanded ? "Exit Fullscreen" : "Go Fullscreen"}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          {!isTripInfoComplete() && currentStep !== 'welcome' && (
            <div className="px-4 pt-3 pb-2 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-600">Trip Information</span>
                <span className="text-xs font-medium text-blue-600">{Math.round(progressPercentage())}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage()}%` }}
                  transition={{ duration: 0.3 }}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                />
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={cn("flex gap-3", message.role === 'user' ? "justify-end" : "justify-start")}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-blue-500" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-3",
                    message.role === 'user'
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-900 border border-gray-200"
                  )}
                >
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                  <p
                    className={cn(
                      "text-xs mt-1",
                      message.role === 'user' ? "text-blue-100" : "text-gray-500"
                    )}
                  >
                    {formatTime(message.timestamp)}
                  </p>
                </div>
                {message.role === 'user' && (
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-gray-500" />
                  </div>
                )}
              </motion.div>
            ))}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3 justify-start"
              >
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-blue-500" />
                </div>
                <div className="bg-white rounded-2xl px-4 py-3 border border-gray-200">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white">
            {!isTripInfoComplete() && currentStep !== 'welcome' && (
              <div className="mb-2 text-xs text-gray-500">
                {currentStep !== 'complete' && `Answering: ${STEP_QUESTIONS[currentStep].split('\n')[0]}`}
              </div>
            )}
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={
                  isTripInfoComplete() 
                    ? "Ask about your trip, packages, or travel advice..."
                    : currentStep === 'welcome'
                    ? "Type 'yes' or 'start' to begin..."
                    : "Type your answer..."
                }
                disabled={isLoading}
                className={cn(
                  "flex-1 px-4 py-3 rounded-xl border border-gray-200",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className={cn(
                  "px-4 py-3 bg-blue-500 text-white rounded-xl",
                  "hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed",
                  "transition-colors duration-200 flex items-center justify-center"
                )}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
