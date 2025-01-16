'use client';

import { useState, useEffect } from 'react';
import { Certification, CertificationQuestion } from '@/types/api';
import { getCertification, updateCertificationProgress } from '@/lib/api';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface Props {
  params: {
    id: string;
  };
}

export default function CertificationQuestionsPage({ params }: Props) {
  const [certification, setCertification] = useState<Certification | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCertification();
  }, []);

  const fetchCertification = async () => {
    try {
      const data = await getCertification(params.id);
      if (!data.questions || data.questions.length === 0) {
        notFound();
      }
      setCertification(data);
    } catch (error) {
      setError('Failed to fetch certification');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (isAnswered) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmit = async () => {
    if (selectedAnswer === null || !certification?.questions) return;

    const currentQuestion = certification.questions[currentQuestionIndex];
    const isAnswerCorrect = selectedAnswer === currentQuestion.correctAnswer;
    setIsCorrect(isAnswerCorrect);
    setIsAnswered(true);

    // 進捗を保存
    try {
      await updateCertificationProgress({
        userId: '1', // TODO: 実際のユーザーIDを使用
        certificationId: params.id,
        completedQuestions: [currentQuestion.id],
      });
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  };

  const handleNext = () => {
    if (!certification?.questions) return;

    if (currentQuestionIndex < certification.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setIsCorrect(false);
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (isLoading || !certification || !certification.questions) {
    return <div>Loading...</div>;
  }

  const currentQuestion = certification.questions[currentQuestionIndex];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link
            href={`/certifications/${params.id}`}
            className="text-blue-600 hover:text-blue-800 mb-2 inline-block"
          >
            ← {certification.name}に戻る
          </Link>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">問題 {currentQuestionIndex + 1}</h1>
            <span className="text-gray-500">
              {currentQuestionIndex + 1} / {certification.questions.length}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <p className="text-lg mb-6">{currentQuestion.question}</p>

          <div className="space-y-4">
            {currentQuestion.choices.map((choice, index) => (
              <button
                key={choice.id}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full p-4 text-left rounded-lg border transition-colors ${
                  selectedAnswer === index
                    ? isAnswered
                      ? isCorrect
                        ? 'bg-green-100 border-green-500'
                        : 'bg-red-100 border-red-500'
                      : 'bg-blue-100 border-blue-500'
                    : isAnswered && index === currentQuestion.correctAnswer
                    ? 'bg-green-100 border-green-500'
                    : 'hover:bg-gray-50 border-gray-200'
                }`}
                disabled={isAnswered}
              >
                {choice.text}
              </button>
            ))}
          </div>

          {!isAnswered ? (
            <button
              onClick={handleSubmit}
              disabled={selectedAnswer === null}
              className={`mt-6 px-6 py-2 rounded ${
                selectedAnswer === null
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              回答する
            </button>
          ) : (
            <div className="mt-6">
              <div
                className={`p-4 rounded-lg mb-4 ${
                  isCorrect ? 'bg-green-100' : 'bg-red-100'
                }`}
              >
                <h3 className="font-bold mb-2">
                  {isCorrect ? '正解！' : '不正解...'}
                </h3>
                <p>{currentQuestion.explanation}</p>
              </div>
              {currentQuestionIndex < certification.questions.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  次の問題へ
                </button>
              ) : (
                <Link
                  href={`/certifications/${params.id}`}
                  className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 inline-block"
                >
                  学習を完了
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
