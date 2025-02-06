import { NextRequest, NextResponse } from 'next/server';
import { getProgrammingChapters, createProgrammingChapter } from '@/lib/cosmos-db';
import { CONTAINERS } from '@/lib/storage';
import { uploadFile } from '@/lib/storage';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const languageId = searchParams.get('languageId');

    if (!languageId) {
      return NextResponse.json(
        { error: 'Language ID is required' },
        { status: 400 }
      );
    }

    const chapters = await getProgrammingChapters(languageId);
    return NextResponse.json(chapters);
  } catch (error) {
    console.error('Error fetching chapters:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch chapters' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { languageId, title, description, videoUrl, duration, exercises, status } = body;

    if (!languageId || !title || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 既存のチャプターを取得して新しい順序を決定
    const existingChapters = await getProgrammingChapters(languageId);
    const order = existingChapters.length + 1;

    // サムネイルの生成（動画の最初のフレーム）は別途実装が必要
    const thumbnailUrl = '';

    const chapter = await createProgrammingChapter({
      languageId,
      title,
      description,
      videoUrl,
      thumbnailUrl,
      duration,
      order,
      status: status || 'draft',
      exercises: exercises || [],
    });

    return NextResponse.json(chapter);
  } catch (error) {
    console.error('Error creating chapter:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create chapter' },
      { status: 500 }
    );
  }
}
