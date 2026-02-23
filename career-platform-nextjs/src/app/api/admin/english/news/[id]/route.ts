import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();

    const { data: existing, error: fetchError } = await supabaseAdmin!
      .from('english_news')
      .select('*')
      .eq('id', params.id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json({ error: 'News not found' }, { status: 404 });
    }

    const updatePayload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };
    if (data.title !== undefined) updatePayload.title = data.title;
    if (data.content !== undefined) updatePayload.content = data.content;
    if (data.type !== undefined) updatePayload.type = data.type;
    if (data.difficulty !== undefined) updatePayload.difficulty = data.difficulty;

    const { data: result, error } = await supabaseAdmin!
      .from('english_news')
      .update(updatePayload)
      .eq('id', params.id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({
      ...result,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
      ...(typeof result.content === 'object' && result.content ? result.content : {}),
    });
  } catch (error) {
    console.error('Error updating news:', error);
    return NextResponse.json(
      { error: 'Failed to update news' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabaseAdmin!
      .from('english_news')
      .delete()
      .eq('id', params.id);

    if (error) throw error;
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting news:', error);
    return NextResponse.json(
      { error: 'Failed to delete news' },
      { status: 500 }
    );
  }
}
