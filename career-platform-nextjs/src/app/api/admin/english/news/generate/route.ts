import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const expressUrl = process.env.NEXT_PUBLIC_EXPRESS_API_URL || process.env.EXPRESS_API_URL || 'http://localhost:3001';
    const response = await fetch(`${expressUrl}/api/english/news/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(err || 'Failed to generate news');
    }

    const { title, content, conversation, audioUrl, imageUrl } = await response.json();

    const newsItem = {
      id: `news-${Date.now()}`,
      title: title ?? 'Generated News',
      content: content ?? {},
      type: null,
      difficulty: null,
    };

    const { data, error } = await supabaseAdmin!
      .from('english_news')
      .insert({
        id: newsItem.id,
        title: newsItem.title,
        content: { ...newsItem.content, conversation, audioUrl, imageUrl },
        type: newsItem.type,
        difficulty: newsItem.difficulty,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({
      ...data,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    });
  } catch (error) {
    console.error('Error generating news:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate news' },
      { status: 500 }
    );
  }
}
