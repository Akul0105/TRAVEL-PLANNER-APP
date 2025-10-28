'use client';

import { FloatingChatIcon } from './FloatingChatIcon';
import { Chatbot } from './Chatbot';
import { useChatbot } from '@/hooks/useChatbot';

/**
 * Wrapper component that manages chatbot state and connects FloatingChatIcon with Chatbot
 */
export function ChatbotWrapper() {
  const {
    isOpen,
    toggleChatbot,
    closeChatbot,
    initializeChatbot,
  } = useChatbot();

  return (
    <>
      <FloatingChatIcon
        onClick={toggleChatbot}
        isOpen={isOpen}
      />
      <Chatbot
        isOpen={isOpen}
        onToggle={toggleChatbot}
        onClose={closeChatbot}
      />
    </>
  );
}
