import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      certificationId,
      chapterId,
      questionId,
      selectedAnswer,
      isCorrect,
      videoCompleted,
    } = body;

    const session = await getServerSession(authOptions);
    const userId = session?.user?.id ?? 'anonymous';

    if (chapterId) {
      const id = `${userId}-${certificationId}-${chapterId}`;

      const { data: existing } = await supabaseAdmin!
        .from('certification_progress')
        .select('*')
        .eq('id', id)
        .single();

      const now = new Date().toISOString();
      const completedQuestions = existing?.completed_questions ?? [];

      if (videoCompleted) {
        const { data, error } = await supabaseAdmin!
          .from('certification_progress')
          .upsert({
            id,
            user_id: userId,
            certification_id: certificationId,
            chapter_id: chapterId,
            video_completed: true,
            completed_questions: completedQuestions,
            last_accessed_at: now,
            created_at: existing?.created_at ?? now,
            updated_at: now,
          });

        if (error) throw error;
        return NextResponse.json({ success: true });
      }

      if (questionId !== undefined && isCorrect !== undefined) {
        const updated = Array.isArray(completedQuestions)
          ? [...completedQuestions.filter((q: { questionId?: string }) => q.questionId !== questionId), { questionId, isCorrect }]
          : [{ questionId, isCorrect }];

        const { error } = await supabaseAdmin!
          .from('certification_progress')
          .upsert({
            id,
            user_id: userId,
            certification_id: certificationId,
            chapter_id: chapterId,
            video_completed: existing?.video_completed ?? false,
            completed_questions: updated,
            last_accessed_at: now,
            created_at: existing?.created_at ?? now,
            updated_at: now,
          });

        if (error) throw error;
        return NextResponse.json({ success: true });
      }
    }

    if (questionId && selectedAnswer !== undefined) {
      const questionsRes = await fetch(
        `${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/api/certifications/${certificationId}/questions`
      );
      if (!questionsRes.ok) throw new Error('Failed to fetch questions');
      const questions = await questionsRes.json();
      const question = questions.find((q: { id: string }) => q.id === questionId);
      const correct = question ? (question.correctAnswers ?? [question.correctAnswer]).includes(selectedAnswer) : false;

      const progressRes = await fetch(
        `${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/api/certifications/${certificationId}/questions/answers`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            questionId,
            correct,
            selectedAnswer,
          }),
        }
      );

      if (!progressRes.ok) throw new Error('Failed to record answer');
      const data = await progressRes.json();
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  } catch (error) {
    console.error('Error saving progress:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save progress' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const certificationId = url.searchParams.get('certificationId');
    const chapterId = url.searchParams.get('chapterId');

    if (!certificationId) {
      return NextResponse.json(
        { error: 'Certification ID is required' },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);
    const userId = session?.user?.id ?? 'anonymous';

    if (chapterId) {
      const id = `${userId}-${certificationId}-${chapterId}`;
      const { data, error } = await supabaseAdmin!
        .from('certification_progress')
        .select('*')
        .eq('id', id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return NextResponse.json(data ?? []);
    }

    const { data, error } = await supabaseAdmin!
      .from('certification_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('certification_id', certificationId)
      .order('last_accessed_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data ?? []);
  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch progress' },
      { status: 500 }
    );
  }
}
