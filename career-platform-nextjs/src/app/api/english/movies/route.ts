import { NextResponse } from 'next/server';
import { fetchEnglishMovies } from '@/lib/english-movies.server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const movies = await fetchEnglishMovies();
    console.log('[GET /api/english/movies] Total movies:', movies.length);
    
    // デバッグ: 各動画の状態をログ出力
    movies.forEach((movie) => {
      console.log(`[Movie ${movie.id}]`, {
        title: movie.title,
        isPublished: movie.isPublished,
        videoUrl: movie.videoUrl,
        videoStoragePath: movie.videoStoragePath,
        hasVideoUrl: !!movie.videoUrl,
        willBeIncluded: movie.isPublished && !!movie.videoUrl
      });
    });
    
    // isPublishedがtrueで、videoUrlが存在する動画をフィルタリング
    // YouTube動画も含む（videoUrlにYouTube URLが設定されている場合）
    const publishedMovies = movies.filter((movie) => {
      const hasVideoUrl = !!movie.videoUrl && movie.videoUrl.trim() !== '';
      const isPublished = movie.isPublished === true;
      const willBeIncluded = isPublished && hasVideoUrl;
      
      if (!willBeIncluded) {
        console.log(`[GET /api/english/movies] Excluding movie ${movie.id}:`, {
          title: movie.title,
          isPublished,
          hasVideoUrl,
          videoUrl: movie.videoUrl ? movie.videoUrl.substring(0, 100) : 'N/A'
        });
      }
      
      return willBeIncluded;
    });
    
    console.log('[GET /api/english/movies] Published movies:', publishedMovies.length);
    console.log('[GET /api/english/movies] Published movie IDs:', publishedMovies.map(m => m.id));
    
    return NextResponse.json(publishedMovies);
  } catch (error) {
    console.error('[GET /api/english/movies] Failed to load movies', error);
    return NextResponse.json({ error: 'Failed to load movies' }, { status: 500 });
  }
}


