'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { VideoUploader } from '@/components/ui/VideoUploader';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface AddChapterModalProps {
  isOpen: boolean;
  onClose: () => void;
  languageId: string;
}

export default function AddChapterModal({ isOpen, onClose, languageId }: AddChapterModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [duration, setDuration] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [exercises, setExercises] = useState<{
    id: string;
    title: string;
    description: string;
    testCases: {
      input: string;
      expectedOutput: string;
    }[];
  }[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/programming/chapters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          languageId,
          title,
          description,
          videoUrl,
          thumbnailUrl: '',  // 空文字列を設定
          duration: duration || '',
          status,
          exercises: exercises || [],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to create chapter: ${JSON.stringify(errorData)}`);
      }

      setTitle('');
      setDescription('');
      setVideoUrl('');
      setDuration('');
      setStatus('draft');
      setExercises([]);
      onClose();
    } catch (error) {
      console.error('Error creating chapter:', error instanceof Error ? error.message : error);
    }
  };

  const addExercise = () => {
    setExercises([
      ...exercises,
      {
        id: Math.random().toString(36).substring(2, 15),
        title: '',
        description: '',
        testCases: [
          {
            input: '',
            expectedOutput: '',
          },
        ],
      },
    ]);
  };

  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const updateExercise = (index: number, field: string, value: string) => {
    const newExercises = [...exercises];
    (newExercises[index] as any)[field] = value;
    setExercises(newExercises);
  };

  const addTestCase = (exerciseIndex: number) => {
    const newExercises = [...exercises];
    newExercises[exerciseIndex].testCases.push({
      input: '',
      expectedOutput: '',
    });
    setExercises(newExercises);
  };

  const removeTestCase = (exerciseIndex: number, testCaseIndex: number) => {
    const newExercises = [...exercises];
    newExercises[exerciseIndex].testCases = newExercises[exerciseIndex].testCases.filter(
      (_, i) => i !== testCaseIndex
    );
    setExercises(newExercises);
  };

  const updateTestCase = (
    exerciseIndex: number,
    testCaseIndex: number,
    field: string,
    value: string
  ) => {
    const newExercises = [...exercises];
    (newExercises[exerciseIndex].testCases[testCaseIndex] as any)[field] = value;
    setExercises(newExercises);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle>新規チャプター追加</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              タイトル
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              説明
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ステータス
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="draft">下書き</option>
              <option value="published">公開</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              動画
            </label>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  動画URL
                </label>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://example.com/video.mp4"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  または動画をアップロード
                </label>
                <VideoUploader 
                  type="programming" 
                  onUploadComplete={(url, videoDuration) => {
                    setVideoUrl(url);
                    setDuration(videoDuration);
                  }} 
                />
              </div>
              {videoUrl && (
                <div className="mt-2 text-sm text-gray-600">
                  現在の動画: {videoUrl}
                </div>
              )}
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  動画の長さ（手動入力）
                </label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="例: 5:30"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-medium text-gray-700">
                演習問題
              </label>
              <Button
                type="button"
                onClick={addExercise}
                variant="outline"
              >
                問題を追加
              </Button>
            </div>

            <div className="space-y-6">
              {exercises.map((exercise, exerciseIndex) => (
                <div key={exercise.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">問題 {exerciseIndex + 1}</h3>
                    <Button
                      type="button"
                      onClick={() => removeExercise(exerciseIndex)}
                      variant="destructive"
                      size="sm"
                    >
                      削除
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        タイトル
                      </label>
                      <input
                        type="text"
                        value={exercise.title}
                        onChange={(e) =>
                          updateExercise(exerciseIndex, 'title', e.target.value)
                        }
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        問題文
                      </label>
                      <textarea
                        value={exercise.description}
                        onChange={(e) =>
                          updateExercise(exerciseIndex, 'description', e.target.value)
                        }
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24"
                        required
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          テストケース
                        </label>
                        <Button
                          type="button"
                          onClick={() => addTestCase(exerciseIndex)}
                          variant="outline"
                          size="sm"
                        >
                          テストケースを追加
                        </Button>
                      </div>

                      <div className="space-y-4">
                        {exercise.testCases.map((testCase, testCaseIndex) => (
                          <div
                            key={testCaseIndex}
                            className="p-4 bg-gray-50 rounded-lg"
                          >
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="text-sm font-medium">
                                テストケース {testCaseIndex + 1}
                              </h4>
                              <Button
                                type="button"
                                onClick={() =>
                                  removeTestCase(exerciseIndex, testCaseIndex)
                                }
                                variant="destructive"
                                size="sm"
                              >
                                削除
                              </Button>
                            </div>

                            <div className="space-y-2">
                              <div>
                                <label className="block text-sm text-gray-700 mb-1">
                                  入力
                                </label>
                                <input
                                  type="text"
                                  value={testCase.input}
                                  onChange={(e) =>
                                    updateTestCase(
                                      exerciseIndex,
                                      testCaseIndex,
                                      'input',
                                      e.target.value
                                    )
                                  }
                                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              </div>

                              <div>
                                <label className="block text-sm text-gray-700 mb-1">
                                  期待される出力
                                </label>
                                <input
                                  type="text"
                                  value={testCase.expectedOutput}
                                  onChange={(e) =>
                                    updateTestCase(
                                      exerciseIndex,
                                      testCaseIndex,
                                      'expectedOutput',
                                      e.target.value
                                    )
                                  }
                                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
            >
              キャンセル
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
            >
              保存
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
