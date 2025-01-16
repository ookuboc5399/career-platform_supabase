import { NextRequest, NextResponse } from 'next/server';
import { certificationProgressContainer, initializeDatabase } from '@/lib/cosmos-db';
import { CertificationProgress } from '@/types/api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, certificationId, completedQuestions } = body;

    if (!userId || !certificationId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!certificationProgressContainer) await initializeDatabase();
    const { resources: [existingProgress] } = await certificationProgressContainer
      .items.query<CertificationProgress>({
        query:
          'SELECT * FROM c WHERE c.userId = @userId AND c.certificationId = @certificationId AND c.contentType = "certification"',
        parameters: [
          { name: '@userId', value: userId },
          { name: '@certificationId', value: certificationId },
        ],
      })
      .fetchAll();

    if (existingProgress) {
      // 既存の進捗を更新
      const updatedProgress = {
        ...existingProgress,
        completedQuestions: Array.from(
          new Set([...existingProgress.completedQuestions, ...completedQuestions])
        ),
        updatedAt: new Date().toISOString(),
      };

      const { resource } = await certificationProgressContainer
        .item(existingProgress.id)
        .replace(updatedProgress);

      return NextResponse.json(resource);
    } else {
      // 新しい進捗を作成
      const newProgress: CertificationProgress = {
        id: crypto.randomUUID(),
        userId,
        contentId: certificationId,
        certificationId,
        chapterId: '', // チャプターベースの学習の場合に使用
        contentType: 'certification',
        videoCompleted: false,
        completedExercises: [],
        completedQuestions,
        lastAccessedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const { resource } = await certificationProgressContainer.items.create(newProgress);
      return NextResponse.json(resource);
    }
  } catch (error) {
    console.error('Error updating progress:', error);
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const certificationId = searchParams.get('certificationId');

    if (!userId || !certificationId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    if (!certificationProgressContainer) await initializeDatabase();
    const { resources: [progress] } = await certificationProgressContainer
      .items.query<CertificationProgress>({
        query:
          'SELECT * FROM c WHERE c.userId = @userId AND c.certificationId = @certificationId AND c.contentType = "certification"',
        parameters: [
          { name: '@userId', value: userId },
          { name: '@certificationId', value: certificationId },
        ],
      })
      .fetchAll();

    if (!progress) {
      return NextResponse.json(
        {
          completedQuestions: [],
        },
        { status: 200 }
      );
    }

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    );
  }
}
