import { NextRequest, NextResponse } from 'next/server';
import { fetchEnglishNews } from '@/lib/news-api';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // 外部ニュースはCosmosDBに保存されていないため、NewsAPIから再取得
    console.log('Fetching news from NewsAPI...');
    const allNews = await fetchEnglishNews();
    console.log('All news:', allNews);
    console.log('Looking for news with ID:', params.id);
    const news = allNews.find((item: any) => item.id === params.id);
    console.log('Found news:', news);

    if (!news) {
      return NextResponse.json(
        { error: 'News not found' },
        { status: 404 }
      );
    }

    console.log('Query completed successfully');
    return NextResponse.json(news);
  } catch (error) {
    console.error('Error fetching news:', error);
    let errorMessage = 'Failed to fetch news';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
