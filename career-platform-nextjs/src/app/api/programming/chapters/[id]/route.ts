import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const languageId = searchParams.get('languageId');

    if (!languageId) {
      return NextResponse.json(
        { error: 'Language ID is required' },
        { status: 400 }
      );
    }

    const { data: chapter, error } = await supabaseAdmin
      .from('programming_chapters')
      .select('*')
      .eq('id', params.id)
      .eq('language_id', languageId)
      .single();

    if (error || !chapter) {
      return NextResponse.json(
        { error: 'Chapter not found' },
        { status: 404 }
      );
    }

    // スネークケースからキャメルケースに変換
    const formattedChapter = {
      id: chapter.id,
      languageId: chapter.language_id,
      title: chapter.title,
      description: chapter.description,
      videoUrl: chapter.video_url,
      thumbnailUrl: chapter.thumbnail_url,
      duration: chapter.duration,
      order: chapter.order,
      status: chapter.status,
      exercises: chapter.exercises || [],
      createdAt: chapter.created_at,
      updatedAt: chapter.updated_at,
    };

    return NextResponse.json(formattedChapter);
  } catch (error) {
    console.error('Error fetching chapter:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch chapter' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const languageId = searchParams.get('languageId');

    if (!languageId) {
      return NextResponse.json(
        { error: 'Language ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    // キャメルケースをスネークケースに変換
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.videoUrl !== undefined) updateData.video_url = body.videoUrl;
    if (body.thumbnailUrl !== undefined) updateData.thumbnail_url = body.thumbnailUrl;
    if (body.duration !== undefined) updateData.duration = body.duration;
    if (body.order !== undefined) updateData.order = body.order;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.exercises !== undefined) updateData.exercises = body.exercises;

    const { data: result, error } = await supabaseAdmin
      .from('programming_chapters')
      .update(updateData)
      .eq('id', params.id)
      .eq('language_id', languageId)
      .select()
      .single();

    if (error || !result) {
      return NextResponse.json(
        { error: 'Chapter not found' },
        { status: 404 }
      );
    }

    // スネークケースからキャメルケースに変換
    const formattedChapter = {
      id: result.id,
      languageId: result.language_id,
      title: result.title,
      description: result.description,
      videoUrl: result.video_url,
      thumbnailUrl: result.thumbnail_url,
      duration: result.duration,
      order: result.order,
      status: result.status,
      exercises: result.exercises || [],
      createdAt: result.created_at,
      updatedAt: result.updated_at,
    };

    return NextResponse.json(formattedChapter);
  } catch (error) {
    console.error('Error updating chapter:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update chapter' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const languageId = searchParams.get('languageId');

    if (!languageId) {
      return NextResponse.json(
        { error: 'Language ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from('programming_chapters')
      .delete()
      .eq('id', params.id)
      .eq('language_id', languageId);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting chapter:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete chapter' },
      { status: 500 }
    );
  }
}
