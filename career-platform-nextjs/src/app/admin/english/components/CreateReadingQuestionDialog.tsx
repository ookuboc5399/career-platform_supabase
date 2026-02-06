'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from '@/components/ui/dialog';
import { ReadingQuestion } from '@/types/english';
import { Input } from '@/components/ui/input';

interface CreateReadingQuestionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (question: ReadingQuestion) => Promise<void>;
}

export default function CreateReadingQuestionDialog({ open, onOpenChange, onCreate }: CreateReadingQuestionDialogProps) {
  const [newQuestion, setNewQuestion] = useState<ReadingQuestion>({
    id: '',
    title: '',
    content: '',
    questions: [
      {
        id: '1',
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        explanation: ''
      }
    ],
    level: 'beginner',
    category: 'general',
    createdAt: ''
  });

  const addSubQuestion = () => {
    setNewQuestion({
      ...newQuestion,
      questions: [
        ...newQuestion.questions,
        {
          id: (newQuestion.questions.length + 1).toString(),
          question: '',
          options: ['', '', '', ''],
          correctAnswer: 0,
          explanation: ''
        }
      ]
    });
  };

  const removeSubQuestion = (index: number) => {
    setNewQuestion({
      ...newQuestion,
      questions: newQuestion.questions.filter((_, i) => i !== index)
    });
  };

  const updateSubQuestion = (index: number, field: string, value: string | number) => {
    const updatedQuestions = [...newQuestion.questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value
    };
    setNewQuestion({
      ...newQuestion,
      questions: updatedQuestions
    });
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...newQuestion.questions];
    const options = [...updatedQuestions[questionIndex].options];
    options[optionIndex] = value;
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      options
    };
    setNewQuestion({
      ...newQuestion,
      questions: updatedQuestions
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle>新規長文読解問題作成</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>難易度</Label>
              <Select
                value={newQuestion.level}
                onValueChange={(value: 'beginner' | 'intermediate' | 'advanced') => setNewQuestion({
                  ...newQuestion,
                  level: value
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
              <Label>カテゴリー</Label>
              <Select
                value={newQuestion.category}
                onValueChange={(value: 'general' | 'business' | 'academic') => setNewQuestion({
                  ...newQuestion,
                  category: value
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="general">一般</SelectItem>
                  <SelectItem value="business">ビジネス</SelectItem>
                  <SelectItem value="academic">学術</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>タイトル（任意）</Label>
            <Input
              value={newQuestion.title}
              onChange={(e) => setNewQuestion({
                ...newQuestion,
                title: e.target.value
              })}
              placeholder="長文のタイトルを入力"
            />
          </div>

          <div>
            <Label>長文</Label>
            <Textarea
              value={newQuestion.content}
              onChange={(e) => setNewQuestion({
                ...newQuestion,
                content: e.target.value
              })}
              placeholder="英語の長文を入力"
              className="min-h-[200px]"
            />
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Label>設問</Label>
              <Button
                type="button"
                onClick={addSubQuestion}
                variant="outline"
                size="sm"
              >
                設問を追加
              </Button>
            </div>

            {newQuestion.questions.map((subQuestion, index) => (
              <div key={subQuestion.id} className="space-y-4 border p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">設問 {index + 1}</h3>
                  {index > 0 && (
                    <Button
                      type="button"
                      onClick={() => removeSubQuestion(index)}
                      variant="destructive"
                      size="sm"
                    >
                      削除
                    </Button>
                  )}
                </div>

                <div>
                  <Label>問題文</Label>
                  <Textarea
                    value={subQuestion.question}
                    onChange={(e) => updateSubQuestion(index, 'question', e.target.value)}
                    placeholder="問題文を入力"
                  />
                </div>

                <div className="space-y-2">
                  <Label>選択肢</Label>
                  {subQuestion.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center gap-2">
                      <span className="w-6">{optionIndex + 1}.</span>
                      <Input
                        value={option}
                        onChange={(e) => updateOption(index, optionIndex, e.target.value)}
                        placeholder={`選択肢 ${optionIndex + 1}`}
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <Label>正解</Label>
                  <Select
                    value={subQuestion.correctAnswer.toString()}
                    onValueChange={(value) => updateSubQuestion(index, 'correctAnswer', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {subQuestion.options.map((_, optionIndex) => (
                        <SelectItem
                          key={optionIndex}
                          value={optionIndex.toString()}
                        >
                          選択肢 {optionIndex + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>解説</Label>
                  <Textarea
                    value={subQuestion.explanation}
                    onChange={(e) => updateSubQuestion(index, 'explanation', e.target.value)}
                    placeholder="解説を入力"
                  />
                </div>
              </div>
            ))}
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
