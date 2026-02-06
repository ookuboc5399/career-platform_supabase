import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_EXPRESS_API_URL || 'http://localhost:4000';

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

    const response = await fetch(
      `${API_BASE_URL}/api/certifications/chapters/${resolvedParams.chapterId}?certificationId=${certificationId}`
    );

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.error || 'Failed to fetch chapter' },
        { status: response.status }
      );
    }

    const chapter = await response.json();
    return NextResponse.json(chapter);
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

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ chapterId: string }> | { chapterId: string } }
) {
  try {
    console.log('PUT /api/certifications/chapters/[chapterId] - Start');
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

    const body = await request.json();
    console.log('Request body:', body);

    const response = await fetch(
      `${API_BASE_URL}/api/certifications/${certificationId}/chapters/${resolvedParams.chapterId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('Error response from API:', error);
      return NextResponse.json(
        { error: error.error || 'Failed to update chapter' },
        { status: response.status }
      );
    }

    const updatedChapter = await response.json();
    console.log('Updated chapter:', updatedChapter);
    return NextResponse.json(updatedChapter);
  } catch (error) {
    console.error('Error updating chapter:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
    }
    return NextResponse.json(
      { error: 'Failed to update chapter', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
