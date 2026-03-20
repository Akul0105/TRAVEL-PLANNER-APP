'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Trash2, Minimize2, Maximize2, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { ChatbotProps, ChatMessage } from '@/types';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import type { ChatMessageRow } from '@/lib/supabase';

const CHAT_WELCOME: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content: "Hi! I'm here to help you **browse the catalog** and use Planify. Use **like** / **dislike** on destinations on the home page to improve your bundle suggestions. Ask me anything about destinations, the **Scrapbook**, or how **market basket analysis** works!",
  timestamp: new Date(),
};

export function Chatbot({ isOpen, onToggle, onClose }: ChatbotProps) {
  const { user, profile, isAnonymous, updateProfile, refreshProfile } = useAuth();
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const sessionLoaded = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) {
      setMessages([
        { id: '1', role: 'assistant', content: "Hey! I'm your travel assistant. 🧳\n\n**Sign in** using the **button in the top right corner** to chat and get help browsing the catalog and your bundles.", timestamp: new Date() },
      ]);
      sessionLoaded.current = false;
      setCurrentSessionId(null);
      return;
    }
    // Guest (anonymous) and signed-in users both get full chat; messages and suggestions are stored in DB
    if (sessionLoaded.current) return;
    sessionLoaded.current = true;
    (async () => {
      const { data: sessions } = await supabase
        .from('chat_sessions')
        .select('id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);
      const session = sessions?.[0];
      if (!session) {
        setMessages([CHAT_WELCOME]);
        setCurrentSessionId(null);
        return;
      }
      const { data: rows } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', session.id)
        .order('created_at', { ascending: true });
      const loaded = (rows ?? []) as ChatMessageRow[];
      if (loaded.length > 0) {
        setMessages(loaded.map((m) => ({
          id: m.id,
          role: m.role as 'user' | 'assistant',
          content: m.content,
          timestamp: new Date(m.created_at),
        })));
        setCurrentSessionId(session.id);
      } else {
        setMessages([CHAT_WELCOME]);
        setCurrentSessionId(session.id);
      }
    })();
  }, [user?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();
  }, [isOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    const userInput = inputValue.trim();
    setInputValue('');
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    const persistMessage = async (sessionId: string, role: 'user' | 'assistant', content: string) => {
      await supabase.from('chat_messages').insert({ session_id: sessionId, role, content });
    };

    const ensureSession = async (): Promise<string | null> => {
      if (currentSessionId) return currentSessionId;
      if (!user?.id) return null;
      const { data: row, error } = await supabase
        .from('chat_sessions')
        .insert({ user_id: user.id })
        .select('id')
        .single();
      if (!error && row?.id) {
        setCurrentSessionId(row.id);
        return row.id;
      }
      return null;
    };

    if (phase === 'signed_out') {
      setIsLoading(false);
      return;
    }

    let chatSessionId: string | null = await ensureSession();
    if (chatSessionId) await persistMessage(chatSessionId, 'user', userInput);

    const profileContext = profile
      ? {
          activities_liked: Array.isArray(profile.activities_liked) ? profile.activities_liked.filter((x): x is string => typeof x === 'string') : [],
          food_preferences: Array.isArray(profile.food_preferences) ? profile.food_preferences.filter((x): x is string => typeof x === 'string') : [],
          bucket_list: Array.isArray(profile.bucket_list) ? profile.bucket_list.filter((x): x is string => typeof x === 'string') : [],
        }
      : undefined;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          tripInfo: {},
          profileContext,
        }),
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const data = await response.json();
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || "I didn't quite get that. Try asking about the catalog, Scrapbook, or how bundles work!",
        timestamp: new Date(),
        suggestions: data.suggestions ?? undefined,
      };
      if (chatSessionId) await persistMessage(chatSessionId, 'assistant', assistantMessage.content);
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "I'm having trouble connecting. Please try again later!",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const phase = !user ? 'signed_out' : 'chat';

  const clearMessages = () => {
    setCurrentSessionId(null);
    if (!user) {
      setMessages([{ id: '1', role: 'assistant', content: "**Sign in** using the **button in the top right corner** to chat.", timestamp: new Date() }]);
    } else {
      setMessages([CHAT_WELCOME]);
    }
  };

  const chatSubtitle = !user ? 'Sign in to chat' : isAnonymous ? 'Chat for suggestions — sign in to save across devices' : 'Browse & bundles';

  const formatTime = (timestamp: Date) =>
    timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const addToBucketList = async (name: string) => {
    const current = Array.isArray(profile?.bucket_list) ? profile.bucket_list.filter((x): x is string => typeof x === 'string') : [];
    if (current.length >= 5 || current.some((x) => x.toLowerCase() === name.toLowerCase())) return;
    await updateProfile({ bucket_list: [...current, name] });
    await refreshProfile();
  };

  const addToActivities = async (name: string) => {
    const current = Array.isArray(profile?.activities_liked) ? profile.activities_liked.filter((x): x is string => typeof x === 'string') : [];
    if (current.length >= 5 || current.some((x) => x.toLowerCase() === name.toLowerCase())) return;
    await updateProfile({ activities_liked: [...current, name] });
    await refreshProfile();
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
            'fixed bottom-24 right-6 bg-neutral-50 rounded-2xl shadow-2xl border border-neutral-200 shadow-black/10 z-50 flex flex-col',
            isExpanded ? 'w-screen h-screen bottom-0 right-0 rounded-none' : 'w-96 h-[600px]'
          )}
        >
          <div className="flex items-center justify-between p-4 border-b border-neutral-200 bg-neutral-950 rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/15 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white tracking-tight text-sm">Travel Assistant</h3>
                <p className="text-neutral-400 text-xs">
                  {chatSubtitle}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={clearMessages} className="p-1 text-neutral-400 hover:bg-white/10 rounded-lg" title="Clear chat">
                <Trash2 className="w-4 h-4" />
              </button>
              <button onClick={() => setIsExpanded((prev) => !prev)} className="p-1 text-neutral-400 hover:bg-white/10 rounded-lg" title={isExpanded ? 'Exit fullscreen' : 'Fullscreen'}>
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={cn('flex gap-3', message.role === 'user' ? 'justify-end' : 'justify-start')}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 bg-neutral-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-neutral-950" />
                  </div>
                )}
                <div
                  className={cn(
                    'max-w-[80%] rounded-2xl px-4 py-3',
                    message.role === 'user' ? 'bg-neutral-950 text-white' : 'bg-white text-neutral-950 border border-neutral-200'
                  )}
                >
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                  {message.role === 'assistant' && message.suggestions && (message.suggestions.destinations?.length > 0 || message.suggestions.activities?.length > 0) && (
                    <div className="mt-3 pt-3 border-t border-neutral-200 flex flex-wrap gap-2">
                      {message.suggestions.destinations?.map((name) => (
                        <button
                          key={`dest-${name}`}
                          type="button"
                          onClick={() => addToBucketList(name)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-neutral-950 text-white text-xs font-medium hover:bg-neutral-800"
                        >
                          <Plus className="w-3 h-3" /> Add {name} to bucket list
                        </button>
                      ))}
                      {message.suggestions.activities?.map((name) => (
                        <button
                          key={`act-${name}`}
                          type="button"
                          onClick={() => addToActivities(name)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-neutral-700 text-white text-xs font-medium hover:bg-neutral-600"
                        >
                          <Plus className="w-3 h-3" /> Add {name} to activities
                        </button>
                      ))}
                    </div>
                  )}
                  <p className={cn('text-xs mt-1', message.role === 'user' ? 'text-neutral-400' : 'text-neutral-500')}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
                {message.role === 'user' && (
                  <div className="w-8 h-8 bg-neutral-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-neutral-950" />
                  </div>
                )}
              </motion.div>
            ))}
            {isLoading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 justify-start">
                <div className="w-8 h-8 bg-neutral-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-neutral-950" />
                </div>
                <div className="bg-white rounded-2xl px-4 py-3 border border-neutral-200">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="p-4 border-t border-neutral-200 bg-white">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={phase === 'signed_out' || isLoading}
                placeholder={phase === 'signed_out' ? 'Sign in to chat...' : 'Ask about destinations, Scrapbook, or bundles...'}
                className={cn(
                  'flex-1 px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-950 placeholder:text-neutral-400',
                  'focus:outline-none focus:ring-2 focus:ring-neutral-950/15 focus:border-neutral-950',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
              />
              <button
                type="submit"
                disabled={phase === 'signed_out' || !inputValue.trim() || isLoading}
                className={cn(
                  'px-4 py-3 bg-neutral-950 text-white rounded-xl hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center'
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
