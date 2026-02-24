'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Trash2, Minimize2, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { ChatbotProps, ChatMessage, TripInfo, TripInfoStep } from '@/types';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

const TRIP_INFO_STEPS: TripInfoStep[] = [
  'welcome',
  'destination',
  'pastDestinations',
  'restaurantType',
  'activities',
  'placesVisited',
  'budget',
  'travelStyle',
  'complete'
];

const STEP_QUESTIONS: Record<TripInfoStep, string> = {
  welcome: "I'll ask a few questions about your preferences and past travel so we can suggest **personalized bundles** for you (using market basket analysis).",
  destination: "Which **destination** are you interested in right now? (e.g. Paris, Mauritius, Tokyo)",
  pastDestinations: "Which **destinations have you already visited**? (e.g. London, Bali, Dubai – list a few)",
  restaurantType: "What **type of restaurants** do you enjoy? (e.g. local, fine dining, street food, casual)",
  activities: "What **activities** do you like when you travel? (e.g. beaches, museums, hiking, food tours, nightlife)",
  placesVisited: "Any **places or attractions** you've loved? (e.g. a specific museum, beach, or city area)",
  budget: "What's your usual **budget style**? (budget-friendly, mid-range, or luxury)",
  travelStyle: "What's your **travel style**? (Adventure, Relaxation, Cultural, Business, Family, Luxury, or Budget)",
  complete: "Thanks! I have enough to suggest personalized bundles. Check your **Scrapbook** for recommendations."
};

function isEmail(str: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str.trim());
}

