import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_EXPRESS_API_URL || 'http://localhost:4000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { certificationId, questionId, selectedAnswer } = body;

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    // 問題データを取得して正解を確認
    const questionsResponse = await fetch(
      `${API_BASE_URL}/api/certifications/${certificationId}/questions`
    );
    if (!questionsResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch questions' },
        { status: 500 }
      );
    }
    const questions = await questionsResponse.json();
    const question = questions.find((q: { id: string }) => q.id === questionId);

    if (!question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    const correctAnswers = question.correctAnswers ?? (question.correctAnswer != null ? [question.correctAnswer] : []);
    const isCorrect = correctAnswers.includes(selectedAnswer);

    // 進捗を記録（Express API）
    const progressResponse = await fetch(
      `${API_BASE_URL}/api/certifications/${certificationId}/questions/answers`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session.user.email,
          certificationId,
          questionId,
          correct: isCorrect,
          selectedAnswer,
        }),
      }
    );

    if (!progressResponse.ok) {
      const error = await progressResponse.json().catch(() => ({}));
      return NextResponse.json(
        { error: error.error || 'Failed to create progress' },
        { status: progressResponse.status }
      );
    }

    const progress = await progressResponse.json();
    return NextResponse.json(progress);
  } catch (error) {
    console.error('Error creating progress:', error);
    return NextResponse.json(
      { error: 'Failed to create progress' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const certificationId = url.searchParams.get('certificationId');

    if (!certificationId) {
      return NextResponse.json(
        { error: 'Certification ID is required' },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    const progressResponse = await fetch(
      `${API_BASE_URL}/api/certifications/${certificationId}/questions/progress?userId=${encodeURIComponent(session.user.email)}`
    );

    if (!progressResponse.ok) {
      const error = await progressResponse.json().catch(() => ({}));
      return NextResponse.json(
        { error: error.error || 'Failed to fetch progress' },
        { status: progressResponse.status }
      );
    }

    const progress = await progressResponse.json();
    return NextResponse.json(progress ?? null);
  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    );
  }
}
