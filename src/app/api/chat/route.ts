// File: src/app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { sendChatMessage } from '@/services/mystralService';

export async function POST(request: NextRequest) {
  try {
    // 1. Get the user's message history and trip info from the frontend
    const { messages, tripInfo } = await request.json();

    if (!messages) {
      return NextResponse.json({ error: 'Messages are required' }, { status: 400 });
    }

    // 2. Use Mistral service to send the message with trip info / preferences
    // The service handles the API call and formatting
    const aiResponse = await sendChatMessage(messages, tripInfo);

    // 3. Return the AI's response to the frontend
    return NextResponse.json({ response: aiResponse });

  } catch (error) {
    // This catches errors if our server fails for any reason
    console.error("Chat route error:", error);
    return NextResponse.json(
      { response: "⚠️ My apologies, an internal error occurred. Please try again later!" },
      { status: 500 }
    );
  }
}