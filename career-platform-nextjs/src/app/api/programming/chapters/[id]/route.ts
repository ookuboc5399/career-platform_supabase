import { NextRequest, NextResponse } from 'next/server';
import { updateProgrammingChapter, deleteProgrammingChapter, getProgrammingChapter } from '@/lib/cosmos-db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const languageId = searchParams.get('languageId');

    if (!languageId) {
      return NextResponse.json(
        { error: 'Language ID is required' },
        { status: 400 }
      );
    }

    const chapter = await getProgrammingChapter(params.id, languageId);
    if (!chapter) {
      return NextResponse.json(
        { error: 'Chapter not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(chapter);
  } catch (error) {
    console.error('Error fetching chapter:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch chapter' },
      { status: 500 }
    );
  }
}


export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const languageId = searchParams.get('languageId');

    if (!languageId) {
      return NextResponse.json(
        { error: 'Language ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      videoUrl,
      thumbnailUrl,
      duration,
      status,
      exercises,
    } = body;

    if (!title || !description || !videoUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const chapter = await updateProgrammingChapter(params.id, languageId, {
      title,
      description,
      videoUrl,
      thumbnailUrl: thumbnailUrl || '',
      duration: duration || '',
      status: status || 'draft',
      exercises: exercises || [],
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json(chapter);
  } catch (error) {
    console.error('Error updating chapter:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update chapter' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const languageId = searchParams.get('languageId');

    if (!languageId) {
      return NextResponse.json(
        { error: 'Language ID is required' },
        { status: 400 }
      );
    }

    await deleteProgrammingChapter(params.id, languageId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting chapter:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete chapter' },
      { status: 500 }
    );
  }
}
