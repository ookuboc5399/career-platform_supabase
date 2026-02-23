import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { questionId, answer, isCorrectOrder } = await request.json();

    if (!questionId || !answer) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;

    const { data: question, error: questionError } = await supabaseAdmin!
      .from('english_questions')
      .select('*')
      .eq('id', questionId)
      .single();

    if (questionError || !question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    const content = typeof question.content === 'object' && question.content ? (question.content as Record<string, unknown>) : {};
    const isCorrect = Boolean(isCorrectOrder);

    if (userId && isCorrect) {
      try {
        const now = new Date().toISOString();
        const progressId = `${userId}-${questionId}`;

        const { data: existing } = await supabase
          .from('english_questions_progress')
          .select('*')
          .eq('user_id', userId)
          .eq('question_id', questionId)
          .single();

        if (existing) {
          await supabase
            .from('english_questions_progress')
            .update({
              is_correct: isCorrect,
              answered_at: now,
            })
            .eq('id', existing.id);
        } else {
          await supabase.from('english_questions_progress').insert({
            id: progressId,
            user_id: userId,
            question_id: questionId,
            question_type: question.type || 'writing',
            is_correct: isCorrect,
            answered_at: now,
          });
        }
      } catch (progressError) {
        console.error('Error recording progress:', progressError);
      }
    }

    return NextResponse.json({
      success: true,
      isCorrect,
      correctAnswer: content.english,
      yourAnswer: answer,
      explanation: content.explanation,
    });
  } catch (error) {
    console.error('Error submitting answer:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
