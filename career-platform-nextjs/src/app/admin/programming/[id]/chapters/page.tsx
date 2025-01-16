'use client';

import { useState } from 'react';
import Link from 'next/link';
import AddChapterModal from './components/AddChapterModal';

interface Chapter {
  id: string;
  title: string;
  description: string;
  duration: string;
  order: number;
  exerciseCount: number;
  status: 'draft' | 'published';
}

const MOCK_CHAPTERS: Chapter[] = [
  {
    id: '1',
    title: '環境構築',
    description: '開発環境のセットアップと基本的なツールの使い方',
    duration: '30分',
    order: 1,
    exerciseCount: 2,
    status: 'published',
  },
  {
    id: '2',
    title: '基本構文',
    description: '変数、データ型、制御構文について学ぶ',
    duration: '45分',
    order: 2,
    exerciseCount: 5,
    status: 'published',
  },
  {
    id: '3',
    title: '関数とモジュール',
    description: '関数の定義と使用方法、モジュールの概念',
    duration: '60分',
    order: 3,
    exerciseCount: 4,
    status: 'draft',
  },
];

export default function ChaptersPage({ params }: { params: { id: string } }) {
  const [chapters, setChapters] = useState(MOCK_CHAPTERS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const moveChapter = (fromIndex: number, toIndex: number) => {
    const newChapters = [...chapters];
    const [movedChapter] = newChapters.splice(fromIndex, 1);
    newChapters.splice(toIndex, 0, movedChapter);

    // Update order property
    const updatedChapters = newChapters.map((chapter, index) => ({
      ...chapter,
      order: index + 1,
    }));

    setChapters(updatedChapters);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">チャプター管理</h1>
          <p className="text-gray-600 mt-1">
            {params.id.charAt(0).toUpperCase() + params.id.slice(1)}の学習コンテンツ
          </p>
        </div>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          onClick={() => setIsModalOpen(true)}
        >
          新規チャプター追加
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="space-y-4">
            {chapters.map((chapter, index) => (
              <div
                key={chapter.id}
                className="border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="p-4">
                  <div className="flex items-start">
                    <div className="flex-grow">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-medium">
                          {chapter.order}. {chapter.title}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            chapter.status === 'published'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {chapter.status === 'published' ? '公開中' : '下書き'}
                          </span>
                          <span className="text-sm text-gray-500">
                            {chapter.duration}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-4">
                        {chapter.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                          演習問題: {chapter.exerciseCount}問
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex space-x-2">
                            {index > 0 && (
                              <button
                                onClick={() => moveChapter(index, index - 1)}
                                className="text-gray-500 hover:text-gray-700"
                              >
                                ↑
                              </button>
                            )}
                            {index < chapters.length - 1 && (
                              <button
                                onClick={() => moveChapter(index, index + 1)}
                                className="text-gray-500 hover:text-gray-700"
                              >
                                ↓
                              </button>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-800">
                              編集
                            </button>
                            <button className="text-red-600 hover:text-red-800">
                              削除
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AddChapterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        languageId={params.id}
      />
    </div>
  );
}
