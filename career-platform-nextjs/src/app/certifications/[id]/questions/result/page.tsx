"use client";

import { useEffect, useState, use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface Question {
  id: string;
  certificationId: string;
  questionNumber: number;
  question: string;
  options: string[];
  correctAnswers: number[];
  explanation: string;
  year: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

interface Progress {
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
  timestamp: string;
}

export default function QuestionResultPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [progress, setProgress] = useState<Progress[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { id: certificationId } = use(params);

  useEffect(() => {
    fetchResults();
  }, [certificationId]);

  const fetchResults = async () => {
    try {
      setIsLoading(true);
      // 進捗データを取得
      const progressResponse = await fetch(`/api/certifications/questions/progress?certificationId=${certificationId}`);
      if (!progressResponse.ok) throw new Error('Failed to fetch progress');
      const progressData = await progressResponse.json();

      // 問題データを取得
      const certResponse = await fetch(`/api/certifications/${certificationId}`);
      if (!certResponse.ok) throw new Error('Failed to fetch certification');
      const certification = await certResponse.json();

      if (!certification.questions) {
        setQuestions([]);
        return;
      }

      setQuestions(certification.questions);
      setProgress(progressData);
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setIsLoading(false);
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

  // 正解数と正解率を計算
  const totalQuestions = progress.length;
  const correctAnswers = progress.filter(p => p.isCorrect).length;
  const correctRate = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

  // カテゴリー別の正解率を計算
  const categoryStats = questions.reduce((acc, question) => {
    const category = question.category;
    const progressItem = progress.find(p => p.questionId === question.id);
    if (!acc[category]) {
      acc[category] = { total: 0, correct: 0 };
    }
    if (progressItem) {
      acc[category].total++;
      if (progressItem.isCorrect) {
        acc[category].correct++;
      }
    }
    return acc;
  }, {} as Record<string, { total: number; correct: number }>);

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button
          onClick={() => router.push(`/certifications/${certificationId}/questions`)}
          variant="outline"
          className="mb-4"
        >
          ← 戻る
        </Button>
        <h1 className="text-2xl font-bold">テスト結果</h1>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* 総合結果 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">総合結果</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-gray-500">問題数</div>
              <div className="text-3xl font-bold">{totalQuestions}</div>
            </div>
            <div className="text-center">
              <div className="text-gray-500">正解数</div>
              <div className="text-3xl font-bold text-blue-600">{correctAnswers}</div>
            </div>
            <div className="text-center">
              <div className="text-gray-500">正解率</div>
              <div className="text-3xl font-bold text-green-600">{correctRate.toFixed(1)}%</div>
            </div>
          </div>
        </div>

        {/* カテゴリー別結果 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">カテゴリー別結果</h2>
          <div className="space-y-4">
            {Object.entries(categoryStats).map(([category, stats]) => {
              const rate = (stats.correct / stats.total) * 100;
              return (
                <div key={category} className="border-b pb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{category}</span>
                    <span className="text-sm text-gray-500">
                      {stats.correct} / {stats.total} ({rate.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: `${rate}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* アクションボタン */}
        <div className="flex justify-center gap-4">
          <Button
            onClick={() => router.push(`/certifications/${certificationId}/questions`)}
            variant="outline"
          >
            問題選択に戻る
          </Button>
          <Button
            onClick={() => router.push(`/certifications/${certificationId}`)}
          >
            学習を続ける
          </Button>
        </div>
      </div>
    </div>
  );
}
