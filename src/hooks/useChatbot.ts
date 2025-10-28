/**
 * Custom hook for managing chatbot state and functionality
 * This hook handles all chatbot-related state and API interactions
 */

import { useState, useCallback } from 'react';
import { ChatMessage, ChatbotState } from '@/types';
import { sendChatMessage } from '@/services/mystralService';
import { generateId } from '@/lib/utils';

/**
 * Custom hook for chatbot functionality
 * Manages chat state, message handling, and API interactions
 * @returns Object containing chatbot state and functions
 */
export function useChatbot() {
  const [state, setState] = useState<ChatbotState>({
    isOpen: false,
    messages: [],
    isLoading: false,
    error: undefined,
  });

  /**
   * Toggle chatbot open/closed state
   */
  const toggleChatbot = useCallback(() => {
    setState(prev => ({
      ...prev,
      isOpen: !prev.isOpen,
      error: undefined, // Clear any previous errors when opening
    }));
  }, []);

  /**
   * Close the chatbot
   */
  const closeChatbot = useCallback(() => {
    setState(prev => ({
      ...prev,
      isOpen: false,
    }));
  }, []);

  /**
   * Send a message to the chatbot
   * @param content - The message content to send
   */
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    // Create user message
    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    // Add user message to state
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      error: undefined,
    }));

    try {
      // Get updated messages for API call
      const updatedMessages = [...state.messages, userMessage];
      
      // Send message to Mystral API
      const response = await sendChatMessage(updatedMessages);

      // Create assistant message
      const assistantMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      // Add assistant message to state
      setState(prev => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Create error message
      const errorMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.",
        timestamp: new Date(),
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, errorMessage],
        isLoading: false,
        error: 'Failed to send message',
      }));
    }
  }, [state.messages]);

  /**
   * Clear all messages from the chat
   */
  const clearMessages = useCallback(() => {
    setState(prev => ({
      ...prev,
      messages: [],
      error: undefined,
    }));
  }, []);

  /**
   * Initialize chatbot with welcome message
   */
  const initializeChatbot = useCallback(() => {
    if (state.messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: "Hey! I'm your travel buddy! 🧳 What kind of trip are you dreaming about?",
        timestamp: new Date(),
      };

      setState(prev => ({
        ...prev,
        messages: [welcomeMessage],
      }));
    }
  }, [state.messages.length]);

  return {
    // State
    isOpen: state.isOpen,
    messages: state.messages,
    isLoading: state.isLoading,
    error: state.error,
    
    // Actions
    toggleChatbot,
    closeChatbot,
    sendMessage,
    clearMessages,
    initializeChatbot,
  };
}
