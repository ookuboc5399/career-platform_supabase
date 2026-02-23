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
    type: 'code' | 'multiple-choice';
    title: string;
    description: string;
    testCases?: {
      input: string;
      expectedOutput: string;
    }[];
    choices?: string[];
    correctAnswer?: number | number[];
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
        type: 'code',
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
    if (!newExercises[exerciseIndex].testCases) {
      newExercises[exerciseIndex].testCases = [];
    }
    newExercises[exerciseIndex].testCases!.push({
      input: '',
      expectedOutput: '',
    });
    setExercises(newExercises);
  };

  const removeTestCase = (exerciseIndex: number, testCaseIndex: number) => {
    const newExercises = [...exercises];
    if (newExercises[exerciseIndex].testCases) {
      newExercises[exerciseIndex].testCases = newExercises[exerciseIndex].testCases!.filter(
        (_, i) => i !== testCaseIndex
      );
      setExercises(newExercises);
    }
  };

  const updateTestCase = (
    exerciseIndex: number,
    testCaseIndex: number,
    field: string,
    value: string
  ) => {
    const newExercises = [...exercises];
    const tc = newExercises[exerciseIndex]?.testCases?.[testCaseIndex];
    if (tc) (tc as Record<string, string>)[field] = value;
    setExercises(newExercises);
  };

  const addChoice = (exerciseIndex: number) => {
    const newExercises = [...exercises];
    if (!newExercises[exerciseIndex].choices) {
      newExercises[exerciseIndex].choices = [];
    }
    newExercises[exerciseIndex].choices!.push('');
    setExercises(newExercises);
  };

  const removeChoice = (exerciseIndex: number, choiceIndex: number) => {
    const newExercises = [...exercises];
    if (newExercises[exerciseIndex].choices && newExercises[exerciseIndex].choices!.length > 2) {
      newExercises[exerciseIndex].choices = newExercises[exerciseIndex].choices!.filter(
        (_, i) => i !== choiceIndex
      );
      // 削除された選択肢が正解だった場合、正解をリセット
      const currentCorrect = newExercises[exerciseIndex].correctAnswer;
      if (Array.isArray(currentCorrect)) {
        // 配列の場合、削除されたインデックスを除外し、それより大きいインデックスを1減らす
        const newCorrect = currentCorrect
          .filter(idx => idx !== choiceIndex)
          .map(idx => idx > choiceIndex ? idx - 1 : idx);
        newExercises[exerciseIndex].correctAnswer = newCorrect.length > 0 ? newCorrect : undefined;
      } else if (typeof currentCorrect === 'number') {
        if (currentCorrect === choiceIndex) {
          newExercises[exerciseIndex].correctAnswer = undefined;
        } else if (currentCorrect > choiceIndex) {
          newExercises[exerciseIndex].correctAnswer = currentCorrect - 1;
        }
      }
      setExercises(newExercises);
    }
  };

  const updateChoice = (exerciseIndex: number, choiceIndex: number, value: string) => {
    const newExercises = [...exercises];
    if (!newExercises[exerciseIndex].choices) {
      newExercises[exerciseIndex].choices = [];
    }
    newExercises[exerciseIndex].choices![choiceIndex] = value;
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
                        問題形式
                      </label>
                      <select
                        value={exercise.type}
                        onChange={(e) => {
                          const newExercises = [...exercises];
                          const newType = e.target.value as 'code' | 'multiple-choice';
                          newExercises[exerciseIndex].type = newType;
                          if (newType === 'code') {
                            newExercises[exerciseIndex].testCases = [{ input: '', expectedOutput: '' }];
                            delete newExercises[exerciseIndex].choices;
                            delete newExercises[exerciseIndex].correctAnswer;
                          } else {
                            newExercises[exerciseIndex].choices = ['', ''];
                            newExercises[exerciseIndex].correctAnswer = [];
                            delete newExercises[exerciseIndex].testCases;
                          }
                          setExercises(newExercises);
                        }}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="code">コード入力</option>
                        <option value="multiple-choice">選択肢問題</option>
                      </select>
                    </div>

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
                        onPaste={(e) => {
                          e.preventDefault();
                          const pastedText = e.clipboardData.getData('text/plain');
                          const textarea = e.currentTarget;
                          const start = textarea.selectionStart;
                          const end = textarea.selectionEnd;
                          const newValue = exercise.description.substring(0, start) + pastedText + exercise.description.substring(end);
                          updateExercise(exerciseIndex, 'description', newValue);
                          // カーソル位置を調整
                          setTimeout(() => {
                            textarea.setSelectionRange(start + pastedText.length, start + pastedText.length);
                          }, 0);
                        }}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        解説（任意）
                      </label>
                      <textarea
                        value={(exercise as { explanation?: string }).explanation || ''}
                        onChange={(e) =>
                          updateExercise(exerciseIndex, 'explanation', e.target.value)
                        }
                        onPaste={(e) => {
                          e.preventDefault();
                          const pastedText = e.clipboardData.getData('text/plain');
                          const textarea = e.currentTarget;
                          const start = textarea.selectionStart;
                          const end = textarea.selectionEnd;
                          const expl = (exercise as { explanation?: string }).explanation || '';
                          const newValue = expl.substring(0, start) + pastedText + expl.substring(end);
                          updateExercise(exerciseIndex, 'explanation', newValue);
                          // カーソル位置を調整
                          setTimeout(() => {
                            textarea.setSelectionRange(start + pastedText.length, start + pastedText.length);
                          }, 0);
                        }}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24"
                        placeholder="問題の解説を入力してください"
                      />
                    </div>

                    {exercise.type === 'code' ? (
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
                          {exercise.testCases?.map((testCase, testCaseIndex) => (
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
                    ) : (
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="block text-sm font-medium text-gray-700">
                            選択肢 *（最低2つ必要）
                          </label>
                          <Button
                            type="button"
                            onClick={() => addChoice(exerciseIndex)}
                            variant="outline"
                            size="sm"
                          >
                            選択肢を追加
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {(exercise.choices || ['', '']).map((choice, choiceIndex) => (
                            <div key={choiceIndex} className="flex items-center gap-2">
                              <span className="w-8 text-sm font-medium text-gray-700">
                                {String.fromCharCode(65 + choiceIndex)}.
                              </span>
                              <input
                                type="checkbox"
                                checked={
                                  Array.isArray(exercise.correctAnswer)
                                    ? exercise.correctAnswer.includes(choiceIndex)
                                    : exercise.correctAnswer === choiceIndex
                                }
                                onChange={(e) => {
                                  const newExercises = [...exercises];
                                  const currentCorrect = newExercises[exerciseIndex].correctAnswer;
                                  
                                  if (e.target.checked) {
                                    // チェックされた場合
                                    if (Array.isArray(currentCorrect)) {
                                      // 既に配列の場合は追加
                                      if (!currentCorrect.includes(choiceIndex)) {
                                        newExercises[exerciseIndex].correctAnswer = [...currentCorrect, choiceIndex];
                                      }
                                    } else if (typeof currentCorrect === 'number') {
                                      // 数値の場合は配列に変換
                                      newExercises[exerciseIndex].correctAnswer = [currentCorrect, choiceIndex];
                                    } else {
                                      // undefinedの場合は配列を作成
                                      newExercises[exerciseIndex].correctAnswer = [choiceIndex];
                                    }
                                  } else {
                                    // チェックが外された場合
                                    if (Array.isArray(currentCorrect)) {
                                      const newCorrect = currentCorrect.filter(idx => idx !== choiceIndex);
                                      newExercises[exerciseIndex].correctAnswer = newCorrect.length > 0 ? newCorrect : undefined;
                                    } else if (currentCorrect === choiceIndex) {
                                      newExercises[exerciseIndex].correctAnswer = undefined;
                                    }
                                  }
                                  setExercises(newExercises);
                                }}
                                className="w-4 h-4 text-blue-600"
                              />
                              <input
                                type="text"
                                value={choice}
                                onChange={(e) => updateChoice(exerciseIndex, choiceIndex, e.target.value)}
                                placeholder={`選択肢 ${String.fromCharCode(65 + choiceIndex)}`}
                                className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                              />
                              {(exercise.choices?.length || 2) > 2 && (
                                <Button
                                  type="button"
                                  onClick={() => removeChoice(exerciseIndex, choiceIndex)}
                                  variant="destructive"
                                  size="sm"
                                >
                                  削除
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                        <p className="mt-2 text-sm text-gray-500">
                          ※ 正解の選択肢をチェックボックスで選択してください（複数選択可）
                        </p>
                      </div>
                    )}
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
