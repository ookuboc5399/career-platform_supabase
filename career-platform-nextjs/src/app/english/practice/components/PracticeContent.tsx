'use client';

import { useState, useMemo } from 'react';
import { EnglishContent, EnglishProgress } from '@/types/api';
import { updateEnglishProgress } from '@/lib/api';

const YEARS = Array.from({ length: 2024 - 2009 + 1 }, (_, i) => 2024 - i);
const TERMS = ['spring', 'fall'] as const;
const CATEGORIES = ['文法', '読解', 'リスニング', '語彙'] as const;

const calculateScore = (correct: number, attempts: number) => {
  if (attempts === 0) return 0;
  return Math.floor((correct / attempts) * 100);
};

interface PracticeContentProps {
  initialContents: EnglishContent[];
  initialProgress: EnglishProgress | null;
}

export default function PracticeContent({ initialContents, initialProgress }: PracticeContentProps) {
  const [contents] = useState<EnglishContent[]>(initialContents);
  const [progress, setProgress] = useState<EnglishProgress | null>(initialProgress);
  const [selectedContent, setSelectedContent] = useState<EnglishContent | null>(null);
  const [selectedExerciseIndex, setSelectedExerciseIndex] = useState<number>(-1);
  const [selectedAnswer, setSelectedAnswer] = useState<number>(-1);
  const [showExplanation, setShowExplanation] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // フィルター
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedTerm, setSelectedTerm] = useState<typeof TERMS[number] | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<typeof CATEGORIES[number] | null>(null);

  const filteredContents = useMemo(() => {
    return contents.filter((content: EnglishContent) => {
      if (selectedYear && content.year !== selectedYear) return false;
      if (selectedTerm && content.term !== selectedTerm) return false;
      if (selectedCategory && content.category !== selectedCategory) return false;
      return true;
    });
  }, [contents, selectedYear, selectedTerm, selectedCategory]);

  const handleAnswerSubmit = async () => {
    if (!selectedContent || !progress || selectedExerciseIndex === -1 || selectedAnswer === -1) return;

    const exercise = selectedContent.exercises[selectedExerciseIndex];
    const isCorrect = selectedAnswer === exercise.correctAnswer;
    const category = exercise.category || 'general';

    try {
      const currentStats = progress.categoryScores?.[category] || { attempts: 0, correct: 0, score: 0 };
      const newStats = {
        attempts: currentStats.attempts + 1,
        correct: currentStats.correct + (isCorrect ? 1 : 0),
        score: 0, // 一時的な値、サーバーサイドで計算
      };

      const updatedProgress = await updateEnglishProgress(
        'user1',
        selectedContent.id,
        {
          ...(isCorrect && {
            completedExercises: [...progress.completedExercises, exercise.id],
          }),
          categoryScores: {
            ...progress.categoryScores,
            [category]: newStats,
          },
        }
      );
      setProgress(updatedProgress);
    } catch (error) {
      console.error('Error updating progress:', error);
      setError('Failed to update progress');
    }

    setShowExplanation(true);
  };

  const handleNextExercise = () => {
    setSelectedAnswer(-1);
    setShowExplanation(false);
    if (!selectedContent) return;
    
    setSelectedExerciseIndex(prev => {
      if (prev < selectedContent.exercises.length - 1) {
        return prev + 1;
      } else {
        setSelectedContent(null);
        return -1;
      }
    });
  };

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* フィルターセクション */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-wrap gap-4">
          <select
            value={selectedYear || ''}
            onChange={(e) => setSelectedYear(e.target.value ? Number(e.target.value) : null)}
            className="rounded-lg border border-gray-300 px-4 py-2"
          >
            <option value="">年度を選択</option>
            {YEARS.map(year => (
              <option key={year} value={year}>{year}年</option>
            ))}
          </select>

          <select
            value={selectedTerm || ''}
            onChange={(e) => setSelectedTerm(e.target.value as typeof TERMS[number] || null)}
            className="rounded-lg border border-gray-300 px-4 py-2"
          >
            <option value="">時期を選択</option>
            {TERMS.map(term => (
              <option key={term} value={term}>
                {term === 'spring' ? '春期' : '秋期'}
              </option>
            ))}
          </select>

          <select
            value={selectedCategory || ''}
            onChange={(e) => setSelectedCategory(e.target.value as typeof CATEGORIES[number] || null)}
            className="rounded-lg border border-gray-300 px-4 py-2"
          >
            <option value="">カテゴリを選択</option>
            {CATEGORIES.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {progress?.categoryScores && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Object.entries(progress.categoryScores).map(([category, stats]) => {
              const score = calculateScore(stats.correct, stats.attempts);
              return (
                <div key={category} className="bg-white rounded-lg shadow p-4">
                  <h3 className="font-medium text-gray-900">{category}</h3>
                  <div className="mt-2 text-sm text-gray-600">
                    <p>正答率: {score}%</p>
                    <p>回答数: {stats.attempts}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 問題一覧または問題解答セクション */}
      {selectedContent && selectedExerciseIndex !== -1 ? (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              {selectedContent.year}年 {selectedContent.term === 'spring' ? '春期' : '秋期'} - 
              問題 {selectedExerciseIndex + 1}
            </h2>
            <button
              onClick={() => {
                setSelectedContent(null);
                setSelectedExerciseIndex(-1);
              }}
              className="text-gray-600 hover:text-gray-900"
            >
              問題一覧に戻る
            </button>
          </div>

          <div className="space-y-6">
            <p className="text-lg">{selectedContent.exercises[selectedExerciseIndex].question}</p>

            <div className="space-y-4">
              {selectedContent.exercises[selectedExerciseIndex].choices.map((choice, index) => (
                <button
                  key={choice.id}
                  onClick={() => !showExplanation && setSelectedAnswer(index)}
                  disabled={showExplanation}
                  className={`w-full text-left p-4 rounded-lg border ${
                    selectedAnswer === index
                      ? showExplanation
                        ? index === selectedContent.exercises[selectedExerciseIndex].correctAnswer
                          ? 'border-green-500 bg-green-50'
                          : 'border-red-500 bg-red-50'
                        : 'border-blue-500 bg-blue-50'
                      : showExplanation && index === selectedContent.exercises[selectedExerciseIndex].correctAnswer
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-blue-500'
                  }`}
                >
                  {choice.text}
                </button>
              ))}
            </div>

            {!showExplanation && selectedAnswer !== -1 && (
              <button
                onClick={handleAnswerSubmit}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                回答を確定
              </button>
            )}

            {showExplanation && (
              <div className="mt-6">
                <h3 className="font-semibold mb-2">解説</h3>
                <p className="text-gray-600">
                  {selectedContent.exercises[selectedExerciseIndex].explanation}
                </p>
                <button
                  onClick={handleNextExercise}
                  className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  次の問題へ
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContents.map((content: EnglishContent) => {
            const completedCount = progress?.completedExercises.filter(id => 
              content.exercises.some(ex => ex.id === id)
            ).length || 0;

            return (
              <div
                key={content.id}
                className="bg-white rounded-lg shadow-sm border p-6 hover:border-blue-500 cursor-pointer"
                onClick={() => {
                  setSelectedContent(content);
                  setSelectedExerciseIndex(0);
                }}
              >
                <h2 className="text-lg font-semibold mb-2">
                  {content.year}年 {content.term === 'spring' ? '春期' : '秋期'}
                </h2>
                <p className="text-gray-600 mb-4">{content.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {content.exercises.length}問
                  </span>
                  {progress && (
                    <span className="text-sm text-gray-500">
                      進捗: {completedCount} / {content.exercises.length}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
