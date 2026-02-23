import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const level = searchParams.get('level');

    let query = supabaseAdmin!
      .from('english_questions')
      .select('*')
      .eq('type', 'reading');

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }
    if (level && level !== 'all') {
      query = query.eq('level', level);
    }

    const { data: questions, error } = await query;

    if (error) throw error;
    if (!questions || questions.length === 0) {
      return NextResponse.json({ error: 'No questions found' }, { status: 404 });
    }

    const randomIndex = Math.floor(Math.random() * questions.length);
    const selected = questions[randomIndex];
    const content = typeof selected.content === 'object' && selected.content ? selected.content : {};
    return NextResponse.json({ id: selected.id, type: selected.type, content, ...content });
  } catch (error) {
    console.error('Error fetching reading questions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
