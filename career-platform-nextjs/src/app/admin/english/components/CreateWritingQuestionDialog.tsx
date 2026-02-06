'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from '@/components/ui/dialog';
import { Question, WritingCategory, WritingLevel } from '@/types/english';
import { Input } from '@/components/ui/input';

interface CreateWritingQuestionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (question: Question) => Promise<void>;
}

export default function CreateWritingQuestionDialog({ open, onOpenChange, onCreate }: CreateWritingQuestionDialogProps) {
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
      japanese: [''],
      english: [''],
      format: 'translation'
    },
    createdAt: ''
  });

  const addJapanese = () => {
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
  };

  const removeJapanese = (index: number) => {
    const newJapanese = Array.isArray(newQuestion.content.japanese)
      ? newQuestion.content.japanese.filter((_: string, i: number) => i !== index)
      : [];
    setNewQuestion({
      ...newQuestion,
      content: {
        ...newQuestion.content,
        japanese: newJapanese
      }
    });
  };

  const updateJapanese = (index: number, value: string) => {
    const newJapanese = Array.isArray(newQuestion.content.japanese)
      ? [...newQuestion.content.japanese]
      : [newQuestion.content.japanese || ''];
    newJapanese[index] = value;
    setNewQuestion({
      ...newQuestion,
      content: {
        ...newQuestion.content,
        japanese: newJapanese,
        question: newJapanese[0]
      }
    });
  };

  const addEnglish = () => {
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
  };

  const removeEnglish = (index: number) => {
    const newEnglish = Array.isArray(newQuestion.content.english)
      ? newQuestion.content.english.filter((_: string, i: number) => i !== index)
      : [];
    setNewQuestion({
      ...newQuestion,
      content: {
        ...newQuestion.content,
        english: newEnglish
      }
    });
  };

  const updateEnglish = (index: number, value: string) => {
    const newEnglish = Array.isArray(newQuestion.content.english)
      ? [...newQuestion.content.english]
      : [newQuestion.content.english || ''];
    newEnglish[index] = value;
    setNewQuestion({
      ...newQuestion,
      content: {
        ...newQuestion.content,
        english: newEnglish
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle>新規英作文問題作成</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>難易度</Label>
              <Select
                value={newQuestion.difficulty}
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
                value={newQuestion.level}
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
                value={newQuestion.category as WritingCategory}
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
          </div>

          {newQuestion.category === 'school' && (
            <div>
              <Label>学校名</Label>
              <Input
                value={newQuestion.content.schoolName || ''}
                onChange={(e) => setNewQuestion({
                  ...newQuestion,
                  content: {
                    ...newQuestion.content,
                    schoolName: e.target.value
                  }
                })}
                placeholder="例: 東京大学"
              />
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>日本語</Label>
              <Button
                type="button"
                onClick={addJapanese}
                variant="outline"
                size="sm"
              >
                入力欄を追加
              </Button>
            </div>
            {(Array.isArray(newQuestion.content.japanese)
              ? newQuestion.content.japanese
              : [newQuestion.content.japanese || '']
            ).map((text: string, index: number) => (
              <div key={index} className="flex gap-2">
                <Textarea
                  value={text}
                  onChange={(e) => updateJapanese(index, e.target.value)}
                  placeholder={`日本語 ${index + 1}`}
                  className="flex-1"
                />
                {index > 0 && (
                  <Button
                    type="button"
                    onClick={() => removeJapanese(index)}
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
                onClick={addEnglish}
                variant="outline"
                size="sm"
              >
                入力欄を追加
              </Button>
            </div>
            {(Array.isArray(newQuestion.content.english)
              ? newQuestion.content.english
              : [newQuestion.content.english || '']
            ).map((text: string, index: number) => (
              <div key={index} className="flex gap-2">
                <Textarea
                  value={text}
                  onChange={(e) => updateEnglish(index, e.target.value)}
                  placeholder={`英語 ${index + 1}`}
                  className="flex-1"
                />
                {index > 0 && (
                  <Button
                    type="button"
                    onClick={() => removeEnglish(index)}
                    variant="destructive"
                    size="icon"
                  >
                    ×
                  </Button>
                )}
              </div>
            ))}
          </div>

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
              placeholder="解説を入力"
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
