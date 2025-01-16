'use client';

import { useState, useEffect } from 'react';
import { Certification, CertificationQuestion } from '@/types/api';
import { getCertifications } from '@/lib/api';
import Link from 'next/link';

export default function CertificationPracticePage() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [allQuestions, setAllQuestions] = useState<(CertificationQuestion & { certificationName: string })[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<(CertificationQuestion & { certificationName: string }) | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCertifications();
  }, []);

  const fetchCertifications = async () => {
    try {
      const data = await getCertifications();
      setCertifications(data);

      // 全ての問題を1つの配列にまとめる
      const questions = data.flatMap(cert => 
        cert.chapters?.flatMap(chapter => 
          chapter.questions.map(q => ({
            ...q,
            certificationName: cert.name
          }))
        ) || []
      );
      setAllQuestions(questions);
      
      // ランダムに問題を選択
      if (questions.length > 0) {
        const randomIndex = Math.floor(Math.random() * questions.length);
        setCurrentQuestion(questions[randomIndex]);
      }
    } catch (error) {
      setError('Failed to fetch certifications');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (isAnswered) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null || !currentQuestion) return;

    const isAnswerCorrect = selectedAnswer === currentQuestion.correctAnswer;
    setIsCorrect(isAnswerCorrect);
    setIsAnswered(true);
  };

  const handleNext = () => {
    if (allQuestions.length === 0) return;

    const randomIndex = Math.floor(Math.random() * allQuestions.length);
    setCurrentQuestion(allQuestions[randomIndex]);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setIsCorrect(false);
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link
            href="/certifications"
            className="text-blue-600 hover:text-blue-800 mb-2 inline-block"
          >
            ← 資格・検定一覧に戻る
          </Link>
          <h1 className="text-2xl font-bold">ランダム問題演習</h1>
        </div>

        {currentQuestion ? (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <div className="mb-4">
              <span className="text-sm text-gray-500">
                {currentQuestion.certificationName}
              </span>
            </div>
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
                <button
                  onClick={handleNext}
                  className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  次の問題へ
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">問題が登録されていません。</p>
          </div>
        )}
      </div>
    </div>
  );
}
