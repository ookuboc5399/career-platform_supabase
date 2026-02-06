import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { fetchEnglishMovieById } from '@/lib/english-movies.server';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const movieId = params.id;
  try {
    const movie = await request.json();

    // 既存のデータを取得
    const existingMovie = await fetchEnglishMovieById(movieId);
    if (!existingMovie) {
      return NextResponse.json(
        { error: 'Movie not found' },
        { status: 404 }
      );
    }

    // contentオブジェクトを構築
    const content: Record<string, unknown> = {
      videoUrl: movie.videoUrl || existingMovie.videoUrl || '',
      videoStoragePath: movie.videoStoragePath || existingMovie.videoStoragePath || undefined,
      subtitleUrl: movie.subtitleUrl || existingMovie.subtitleUrl || undefined,
      subtitleStoragePath: movie.subtitleStoragePath || existingMovie.subtitleStoragePath || undefined,
      thumbnailUrl: movie.thumbnailUrl || existingMovie.thumbnailUrl || undefined,
      thumbnailStoragePath: movie.thumbnailStoragePath || existingMovie.thumbnailStoragePath || undefined,
      description: movie.description || existingMovie.description || '',
      level: movie.level || existingMovie.level || 'beginner',
      tags: movie.tags || existingMovie.tags || [],
      subtitles: movie.subtitles || existingMovie.subtitles || [],
      vocabulary: movie.vocabulary || existingMovie.vocabulary || [],
      isPublished: movie.isPublished !== undefined 
        ? (movie.isPublished === true || movie.isPublished === 'true')
        : existingMovie.isPublished,
      duration: movie.duration !== undefined ? movie.duration : existingMovie.duration || 0,
      processed: movie.processed !== undefined ? movie.processed : existingMovie.processed,
      error: movie.error !== undefined ? movie.error : existingMovie.error || null,
      lastProcessingTime: movie.lastProcessingTime || existingMovie.lastProcessingTime || new Date().toISOString(),
      lastProcessingStage: movie.lastProcessingStage || existingMovie.lastProcessingStage || 'pending',
    };

    // YouTube動画の場合は追加情報を設定
    if (movie.originalTitle) {
      content.originalTitle = movie.originalTitle;
    } else if (existingMovie.originalTitle) {
      content.originalTitle = existingMovie.originalTitle;
    }
    if (movie.originalDescription) {
      content.originalDescription = movie.originalDescription;
    } else if (existingMovie.originalDescription) {
      content.originalDescription = existingMovie.originalDescription;
    }

    // Supabaseに更新
    const { data, error: supabaseError } = await supabaseAdmin!
      .from('english_movies')
      .update({
        title: movie.title || existingMovie.title,
        content,
        type: movie.type || 'movie',
        difficulty: movie.level || existingMovie.level || 'beginner',
        updated_at: new Date().toISOString(),
      })
      .eq('id', movieId)
      .select()
      .single();

    if (supabaseError) {
      console.error('Supabase update error:', supabaseError);
      throw new Error(`Failed to update movie: ${supabaseError.message}`);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating movie:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
        context: {
          movieId
        }
      });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update movie' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const movieId = params.id;
  try {
    // 既存のデータを確認
    const existingMovie = await fetchEnglishMovieById(movieId);
    if (!existingMovie) {
      return NextResponse.json(
        { error: 'Movie not found' },
        { status: 404 }
      );
    }

    // Supabaseから削除
    const { error: supabaseError } = await supabaseAdmin!
      .from('english_movies')
      .delete()
      .eq('id', movieId);

    if (supabaseError) {
      console.error('Supabase delete error:', supabaseError);
      throw new Error(`Failed to delete movie: ${supabaseError.message}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting movie:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
        context: {
          movieId
        }
      });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete movie' },
      { status: 500 }
    );
  }
}
