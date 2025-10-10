/**
 * Chat API Route
 * Handles chatbot requests and integrates with Mystral AI
 * Provides travel-specific responses with market basket analysis
 */

import { NextRequest, NextResponse } from 'next/server';
import { sendChatMessage } from '@/services/mystralService';

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    // Send to Mystral AI
    const response = await sendChatMessage(messages);

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Chat API error:', error);
    
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}
