import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const { data, error } = await supabaseAdmin!
      .from('english_news')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'News not found' }, { status: 404 });
    }

    const result = {
      ...data,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      ...(typeof data.content === 'object' && data.content ? data.content : {}),
    };
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch news' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const { error } = await supabaseAdmin!.from('english_news').delete().eq('id', id);

    if (error) throw error;
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting news:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete news' },
      { status: 500 }
    );
  }
}
