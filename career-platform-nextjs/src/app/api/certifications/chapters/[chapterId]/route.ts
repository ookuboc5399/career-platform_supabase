import { NextResponse } from 'next/server';
import { getCertificationChapter } from '@/lib/cosmos-db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ chapterId: string }> | { chapterId: string } }
) {
  try {
    console.log('GET /api/certifications/chapters/[chapterId] - Start');
    const resolvedParams = params instanceof Promise ? await params : params;
    console.log('Chapter ID:', resolvedParams.chapterId);

    const { searchParams } = new URL(request.url);
    const certificationId = searchParams.get('certificationId');
    
    if (!certificationId) {
      return NextResponse.json(
        { error: 'Certification ID is required' },
        { status: 400 }
      );
    }

    const chapter = await getCertificationChapter(resolvedParams.chapterId, certificationId);
    console.log('Retrieved chapter:', chapter);

    if (!chapter) {
      return NextResponse.json(
        { error: 'Chapter not found' },
        { status: 404 }
      );
    }

    // チャプターの情報を返す
    return NextResponse.json({
      id: chapter.id,
      certificationId: chapter.certificationId,
      title: chapter.title,
      description: chapter.description,
      videoUrl: chapter.videoUrl,
      thumbnailUrl: chapter.thumbnailUrl,
      duration: chapter.duration,
      order: chapter.order,
      status: chapter.status,
      content: chapter.content,
      questions: chapter.questions,
      createdAt: chapter.createdAt,
      updatedAt: chapter.updatedAt
    });
  } catch (error) {
    console.error('Error fetching chapter:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
    }
    return NextResponse.json(
      { error: 'Failed to fetch chapter', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
