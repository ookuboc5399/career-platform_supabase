'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { NewsContent } from '@/types/english';

export default function NewsPage() {
  const [news, setNews] = useState<NewsContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await fetch('/api/english/news');
      if (!response.ok) throw new Error('Failed to fetch news');
      const data = await response.json();
      setNews(data);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredNews = news.filter(item => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (selectedLevel !== 'all' && item.level !== selectedLevel) return false;
    return true;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // 最新のニュースを取得
  const latestNews = filteredNews[0];
  // その他のニュース
  const otherNews = filteredNews.slice(1);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-4">英語ニュース</h1>
          <p className="text-xl text-blue-100">
            世界のニュースを英語で読んで、リーディング力を向上させましょう
          </p>
        </div>
      </div>

      {/* フィルター */}
      <div className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border rounded-full bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <option value="all">すべてのカテゴリー</option>
              <option value="world">世界</option>
              <option value="business">ビジネス</option>
              <option value="technology">テクノロジー</option>
              <option value="science">科学</option>
              <option value="entertainment">エンターテイメント</option>
            </select>

            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-4 py-2 border rounded-full bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <option value="all">すべてのレベル</option>
              <option value="beginner">初級</option>
              <option value="intermediate">中級</option>
              <option value="advanced">上級</option>
            </select>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="container mx-auto px-4 py-8">
        {/* 最新ニュース */}
        {latestNews && (
          <Link
            href={`/english/news/${latestNews.id}`}
            className="block mb-12 group"
          >
            <div className="grid md:grid-cols-2 gap-8 bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow">
              <div className="relative h-64 md:h-full min-h-[300px]">
                <Image
                  src={latestNews.imageUrl || 'https://englishimages.blob.core.windows.net/news/placeholder.jpg'}
                  alt={latestNews.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent md:hidden"></div>
              </div>
              <div className="p-6 md:p-8 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {latestNews.category}
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    {latestNews.level}
                  </span>
                  {latestNews.videoUrl && (
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      </svg>
                      動画付き
                    </span>
                  )}
                </div>
                <h2 className="text-3xl font-bold mb-4 group-hover:text-blue-600 transition-colors">
                  {latestNews.title}
                </h2>
                <p className="text-gray-600 text-lg mb-6 line-clamp-3">
                  {latestNews.description}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    {latestNews.tags.map((tag) => (
                      <span key={tag} className="text-blue-600">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <time dateTime={latestNews.createdAt} className="font-medium">
                    {new Date(latestNews.createdAt).toLocaleDateString()}
                  </time>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* その他のニュース */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {otherNews.map((item) => (
            <Link
              key={item.id}
              href={`/english/news/${item.id}`}
              className="group"
            >
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow h-full flex flex-col">
                <div className="relative h-48">
                  <Image
                    src={item.imageUrl || 'https://englishimages.blob.core.windows.net/news/placeholder.jpg'}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {item.category}
                    </span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      {item.level}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold mb-3 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h2>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
                    {item.description}
                  </p>
                  {item.videoUrl && (
                    <div className="flex items-center gap-1 text-sm text-purple-600 mb-4">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      </svg>
                      動画付き
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm text-gray-500 mt-auto">
                    <div className="flex items-center gap-2">
                      {item.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="text-blue-600">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <time dateTime={item.createdAt} className="font-medium">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </time>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
