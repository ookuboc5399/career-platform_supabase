import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin!
      .from('english_news')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const items = (data ?? []).map((row) => ({
      ...row,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      ...(typeof row.content === 'object' && row.content ? row.content : {}),
    }));
    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}
