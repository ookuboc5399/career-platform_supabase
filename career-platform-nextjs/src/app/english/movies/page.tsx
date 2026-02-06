'use client';

import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Movie } from '@/types/english';
import Link from 'next/link';
import { VideoThumbnail } from '@/components/ui/VideoThumbnail';

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);
  const popularTags = [
    'toeic', 'bbc', 'フレンズ', 'スヌーピー', 'ジブリ',
    'スポンジボブ', '映画', 'ハリーポッター', 'ディズニー'
  ];

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      console.log('[MoviesPage] Loading movies from /api/english/movies');
      const response = await fetch('/api/english/movies');
      
      console.log('[MoviesPage] Response status:', response.status);
      console.log('[MoviesPage] Response ok:', response.ok);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('[MoviesPage] API error:', errorData);
        throw new Error(errorData.error || `Failed to load movies (${response.status})`);
      }
      
      const data = await response.json();
      console.log('[MoviesPage] Movies loaded:', {
        count: data.length,
        movies: data.map((m: Movie) => ({
          id: m.id,
          title: m.title,
          hasVideoUrl: !!m.videoUrl,
          isPublished: m.isPublished
        }))
      });
      
      setMovies(data);
    } catch (error) {
      console.error('[MoviesPage] Error loading movies:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load movies';
      setError(errorMessage);
    }
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">映画で学ぶ英語</h1>
        <Link
          href="/english"
          className="text-blue-500 hover:text-blue-700 flex items-center"
        >
          ← 英語学習トップに戻る
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
          <div className="font-bold">エラーが発生しました</div>
          <div className="mt-1">{error}</div>
        </div>
      )}

      {/* 人気のハッシュタグ */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-4">今人気のハッシュタグ</h2>
        <div className="flex flex-wrap gap-2">
          {popularTags.map((tag) => (
            <span
              key={tag}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm cursor-pointer transition-colors"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* 人気上昇中の動画 */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-4">人気上昇中の動画</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {movies.slice(0, 3).map((movie) => (
            <Card key={movie.id} className="hover:shadow-lg transition-shadow">
              <Link href={`/english/movies/${movie.id}`}>
                <div className="aspect-video relative">
                  {movie.thumbnailUrl ? (
                    <img
                      src={movie.thumbnailUrl}
                      alt={movie.title}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                  ) : movie.videoUrl ? (
                    <VideoThumbnail
                      videoUrl={movie.videoUrl}
                      alt={movie.title}
                      className="w-full h-full object-cover rounded-t-lg"
                      fallbackText="サムネイルなし"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 rounded-t-lg flex items-center justify-center">
                      <span className="text-gray-400">サムネイルなし</span>
                    </div>
                  )}
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-sm px-2 py-1 rounded">
                    {formatDuration(movie.duration || 0)}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black bg-opacity-30 rounded-t-lg">
                    <div className="text-white text-4xl">▶</div>
                  </div>
                </div>
              </Link>
              <div className="p-4">
                <Link href={`/english/movies/${movie.id}`}>
                  <h3 className="font-semibold mb-2 hover:text-blue-600">{movie.title}</h3>
                </Link>
                <p className="text-gray-500 text-sm line-clamp-2">{movie.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-xs px-2 py-1 rounded ${
                    movie.level === 'beginner' ? 'bg-green-100 text-green-800' :
                    movie.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {movie.level === 'beginner' ? '初級' :
                     movie.level === 'intermediate' ? '中級' : '上級'}
                  </span>
                  {(movie.tags || []).slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-2">
                  <Link
                    href={`/english/movies/${movie.id}`}
                    className="text-sm text-blue-500 hover:text-blue-700"
                  >
                    詳細を見る →
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* すべての動画 */}
      <div>
        <h2 className="text-xl font-semibold mb-4">すべての動画</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {movies.map((movie) => (
            <Card key={movie.id} className="hover:shadow-lg transition-shadow">
              <Link href={`/english/movies/${movie.id}`}>
                <div className="aspect-video relative">
                  {movie.thumbnailUrl ? (
                    <img
                      src={movie.thumbnailUrl}
                      alt={movie.title}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                  ) : movie.videoUrl ? (
                    <VideoThumbnail
                      videoUrl={movie.videoUrl}
                      alt={movie.title}
                      className="w-full h-full object-cover rounded-t-lg"
                      fallbackText="サムネイルなし"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 rounded-t-lg flex items-center justify-center">
                      <span className="text-gray-400">サムネイルなし</span>
                    </div>
                  )}
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-sm px-2 py-1 rounded">
                    {formatDuration(movie.duration || 0)}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black bg-opacity-30 rounded-t-lg">
                    <div className="text-white text-4xl">▶</div>
                  </div>
                </div>
              </Link>
              <div className="p-4">
                <Link href={`/english/movies/${movie.id}`}>
                  <h3 className="font-semibold mb-2 hover:text-blue-600">{movie.title}</h3>
                </Link>
                <p className="text-gray-500 text-sm line-clamp-2">{movie.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-xs px-2 py-1 rounded ${
                    movie.level === 'beginner' ? 'bg-green-100 text-green-800' :
                    movie.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {movie.level === 'beginner' ? '初級' :
                     movie.level === 'intermediate' ? '中級' : '上級'}
                  </span>
                  {(movie.tags || []).slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-2">
                  <Link
                    href={`/english/movies/${movie.id}`}
                    className="text-sm text-blue-500 hover:text-blue-700"
                  >
                    詳細を見る →
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
