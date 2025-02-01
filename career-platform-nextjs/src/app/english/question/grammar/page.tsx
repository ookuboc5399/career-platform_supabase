'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card } from "@/components/ui/card";

interface Question {
  id: number;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
}

export default function GrammarPage() {
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const questions: Question[] = [
    {
      id: 1,
      title: '基本時制の使い分け',
      description: '現在形・過去形・未来形の基本的な使い方を学びます。',
      level: 'beginner',
      category: '時制',
    },
    {
      id: 2,
      title: '完了形の理解',
      description: '現在完了形・過去完了形の概念と使用場面を学びます。',
      level: 'intermediate',
      category: '時制',
    },
    {
      id: 3,
      title: '仮定法の活用',
      description: '仮定法過去・仮定法過去完了の使い方を学びます。',
      level: 'advanced',
      category: '仮定法',
    },
    {
      id: 4,
      title: '関係代名詞の基礎',
      description: 'who, which, thatの使い分けを学びます。',
      level: 'beginner',
      category: '関係詞',
    },
    {
      id: 5,
      title: '助動詞の使い方',
      description: 'can, may, must, shouldなどの使い分けを学びます。',
      level: 'beginner',
      category: '助動詞',
    },
    {
      id: 6,
      title: '受動態の構文',
      description: '能動態から受動態への変換と使用場面を学びます。',
      level: 'intermediate',
      category: '受動態',
    },
  ];

  const categories = ['時制', '仮定法', '関係詞', '助動詞', '受動態'];

  const filteredQuestions = questions.filter(question => {
    const levelMatch = selectedLevel === 'all' || question.level === selectedLevel;
    const categoryMatch = selectedCategory === 'all' || question.category === selectedCategory;
    return levelMatch && categoryMatch;
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case 'beginner':
        return '初級';
      case 'intermediate':
        return '中級';
      case 'advanced':
        return '上級';
      default:
        return level;
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">文法学習</h1>
        <div className="flex items-center gap-4">
          <Link
            href="/english/question/grammar/session"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            総合問題に挑戦
          </Link>
          <Link
            href="/english/question"
            className="text-blue-500 hover:text-blue-700 flex items-center"
          >
            ← 問題一覧に戻る
          </Link>
        </div>
      </div>

      {/* フィルター */}
      <div className="mb-8 space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">レベル</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedLevel('all')}
              className={`px-4 py-2 rounded-full ${
                selectedLevel === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-100'
              }`}
            >
              すべて
            </button>
            {['beginner', 'intermediate', 'advanced'].map((level) => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`px-4 py-2 rounded-full ${
                  selectedLevel === level ? 'bg-blue-500 text-white' : getLevelColor(level)
                }`}
              >
                {getLevelText(level)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">カテゴリー</h2>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full ${
                selectedCategory === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-100'
              }`}
            >
              すべて
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full ${
                  selectedCategory === category ? 'bg-blue-500 text-white' : 'bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 問題一覧 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredQuestions.map((question) => (
          <Link key={question.id} href={`/english/question/grammar/${question.id}`}>
            <Card className="cursor-pointer hover:shadow-lg transition-all p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">{question.title}</h3>
                <span className={`text-sm px-3 py-1 rounded-full ${getLevelColor(question.level)}`}>
                  {getLevelText(question.level)}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{question.description}</p>
              <div className="flex items-center gap-2">
                <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                  {question.category}
                </span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
