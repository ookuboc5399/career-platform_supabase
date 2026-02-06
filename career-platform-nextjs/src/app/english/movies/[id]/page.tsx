'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Movie, Subtitle } from '@/types/english';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

// シンプルなHTML5 videoプレーヤーを使用
const SimpleVideoPlayer = dynamic(
  () => import('@/components/ui/SimpleVideoPlayer'),
  {
    ssr: false,
    loading: () => (
      <div className="flex justify-center items-center h-full bg-gray-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    ),
  }
);

export default function MovieDetailPage() {
  const params = useParams();
  const router = useRouter();
  const movieId = params?.id as string;
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentSubtitle, setCurrentSubtitle] = useState<Subtitle | null>(null);
  const [subtitleList, setSubtitleList] = useState<Subtitle[]>([]);
  const playerRef = useRef<{ seekTo: (time: number) => void } | null>(null);

  const loadMovie = useCallback(async () => {
    try {
      console.log('[MovieDetailPage] Loading movie with ID:', movieId);
      const response = await fetch(`/api/english/movies/${movieId}`);
      
      console.log('[MovieDetailPage] Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('[MovieDetailPage] API error:', errorData);
        throw new Error(errorData.error || `Failed to load movie (${response.status})`);
      }
      
      const data: Movie = await response.json();
      console.log('[MovieDetailPage] Movie loaded:', {
        id: data.id,
        title: data.title,
        videoUrl: data.videoUrl,
        isPublished: data.isPublished
      });
      setMovie(data);
    } catch (error) {
      console.error('[MovieDetailPage] Error loading movie:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load movie';
      setError(errorMessage);
    }
  }, [movieId]);

  useEffect(() => {
    if (movieId) {
      loadMovie();
    }
  }, [movieId, loadMovie]);

  const parseVttTimestamp = useCallback((timestamp: string): number => {
    try {
      // WebVTTのタイムスタンプ形式をサポート: HH:MM:SS.mmm または HH:MM:SS,mmm
      const pattern = /^(\d{2}):(\d{2}):(\d{2})[.,](\d{3})$/;
      const match = timestamp.trim().match(pattern);
      if (!match) {
        return 0;
      }

      const hours = Number(match[1]);
      const minutes = Number(match[2]);
      const seconds = Number(match[3]);
      const milliseconds = Number(match[4]);

      const totalSeconds = hours * 3600 + minutes * 60 + seconds + milliseconds / 1000;
      return totalSeconds;
    } catch (error) {
      console.error('[MovieDetailPage] Error parsing timestamp:', timestamp, error);
      return 0;
    }
  }, []);

  const parseVtt = useCallback((vttText: string): Subtitle[] => {
    const lines = vttText.split(/\r?\n/);
    const subtitles: Subtitle[] = [];
    let index = 0;

    // WebVTTヘッダーをスキップ
    while (index < lines.length && !lines[index].trim().includes('-->')) {
      if (lines[index].trim().startsWith('WEBVTT')) {
        index += 1;
        // 空行やメタデータをスキップ
        while (index < lines.length && lines[index].trim() && !lines[index].trim().includes('-->')) {
          index += 1;
        }
      } else {
        index += 1;
      }
    }

    while (index < lines.length) {
      const line = lines[index].trim();

      if (!line) {
        index += 1;
        continue;
      }

      // Skip cue number if present
      if (/^\d+$/.test(line)) {
        index += 1;
        if (index >= lines.length) break;
      }

      // タイムスタンプ行を探す（より厳密なパターンマッチング）
      const timingLine = lines[index].trim();
      const timingMatch = timingLine.match(/^(\d{2}:\d{2}:\d{2}[.,]\d{3})\s+-->\s+(\d{2}:\d{2}:\d{2}[.,]\d{3})(.*)$/);
      
      if (!timingMatch) {
        index += 1;
        continue;
      }

      const start = parseVttTimestamp(timingMatch[1]);
      const end = parseVttTimestamp(timingMatch[2]);
      index += 1;

      // 字幕テキストを取得
      const textLines: string[] = [];
      while (index < lines.length && lines[index].trim() && !lines[index].trim().includes('-->')) {
        const textLine = lines[index].trim();
        // HTMLタグを除去
        const cleanText = textLine.replace(/<[^>]+>/g, '');
        if (cleanText) {
          textLines.push(cleanText);
        }
        index += 1;
      }

      const text = textLines.join(' ');
      if (!text) {
        continue;
      }

      subtitles.push({
        startTime: start,
        endTime: end,
        text,
        translation: '',
      });
    }

    return subtitles;
  }, [parseVttTimestamp]);

  const loadRemoteSubtitles = useCallback(async (url: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to load subtitles from ${url}`);
      }
      const vttText = await response.text();
      const parsed = parseVtt(vttText);
      setSubtitleList(parsed);
    } catch (subtitleError) {
      console.error('[MovieDetailPage] Failed to fetch subtitles', subtitleError);
      setSubtitleList([]);
    }
  }, [parseVtt]);

  useEffect(() => {
    if (!movie) {
      setSubtitleList([]);
      return;
    }

    if (movie.subtitles && movie.subtitles.length > 0) {
      setSubtitleList(movie.subtitles);
      return;
    }

    if (movie.subtitleUrl) {
      loadRemoteSubtitles(movie.subtitleUrl);
    } else {
      setSubtitleList([]);
    }
  }, [movie?.id, movie?.subtitles, movie?.subtitleUrl, loadRemoteSubtitles]);

  const handleSubtitleClick = useCallback((subtitle: Subtitle) => {
    if (playerRef.current) {
      playerRef.current.seekTo(subtitle.startTime);
    }
    setCurrentSubtitle(subtitle);
  }, []);

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
        <div className="mb-4" style={{ zIndex: 1000, position: 'relative' }}>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              router.push('/english/movies');
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="text-blue-500 hover:text-blue-700 flex items-center gap-2 transition-colors cursor-pointer bg-transparent border-none p-0 font-medium"
            type="button"
            style={{ pointerEvents: 'auto' }}
          >
            <span>←</span>
            <span>動画一覧に戻る</span>
          </button>
        </div>

        <h1 className="text-2xl font-bold mb-4">{movie.title}</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* 左側: 動画プレーヤー */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-lg shadow-lg p-4" style={{ position: 'relative', zIndex: 1 }}>
              <SimpleVideoPlayer
                ref={playerRef}
                url={movie.videoUrl}
                subtitles={subtitleList}
                subtitleUrl={movie.subtitleUrl}
                onSubtitleChange={setCurrentSubtitle}
              />
            </div>

            {/* 現在の字幕（動画内に表示されるため、ここでは非表示またはオプション） */}
            {/* 動画内に字幕が表示されるため、このセクションは削除しました */}

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
                {(movie.tags || []).map((tag) => (
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

          {/* 右側: 字幕リストと単語リスト（VoiceTube風） */}
          <div className="space-y-4">
            {/* 字幕リスト */}
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h2 className="text-lg font-semibold mb-4">字幕リスト</h2>
              <div className="space-y-1 max-h-[400px] overflow-y-auto">
                {subtitleList.map((subtitle, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded transition-all cursor-pointer border-l-4 ${
                      subtitle === currentSubtitle
                        ? 'bg-blue-50 border-blue-500 shadow-md'
                        : 'hover:bg-gray-50 border-transparent hover:border-gray-300'
                    }`}
                    onClick={() => handleSubtitleClick(subtitle)}
                  >
                    <div className="text-xs text-gray-500 mb-1">
                      {Math.floor(subtitle.startTime / 60)}:
                      {String(Math.floor(subtitle.startTime % 60)).padStart(2, '0')}
                    </div>
                    <div className={`font-medium mb-1 ${
                      subtitle === currentSubtitle ? 'text-blue-700' : 'text-gray-900'
                    }`}>
                      {subtitle.text}
                    </div>
                    {subtitle.translation && (
                      <div className="text-sm text-gray-600">{subtitle.translation}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 単語リスト */}
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h2 className="text-lg font-semibold mb-4">単語リスト</h2>
              <div className="space-y-4 max-h-[300px] overflow-y-auto">
                {(movie.vocabulary || []).map((word, index) => (
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
