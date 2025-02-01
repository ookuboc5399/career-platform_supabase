'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GrammarCategory, EnglishProgress } from '@/types/english';
import Link from 'next/link';

const CATEGORIES: { value: GrammarCategory; label: string }[] = [
  { value: 'all', label: 'すべて' },
  { value: 'tense', label: '時制' },
  { value: 'subjunctive', label: '仮定法' },
  { value: 'relative', label: '関係詞' },
  { value: 'modal', label: '助動詞' },
  { value: 'passive', label: '受動態' },
];

export default function GrammarSessionPage() {
  const [selectedCategory, setSelectedCategory] = useState<GrammarCategory>('all');
  const [progress, setProgress] = useState<EnglishProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/english/progress?type=grammar');
      if (!response.ok) throw new Error('Failed to fetch progress');
      const data = await response.json();
      setProgress(data);
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStart = () => {
    const tempSessionId = `session-${Date.now()}`;
    router.push(`/english/question/grammar/session/${tempSessionId}?category=${selectedCategory}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">総合問題</h1>
        <Link
          href="/english/question/grammar"
          className="text-blue-500 hover:text-blue-700 flex items-center"
        >
          ← 戻る
        </Link>
      </div>

      <div className="space-y-8">
        <Card className="max-w-2xl mx-auto p-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">カテゴリーを選択</h2>
              <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as GrammarCategory)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="カテゴリーを選択" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleStart}
                className="bg-blue-600 hover:bg-blue-700"
              >
                開始
              </Button>
            </div>
          </div>
        </Card>

        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-bold mb-4">学習履歴</h2>
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {progress.map((item) => (
                <Card key={item.id} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-sm px-2 py-1 rounded bg-blue-100 text-blue-800 mr-2">
                        {CATEGORIES.find(c => c.value === item.category)?.label || 'その他'}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatDate(item.createdAt)}
                      </span>
                    </div>
                    <div className="text-lg font-bold">
                      {item.score} / {item.totalQuestions}点
                    </div>
                  </div>
                </Card>
              ))}

              {progress.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  まだ学習履歴がありません
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
