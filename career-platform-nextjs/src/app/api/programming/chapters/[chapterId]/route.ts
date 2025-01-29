import { NextRequest, NextResponse } from 'next/server';
import { getProgrammingChapter, updateProgrammingChapter, deleteProgrammingChapter } from '@/lib/cosmos-db';

export async function GET(
  request: NextRequest,
  { params }: { params: { chapterId: string } }
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

    const chapterId = params.chapterId;
    const chapter = await getProgrammingChapter(chapterId, languageId);
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
  { params }: { params: { chapterId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const languageId = searchParams.get('languageId');
    const chapterId = params.chapterId;

    if (!languageId) {
      return NextResponse.json(
        { error: 'Language ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { title, description, videoUrl, duration, status, exercises } = body;

    if (!title || !description || !videoUrl || !duration || !status || !exercises) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const chapter = await getProgrammingChapter(chapterId, languageId);
    if (!chapter) {
      return NextResponse.json(
        { error: 'Chapter not found' },
        { status: 404 }
      );
    }

    const resource = await updateProgrammingChapter(chapterId, languageId, {
      title,
      description,
      videoUrl,
      duration,
      status,
      exercises: exercises || [
        {
          id: '1',
          title: '数値を表示しよう',
          description: '右のコードエリアで、以下の数値を表示するプログラムを実行してください。',
          testCases: [
            {
              input: '',
              expectedOutput: '12345'
            }
          ]
        }
      ],
    });
    return NextResponse.json(resource);
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
  { params }: { params: { chapterId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const languageId = searchParams.get('languageId');
    const chapterId = params.chapterId;

    if (!languageId) {
      return NextResponse.json(
        { error: 'Language ID is required' },
        { status: 400 }
      );
    }

    const chapter = await getProgrammingChapter(chapterId, languageId);
    if (!chapter) {
      return NextResponse.json(
        { error: 'Chapter not found' },
        { status: 404 }
      );
    }

    await deleteProgrammingChapter(chapterId, languageId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting chapter:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete chapter' },
      { status: 500 }
    );
  }
}
