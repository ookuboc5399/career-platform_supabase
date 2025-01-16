import { NextRequest, NextResponse } from 'next/server';

interface ChapterProgress {
  id: string;
  userId: string;
  languageId: string;
  chapterId: string;
  videoCompleted: boolean;
  completedExercises: string[]; // 完了した演習問題のID
  lastAccessedAt: string;
}

// 仮のデータストア
const mockProgress: { [key: string]: ChapterProgress } = {};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const languageId = searchParams.get('languageId');
    const chapterId = searchParams.get('chapterId');

    if (!userId || !languageId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // 仮の実装（開発用）
    const progressList = Object.values(mockProgress).filter(
      p => p.userId === userId && p.languageId === languageId
    );

    if (chapterId) {
      const progress = progressList.find(p => p.chapterId === chapterId);
      return NextResponse.json(progress || {
        id: `${userId}-${languageId}-${chapterId}`,
        userId,
        languageId,
        chapterId,
        videoCompleted: false,
        completedExercises: [],
        lastAccessedAt: new Date().toISOString(),
      });
    }

    return NextResponse.json(progressList);

    // 本番用のコード（Cosmos DB接続が確認できたら切り替え）
    /*
    if (chapterId) {
      const progress = await getChapterProgress(userId, languageId, chapterId);
      return NextResponse.json(progress || {
        id: `${userId}-${languageId}-${chapterId}`,
        userId,
        languageId,
        chapterId,
        videoCompleted: false,
        completedExercises: [],
        lastAccessedAt: new Date().toISOString(),
      });
    }

    const progressList = await getLanguageProgress(userId, languageId);
    return NextResponse.json(progressList);
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
    const { userId, languageId, chapterId, data } = body;

    if (!userId || !languageId || !chapterId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const progressId = `${userId}-${languageId}-${chapterId}`;

    // 仮の実装（開発用）
    const existingProgress = mockProgress[progressId];
    const updatedProgress: ChapterProgress = {
      id: progressId,
      userId,
      languageId,
      chapterId,
      videoCompleted: data.videoCompleted ?? existingProgress?.videoCompleted ?? false,
      completedExercises: data.completedExercises ?? existingProgress?.completedExercises ?? [],
      lastAccessedAt: new Date().toISOString(),
    };

    mockProgress[progressId] = updatedProgress;
    return NextResponse.json(updatedProgress);

    // 本番用のコード（Cosmos DB接続が確認できたら切り替え）
    /*
    const progress = await updateChapterProgress(userId, languageId, chapterId, data);
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

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const languageId = searchParams.get('languageId');
    const chapterId = searchParams.get('chapterId');

    if (!userId || !languageId || !chapterId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // 仮の実装（開発用）
    const progressId = `${userId}-${languageId}-${chapterId}`;
    delete mockProgress[progressId];
    return new NextResponse(null, { status: 204 });

    // 本番用のコード（Cosmos DB接続が確認できたら切り替え）
    /*
    await deleteChapterProgress(userId, languageId, chapterId);
    return new NextResponse(null, { status: 204 });
    */
  } catch (error) {
    console.error('Error deleting progress:', error);
    return NextResponse.json(
      { error: 'Failed to delete progress' },
      { status: 500 }
    );
  }
}
