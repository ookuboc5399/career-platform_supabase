'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import VideoPlayer from '@/components/ui/VideoPlayer';
import { NewsContent } from '@/types/english';

interface NewsWithExtras extends NewsContent {
  publishedAt?: string;
  conversation?: string;
  audioUrl?: string;
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
      const response = await fetch(`/api/english/news/${params.id}`);
      if (!response.ok) throw new Error('Failed to fetch news');
      const data = await response.json();
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
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-white border-b">
        <div className="container max-w-4xl mx-auto px-4 py-6">
          <button
            onClick={() => router.push('/english/news')}
            className="flex items-center gap-1 text-gray-600 hover:text-gray-900 mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            ニュース一覧に戻る
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
              {news.category}
            </span>
            <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">
              {news.level}
            </span>
          </div>

          <h1 className="text-3xl font-bold mb-2">{news.title}</h1>
          <p className="text-gray-600">{news.description}</p>
        </div>
      </div>

      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* メディアセクション */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
            {news.imageUrl && (
              <div>
                <h2 className="text-lg font-medium mb-2">画像</h2>
                <div className="relative h-48 md:h-64">
                  <Image
                    src={news.imageUrl}
                    alt={news.title}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              </div>
            )}
            {news.videoUrl && (
              <div>
                <h2 className="text-lg font-medium mb-2">動画</h2>
                <div className="rounded-lg overflow-hidden aspect-video">
                  <VideoPlayer url={news.videoUrl} />
                </div>
              </div>
            )}
          </div>

          {/* 本文 */}
          <div className="p-6 border-t">
            <h2 className="text-xl font-semibold mb-4">本文</h2>
            <div className="prose max-w-none">
              <p className="whitespace-pre-line">{news.content}</p>
            </div>
          </div>

          {/* 単語リスト */}
          {news.vocabulary && news.vocabulary.length > 0 && (
            <div className="p-6 border-t">
              <h2 className="text-xl font-semibold mb-4">重要単語</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {news.vocabulary.map((word, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="font-medium text-lg mb-1">{word.word}</div>
                    <div className="text-gray-600 mb-2">{word.meaning}</div>
                    <div className="text-sm text-gray-500">
                      <span className="font-medium">例文:</span> {word.example}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 会話練習 */}
          {news.conversation && (
            <div className="p-6 border-t">
              <h2 className="text-xl font-semibold mb-4">会話練習</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="whitespace-pre-line">{news.conversation}</p>
              </div>
            </div>
          )}

          {/* 音声 */}
          {news.audioUrl && (
            <div className="p-6 border-t">
              <h2 className="text-xl font-semibold mb-4">音声</h2>
              <audio controls className="w-full">
                <source src={news.audioUrl} type="audio/mpeg" />
                お使いのブラウザは音声再生に対応していません。
              </audio>
            </div>
          )}

          {/* メタ情報 */}
          <div className="p-6 border-t bg-gray-50">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-2">
                {news.tags.map((tag) => (
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
