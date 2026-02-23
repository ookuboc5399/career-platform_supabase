import { NextRequest, NextResponse } from 'next/server';
import { getYouTubeInfo } from '@/lib/youtube-info';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const info = await getYouTubeInfo(url);
    return NextResponse.json(info);
  } catch (error) {
    console.error('Error getting YouTube info:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get YouTube video information' },
      { status: 500 }
    );
  }
}
