'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Question } from '@/types/english';
import Image from 'next/image';

interface Answer {
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
}

export default function GrammarSessionPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get('category');

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/admin/english/questions?type=grammar${category !== 'all' ? `&category=${category}` : ''}`);
      if (!response.ok) throw new Error('Failed to fetch questions');
      const data = await response.json();
      // ランダムに10問を選択
      const shuffled = [...data].sort(() => 0.5 - Math.random());
      setQuestions(shuffled.slice(0, 10));
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (!showAnswer) {
      setSelectedAnswer(answerIndex);
    }
  };

  const handleCheckAnswer = () => {
    if (selectedAnswer === null) return;

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = currentQuestion.content.correctAnswers.includes(selectedAnswer + 1);

    setAnswers([
      ...answers,
      {
        questionId: currentQuestion.id,
        selectedAnswer: selectedAnswer + 1,
        isCorrect,
      },
    ]);

    setShowAnswer(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex === questions.length - 1) {
      // 全問題が終了したら進捗を保存
      saveProgress(answers, answers.filter(answer => answer.isCorrect).length);
      router.push('/english/question/grammar/session');
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowAnswer(false);
    }
  };

  const saveProgress = async (questionAnswers: Answer[], score: number) => {
    try {
      const response = await fetch('/api/english/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'grammar',
          category: category || 'all',
          questions: questionAnswers,
          score,
          totalQuestions: questions.length,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save progress');
      }
    } catch (error) {
      console.error('Error saving progress:', error);
      // エラーが発生しても進捗は保存できなかっただけなので、
      // ユーザーには通知するだけで次の画面に進ませる
      alert('進捗の保存に失敗しました。');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto p-6">
        <div className="mb-4 flex justify-between items-center">
          <span className="text-sm text-gray-500">
            問題 {currentQuestionIndex + 1} / {questions.length}
          </span>
          <span className="text-sm px-2 py-1 rounded bg-blue-100 text-blue-800">
            {category === 'tense' ? '時制' :
             category === 'subjunctive' ? '仮定法' :
             category === 'relative' ? '関係詞' :
             category === 'modal' ? '助動詞' :
             category === 'passive' ? '受動態' : 'その他'}
          </span>
        </div>

        {currentQuestion.imageUrl && (
          <div className="mb-4">
            <Image
              src={currentQuestion.imageUrl}
              alt="Question"
              width={400}
              height={300}
              className="rounded-lg"
            />
          </div>
        )}

        <div className="space-y-4 mb-6">
          {currentQuestion.content.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={showAnswer}
              className={`w-full p-4 text-left rounded-lg border transition-colors ${
                showAnswer
                  ? currentQuestion.content.correctAnswers.includes(index + 1)
                    ? 'bg-green-50 border-green-200'
                    : selectedAnswer === index
                    ? 'bg-red-50 border-red-200'
                    : 'bg-gray-50'
                  : selectedAnswer === index
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-200'
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        {showAnswer && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-2">解説</h3>
            <p>{currentQuestion.content.explanation}</p>
          </div>
        )}

        <div className="flex justify-end">
          {!showAnswer ? (
            <Button
              onClick={handleCheckAnswer}
              disabled={selectedAnswer === null}
            >
              解答を確認
            </Button>
          ) : (
            <Button onClick={handleNext}>
              {currentQuestionIndex === questions.length - 1 ? '終了' : '次へ'}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
