import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { getEnglishNewsContainer } from '@/lib/cosmos-db';

export async function POST(request: NextRequest) {
  try {
    // Express APIを呼び出してニュースを生成
    const response = await axios.post('http://localhost:3001/api/english/news/generate');
    const { title, content, conversation, audioUrl, imageUrl } = response.data;

    // CosmosDBに保存
    const container = await getEnglishNewsContainer();
    const newsItem = {
      id: `news-${Date.now()}`,
      title,
      content,
      conversation,
      audioUrl,
      imageUrl,
      createdAt: new Date().toISOString(),
      isPublished: false,
    };

    await container.items.create(newsItem);

    return NextResponse.json(newsItem);
  } catch (error) {
    console.error('Error generating news:', error);
    return NextResponse.json(
      { error: 'Failed to generate news' },
      { status: 500 }
    );
  }
}
