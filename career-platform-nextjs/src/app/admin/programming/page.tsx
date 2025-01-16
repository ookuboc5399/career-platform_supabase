'use client';

import { useState } from 'react';
import Link from 'next/link';

type Language = {
  id: string;
  name: string;
  category: 'language' | 'framework';
};

const LANGUAGES: Language[] = [
  { id: 'python', name: 'Python', category: 'language' },
  { id: 'javascript', name: 'JavaScript', category: 'language' },
  { id: 'typescript', name: 'TypeScript', category: 'language' },
  { id: 'react', name: 'React', category: 'framework' },
  { id: 'nextjs', name: 'Next.js', category: 'framework' },
  { id: 'django', name: 'Django', category: 'framework' },
];

export default function AdminProgrammingPage() {
  const [activeCategory, setActiveCategory] = useState<'language' | 'framework'>('language');

  const filteredLanguages = LANGUAGES.filter(lang => lang.category === activeCategory);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">プログラミング学習コンテンツ管理</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          onClick={() => {/* TODO: 新規コンテンツ追加モーダルを表示 */}}
        >
          新規コンテンツ追加
        </button>
      </div>

      {/* タブナビゲーション */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveCategory('language')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeCategory === 'language'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            プログラミング言語
          </button>
          <button
            onClick={() => setActiveCategory('framework')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeCategory === 'framework'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            フレームワーク
          </button>
        </nav>
      </div>

      {/* 言語/フレームワーク一覧 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLanguages.map((lang) => (
          <div key={lang.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-gray-900">{lang.name}</h2>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                  {lang.category === 'language' ? '言語' : 'フレームワーク'}
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>チャプター数</span>
                  <span>10</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>総学習時間</span>
                  <span>20時間</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>最終更新日</span>
                  <span>2024-01-14</span>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <Link
                  href={`/admin/programming/${lang.id}/chapters`}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  チャプター管理
                </Link>
                <button
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  設定
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 新規言語/フレームワーク追加カード */}
      <div className="mt-6">
        <button
          className="w-full p-6 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          <span className="mt-2 block text-sm font-medium text-gray-900">
            新しい{activeCategory === 'language' ? '言語' : 'フレームワーク'}を追加
          </span>
        </button>
      </div>
    </div>
  );
}
