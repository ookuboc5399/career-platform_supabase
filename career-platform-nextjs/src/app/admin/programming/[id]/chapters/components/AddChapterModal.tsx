'use client';

import { useState } from 'react';

interface Exercise {
  title: string;
  description: string;
  testCases: {
    input: string;
    expectedOutput: string;
  }[];
}

interface AddChapterModalProps {
  isOpen: boolean;
  onClose: () => void;
  languageId: string;
}

export default function AddChapterModal({ isOpen, onClose, languageId }: AddChapterModalProps) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    videoUrl: '',
    duration: '',
    status: 'draft' as 'draft' | 'published',
  });

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentExercise, setCurrentExercise] = useState<Exercise>({
    title: '',
    description: '',
    testCases: [{ input: '', expectedOutput: '' }],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: APIを呼び出してチャプターを保存
    onClose();
  };

  const addExercise = () => {
    if (currentExercise.title && currentExercise.description) {
      setExercises([...exercises, currentExercise]);
      setCurrentExercise({
        title: '',
        description: '',
        testCases: [{ input: '', expectedOutput: '' }],
      });
    }
  };

  const addTestCase = () => {
    setCurrentExercise({
      ...currentExercise,
      testCases: [...currentExercise.testCases, { input: '', expectedOutput: '' }],
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-lg bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900">
            新規チャプター追加
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 基本情報 */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                タイトル
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                説明
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={3}
                  required
                />
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                動画URL
                <input
                  type="url"
                  value={form.videoUrl}
                  onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  所要時間
                  <input
                    type="text"
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="例: 30分"
                    required
                  />
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  ステータス
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as 'draft' | 'published' })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="draft">下書き</option>
                    <option value="published">公開</option>
                  </select>
                </label>
              </div>
            </div>
          </div>

          {/* 演習問題 */}
          <div className="border-t pt-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">演習問題</h4>
            
            {/* 既存の演習問題リスト */}
            {exercises.length > 0 && (
              <div className="mb-6 space-y-4">
                {exercises.map((exercise, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-medium">{exercise.title}</h5>
                    <p className="text-sm text-gray-600">{exercise.description}</p>
                    <div className="mt-2 text-sm text-gray-500">
                      テストケース: {exercise.testCases.length}件
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 新規演習問題フォーム */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    タイトル
                    <input
                      type="text"
                      value={currentExercise.title}
                      onChange={(e) => setCurrentExercise({ ...currentExercise, title: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    問題文
                    <textarea
                      value={currentExercise.description}
                      onChange={(e) => setCurrentExercise({ ...currentExercise, description: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      rows={2}
                    />
                  </label>
                </div>

                {/* テストケース */}
                <div className="space-y-4">
                  {currentExercise.testCases.map((testCase, index) => (
                    <div key={index} className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          入力
                          <input
                            type="text"
                            value={testCase.input}
                            onChange={(e) => {
                              const newTestCases = [...currentExercise.testCases];
                              newTestCases[index].input = e.target.value;
                              setCurrentExercise({ ...currentExercise, testCases: newTestCases });
                            }}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </label>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          期待される出力
                          <input
                            type="text"
                            value={testCase.expectedOutput}
                            onChange={(e) => {
                              const newTestCases = [...currentExercise.testCases];
                              newTestCases[index].expectedOutput = e.target.value;
                              setCurrentExercise({ ...currentExercise, testCases: newTestCases });
                            }}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </label>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={addTestCase}
                    className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
                  >
                    + テストケース追加
                  </button>
                  <button
                    type="button"
                    onClick={addExercise}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    この演習問題を追加
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