export function Chatbot({ isOpen, onToggle, onClose }: ChatbotProps) {
  const { user, profile, session, signInWithOtp, updateProfile } = useAuth();
  const [inputValue, setInputValue] = useState('');
  const [tripInfo, setTripInfo] = useState<TripInfo>({});
  const [currentStep, setCurrentStep] = useState<TripInfoStep>('welcome');
  const [profileStep, setProfileStep] = useState<'name' | 'address'>('name');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const profilePromptSent = useRef(false);
  const tripWelcomeSent = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const phase = !user ? 'auth' : !profile?.full_name ? 'profile' : 'trip';

  useEffect(() => {
    if (!user) {
      setMessages([
        { id: '1', role: 'assistant', content: "Hey! I'm your travel planning assistant. 🧳\n\nTo get started, **enter your email** and we'll send you a sign-in link. After you sign in, we can chat and I'll create personalized travel bundles for you.", timestamp: new Date() },
      ]);
      profilePromptSent.current = false;
      tripWelcomeSent.current = false;
      return;
    }
    if (!profile?.full_name) {
      if (!profilePromptSent.current) {
        profilePromptSent.current = true;
        setMessages((prev) => {
          const hasEmailFlow = prev.some((m) => m.content.includes('sign-in link') || m.content.includes('Check your email'));
          if (hasEmailFlow) {
            return [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: "You're signed in! What's your **full name**?", timestamp: new Date() }];
          }
          return [{ id: '1', role: 'assistant', content: "You're signed in! What's your **full name**?", timestamp: new Date() }];
        });
        setProfileStep('name');
      }
      return;
    }
    profilePromptSent.current = false;
    if (!tripWelcomeSent.current) {
      tripWelcomeSent.current = true;
      setMessages((prev) => {
        const hasWelcome = prev.some((m) => m.content.includes('plan a trip') || m.content.includes('start planning'));
        if (hasWelcome) return prev;
        return [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: "Would you like to **share your preferences** (destinations, restaurants, activities) so I can suggest personalized bundles? Type **yes** or **start**.", timestamp: new Date() }];
      });
    }
    setCurrentStep('welcome');
  }, [user?.id, profile?.full_name]);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();
  }, [isOpen]);

  // Enough preferences for MBA-based bundles
  const isTripInfoComplete = (): boolean => {
    return !!(tripInfo.destination && (tripInfo.pastDestinations?.length || tripInfo.restaurantPreferences || tripInfo.activityPreferences?.length || tripInfo.budget || tripInfo.travelStyle));
  };

  // Extract preferences from user message
  const extractTripInfo = (message: string, step: TripInfoStep): Partial<TripInfo> => {
    const lowerMessage = message.toLowerCase();
    const info: Partial<TripInfo> = {};

    switch (step) {
      case 'destination':
        info.destination = message.trim();
        break;
      case 'pastDestinations':
        info.pastDestinations = message.split(/[,;]/).map(s => s.trim()).filter(Boolean);
        break;
      case 'restaurantType':
        info.restaurantPreferences = message.trim();
        break;
      case 'activities':
        info.activityPreferences = message.split(/[,;]/).map(s => s.trim()).filter(Boolean);
        break;
      case 'placesVisited':
        info.placesVisited = message.split(/[,;]/).map(s => s.trim()).filter(Boolean);
        break;
      case 'budget':
        info.budget = message.trim();
        break;
      case 'travelStyle':
        const styles = ['adventure', 'relaxation', 'cultural', 'business', 'family', 'luxury', 'budget'];
        const foundStyle = styles.find(style => lowerMessage.includes(style));
        if (foundStyle) info.travelStyle = foundStyle as TripInfo['travelStyle'];
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
      // --- Auth phase: collect email and send sign-in link
      if (phase === 'auth') {
        if (!isEmail(userInput)) {
          setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: "Please enter a valid email address.", timestamp: new Date() }]);
          setIsLoading(false);
          return;
        }
        const { error } = await signInWithOtp(userInput);
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: error
            ? "We couldn't send the sign-in link. Please try again or use another email."
            : "We've sent you a **sign-in link** to your email. Click the link to sign in, then return here and refresh or continue chatting.",
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
        return;
      }

      // --- Profile phase: collect name then address
      if (phase === 'profile') {
        if (profileStep === 'name') {
          await updateProfile({ full_name: userInput });
          setProfileStep('address');
          setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: "Thanks! What's your **address**? (You can type 'skip' if you prefer not to share.)", timestamp: new Date() }]);
          setIsLoading(false);
          return;
        }
        if (profileStep === 'address') {
          if (!userInput.toLowerCase().includes('skip')) await updateProfile({ address: userInput });
          setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: "All set! Would you like to **share your preferences** so I can suggest personalized bundles? Type **yes** or **start** and I'll ask about destinations, restaurants, activities and more.", timestamp: new Date() }]);
          setCurrentStep('welcome');
          setIsLoading(false);
          return;
        }
      }

      // If user wants to start planning, begin the information collection
      if (phase === 'trip' && currentStep === 'welcome' && (userInput.toLowerCase().includes('yes') || userInput.toLowerCase().includes('start') || userInput.toLowerCase().includes('plan'))) {
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

      // If we're still collecting information (trip phase only)
      if (phase === 'trip' && currentStep !== 'complete' && currentStep !== 'welcome') {
        // Extract information from user's message
        const extractedInfo = extractTripInfo(userInput, currentStep);
        const updatedTripInfo = { ...tripInfo, ...extractedInfo };
        setTripInfo(updatedTripInfo);

        // Move to next step
        const nextStep = getNextStep(currentStep);
        setCurrentStep(nextStep);

        // If we've completed all steps: save MBA bundles and tell user to check Scrapbook
        if (nextStep === 'complete' || isTripInfoComplete()) {
          let scrapbookNote = '';
          try {
            const { data: { session: currentSession } } = await supabase.auth.getSession();
            const token = currentSession?.access_token;
            if (token && updatedTripInfo.destination) {
              const res = await fetch('/api/mba/suggest-bundles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ tripInfo: updatedTripInfo }),
              });
              const data = await res.json();
              if (data?.success && data?.count > 0) {
                scrapbookNote = `\n\nI've added **${data.count} personalized bundle(s)** to your **Scrapbook** (based on market basket analysis). Check the **Scrapbook** page to see them!`;
              } else if (data?.error) {
                scrapbookNote = `\n\n(Saving bundles failed: ${data.error}. You can try again from Scrapbook.)`;
              }
            }
          } catch { /* ignore */ }
          const assistantMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: STEP_QUESTIONS['complete'] + scrapbookNote + '\n\nWhat would you like to know next?',
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

      // If trip info is complete, allow normal chat with API (trip phase only)
      if (phase === 'trip' && (isTripInfoComplete() || currentStep === 'complete')) {
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
      } else if (phase === 'trip') {
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
    setProfileStep('name');
    if (!user) {
      setMessages([{ id: '1', role: 'assistant', content: "Enter your **email** to get started and we'll send you a sign-in link.", timestamp: new Date() }]);
    } else if (!profile?.full_name) {
      setMessages([{ id: '1', role: 'assistant', content: "What's your **full name**?", timestamp: new Date() }]);
      setProfileStep('name');
    } else {
      setMessages([{ id: '1', role: 'assistant', content: "Would you like to **share your preferences** for personalized bundles? Type **yes** or **start**.", timestamp: new Date() }]);
    }
  };

  const formatTime = (timestamp: Date) =>
    timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const progressPercentage = () => {
    const steps = TRIP_INFO_STEPS.filter(s => s !== 'welcome' && s !== 'complete');
    const done = steps.filter(s => {
      if (s === 'destination') return !!tripInfo.destination;
      if (s === 'pastDestinations') return !!tripInfo.pastDestinations?.length;
      if (s === 'restaurantType') return !!tripInfo.restaurantPreferences;
      if (s === 'activities') return !!tripInfo.activityPreferences?.length;
      if (s === 'placesVisited') return !!tripInfo.placesVisited?.length;
      if (s === 'budget') return !!tripInfo.budget;
      if (s === 'travelStyle') return !!tripInfo.travelStyle;
      return false;
    });
    return (done.length / steps.length) * 100;
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
                  {phase === 'auth' ? 'Sign in' : phase === 'profile' ? 'Profile' : isTripInfoComplete() ? 'Ready to plan!' : 'Collecting info...'}
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
          {phase === 'trip' && !isTripInfoComplete() && currentStep !== 'welcome' && (
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
            {phase === 'trip' && !isTripInfoComplete() && currentStep !== 'welcome' && (
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
                  phase === 'auth'
                    ? "Your email address..."
                    : phase === 'profile'
                    ? profileStep === 'name'
                      ? "Your full name..."
                      : "Your address or 'skip'..."
                    : isTripInfoComplete()
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
