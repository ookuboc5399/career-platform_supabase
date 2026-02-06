import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { fetchEnglishMovies } from '@/lib/english-movies.server';

export async function GET() {
  try {
    // Supabaseから動画一覧を取得
    const movies = await fetchEnglishMovies();
    return NextResponse.json(movies);
  } catch (error) {
    console.error('Error getting movies:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
    return NextResponse.json(
      { error: 'Failed to get movies' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const movie = await request.json();

    // 新規作成時はIDを生成
    if (!movie.id) {
      movie.id = crypto.randomUUID();
    }

    // contentオブジェクトを構築
    const content: Record<string, unknown> = {
      videoUrl: movie.videoUrl || '',
      videoStoragePath: movie.videoStoragePath || undefined,
      subtitleUrl: movie.subtitleUrl || undefined,
      subtitleStoragePath: movie.subtitleStoragePath || undefined,
      thumbnailUrl: movie.thumbnailUrl || undefined,
      thumbnailStoragePath: movie.thumbnailStoragePath || undefined,
      description: movie.description || '',
      level: movie.level || 'beginner',
      tags: movie.tags || [],
      subtitles: movie.subtitles || [],
      vocabulary: movie.vocabulary || [],
      isPublished: movie.isPublished === true || movie.isPublished === 'true',
      duration: movie.duration || 0,
      processed: movie.processed || false,
      error: movie.error || null,
      lastProcessingTime: movie.lastProcessingTime || new Date().toISOString(),
      lastProcessingStage: movie.lastProcessingStage || 'pending',
    };

    // YouTube動画の場合は追加情報を設定
    if (movie.originalTitle) {
      content.originalTitle = movie.originalTitle;
    }
    if (movie.originalDescription) {
      content.originalDescription = movie.originalDescription;
    }

    // Supabaseに保存
    const { data, error: supabaseError } = await supabaseAdmin!
      .from('english_movies')
      .insert({
        id: movie.id,
        title: movie.title || 'Untitled Movie',
        content,
        type: movie.type || 'movie',
        difficulty: movie.level || 'beginner',
        created_at: movie.createdAt || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (supabaseError) {
      console.error('Supabase insert error:', supabaseError);
      throw new Error(`Failed to create movie: ${supabaseError.message}`);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in POST handler:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create movie' },
      { status: 500 }
    );
  }
}
