import { NextResponse } from 'next/server';
import { fetchEnglishMovieById } from '@/lib/english-movies.server';

export const dynamic = 'force-dynamic';

interface Params {
  params: Promise<{ id: string }> | { id: string };
}

export async function GET(
  request: Request,
  { params }: Params
) {
  try {
    // Next.js 15ではparamsがPromiseになる可能性があるため、解決する
    const resolvedParams = await Promise.resolve(params);
    const movieId = resolvedParams.id;
    
    console.log(`[GET /api/english/movies/${movieId}] Fetching movie with ID:`, movieId);
    
    const movie = await fetchEnglishMovieById(movieId);
    
    console.log(`[GET /api/english/movies/${movieId}] Movie found:`, {
      exists: !!movie,
      isPublished: movie?.isPublished,
      hasVideoUrl: !!movie?.videoUrl,
      title: movie?.title
    });

    if (!movie) {
      console.log(`[GET /api/english/movies/${movieId}] Movie not found`);
      return NextResponse.json({ error: 'Movie not found' }, { status: 404 });
    }

    if (!movie.isPublished) {
      console.log(`[GET /api/english/movies/${movieId}] Movie exists but not published`);
      return NextResponse.json({ error: 'Movie not found' }, { status: 404 });
    }

    return NextResponse.json(movie);
  } catch (error) {
    const resolvedParams = await Promise.resolve(params);
    const movieId = resolvedParams.id;
    console.error(`[GET /api/english/movies/${movieId}] Failed to load movie`, error);
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      return NextResponse.json(
        { error: `Failed to load movie: ${error.message}` },
        { status: 500 }
      );
    }
    return NextResponse.json({ error: 'Failed to load movie' }, { status: 500 });
  }
}


