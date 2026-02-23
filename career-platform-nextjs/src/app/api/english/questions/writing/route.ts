import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const level = searchParams.get('level');
    const searchText = searchParams.get('searchText');
    const includeSolved = searchParams.get('includeSolved') === 'true';

    if (!category || !level) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const difficulty = searchParams.get('difficulty');
    if (!difficulty) {
      return NextResponse.json({ error: 'Missing difficulty parameter' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;

    let query = supabaseAdmin!
      .from('english_questions')
      .select('*')
      .eq('type', 'writing')
      .eq('category', category)
      .eq('level', level)
      .eq('difficulty', difficulty);

    const { data: questions, error } = await query;

    if (error) throw error;
    if (!questions || questions.length === 0) {
      return NextResponse.json({ error: 'No questions found' }, { status: 404 });
    }

    let filteredQuestions = questions;
    if (searchText) {
      filteredQuestions = questions.filter(
        (q) =>
          (typeof q.content === 'object' &&
            q.content &&
            (String((q.content as Record<string, unknown>).question ?? '').includes(searchText) ||
              String((q.content as Record<string, unknown>).japanese ?? '').includes(searchText))) ||
          false
      );
      if (filteredQuestions.length === 0) filteredQuestions = questions;
    }

    if (userId && !includeSolved) {
      try {
        const { data: progressData } = await supabase
          .from('english_questions_progress')
          .select('question_id')
          .eq('user_id', userId)
          .eq('is_correct', true);

        if (progressData && progressData.length > 0) {
          const solvedQuestionIds = new Set(progressData.map((p) => p.question_id));
          filteredQuestions = filteredQuestions.filter((q) => !solvedQuestionIds.has(q.id));
        }
      } catch (progressError) {
        console.error('Error fetching progress:', progressError);
      }
    }

    if (filteredQuestions.length === 0) {
      filteredQuestions = questions;
    }

    const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
    const selected = filteredQuestions[randomIndex];
    const content = typeof selected.content === 'object' && selected.content ? selected.content : {};
    return NextResponse.json({ id: selected.id, type: selected.type, content, ...content });
  } catch (error) {
    console.error('Error fetching writing questions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
