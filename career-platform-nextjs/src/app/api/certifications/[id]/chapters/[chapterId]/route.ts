import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_EXPRESS_API_URL || 'http://localhost:4000';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; chapterId: string }> | { id: string; chapterId: string } }
) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params;
    const body = await request.json();

    const response = await fetch(
      `${API_BASE_URL}/api/certifications/${resolvedParams.id}/chapters/${resolvedParams.chapterId}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
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
      { error: 'Failed to update chapter', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; chapterId: string }> | { id: string; chapterId: string } }
) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params;

    const response = await fetch(
      `${API_BASE_URL}/api/certifications/${resolvedParams.id}/chapters/${resolvedParams.chapterId}`,
      { method: 'DELETE' }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: error.error || 'Failed to delete chapter' },
        { status: response.status }
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting chapter:', error);
    return NextResponse.json(
      { error: 'Failed to delete chapter' },
      { status: 500 }
    );
  }
}
