import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_EXPRESS_API_URL || 'http://localhost:4000';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params;
    const body = await request.json();
    const { certificationId, ...questionData } = body;

    if (!certificationId) {
      return NextResponse.json({ error: 'certificationId is required' }, { status: 400 });
    }

    const response = await fetch(
      `${API_BASE_URL}/api/certifications/${certificationId}/questions/${resolvedParams.id}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...questionData, certificationId }),
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: error.error || '問題の更新に失敗しました' },
        { status: response.status }
      );
    }

    const savedQuestion = await response.json();
    return NextResponse.json(savedQuestion);
  } catch (error) {
    console.error('Error updating question:', error);
    return NextResponse.json({ error: '問題の更新に失敗しました' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params;
    const url = new URL(request.url);
    const certificationId = url.searchParams.get('certificationId');

    if (!certificationId) {
      return NextResponse.json({ error: 'certificationId is required as query parameter' }, { status: 400 });
    }

    const response = await fetch(
      `${API_BASE_URL}/api/certifications/${certificationId}/questions/${resolvedParams.id}`,
      { method: 'DELETE' }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: error.error || '問題の削除に失敗しました' },
        { status: response.status }
      );
    }

    return NextResponse.json({ message: '問題を削除しました' });
  } catch (error) {
    console.error('Error deleting question:', error);
    return NextResponse.json({ error: '問題の削除に失敗しました' }, { status: 500 });
  }
}
