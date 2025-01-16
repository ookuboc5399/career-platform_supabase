'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import VideoPlayer from '@/components/ui/VideoPlayer';

interface Exercise {
  title: string;
  description: string;
  testCases: {
    input: string;
    expectedOutput: string;
  }[];
}

interface Chapter {
  id: string;
  languageId: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: string;
  exercises: Exercise[];
}

interface ChapterProgress {
  videoCompleted: boolean;
  completedExercises: string[];
}

interface TestResult {
  input: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
}

export default function ChapterPage({
  params,
}: {
  params: { id: string; chapterId: string };
}) {
  const router = useRouter();
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [progress, setProgress] = useState<ChapterProgress>({
    videoCompleted: false,
    completedExercises: [],
  });
  const [code, setCode] = useState<string>('');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [testResults, setTestResults] = useState<TestResult[] | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // チャプター情報を取得
        const chapterRes = await fetch(`/api/programming/chapters/${params.chapterId}`);
        if (!chapterRes.ok) throw new Error('Failed to fetch chapter');
        const chapterData = await chapterRes.json();
        setChapter(chapterData);

        // 進捗情報を取得（ユーザーIDは仮で'user1'を使用）
        const progressRes = await fetch(
          `/api/programming/progress?userId=user1&languageId=${params.id}&chapterId=${params.chapterId}`
        );
        if (!progressRes.ok) throw new Error('Failed to fetch progress');
        const progressData = await progressRes.json();
        setProgress(progressData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load chapter content');
      }
    };

    fetchData();
  }, [params.id, params.chapterId]);

  const handleVideoComplete = async () => {
    try {
      const res = await fetch('/api/programming/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'user1', // 仮のユーザーID
          languageId: params.id,
          chapterId: params.chapterId,
          data: {
            videoCompleted: true,
            completedExercises: progress.completedExercises,
          },
        }),
      });

      if (!res.ok) throw new Error('Failed to update progress');
      const updatedProgress = await res.json();
      setProgress(updatedProgress);
    } catch (error) {
      console.error('Error updating progress:', error);
      setError('Failed to update progress');
    }
  };

  const runCode = async () => {
    if (!selectedExercise) return;

    setIsRunning(true);
    setTestResults(null);
    setError(null);

    try {
      const res = await fetch('/api/code/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          language: params.id,
          testCases: selectedExercise.testCases,
        }),
      });

      if (!res.ok) throw new Error('Failed to run code');
      const result = await res.json();

      setTestResults(result.testResults);

      if (result.success) {
        // 演習問題をクリアした場合、進捗を更新
        const updatedExercises = [...progress.completedExercises];
        if (!updatedExercises.includes(selectedExercise.title)) {
          updatedExercises.push(selectedExercise.title);
          const progressRes = await fetch('/api/programming/progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: 'user1',
              languageId: params.id,
              chapterId: params.chapterId,
              data: {
                videoCompleted: progress.videoCompleted,
                completedExercises: updatedExercises,
              },
            }),
          });

          if (!progressRes.ok) throw new Error('Failed to update progress');
          const updatedProgress = await progressRes.json();
          setProgress(updatedProgress);
        }
      }
    } catch (error) {
      console.error('Error running code:', error);
      setError('Failed to run code');
    } finally {
      setIsRunning(false);
    }
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
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
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">{chapter.title}</h1>
        <p className="text-gray-600 mb-8">{chapter.description}</p>

        {/* ビデオセクション */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">レッスン動画</h2>
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            <VideoPlayer
              url={chapter.videoUrl}
              onComplete={handleVideoComplete}
              completed={progress.videoCompleted}
            />
          </div>
        </div>

        {/* 演習問題セクション */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">演習問題</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {chapter.exercises.map((exercise) => (
              <button
                key={exercise.title}
                onClick={() => setSelectedExercise(exercise)}
                className={`p-4 rounded-lg border ${
                  selectedExercise?.title === exercise.title
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-500'
                } ${
                  progress.completedExercises.includes(exercise.title)
                    ? 'bg-green-50'
                    : ''
                }`}
              >
                <h3 className="font-medium">{exercise.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{exercise.description}</p>
                {progress.completedExercises.includes(exercise.title) && (
                  <span className="inline-block px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full mt-2">
                    完了
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* コードエディタセクション */}
        {selectedExercise && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-2">{selectedExercise.title}</h3>
            <p className="text-gray-600 mb-4">{selectedExercise.description}</p>
            <div className="mb-4">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-64 font-mono text-sm p-4 bg-gray-900 text-gray-100 rounded-lg"
                placeholder="ここにコードを入力してください..."
              />
            </div>
            <button
              onClick={runCode}
              disabled={isRunning || !code}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRunning ? '実行中...' : 'コードを実行'}
            </button>
          </div>
        )}

        {/* テスト結果セクション */}
        {testResults && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">テスト結果</h3>
            <div className="space-y-4">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${
                    result.passed ? 'bg-green-50' : 'bg-red-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">テストケース {index + 1}</span>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        result.passed
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {result.passed ? '成功' : '失敗'}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">入力:</span> {result.input}
                    </div>
                    <div>
                      <span className="font-medium">期待される出力:</span>{' '}
                      {result.expectedOutput}
                    </div>
                    <div>
                      <span className="font-medium">実際の出力:</span>{' '}
                      {result.actualOutput}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
