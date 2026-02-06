'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ProgrammingPracticeExercise, ProgrammingChapter } from '@/types/api';

interface EditPracticeExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  exercise: ProgrammingPracticeExercise;
  chapters: ProgrammingChapter[];
  existingExercises: ProgrammingPracticeExercise[];
}

export default function EditPracticeExerciseModal({
  isOpen,
  onClose,
  exercise,
  chapters,
  existingExercises,
}: EditPracticeExerciseModalProps) {
  const [type, setType] = useState<'code' | 'multiple-choice'>(exercise.type || 'code');
  const [title, setTitle] = useState(exercise.title || '');
  const [description, setDescription] = useState(exercise.description || '');
  const [descriptionJapanese, setDescriptionJapanese] = useState((exercise as any).descriptionJapanese || '');
  const [languageMode, setLanguageMode] = useState<'japanese' | 'english'>(
    (exercise as any).descriptionJapanese ? 'japanese' : 'english'
  );
  const [explanation, setExplanation] = useState(exercise.explanation || '');
  const [chapterId, setChapterId] = useState<string>(exercise.chapterId || '');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>(exercise.difficulty || 'medium');
  const [status, setStatus] = useState<'draft' | 'published'>(exercise.status || 'draft');
  const [testCases, setTestCases] = useState<{ input: string; expectedOutput: string }[]>(
    exercise.testCases || [{ input: '', expectedOutput: '' }]
  );
  const [choices, setChoices] = useState<string[]>(exercise.choices && exercise.choices.length >= 2 ? exercise.choices : ['', '']);
  const [correctAnswer, setCorrectAnswer] = useState<number | number[]>(
    Array.isArray(exercise.correctAnswer) ? exercise.correctAnswer : (exercise.correctAnswer !== undefined ? exercise.correctAnswer : [])
  );

  // 重複チェック（リアルタイム）- 問題文のみ
  const duplicateCheck = useMemo(() => {
    const currentDescription = languageMode === 'japanese' ? descriptionJapanese : description;
    const trimmedDescription = currentDescription.trim();
    
    if (!trimmedDescription) {
      return null;
    }

    const duplicate = existingExercises.find(
      (ex) =>
        ex.id !== exercise.id &&
        ((ex.description?.trim() === trimmedDescription || 
          (ex as any).descriptionJapanese?.trim() === trimmedDescription)) &&
        ex.languageId === exercise.languageId
    );

    return duplicate || null;
  }, [description, descriptionJapanese, languageMode, existingExercises, exercise.id, exercise.languageId]);

  useEffect(() => {
    if (exercise) {
      setType(exercise.type || 'code');
      setTitle(exercise.title || '');
      setDescription(exercise.description || '');
      setDescriptionJapanese((exercise as any).descriptionJapanese || '');
      setLanguageMode((exercise as any).descriptionJapanese ? 'japanese' : 'english');
      setExplanation(exercise.explanation || '');
      setChapterId(exercise.chapterId || '');
      setDifficulty(exercise.difficulty || 'medium');
      setStatus(exercise.status || 'draft');
      setTestCases(exercise.testCases || [{ input: '', expectedOutput: '' }]);
      setChoices(exercise.choices && exercise.choices.length >= 2 ? exercise.choices : ['', '']);
      setCorrectAnswer(
        Array.isArray(exercise.correctAnswer) ? exercise.correctAnswer : (exercise.correctAnswer !== undefined ? exercise.correctAnswer : [])
      );
    }
  }, [exercise]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 既存の問題と重複チェック（問題文が同じ、ただし自分自身は除外）
    const currentDescription = languageMode === 'japanese' ? descriptionJapanese : description;
    const trimmedDescription = currentDescription.trim();
    
    const duplicate = existingExercises.find(
      (ex) =>
        ex.id !== exercise.id &&
        ((ex.description?.trim() === trimmedDescription || 
          (ex as any).descriptionJapanese?.trim() === trimmedDescription)) &&
        ex.languageId === exercise.languageId
    );

    if (duplicate) {
      alert('既に同じ問題が存在します。問題文が重複しています。');
      return;
    }

    // 選択肢問題の場合、空の選択肢をフィルタリング
    const validChoices = type === 'multiple-choice' 
      ? choices.filter(choice => choice.trim() !== '')
      : null;

    // 問題文が入力されているかチェック
    if (!trimmedDescription) {
      alert('問題文を入力してください。');
      return;
    }

    // 選択肢が2つ未満の場合はエラー
    if (type === 'multiple-choice' && (!validChoices || validChoices.length < 2)) {
      alert('選択肢は最低2つ必要です。空の選択肢は削除してください。');
      return;
    }

    // 正解のインデックスを調整（空の選択肢を削除した後のインデックスに合わせる）
    let adjustedCorrectAnswer: number | number[] | null = correctAnswer;
    if (type === 'multiple-choice' && validChoices) {
      if (Array.isArray(correctAnswer)) {
        const adjusted: number[] = [];
        let validIndex = 0;
        for (let i = 0; i < choices.length; i++) {
          if (choices[i].trim() !== '') {
            if (correctAnswer.includes(i)) {
              adjusted.push(validIndex);
            }
            validIndex++;
          }
        }
        adjustedCorrectAnswer = adjusted.length > 0 ? adjusted : null;
      } else if (typeof correctAnswer === 'number') {
        let validIndex = 0;
        for (let i = 0; i < choices.length; i++) {
          if (choices[i].trim() !== '') {
            if (i === correctAnswer) {
              adjustedCorrectAnswer = validIndex;
              break;
            }
            validIndex++;
          }
        }
      }
    }

    try {
      const response = await fetch(`/api/programming/practice-exercises/${exercise.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          languageId: exercise.languageId,
          chapterId: chapterId || null,
          type,
          title: title || null,
          description: languageMode === 'english' ? description : descriptionJapanese,
          descriptionJapanese: languageMode === 'japanese' ? descriptionJapanese : description,
          explanation: explanation || null,
          testCases: type === 'code' ? testCases : null,
          choices: type === 'multiple-choice' ? validChoices : null,
          correctAnswer: type === 'multiple-choice' ? adjustedCorrectAnswer : null,
          difficulty,
          order: exercise.order || 0,
          status,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to update exercise: ${JSON.stringify(errorData)}`);
      }

      onClose();
    } catch (error) {
      console.error('Error updating exercise:', error instanceof Error ? error.message : error);
      alert('問題の更新に失敗しました');
    }
  };

  const addTestCase = () => {
    setTestCases([...testCases, { input: '', expectedOutput: '' }]);
  };

  const removeTestCase = (index: number) => {
    setTestCases(testCases.filter((_, i) => i !== index));
  };

  const updateTestCase = (index: number, field: 'input' | 'expectedOutput', value: string) => {
    const newTestCases = [...testCases];
    newTestCases[index][field] = value;
    setTestCases(newTestCases);
  };

  const updateChoice = (index: number, value: string) => {
    const newChoices = [...choices];
    newChoices[index] = value;
    setChoices(newChoices);
  };

  const addChoice = () => {
    setChoices([...choices, '']);
  };

  const removeChoice = (index: number) => {
    if (choices.length > 2) {
      const newChoices = choices.filter((_, i) => i !== index);
      setChoices(newChoices);
      // 削除された選択肢が正解だった場合、正解をリセット
      if (correctAnswer === index) {
        setCorrectAnswer(0);
      } else if (correctAnswer > index) {
        setCorrectAnswer(correctAnswer - 1);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle>試験対策問題の編集</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              問題形式
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as 'code' | 'multiple-choice')}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="code">コード入力</option>
              <option value="multiple-choice">選択肢問題</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              チャプター（任意）
            </label>
            <select
              value={chapterId}
              onChange={(e) => setChapterId(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">チャプターを選択しない（言語全体の問題）</option>
              {chapters.map((chapter) => (
                <option key={chapter.id} value={chapter.id}>
                  {chapter.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              タイトル（任意）
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                問題文 *
              </label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={() => setLanguageMode('japanese')}
                  variant={languageMode === 'japanese' ? 'default' : 'outline'}
                  size="sm"
                >
                  日本語
                </Button>
                <Button
                  type="button"
                  onClick={() => setLanguageMode('english')}
                  variant={languageMode === 'english' ? 'default' : 'outline'}
                  size="sm"
                >
                  英語
                </Button>
              </div>
            </div>
            {languageMode === 'japanese' ? (
              <textarea
                value={descriptionJapanese}
                onChange={(e) => setDescriptionJapanese(e.target.value)}
                onPaste={(e) => {
                  e.preventDefault();
                  const pastedText = e.clipboardData.getData('text/plain');
                  const textarea = e.currentTarget;
                  const start = textarea.selectionStart;
                  const end = textarea.selectionEnd;
                  const newValue = descriptionJapanese.substring(0, start) + pastedText + descriptionJapanese.substring(end);
                  setDescriptionJapanese(newValue);
                  setTimeout(() => {
                    textarea.setSelectionRange(start + pastedText.length, start + pastedText.length);
                  }, 0);
                }}
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:border-transparent h-24 ${
                  duplicateCheck ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                }`}
                required
                placeholder="日本語で問題文を入力してください"
              />
            ) : (
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onPaste={(e) => {
                  e.preventDefault();
                  const pastedText = e.clipboardData.getData('text/plain');
                  const textarea = e.currentTarget;
                  const start = textarea.selectionStart;
                  const end = textarea.selectionEnd;
                  const newValue = description.substring(0, start) + pastedText + description.substring(end);
                  setDescription(newValue);
                  setTimeout(() => {
                    textarea.setSelectionRange(start + pastedText.length, start + pastedText.length);
                  }, 0);
                }}
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:border-transparent h-24 ${
                  duplicateCheck ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                }`}
                required
                placeholder="Enter the problem description in English"
              />
            )}
            {duplicateCheck && (
              <p className="mt-1 text-sm text-red-600">
                ⚠️ 既に同じ問題が存在します。問題文が重複しています。
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              解説（任意）
            </label>
            <textarea
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              onPaste={(e) => {
                e.preventDefault();
                const pastedText = e.clipboardData.getData('text/plain');
                const textarea = e.currentTarget;
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const newValue = explanation.substring(0, start) + pastedText + explanation.substring(end);
                setExplanation(newValue);
                // カーソル位置を調整
                setTimeout(() => {
                  textarea.setSelectionRange(start + pastedText.length, start + pastedText.length);
                }, 0);
              }}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24"
              placeholder="問題の解説を入力してください"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              難易度
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="easy">易</option>
              <option value="medium">中</option>
              <option value="hard">難</option>
            </select>
          </div>

          {type === 'code' ? (
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  テストケース *
                </label>
                <Button
                  type="button"
                  onClick={addTestCase}
                  variant="outline"
                  size="sm"
                >
                  テストケースを追加
                </Button>
              </div>
              <div className="space-y-4">
                {testCases.map((testCase, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium">テストケース {index + 1}</h4>
                      {testCases.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => removeTestCase(index)}
                          variant="destructive"
                          size="sm"
                        >
                          削除
                        </Button>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">入力</label>
                        <input
                          type="text"
                          value={testCase.input}
                          onChange={(e) => updateTestCase(index, 'input', e.target.value)}
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">期待される出力</label>
                        <input
                          type="text"
                          value={testCase.expectedOutput}
                          onChange={(e) => updateTestCase(index, 'expectedOutput', e.target.value)}
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
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
                  onClick={addChoice}
                  variant="outline"
                  size="sm"
                >
                  選択肢を追加
                </Button>
              </div>
              <div className="space-y-2">
                {choices.map((choice, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span className="w-8 text-sm font-medium text-gray-700">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    <input
                      type="text"
                      value={choice}
                      onChange={(e) => updateChoice(index, e.target.value)}
                      className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={`選択肢 ${String.fromCharCode(65 + index)}`}
                    />
                    <input
                      type="checkbox"
                      checked={
                        Array.isArray(correctAnswer)
                          ? correctAnswer.includes(index)
                          : correctAnswer === index
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          if (Array.isArray(correctAnswer)) {
                            if (!correctAnswer.includes(index)) {
                              setCorrectAnswer([...correctAnswer, index]);
                            }
                          } else if (typeof correctAnswer === 'number') {
                            setCorrectAnswer([correctAnswer, index]);
                          } else {
                            setCorrectAnswer([index]);
                          }
                        } else {
                          if (Array.isArray(correctAnswer)) {
                            const newCorrect = correctAnswer.filter(idx => idx !== index);
                            setCorrectAnswer(newCorrect.length > 0 ? newCorrect : []);
                          } else if (correctAnswer === index) {
                            setCorrectAnswer([]);
                          }
                        }
                      }}
                      className="w-4 h-4"
                    />
                    <label className="text-sm text-gray-700">正解</label>
                    {choices.length > 2 && (
                      <Button
                        type="button"
                        onClick={() => removeChoice(index)}
                        variant="destructive"
                        size="sm"
                      >
                        削除
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

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

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onClose}>
              キャンセル
            </Button>
            <Button type="submit">更新</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

