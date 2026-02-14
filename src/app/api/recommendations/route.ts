import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ error: 'Missing query parameter' }, { status: 400 });
  }

  try {
    const res = await fetch('https://api.mystral.ai/recommend', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer aKRU8CQiTLFfPeKHam4WAEPteYRZ7mkG',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    // 🔍 Check if the API responded correctly
    if (!res.ok) {
      const errorText = await res.text();
      console.error('API Error Response:', errorText);
      return NextResponse.json({ error: 'API request failed', details: errorText }, { status: 500 });
    }

    const data = await res.json();
    console.log('API Response:', data); // 👈 helps you debug in console

    // ✅ Return the recommendations
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Mystral API error:', error);
    return NextResponse.json({ error: 'Failed to fetch recommendations' }, { status: 500 });
  }
}
