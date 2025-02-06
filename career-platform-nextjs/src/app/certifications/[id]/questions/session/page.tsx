"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface Option {
  text: string;
  imageUrl: string | null;
}

interface Question {
  id: string;
  certificationId: string;
  questionNumber: number;
  question: string;
  questionImage: string | null;
  options: Option[];
  correctAnswers: number[];
  explanation: string;
  explanationImages: string[];
  year: string;
  category: string;
  mainCategory: string;
  createdAt: string;
  updatedAt: string;
}

export default function QuestionSessionPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const certificationId = params.id;
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchQuestions();
  }, [certificationId, searchParams]);

  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      const questionIds = searchParams.get('ids')?.split(',') || [];
      if (questionIds.length === 0) {
        setError('問題が選択されていません');
        return;
      }
      console.log('Selected question IDs:', questionIds);

      const response = await fetch(`/api/certifications/${certificationId}/questions`);
      if (!response.ok) throw new Error('Failed to fetch questions');
      const allQuestions = await response.json();

      console.log('All questions:', allQuestions);

      if (!Array.isArray(allQuestions)) {
        setError('問題データの形式が不正です');
        return;
      }

      // 選択された問題を収集
      const selectedQuestions = allQuestions
        .filter((question: Question) => questionIds.includes(question.id));

      if (selectedQuestions.length === 0) {
        setError('選択された問題が見つかりません');
        return;
      }

      // 問題をシャッフル
      const shuffledQuestions = selectedQuestions.sort(() => Math.random() - 0.5);
      console.log('Shuffled questions:', shuffledQuestions);
      setQuestions(shuffledQuestions);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setError('問題の取得に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = async (choiceIndex: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(choiceIndex);
    setShowExplanation(true);

    try {
      await fetch('/api/certifications/questions/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          certificationId,
          questionId: questions[currentIndex].id,
          selectedAnswer: choiceIndex,
        }),
      });
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      // 全問終了
      router.push(`/certifications/${certificationId}/questions/result`);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <p className="text-gray-500">{error}</p>
          <button
            onClick={() => router.push(`/certifications/${certificationId}/questions`)}
            className="mt-4 text-blue-500 hover:text-blue-600"
          >
            問題選択に戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-blue-600 text-white py-4">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => router.push(`/certifications/${certificationId}/questions`)}
              className="text-white/80 hover:text-white flex items-center gap-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              終了
            </button>
            <div className="font-medium">
              自由演習 {currentIndex + 1}/{questions.length}
            </div>
            <div className="text-white/80">
              {currentQuestion.year}
            </div>
          </div>
          <div className="h-1 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* 問題文 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="text-sm text-gray-500 mb-4">
            {currentQuestion.category}
          </div>
          <p className="text-lg font-medium mb-6">{currentQuestion.question}</p>
          <div className="space-y-4">
            {currentQuestion.options.map((option, index) => {
              const letter = String.fromCharCode(65 + index);
              const isSelected = selectedAnswer === index;
              const isCorrect = currentQuestion.correctAnswers.includes(index);
              const showResult = selectedAnswer !== null;

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={selectedAnswer !== null}
                  className={`w-full p-4 border-2 rounded-lg text-left flex items-center gap-4 transition-colors ${
                    showResult
                      ? isCorrect
                        ? 'bg-green-50 border-green-500 text-green-800'
                        : isSelected
                        ? 'bg-red-50 border-red-500 text-red-800'
                        : 'border-transparent'
                      : 'hover:border-blue-500 hover:text-blue-600'
                  }`}
                >
                  <span className="font-semibold min-w-[24px]">{letter}.</span>
                  <span className="flex-1">
                    <span>{option.text}</span>
                    {option.imageUrl && (
                      <div className="mt-2">
                        <Image
                          src={option.imageUrl}
                          alt={`選択肢${letter}の画像`}
                          width={200}
                          height={200}
                          className="rounded-md"
                        />
                      </div>
                    )}
                  </span>
                  {showResult && isSelected && (
                    <span className="ml-auto">
                      {isCorrect ? (
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 解説 */}
        {showExplanation && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
              {selectedAnswer !== null && currentQuestion.correctAnswers.includes(selectedAnswer) ? (
                <>
                  <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium text-green-600">正解です！</span>
                </>
              ) : (
                <>
                  <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium text-red-600">
                    不正解です。正解は {currentQuestion.correctAnswers.map(i => String.fromCharCode(65 + i)).join(' または ')} です。
                  </span>
                </>
              )}
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="font-medium text-gray-700 mb-2">解説:</p>
              <p className="text-gray-600">{currentQuestion.explanation}</p>
            </div>
          </div>
        )}

        {/* アクションボタン */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
          <div className="container max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            {selectedAnswer === null ? (
              <button
                onClick={() => handleNext()}
                className="text-gray-500 hover:text-gray-700"
              >
                スキップ
              </button>
            ) : (
              <div />
            )}
            {selectedAnswer !== null && (
              <button
                onClick={handleNext}
                className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                {currentIndex < questions.length - 1 ? '次の問題へ' : '結果を見る'}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
