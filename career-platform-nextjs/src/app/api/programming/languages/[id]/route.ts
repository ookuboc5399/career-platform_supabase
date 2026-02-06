import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { title, description, type } = body;

    if (!title || !type) {
      return NextResponse.json(
        { error: 'Title and type are required' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();

    const { data, error } = await supabaseAdmin
      .from('programming_languages')
      .update({
        title,
        description: description || null,
        type,
        updated_at: now,
      })
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Language not found' },
        { status: 404 }
      );
    }

    // スネークケースからキャメルケースに変換
    const formattedLanguage = {
      id: data.id,
      title: data.title,
      description: data.description,
      type: data.type,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };

    return NextResponse.json(formattedLanguage);
  } catch (error) {
    console.error('Error updating programming language:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update programming language' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 関連するチャプターが存在するかチェック
    const { data: chapters, error: chaptersError } = await supabaseAdmin
      .from('programming_chapters')
      .select('id')
      .eq('language_id', params.id)
      .limit(1);

    if (chaptersError) {
      throw chaptersError;
    }

    if (chapters && chapters.length > 0) {
      return NextResponse.json(
        { error: 'この言語に関連するチャプターが存在するため削除できません。先にチャプターを削除してください。' },
        { status: 400 }
      );
    }

    // プログラミング言語を削除
    const { error } = await supabaseAdmin
      .from('programming_languages')
      .delete()
      .eq('id', params.id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting programming language:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete programming language' },
      { status: 500 }
    );
  }
}

