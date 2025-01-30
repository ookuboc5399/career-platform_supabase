'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card } from "@/components/ui/card";

interface WritingTask {
  id: number;
  title: string;
  description: string;
  category: string;
  wordLimit: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
}

export default function WritingPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const writingTasks: WritingTask[] = [
    {
      id: 1,
      title: '自己紹介文を書く',
      description: '自分の経歴、趣味、将来の目標などについて英語で紹介文を書きます。',
      category: '自己紹介',
      wordLimit: 150,
      difficulty: 'beginner',
      estimatedTime: 20,
    },
    {
      id: 2,
      title: 'ビジネスメールの作成',
      description: '取引先への問い合わせメールを適切な形式と表現で作成します。',
      category: 'ビジネス',
      wordLimit: 200,
      difficulty: 'intermediate',
      estimatedTime: 30,
    },
    {
      id: 3,
      title: '意見文を書く',
      description: '与えられたトピックについて、自分の意見を論理的に展開します。',
      category: 'アカデミック',
      wordLimit: 300,
      difficulty: 'advanced',
      estimatedTime: 45,
    },
    {
      id: 4,
      title: '日記を書く',
      description: '日常生活での出来事や感想を英語で表現します。',
      category: '日常',
      wordLimit: 100,
      difficulty: 'beginner',
      estimatedTime: 15,
    },
    {
      id: 5,
      title: 'レビューを書く',
      description: '映画や本のレビューを英語で書きます。',
      category: 'レビュー',
      wordLimit: 250,
      difficulty: 'intermediate',
      estimatedTime: 35,
    },
    {
      id: 6,
      title: '研究要旨の作成',
      description: '研究内容を英語で簡潔にまとめます。',
      category: 'アカデミック',
      wordLimit: 400,
      difficulty: 'advanced',
      estimatedTime: 60,
    },
  ];

  const categories = ['自己紹介', 'ビジネス', 'アカデミック', '日常', 'レビュー'];

  const filteredTasks = writingTasks.filter(task => {
    const categoryMatch = selectedCategory === 'all' || task.category === selectedCategory;
    const difficultyMatch = selectedDifficulty === 'all' || task.difficulty === selectedDifficulty;
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
        <h1 className="text-3xl font-bold">英作文</h1>
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

      {/* 課題一覧 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.map((task) => (
          <Link key={task.id} href={`/english/question/writing/${task.id}`}>
            <Card className="cursor-pointer hover:shadow-lg transition-all p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">{task.title}</h3>
                <span className={`text-sm px-3 py-1 rounded-full ${getDifficultyColor(task.difficulty)}`}>
                  {getDifficultyText(task.difficulty)}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{task.description}</p>
              <div className="flex items-center justify-between">
                <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                  {task.category}
                </span>
                <div className="flex items-center gap-4">
                  <span className="text-gray-500 text-sm">
                    {task.wordLimit}語
                  </span>
                  <span className="text-gray-500 text-sm">
                    約{task.estimatedTime}分
                  </span>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
