'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import VideoPlayer from '@/components/ui/VideoPlayer';
import { NewsContent } from '@/types/api';
import { getNewsById } from '@/lib/api';

interface NewsWithExtras extends NewsContent {
  publishedAt?: string;
  conversation?: string;
  audioUrl?: string;
  sourceUrl?: string;
  sourceName?: string;
}

export default function NewsDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [news, setNews] = useState<NewsWithExtras | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNews();
  }, [params.id]);

  const fetchNews = async () => {
    try {
      const data = await getNewsById(params.id);
      setNews(data);
    } catch (error) {
      console.error('Error fetching news:', error);
      setError('Failed to load news');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-500">{error || 'News not found'}</p>
          <button
            onClick={() => router.push('/english/news')}
            className="mt-4 text-blue-500 hover:text-blue-600"
          >
            ニュース一覧に戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* ヘッダー */}
      <div className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="container mx-auto max-w-4xl px-4 py-6">
          <button
            onClick={() => router.push('/english/news')}
            className="mb-4 flex items-center gap-1 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            ニュース一覧に戻る
          </button>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                {news.category}
              </span>
              <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">
                {news.level}
              </span>
            </div>
            {news.sourceName && (
              <div className="text-sm text-gray-500">
                Source: <a href={news.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600">{news.sourceName}</a>
              </div>
            )}
          </div>

          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-gray-100">{news.title}</h1>
          <p className="text-gray-600 dark:text-gray-300">{news.description}</p>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="overflow-hidden rounded-lg bg-white shadow-md dark:bg-gray-900 dark:shadow-none dark:ring-1 dark:ring-gray-800">
          {news.videoUrl && (
            <div className="px-6 pt-6">
              <h2 className="mb-3 text-center text-lg font-medium text-gray-900 dark:text-gray-100">動画</h2>
              <div className="mx-auto aspect-video w-full max-w-4xl overflow-hidden rounded-lg bg-black">
                <VideoPlayer url={news.videoUrl} />
              </div>
            </div>
          )}
          {/* メディアセクション（画像） */}
          {news.imageUrl && (
            <div
              className={`grid grid-cols-1 gap-4 p-6 ${news.videoUrl ? 'pt-4' : ''} ${news.videoUrl ? 'md:justify-items-center' : 'md:grid-cols-2'}`}
            >
              <div className={news.videoUrl ? 'w-full max-w-2xl' : ''}>
                <h2 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">画像</h2>
                <div className="relative h-48 md:h-64">
                  <Image
                    src={news.imageUrl}
                    alt={news.title}
                    fill
                    className="rounded-lg object-cover"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 本文 */}
          <div className="border-t border-gray-200 p-6 dark:border-gray-800">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">本文</h2>
            <div className="prose max-w-none text-gray-800 dark:text-gray-200">
              <p className="whitespace-pre-line">{news.content}</p>
            </div>
          </div>

          {/* 単語リスト */}
          {news.vocabulary && news.vocabulary.length > 0 && (
            <div className="border-t border-gray-200 p-6 dark:border-gray-800">
              <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">重要単語</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {news.vocabulary.map((word, index) => (
                  <div key={index} className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/60">
                    <div className="mb-1 text-lg font-medium text-gray-900 dark:text-gray-100">{word.word}</div>
                    <div className="mb-2 text-gray-600 dark:text-gray-300">{word.meaning}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-medium">例文:</span> {word.example}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 会話練習 */}
          {news?.conversation && (
            <div className="p-6 border-t">
              <h2 className="text-xl font-semibold mb-4">会話練習</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="whitespace-pre-line">{news.conversation}</p>
              </div>
            </div>
          )}

          {/* 音声 */}
          {news?.audioUrl && (
            <div className="p-6 border-t">
              <h2 className="text-xl font-semibold mb-4">音声</h2>
              <audio controls className="w-full">
                <source src={news.audioUrl} type="audio/mpeg" />
                お使いのブラウザは音声再生に対応していません。
              </audio>
            </div>
          )}

          {/* メタ情報 */}
          <div className="border-t border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-800/40">
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                {news?.tags?.map((tag) => (
                  <span key={tag} className="text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
              <time dateTime={news.publishedAt || news.createdAt}>
                {new Date(news.publishedAt || news.createdAt).toLocaleDateString()}
              </time>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
