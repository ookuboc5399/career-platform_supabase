'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card } from "@/components/ui/card";

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export default function GrammarQuestionPage() {
  const params = useParams();
  const questionId = params?.id as string;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);

  // サンプル問題データ
  const questions: Question[] = [
    {
      id: '1',
      text: '彼は毎朝6時に（     ）。',
      options: [
        'wake up',
        'wakes up',
        'waking up',
        'waked up'
      ],
      correctAnswer: 1,
      explanation: '主語が三人称単数(he)で、習慣的な動作を表す現在形なので、動詞に-sをつけます。',
    },
    {
      id: '1',
      text: '私は昨日映画を（     ）。',
      options: [
        'watch',
        'watches',
        'watching',
        'watched'
      ],
      correctAnswer: 3,
      explanation: '過去の出来事を表すので、動詞の過去形を使います。',
    },
    {
      id: '1',
      text: '彼女は今（     ）。',
      options: [
        'study',
        'studies',
        'is studying',
        'studied'
      ],
      correctAnswer: 2,
      explanation: '現在進行中の動作を表すので、be動詞 + 動詞のing形を使います。',
    },
  ];

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
    if (answerIndex === questions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">文法問題</h1>
        <Link
          href="/english/question/grammar"
          className="text-blue-500 hover:text-blue-700 flex items-center"
        >
          ← 問題一覧に戻る
        </Link>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* 進捗バー */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span>進捗</span>
            <span>{currentQuestionIndex + 1} / {questions.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* 問題カード */}
        <Card className="p-6 mb-6">
          <p className="text-xl mb-6">{currentQuestion.text}</p>
          <div className="space-y-4">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={selectedAnswer !== null}
                className={`w-full p-4 text-left rounded-lg transition-colors ${
                  selectedAnswer === null
                    ? 'hover:bg-gray-100 border border-gray-200'
                    : selectedAnswer === index
                    ? index === currentQuestion.correctAnswer
                      ? 'bg-green-100 border border-green-500'
                      : 'bg-red-100 border border-red-500'
                    : index === currentQuestion.correctAnswer
                    ? 'bg-green-100 border border-green-500'
                    : 'bg-gray-50 border border-gray-200'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </Card>

        {/* 解説 */}
        {showExplanation && (
          <Card className="p-6 mb-6">
            <h2 className="text-lg font-bold mb-2">解説</h2>
            <p className="text-gray-700">{currentQuestion.explanation}</p>
          </Card>
        )}

        {/* 次の問題ボタン */}
        {showExplanation && !isLastQuestion && (
          <button
            onClick={handleNextQuestion}
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            次の問題へ
          </button>
        )}

        {/* 結果表示 */}
        {showExplanation && isLastQuestion && (
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">学習完了！</h2>
            <p className="text-lg mb-4">
              正解数: {score} / {questions.length}
              <span className="ml-2 text-gray-500">
                ({Math.round((score / questions.length) * 100)}%)
              </span>
            </p>
            <Link
              href="/english/question/grammar"
              className="block w-full bg-blue-500 text-white text-center py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              問題一覧に戻る
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
}
