import { NextRequest, NextResponse } from 'next/server';
import type { CertificationChapter, Certification } from '@/types/api';
import { mockCertifications } from '../../route';

export async function POST(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const data = await request.json();

    // バリデーション
    if (!data.title || !data.description || !data.videoUrl || !data.thumbnailUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 仮の実装（開発用）
    const newChapter: CertificationChapter = {
      id: crypto.randomUUID(),
      certificationId: context.params.id,
      title: data.title,
      description: data.description,
      videoUrl: data.videoUrl,
      thumbnailUrl: data.thumbnailUrl,
      duration: data.duration,
      order: data.order,
      status: 'draft',
      content: data.content,
      questions: data.questions || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 親の資格データを更新
    const certification = mockCertifications.find((c: Certification) => c.id === context.params.id);
    if (!certification) {
      return NextResponse.json(
        { error: 'Certification not found' },
        { status: 404 }
      );
    }

    certification.chapters = [...(certification.chapters || []), newChapter];
    return NextResponse.json(newChapter);
  } catch (error) {
    console.error('Error creating chapter:', error);
    return NextResponse.json(
      { error: 'Failed to create chapter' },
      { status: 500 }
    );
  }
}
