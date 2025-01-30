'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card } from "@/components/ui/card";

interface VocabularySet {
  id: number;
  title: string;
  description: string;
  category: string;
  wordCount: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export default function VocabularyPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const vocabularySets: VocabularySet[] = [
    {
      id: 1,
      title: 'TOEIC頻出単語 Part 1',
      description: 'TOEICテストで頻出の基本的なビジネス用語を学びます。',
      category: 'TOEIC',
      wordCount: 50,
      difficulty: 'beginner',
    },
    {
      id: 2,
      title: 'ビジネス会話で使える表現',
      description: 'ビジネスシーンで役立つ実践的な表現を学びます。',
      category: 'ビジネス',
      wordCount: 40,
      difficulty: 'intermediate',
    },
    {
      id: 3,
      title: '日常会話の基本フレーズ',
      description: '日常生活で使用頻度の高い表現を学びます。',
      category: '日常会話',
      wordCount: 30,
      difficulty: 'beginner',
    },
    {
      id: 4,
      title: 'アカデミック英語の語彙',
      description: '学術論文や専門書で使用される高度な語彙を学びます。',
      category: 'アカデミック',
      wordCount: 45,
      difficulty: 'advanced',
    },
    {
      id: 5,
      title: '旅行で使える表現',
      description: '海外旅行で役立つ実用的な表現を学びます。',
      category: '旅行',
      wordCount: 35,
      difficulty: 'beginner',
    },
    {
      id: 6,
      title: 'IT業界の専門用語',
      description: 'IT分野で使用される専門的な用語を学びます。',
      category: 'IT',
      wordCount: 40,
      difficulty: 'advanced',
    },
  ];

  const categories = ['TOEIC', 'ビジネス', '日常会話', 'アカデミック', '旅行', 'IT'];

  const filteredSets = vocabularySets.filter(set => {
    const categoryMatch = selectedCategory === 'all' || set.category === selectedCategory;
    const difficultyMatch = selectedDifficulty === 'all' || set.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
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

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return '初級';
      case 'intermediate':
        return '中級';
      case 'advanced':
        return '上級';
      default:
        return difficulty;
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">単語学習</h1>
        <Link
          href="/english/question"
          className="text-blue-500 hover:text-blue-700 flex items-center"
        >
          ← 問題一覧に戻る
        </Link>
      </div>

      {/* フィルター */}
      <div className="mb-8 space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">難易度</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedDifficulty('all')}
              className={`px-4 py-2 rounded-full ${
                selectedDifficulty === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-100'
              }`}
            >
              すべて
            </button>
            {['beginner', 'intermediate', 'advanced'].map((difficulty) => (
              <button
                key={difficulty}
                onClick={() => setSelectedDifficulty(difficulty)}
                className={`px-4 py-2 rounded-full ${
                  selectedDifficulty === difficulty ? 'bg-blue-500 text-white' : getDifficultyColor(difficulty)
                }`}
              >
                {getDifficultyText(difficulty)}
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

      {/* 単語セット一覧 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSets.map((set) => (
          <Link key={set.id} href={`/english/question/vocabulary/${set.id}`}>
            <Card className="cursor-pointer hover:shadow-lg transition-all p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">{set.title}</h3>
                <span className={`text-sm px-3 py-1 rounded-full ${getDifficultyColor(set.difficulty)}`}>
                  {getDifficultyText(set.difficulty)}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{set.description}</p>
              <div className="flex items-center justify-between">
                <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                  {set.category}
                </span>
                <span className="text-gray-500 text-sm">
                  {set.wordCount}単語
                </span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
