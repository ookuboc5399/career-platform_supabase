import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { fetchEnglishNews } from '@/lib/news-api';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { data: internalNews, error } = await supabaseAdmin!
      .from('english_news')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const externalNews = await fetchEnglishNews();

    const allNews = [
      ...(internalNews || []).map((row: any) => ({
        ...row,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        ...(typeof row.content === 'object' && row.content ? row.content : {}),
      })),
      ...externalNews,
    ].sort(
      (a, b) =>
        new Date((b as any).createdAt || 0).getTime() -
        new Date((a as any).createdAt || 0).getTime()
    );

    return NextResponse.json(allNews);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch news' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newsItem = {
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const id = newsItem.id || `news-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const { data, error } = await supabaseAdmin!
      .from('english_news')
      .insert({
        id,
        title: newsItem.title ?? null,
        content: newsItem,
        type: newsItem.type ?? null,
        difficulty: newsItem.difficulty ?? null,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ ...data, createdAt: data.created_at, updatedAt: data.updated_at });
  } catch (error) {
    console.error('Error creating news:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create news' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) throw new Error('News ID is required');

    const updatePayload: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (updateData.title !== undefined) updatePayload.title = updateData.title;
    if (updateData.content !== undefined) updatePayload.content = updateData.content;
    if (updateData.type !== undefined) updatePayload.type = updateData.type;
    if (updateData.difficulty !== undefined) updatePayload.difficulty = updateData.difficulty;

    const { data, error } = await supabaseAdmin!
      .from('english_news')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('News not found');
    return NextResponse.json({ ...data, createdAt: data.created_at, updatedAt: data.updated_at });
  } catch (error) {
    console.error('Error updating news:', error);
    const status = error instanceof Error && error.message === 'News not found' ? 404 : 500;
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update news' },
      { status }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, isPublished, publishedAt } = body;

    if (!id) throw new Error('News ID is required');

    const { data, error } = await supabaseAdmin!
      .from('english_news')
      .update({
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('News not found');
    return NextResponse.json({ ...data, createdAt: data.created_at, updatedAt: data.updated_at });
  } catch (error) {
    console.error('Error updating news:', error);
    const status = error instanceof Error && error.message === 'News not found' ? 404 : 500;
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update news' },
      { status }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) throw new Error('News ID is required');

    const { error } = await supabaseAdmin!.from('english_news').delete().eq('id', id);

    if (error) throw error;
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting news:', error);
    const status = error instanceof Error && error.message === 'News not found' ? 404 : 500;
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete news' },
      { status }
    );
  }
}
