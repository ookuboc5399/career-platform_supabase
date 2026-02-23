import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_EXPRESS_API_URL || 'http://localhost:4000';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params;

    const response = await fetch(
      `${API_BASE_URL}/api/certifications/${resolvedParams.id}/chapters`
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: error.error || 'Failed to fetch chapters' },
        { status: response.status }
      );
    }

    const chapters = await response.json();
    return NextResponse.json(chapters || []);
  } catch (error) {
    console.error('Error fetching chapters:', error);
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
    const resolvedParams = params instanceof Promise ? await params : params;
    const body = await request.json();
    const { title, content, order, videoUrl, questions, webText } = body;

    const chapterData = {
      title,
      description: content || title,
      content: content || '',
      order: order ?? 0,
      videoUrl: videoUrl || '',
      questions: questions || [],
      webText: webText || '',
      status: 'draft',
      duration: '',
    };

    const response = await fetch(
      `${API_BASE_URL}/api/certifications/${resolvedParams.id}/chapters`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(chapterData),
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: error.error || 'Failed to create chapter' },
        { status: response.status }
      );
    }

    const chapter = await response.json();
    return NextResponse.json(chapter);
  } catch (error) {
    console.error('Error creating chapter:', error);
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
    const resolvedParams = params instanceof Promise ? await params : params;
    const body = await request.json();
    const { id: chapterId, title, content, order, videoUrl, questions, webText } = body;

    if (!chapterId) {
      return NextResponse.json(
        { error: 'Chapter ID is required' },
        { status: 400 }
      );
    }

    const updateData = {
      title,
      description: content,
      content,
      order,
      videoUrl,
      questions,
      webText,
    };

    const response = await fetch(
      `${API_BASE_URL}/api/certifications/${resolvedParams.id}/chapters/${chapterId}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: error.error || 'Failed to update chapter' },
        { status: response.status }
      );
    }

    const resource = await response.json();
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
    const resolvedParams = params instanceof Promise ? await params : params;
    const url = new URL(request.url);
    const chapterId = url.searchParams.get('chapterId');

    if (!chapterId) {
      return NextResponse.json(
        { error: 'Chapter ID is required' },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${API_BASE_URL}/api/certifications/${resolvedParams.id}/chapters/${chapterId}`,
      { method: 'DELETE' }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: error.error || 'Failed to delete chapter' },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting chapter:', error);
    return NextResponse.json(
      { error: 'Failed to delete chapter' },
      { status: 500 }
    );
  }
}
