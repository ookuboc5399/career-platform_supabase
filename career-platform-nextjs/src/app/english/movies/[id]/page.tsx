'use client';

import { useState, useEffect, useRef } from 'react';
import { Movie, Subtitle } from '@/types/english';
import type { EnglishVideoPlayerHandle } from '@/components/ui/EnglishVideoPlayer';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const EnglishVideoPlayer = dynamic(() => import('@/components/ui/EnglishVideoPlayer'), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center h-full bg-gray-100">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  ),
});

export default function MovieDetailPage() {
  const params = useParams();
  const movieId = params?.id as string;
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentSubtitle, setCurrentSubtitle] = useState<Subtitle | null>(null);
  const playerRef = useRef<EnglishVideoPlayerHandle>(null);

  useEffect(() => {
    if (movieId) {
      loadMovie();
    }
  }, [movieId]);

  const loadMovie = async () => {
    try {
      const response = await fetch('/api/admin/english/movies');
      if (!response.ok) {
        throw new Error('Failed to load movies');
      }
      const movies = await response.json();
      console.log('Loaded movies:', movies); // デバッグログ

      const foundMovie = movies.find((m: Movie) => m.id === movieId);
      console.log('Found movie:', foundMovie); // デバッグログ
      
      if (!foundMovie) {
        throw new Error('Movie not found');
      }

      setMovie(foundMovie);
    } catch (error) {
      console.error('Error loading movie:', error);
      setError('Failed to load movie');
    }
  };

  const handleSubtitleClick = (subtitle: Subtitle) => {
    if (playerRef.current) {
      playerRef.current.seekTo(subtitle.startTime);
    }
  };

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <div className="font-bold">エラーが発生しました</div>
          <div className="mt-1">{error}</div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  console.log('Rendering movie:', movie); // デバッグログ

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-4 px-4">
        <div className="mb-4">
          <Link
            href="/english/movies"
            className="text-blue-500 hover:text-blue-700 flex items-center"
          >
            ← 動画一覧に戻る
          </Link>
        </div>

        <h1 className="text-2xl font-bold mb-4">{movie.title}</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* 左側: 動画プレーヤー */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-lg shadow-lg">
              <EnglishVideoPlayer
                ref={playerRef}
                url={movie.videoUrl}
                subtitles={movie.subtitles}
                onSubtitleChange={setCurrentSubtitle}
              />
            </div>

            {/* 現在の字幕 */}
            {currentSubtitle && (
              <div className="bg-white rounded-lg shadow-lg p-4">
                <div className="text-lg font-medium">{currentSubtitle.text}</div>
                <div className="text-gray-600 mt-2">{currentSubtitle.translation}</div>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-lg p-4">
              <p className="text-gray-600">{movie.description}</p>
              <div className="flex items-center gap-2 mt-4">
                <span className={`text-sm px-3 py-1 rounded ${
                  movie.level === 'beginner' ? 'bg-green-100 text-green-800' :
                  movie.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {movie.level === 'beginner' ? '初級' :
                   movie.level === 'intermediate' ? '中級' : '上級'}
                </span>
                {movie.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 右側: 字幕リストと単語リスト */}
          <div className="space-y-4">
            {/* 字幕リスト */}
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h2 className="text-lg font-semibold mb-4">字幕リスト</h2>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {movie.subtitles.map((subtitle, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded transition-colors cursor-pointer ${
                      subtitle === currentSubtitle
                        ? 'bg-blue-100'
                        : 'hover:bg-gray-100'
                    }`}
                    onClick={() => handleSubtitleClick(subtitle)}
                  >
                    <div className="text-sm text-gray-500">
                      {Math.floor(subtitle.startTime / 60)}:
                      {String(subtitle.startTime % 60).padStart(2, '0')}
                    </div>
                    <div className="font-medium">{subtitle.text}</div>
                    <div className="text-sm text-gray-600">{subtitle.translation}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 単語リスト */}
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h2 className="text-lg font-semibold mb-4">単語リスト</h2>
              <div className="space-y-4 max-h-[300px] overflow-y-auto">
                {movie.vocabulary.map((word, index) => (
                  <div key={index} className="border-b pb-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{word.word}</span>
                      <span className="text-gray-500">{word.partOfSpeech}</span>
                    </div>
                    <div className="text-gray-600 mt-1">{word.translation}</div>
                    <div className="text-sm text-gray-500 mt-1">{word.example}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
