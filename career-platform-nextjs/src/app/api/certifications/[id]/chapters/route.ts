import { NextResponse } from 'next/server';
import {
  getCertificationChapters,
  createCertificationChapter,
  certificationChaptersContainer,
  initializeDatabase,
} from '@/lib/cosmos-db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    console.log('GET /api/certifications/[id]/chapters - Start');
    const resolvedParams = params instanceof Promise ? await params : params;
    console.log('Certification ID:', resolvedParams.id);

    const chapters = await getCertificationChapters(resolvedParams.id);
    console.log('Retrieved chapters:', chapters);

    return NextResponse.json(chapters || []);
  } catch (error) {
    console.error('Error fetching chapters:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
    }
    return NextResponse.json(
      { error: 'Failed to fetch chapters', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    console.log('POST /api/certifications/[id]/chapters - Start');
    const resolvedParams = params instanceof Promise ? await params : params;
    console.log('Certification ID:', resolvedParams.id);

    const body = await request.json();
    console.log('Request body:', body);
    const { title, content, order, videoUrl, questions, webText } = body;

    console.log('Creating chapter with data:', {
      certificationId: resolvedParams.id,
      title,
      content,
      order,
      videoUrl,
      questions,
      webText,
    });

    const chapterData = {
      certificationId: resolvedParams.id,
      title,
      description: content,
      content,
      order,
      videoUrl,
      questions,
      webText,
      thumbnailUrl: '',
      duration: '',
    };
    
    console.log('Creating chapter with data:', chapterData);
    const chapter = await createCertificationChapter(chapterData);

    console.log('Created chapter:', chapter);
    return NextResponse.json(chapter);
  } catch (error) {
    console.error('Error creating chapter:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
    }
    return NextResponse.json(
      { error: 'Failed to create chapter', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    if (!certificationChaptersContainer) await initializeDatabase();
    const resolvedParams = params instanceof Promise ? await params : params;
    const body = await request.json();
    const { id, title, content, order, videoUrl, questions, webText } = body;

    const { resource } = await certificationChaptersContainer.item(id, resolvedParams.id).replace({
      id,
      certificationId: resolvedParams.id,
      title,
      description: content,
      content,
      order,
      videoUrl,
      questions,
      webText,
      thumbnailUrl: '',
      duration: '',
    });

    return NextResponse.json(resource);
  } catch (error) {
    console.error('Error updating chapter:', error);
    return NextResponse.json(
      { error: 'Failed to update chapter' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    if (!certificationChaptersContainer) await initializeDatabase();
    const resolvedParams = params instanceof Promise ? await params : params;
    const url = new URL(request.url);
    const chapterId = url.searchParams.get('chapterId');

    if (!chapterId) {
      return NextResponse.json(
        { error: 'Chapter ID is required' },
        { status: 400 }
      );
    }

    await certificationChaptersContainer.item(chapterId, resolvedParams.id).delete();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting chapter:', error);
    return NextResponse.json(
      { error: 'Failed to delete chapter' },
      { status: 500 }
    );
  }
}
