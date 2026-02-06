'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from "@/components/ui/card";
import { Question } from '@/types/english';

const categoryLabels: { [key: string]: string } = {
  'daily': '日常',
  'self-introduction': '自己紹介',
  'business': 'ビジネス',
  'academic': 'アカデミック',
  'review': 'レビュー'
};

const categoryIcons: { [key: string]: string } = {
  'daily': '🌞',
  'self-introduction': '👋',
  'business': '💼',
  'academic': '📚',
  'review': '⭐'
};

export default function QuestionPage({ params }: { params: { category: string; id: string } }) {
  const [question, setQuestion] = useState<Question | null>(null);
  const [questionsInCategory, setQuestionsInCategory] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('/api/admin/english/questions');
        if (!response.ok) throw new Error('Failed to fetch questions');
        const data = await response.json();
        // 同じカテゴリーと難易度の問題をフィルタリング
        const currentQuestion = data.find((q: Question) => q.id === params.id);
        if (!currentQuestion) {
          throw new Error('Question not found');
        }

        // 同じカテゴリーと難易度の問題をフィルタリング
        const questions = data.filter((q: Question) => 
          q.type === 'writing' &&
          (q.category === params.category || 
           (params.category === 'daily' && q.category === undefined)) &&
          q.difficulty === currentQuestion.difficulty
        );

        setQuestionsInCategory(questions);
        const index = questions.findIndex((q: Question) => q.id === params.id);
        setCurrentIndex(index);
        setQuestion(questions[index]);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, [params.id, params.category]);

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

  if (!question) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{categoryIcons[params.category]}</span>
          <div>
            <h1 className="text-3xl font-bold">{categoryLabels[params.category]}の英作文</h1>
            <div className="flex gap-2 mt-2">
              <span className={`text-sm px-3 py-1 rounded-full ${getDifficultyColor(question.difficulty || 'beginner')}`}>
                {getDifficultyText(question.difficulty || 'beginner')}
              </span>
            </div>
          </div>
        </div>
        <Link
          href={`/english/question/writing/${params.category}`}
          className="text-blue-500 hover:text-blue-700 flex items-center"
        >
          ← 問題一覧に戻る
        </Link>
      </div>

      <div className="space-y-8">
        {/* 進捗バー */}
        <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
          <div
            className="bg-blue-500 h-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questionsInCategory.length) * 100}%` }}
          />
        </div>

        {/* 進捗テキスト */}
        <div className="text-center">
          <p className="text-gray-600">
            {currentIndex + 1} / {questionsInCategory.length}問目
          </p>
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">問題</h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-600 mb-2">日本語</p>
              <p className="text-lg">{question.content.japanese}</p>
              {/* ナビゲーションボタン */}
        <div className="flex justify-between items-center mt-8">
          {currentIndex > 0 && (
            <Link
              href={`/english/question/writing/${params.category}/${questionsInCategory[currentIndex - 1].id}`}
              className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              前の問題
            </Link>
          )}
          {currentIndex < questionsInCategory.length - 1 && (
            <Link
              href={`/english/question/writing/${params.category}/${questionsInCategory[currentIndex + 1].id}`}
              className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors ml-auto"
            >
              次の問題
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          )}
          {currentIndex === questionsInCategory.length - 1 && (
            <Link
              href={`/english/question/writing/${params.category}`}
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors ml-auto"
            >
              ドリル完了！
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </Link>
          )}
        </div>
      </div>
            <div>
              <p className="text-gray-600 mb-2">英語</p>
              <p className="text-lg font-medium">{question.content.english}</p>
            </div>
          </div>
        </Card>

        {question.content.explanation && (
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">解説</h2>
            <p className="text-gray-800 whitespace-pre-line">{question.content.explanation}</p>
          </Card>
        )}
      </div>
    </div>
  );
}
