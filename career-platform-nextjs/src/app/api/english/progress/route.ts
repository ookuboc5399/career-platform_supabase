import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/auth';
import { EnglishProgress } from '@/types/english';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const progress: EnglishProgress = {
      id: `progress-${Date.now()}`,
      userId: session.user.id,
      type: body.type,
      category: body.category,
      questions: body.questions,
      score: body.score,
      totalQuestions: body.totalQuestions,
      createdAt: new Date().toISOString(),
    };

    const { data, error } = await supabaseAdmin!.from('english_progress').insert({
      id: progress.id,
      user_id: progress.userId,
      type: progress.type,
      category: progress.category ?? null,
      questions: progress.questions ?? [],
      score: progress.score ?? 0,
      total_questions: progress.totalQuestions ?? 0,
      created_at: progress.createdAt,
    }).select().single();

    if (error) throw error;
    return NextResponse.json({
      ...data,
      userId: data.user_id,
      totalQuestions: data.total_questions,
      createdAt: data.created_at,
    });
  } catch (error) {
    console.error('Error saving progress:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save progress' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const category = searchParams.get('category');

    let query = supabaseAdmin!
      .from('english_progress')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (type) query = query.eq('type', type);
    if (category) query = query.eq('category', category);

    const { data, error } = await query;

    if (error) throw error;

    const progress = (data ?? []).map((row) => ({
      ...row,
      userId: row.user_id,
      totalQuestions: row.total_questions,
      createdAt: row.created_at,
    }));
    return NextResponse.json(progress);
  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch progress' },
      { status: 500 }
    );
  }
}
