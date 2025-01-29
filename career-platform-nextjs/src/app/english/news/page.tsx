'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { NewsContent } from '@/types/english';

export default function NewsPage() {
  const [news, setNews] = useState<NewsContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setError(null);
        const response = await axios.get('/api/english/news');
        if (response.status !== 200) throw new Error('Failed to fetch news');
        // 公開済みのニュースのみを表示
        setNews(response.data.filter((item: NewsContent) => item.isPublished));
      } catch (error) {
        console.error('Error fetching news:', error);
        setError('ニュースの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">今日のニュース</h1>

      {news.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          現在公開中のニュースはありません。
        </div>
      ) : (
        <div className="space-y-8">
          {news.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4">{item.title}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <img
                    src={item.imageUrl}
                    alt="News visualization"
                    className="w-full rounded-lg mb-4"
                  />
                  <audio controls className="w-full">
                    <source src={item.audioUrl} type="audio/mpeg" />
                    お使いのブラウザは音声再生に対応していません。
                  </audio>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">ニュース本文</h3>
                    <p className="text-gray-700 whitespace-pre-line">{item.content}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-2">会話練習</h3>
                    <p className="text-gray-700 whitespace-pre-line">{item.conversation}</p>
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-500 text-right">
                公開日: {new Date(item.publishedAt!).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
