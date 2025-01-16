import { NextRequest, NextResponse } from 'next/server';
import { EnglishProgress } from '@/types/api';

// 仮のデータストア
const mockProgress: { [key: string]: EnglishProgress } = {};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const lessonId = searchParams.get('lessonId');

    if (!userId || !lessonId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const progressId = `${userId}-${lessonId}`;
    const progress = mockProgress[progressId] || {
      id: progressId,
      userId,
      contentId: lessonId,
      lessonId,
      contentType: 'english' as const,
      videoCompleted: false,
      completedExercises: [],
      lastAccessedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(progress);

    // 本番用のコード（Cosmos DB接続が確認できたら切り替え）
    /*
    const progress = await getProgress(userId, lessonId);
    return NextResponse.json(progress);
    */
  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, lessonId, data } = body;

    if (!userId || !lessonId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const progressId = `${userId}-${lessonId}`;
    const now = new Date().toISOString();

    const progress: EnglishProgress = {
      id: progressId,
      userId,
      contentId: lessonId,
      lessonId,
      contentType: 'english',
      videoCompleted: data.videoCompleted ?? false,
      completedExercises: data.completedExercises ?? [],
      lastAccessedAt: now,
      createdAt: mockProgress[progressId]?.createdAt ?? now,
      updatedAt: now,
    };

    mockProgress[progressId] = progress;
    return NextResponse.json(progress);

    // 本番用のコード（Cosmos DB接続が確認できたら切り替え）
    /*
    const progress = await updateProgress(userId, lessonId, data);
    return NextResponse.json(progress);
    */
  } catch (error) {
    console.error('Error updating progress:', error);
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    );
  }
}
