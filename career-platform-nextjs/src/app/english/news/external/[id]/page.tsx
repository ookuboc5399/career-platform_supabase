'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { NewsContent } from '@/types/api';
import { getNewsById } from '@/lib/api';

export default function ExternalNewsDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [news, setNews] = useState<NewsContent | null>(null);
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

          <h1 className="text-3xl font-bold mb-2">{news.title}</h1>
          <p className="text-gray-600">{news.description}</p>
        </div>
      </div>

      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* メディアセクション */}
          {news.imageUrl && (
            <div className="p-6">
              <div className="relative h-64 md:h-96">
                {news.imageUrl && (
                  news.id.startsWith('newsapi-') ? (
                    // 外部ニュースの画像は直接表示
                    <img
                      src={news.imageUrl}
                      alt={news.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    // 内部ニュースの画像はNext.js Image最適化を使用
                    <Image
                      src={news.imageUrl}
                      alt={news.title}
                      fill
                      className="object-cover rounded-lg"
                    />
                  )
                )}
              </div>
            </div>
          )}

          {/* 本文 */}
          <div className="p-6 border-t">
            <h2 className="text-xl font-semibold mb-4">本文</h2>
            <div className="prose max-w-none">
              <p className="whitespace-pre-line">{news.content}</p>
            </div>
          </div>

          {/* メタ情報 */}
          <div className="p-6 border-t bg-gray-50">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-2">
                {news?.tags?.map((tag) => (
                  <span key={tag} className="text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
              <time dateTime={news.createdAt}>
                {new Date(news.createdAt).toLocaleDateString()}
              </time>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
