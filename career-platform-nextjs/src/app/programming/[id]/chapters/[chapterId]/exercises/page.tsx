'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ProgrammingChapter } from '@/lib/cosmos-db';
import Editor from '@monaco-editor/react';

export default function ExercisesPage() {
  const params = useParams();
  const [chapter, setChapter] = useState<ProgrammingChapter | null>(null);
  const [nextChapter, setNextChapter] = useState<ProgrammingChapter | null>(null);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 現在のチャプターを取得
        const response = await fetch(`/api/programming/chapters/${params.chapterId}?languageId=${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch chapter');
        const data = await response.json();
        setChapter(data);
        if (data.exercises?.[0]) {
          setCode('# コードを入力してください\n');
        }

        // 次のチャプターを取得
        const chaptersResponse = await fetch(`/api/programming/chapters?languageId=${params.id}`);
        if (chaptersResponse.ok) {
          const chapters = await chaptersResponse.json();
          const currentIndex = chapters.findIndex((c: ProgrammingChapter) => c.id === params.chapterId);
          if (currentIndex !== -1 && currentIndex < chapters.length - 1) {
            setNextChapter(chapters[currentIndex + 1]);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [params.chapterId, params.id]);

  const runCode = async () => {
    if (!chapter?.exercises?.[currentExercise]) return;
    setIsRunning(true);
    try {
      const response = await fetch('/api/code/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          language: 'python',
          testCases: chapter.exercises[currentExercise].testCases
        }),
      });
      const data = await response.json();
      // 実行結果から実際の出力のみを抽出
      const outputLines = data.output.split('\n');
      const actualOutputs = outputLines
        .filter((line: string) => line.includes('実際の出力:'))
        .map((line: string) => line.split('実際の出力:')[1].trim())
        .join('\n');
      setOutput(actualOutputs || '実行エラーが発生しました');
    } catch (error) {
      console.error('Error running code:', error);
      setOutput('実行エラーが発生しました');
    } finally {
      setIsRunning(false);
    }
  };

  if (!chapter || !chapter.exercises?.[currentExercise]) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const exercise = chapter.exercises[currentExercise];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">演習問題: {exercise.title}</h1>
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-2">問題</h2>
          <p className="text-gray-700 mb-4">{exercise.description}</p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">期待される出力:</h3>
            {exercise.testCases.map((testCase, index) => (
              <div key={index} className="text-sm text-gray-600">
                入力: {testCase.input}<br />
                期待される出力: {testCase.expectedOutput}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">コードエディタ</h2>
          </div>
          <div className="h-[500px]">
            <Editor
              height="100%"
              defaultLanguage="python"
              value={code}
              onChange={(value: string | undefined) => setCode(value || '')}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
              }}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">実行結果</h2>
          </div>
          <div className="p-4">
            <div className="bg-gray-900 text-white p-4 rounded-lg h-[452px] font-mono overflow-auto">
              {output || '実行結果がここに表示されます'}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-between items-center">
        <Link
          href={`/programming/${params.id}/chapters/${params.chapterId}`}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          動画に戻る
        </Link>
        <div className="space-x-4">
          <button
            onClick={runCode}
            disabled={isRunning}
            className={`px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${
              isRunning ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isRunning ? '実行中...' : 'コードを実行'}
          </button>
          {currentExercise < (chapter?.exercises?.length || 0) - 1 ? (
            <button
              onClick={() => {
                setCurrentExercise(currentExercise + 1);
                setCode('# コードを入力してください\n');
                setOutput('');
              }}
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              次の問題へ
            </button>
          ) : nextChapter && (
            <Link
              href={`/programming/${params.id}/chapters/${nextChapter.id}`}
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 inline-flex items-center"
            >
              次のチャプターへ
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
