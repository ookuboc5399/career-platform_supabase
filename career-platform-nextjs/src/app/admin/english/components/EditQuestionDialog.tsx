'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from '@/components/ui/dialog';
import { Question, WritingCategory } from '@/types/english';

interface EditQuestionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  question: Question | null;
  onUpdate: (question: Question) => Promise<void>;
}

export default function EditQuestionDialog({ open, onOpenChange, question, onUpdate }: EditQuestionDialogProps) {
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  useEffect(() => {
    if (question) {
      setEditingQuestion({
        ...question,
        englishId: question.englishId || question.id,
        category: question.category || 'book',
        difficulty: question.difficulty || 'beginner',
        level: question.level || 'junior'
      });
    }
  }, [question]);

  if (!editingQuestion || !question) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle>問題の編集</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>難易度</Label>
              <Select
                value={editingQuestion.difficulty || 'beginner'}
                onValueChange={(value: 'beginner' | 'intermediate' | 'advanced') => setEditingQuestion({
                  ...editingQuestion,
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
                value={editingQuestion.level || 'junior'}
                onValueChange={(value: 'junior' | 'high' | 'university') => setEditingQuestion({
                  ...editingQuestion,
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

            {editingQuestion.type === 'writing' && (
              <div>
                <Label>カテゴリー</Label>
                <Select
                  value={editingQuestion.category as WritingCategory || 'book'}
                  onValueChange={(value: WritingCategory) => setEditingQuestion({
                    ...editingQuestion,
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
            )}
          </div>

          {editingQuestion.content.format === 'translation' ? (
            <>
              {editingQuestion.category === 'school' && (
                <div>
                  <Label>学校名</Label>
                  <input
                    type="text"
                    value={editingQuestion.content.schoolName || ''}
                    onChange={(e) => setEditingQuestion({
                      ...editingQuestion,
                      content: {
                        ...editingQuestion.content,
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
                      const currentJapanese = Array.isArray(editingQuestion.content.japanese)
                        ? editingQuestion.content.japanese
                        : [editingQuestion.content.japanese || ''];
                      setEditingQuestion({
                        ...editingQuestion,
                        content: {
                          ...editingQuestion.content,
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
                {(Array.isArray(editingQuestion.content.japanese)
                  ? editingQuestion.content.japanese
                  : [editingQuestion.content.japanese || editingQuestion.content.question || '']
                ).map((text, index) => (
                  <div key={index} className="flex gap-2">
                    <Textarea
                      value={text}
                      onChange={(e) => {
                        const newJapanese = Array.isArray(editingQuestion.content.japanese)
                          ? [...editingQuestion.content.japanese]
                          : [editingQuestion.content.japanese || ''];
                        newJapanese[index] = e.target.value;
                        setEditingQuestion({
                          ...editingQuestion,
                          content: {
                            ...editingQuestion.content,
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
                          const newJapanese = Array.isArray(editingQuestion.content.japanese)
                            ? editingQuestion.content.japanese.filter((_, i) => i !== index)
                            : [];
                          setEditingQuestion({
                            ...editingQuestion,
                            content: {
                              ...editingQuestion.content,
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
                      const currentEnglish = Array.isArray(editingQuestion.content.english)
                        ? editingQuestion.content.english
                        : [editingQuestion.content.english || ''];
                      setEditingQuestion({
                        ...editingQuestion,
                        content: {
                          ...editingQuestion.content,
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
                {(Array.isArray(editingQuestion.content.english)
                  ? editingQuestion.content.english
                  : [editingQuestion.content.english || '']
                ).map((text, index) => (
                  <div key={index} className="flex gap-2">
                    <Textarea
                      value={text}
                      onChange={(e) => {
                        const newEnglish = Array.isArray(editingQuestion.content.english)
                          ? [...editingQuestion.content.english]
                          : [editingQuestion.content.english || ''];
                        newEnglish[index] = e.target.value;
                        setEditingQuestion({
                          ...editingQuestion,
                          content: {
                            ...editingQuestion.content,
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
                          const newEnglish = Array.isArray(editingQuestion.content.english)
                            ? editingQuestion.content.english.filter((_, i) => i !== index)
                            : [];
                          setEditingQuestion({
                            ...editingQuestion,
                            content: {
                              ...editingQuestion.content,
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
                  value={editingQuestion.content.question}
                  onChange={(e) => setEditingQuestion({
                    ...editingQuestion,
                    content: {
                      ...editingQuestion.content,
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
              value={editingQuestion.content.explanation}
              onChange={(e) => setEditingQuestion({
                ...editingQuestion,
                content: {
                  ...editingQuestion.content,
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
              onClick={() => {
                if (editingQuestion) {
                  onUpdate({
                    ...editingQuestion,
                    englishId: editingQuestion.englishId || editingQuestion.id
                  });
                }
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              更新
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
