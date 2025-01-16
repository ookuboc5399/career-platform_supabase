'use client';

import { use } from 'react';
import { useState } from 'react';
import Link from 'next/link';

interface ProgrammingContent {
  id: string;
  title: string;
  description: string;
  chapters: {
    id: string;
    title: string;
    description: string;
    duration: string;
    exercises: number;
  }[];
}

const programmingContents: { [key: string]: ProgrammingContent } = {
  'python': {
    id: 'python',
    title: 'Python入門',
    description: 'データサイエンス、機械学習、Webアプリケーション開発で人気のPythonを基礎から学びます。',
    chapters: [
      {
        id: '1',
        title: 'Pythonとは？',
        description: 'このコースの目的、対象者、学習方法についての解説と、Pythonの概要について解説します。',
        duration: '2:43',
        exercises: 0,
      },
      {
        id: '2',
        title: 'Pythonでプログラムを書いてみよう',
        description: 'オンラインエディタを使って実際にPythonプログラムを書いていきます。まずは各言語を学ぶときのお約束のHello world!を書いてみよう！',
        duration: '3:21',
        exercises: 5,
      },
      {
        id: '3',
        title: 'コメントでプログラムを見やすく！',
        description: 'プログラムを読む際に何をやっているか解りやすいように、コードにコメントを付ける方法を学びます。',
        duration: '3:48',
        exercises: 2,
      },
    ],
  },
  'javascript': {
    id: 'javascript',
    title: 'JavaScript入門',
    description: 'Web開発に不可欠なJavaScriptの基礎から応用までを実践的に学習します。',
    chapters: [
      {
        id: '1',
        title: 'JavaScriptの基礎',
        description: 'JavaScriptの基本的な概念と、Webブラウザでの実行方法について学びます。',
        duration: '3:15',
        exercises: 0,
      },
      {
        id: '2',
        title: '変数とデータ型',
        description: 'JavaScriptの変数宣言と基本的なデータ型について学習します。',
        duration: '4:10',
        exercises: 4,
      },
      {
        id: '3',
        title: '関数とスコープ',
        description: '関数の定義方法と変数のスコープについて理解を深めます。',
        duration: '5:30',
        exercises: 3,
      },
    ],
  },
};

export default function ProgrammingContentPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const resolvedParams = use(Promise.resolve(params));
  const [level, setLevel] = useState(1);
  const [completedChapters, setCompletedChapters] = useState(0);
  const content = programmingContents[resolvedParams.id];

  if (!content) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">コンテンツが見つかりません</h3>
              <div className="mt-2 text-sm text-red-700">
                指定されたプログラミング言語のコンテンツは存在しないか、削除された可能性があります。
              </div>
              <div className="mt-4">
                <Link
                  href="/programming"
                  className="text-sm font-medium text-red-700 hover:text-red-600"
                >
                  プログラミング学習トップに戻る
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {content.title}
            </h1>
            <p className="text-gray-600">
              {content.description}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-yellow-500 mb-1">Lv.{level}</div>
            <div className="text-sm text-gray-500">
              完了: {completedChapters}/{content.chapters.length} チャプター
            </div>
          </div>
        </div>

        <div className="h-2 bg-gray-200 rounded-full mb-6">
          <div 
            className="h-2 bg-green-500 rounded-full"
            style={{ width: `${(completedChapters / content.chapters.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="space-y-4">
        {content.chapters.map((chapter, index) => (
          <Link 
            key={chapter.id}
            href={`/programming/${resolvedParams.id}/chapters/${chapter.id}`}
            className="block"
          >
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <div className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                        Chapter {index + 1}
                      </div>
                      <div className="ml-3 text-gray-500 text-sm">
                        {chapter.duration}
                      </div>
                      {chapter.exercises > 0 && (
                        <div className="ml-3 text-gray-500 text-sm">
                          演習: {chapter.exercises}問
                        </div>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {chapter.title}
                    </h3>
                    <p className="text-gray-600">
                      {chapter.description}
                    </p>
                  </div>
                  <div className="ml-6">
                    <div className="bg-gray-100 text-gray-400 rounded-full p-2">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
