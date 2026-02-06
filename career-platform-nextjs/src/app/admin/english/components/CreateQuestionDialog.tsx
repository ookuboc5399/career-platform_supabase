'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from '@/components/ui/dialog';
import { Question, WritingCategory, WritingLevel } from '@/types/english';

interface CreateQuestionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (question: Question) => Promise<void>;
}

export default function CreateQuestionDialog({ open, onOpenChange, onCreate }: CreateQuestionDialogProps) {
  const [questionFormat, setQuestionFormat] = useState<'multiple_choice' | 'translation'>('translation');
  const [newQuestion, setNewQuestion] = useState<Question>({
    id: '',
    type: 'writing',
    imageUrl: '',
    level: 'junior',
    difficulty: 'beginner',
    category: 'book',
    content: {
      question: '',
      options: [],
      correctAnswers: [],
      explanation: '',
      japanese: '',
      english: '',
      format: 'translation'
    },
    createdAt: '',
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle>新規問題作成</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <Label>難易度</Label>
              <Select
                value={newQuestion.difficulty || 'beginner'}
                onValueChange={(value: 'beginner' | 'intermediate' | 'advanced') => setNewQuestion({
                  ...newQuestion,
                  difficulty: value
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="beginner">初級</SelectItem>
                  <SelectItem value="intermediate">中級</SelectItem>
                  <SelectItem value="advanced">上級</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>レベル</Label>
              <Select
                value={newQuestion.level || 'junior'}
                onValueChange={(value: WritingLevel) => setNewQuestion({
                  ...newQuestion,
                  level: value
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="junior">中学レベル</SelectItem>
                  <SelectItem value="high">高校レベル</SelectItem>
                  <SelectItem value="university">大学レベル</SelectItem>
                </SelectContent>
              </Select>
            </div>

              <div>
                <Label>カテゴリー</Label>
                <Select
                  value={newQuestion.category as WritingCategory || 'book'}
                  onValueChange={(value: WritingCategory) => setNewQuestion({
                    ...newQuestion,
                    category: value
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="book">書籍</SelectItem>
                    <SelectItem value="school">学校問題</SelectItem>
                    <SelectItem value="ai">AI問題</SelectItem>
                  </SelectContent>
                </Select>
              </div>

            <div>
              <Label>問題形式</Label>
              <Select
                value={questionFormat}
                onValueChange={(value: 'multiple_choice' | 'translation') => {
                  setQuestionFormat(value);
                  setNewQuestion({
                    ...newQuestion,
                    content: {
                      ...newQuestion.content,
                      format: value,
                      options: value === 'multiple_choice' ? ['', '', '', ''] : [],
                      correctAnswers: [],
                      japanese: '',
                      english: ''
                    }
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="translation">日本語・英語対応</SelectItem>
                  <SelectItem value="multiple_choice">選択式</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {questionFormat === 'translation' ? (
            <>
              {newQuestion.category === 'school' && (
                <div>
                  <Label>学校名</Label>
                  <input
                    type="text"
                    value={newQuestion.content.schoolName || ''}
                    onChange={(e) => setNewQuestion({
                      ...newQuestion,
                      content: {
                        ...newQuestion.content,
                        schoolName: e.target.value
                      }
                    })}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="例: 東京大学"
                  />
                </div>
              )}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>日本語</Label>
                  <Button
                    type="button"
                    onClick={() => {
                      const currentJapanese = Array.isArray(newQuestion.content.japanese)
                        ? newQuestion.content.japanese
                        : [newQuestion.content.japanese || ''];
                      setNewQuestion({
                        ...newQuestion,
                        content: {
                          ...newQuestion.content,
                          japanese: [...currentJapanese, '']
                        }
                      });
                    }}
                    variant="outline"
                    size="sm"
                  >
                    入力欄を追加
                  </Button>
                </div>
                {(Array.isArray(newQuestion.content.japanese)
                  ? newQuestion.content.japanese
                  : [newQuestion.content.japanese || '']
                ).map((text, index) => (
                  <div key={index} className="flex gap-2">
                    <Textarea
                      value={text}
                      onChange={(e) => {
                        const newJapanese = Array.isArray(newQuestion.content.japanese)
                          ? [...newQuestion.content.japanese]
                          : [newQuestion.content.japanese || ''];
                        newJapanese[index] = e.target.value;
                        setNewQuestion({
                          ...newQuestion,
                          content: {
                            ...newQuestion.content,
                            japanese: newJapanese,
                            question: newJapanese[0]
                          }
                        });
                      }}
                      placeholder={`日本語 ${index + 1}`}
                      className="flex-1"
                    />
                    {index > 0 && (
                      <Button
                        type="button"
                        onClick={() => {
                          const newJapanese = Array.isArray(newQuestion.content.japanese)
                            ? newQuestion.content.japanese.filter((_, i) => i !== index)
                            : [];
                          setNewQuestion({
                            ...newQuestion,
                            content: {
                              ...newQuestion.content,
                              japanese: newJapanese
                            }
                          });
                        }}
                        variant="destructive"
                        size="icon"
                      >
                        ×
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>英語</Label>
                  <Button
                    type="button"
                    onClick={() => {
                      const currentEnglish = Array.isArray(newQuestion.content.english)
                        ? newQuestion.content.english
                        : [newQuestion.content.english || ''];
                      setNewQuestion({
                        ...newQuestion,
                        content: {
                          ...newQuestion.content,
                          english: [...currentEnglish, '']
                        }
                      });
                    }}
                    variant="outline"
                    size="sm"
                  >
                    入力欄を追加
                  </Button>
                </div>
                {(Array.isArray(newQuestion.content.english)
                  ? newQuestion.content.english
                  : [newQuestion.content.english || '']
                ).map((text, index) => (
                  <div key={index} className="flex gap-2">
                    <Textarea
                      value={text}
                      onChange={(e) => {
                        const newEnglish = Array.isArray(newQuestion.content.english)
                          ? [...newQuestion.content.english]
                          : [newQuestion.content.english || ''];
                        newEnglish[index] = e.target.value;
                        setNewQuestion({
                          ...newQuestion,
                          content: {
                            ...newQuestion.content,
                            english: newEnglish
                          }
                        });
                      }}
                      placeholder={`英語 ${index + 1}`}
                      className="flex-1"
                    />
                    {index > 0 && (
                      <Button
                        type="button"
                        onClick={() => {
                          const newEnglish = Array.isArray(newQuestion.content.english)
                            ? newQuestion.content.english.filter((_, i) => i !== index)
                            : [];
                          setNewQuestion({
                            ...newQuestion,
                            content: {
                              ...newQuestion.content,
                              english: newEnglish
                            }
                          });
                        }}
                        variant="destructive"
                        size="icon"
                      >
                        ×
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <div>
                <Label>問題文</Label>
                <Textarea
                  value={newQuestion.content.question}
                  onChange={(e) => setNewQuestion({
                    ...newQuestion,
                    content: {
                      ...newQuestion.content,
                      question: e.target.value
                    }
                  })}
                />
              </div>
            </>
          )}

          <div>
            <Label>解説</Label>
            <Textarea
              value={newQuestion.content.explanation}
              onChange={(e) => setNewQuestion({
                ...newQuestion,
                content: {
                  ...newQuestion.content,
                  explanation: e.target.value
                }
              })}
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button
              onClick={() => onOpenChange(false)}
              variant="outline"
            >
              キャンセル
            </Button>
            <Button
              onClick={async () => {
                const timestamp = Date.now();
                await onCreate({
                  ...newQuestion,
                  id: timestamp.toString(),
                  englishId: `question-${timestamp}`,
                  createdAt: new Date().toISOString(),
                });
              }}
              className="bg-green-600 hover:bg-green-700"
            >
              作成
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
