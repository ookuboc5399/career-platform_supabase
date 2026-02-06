import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { languageId, chapters } = body;

    if (!languageId || !chapters || !Array.isArray(chapters)) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    // 各チャプターの順序を更新
    const updatePromises = chapters.map((chapter: { id: string; order: number }) =>
      supabaseAdmin
        .from('programming_chapters')
        .update({ order: chapter.order, updated_at: new Date().toISOString() })
        .eq('id', chapter.id)
        .eq('language_id', languageId)
    );

    const results = await Promise.all(updatePromises);
    
    // エラーチェック
    const errors = results.filter(result => result.error);
    if (errors.length > 0) {
      throw new Error(`Failed to update ${errors.length} chapters`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating chapter order:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update chapter order' },
      { status: 500 }
    );
  }
}
