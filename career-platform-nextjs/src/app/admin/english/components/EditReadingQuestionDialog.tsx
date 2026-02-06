'use client';

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface EditReadingQuestionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData: any;
}

export function EditReadingQuestionDialog({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: EditReadingQuestionDialogProps) {
  const [title, setTitle] = useState(initialData.content.title || '');
  const [content, setContent] = useState(initialData.content.content || '');
  const [level, setLevel] = useState(initialData.content.level || 'beginner');
  const [category, setCategory] = useState(initialData.content.category || 'general');
  const [questions, setQuestions] = useState(initialData.content.questions || []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      type: 'reading',
      content: {
        title,
        content,
        level,
        category,
        questions,
      },
    });
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: Date.now().toString(),
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        explanation: '',
      },
    ]);
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    const newQuestions = [...questions];
    newQuestions[index] = {
      ...newQuestions[index],
      [field]: value,
    };
    setQuestions(newQuestions);
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(newQuestions);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>長文読解問題の編集</DialogTitle>
          <DialogDescription>
            問題の内容を編集してください。
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">タイトル（任意）</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="content">長文</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className="h-40"
              />
            </div>
            <div className="grid gap-2">
              <Label>難易度</Label>
              <RadioGroup
                value={level}
                onValueChange={setLevel}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="beginner" id="beginner" />
                  <Label htmlFor="beginner">初級</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="intermediate" id="intermediate" />
                  <Label htmlFor="intermediate">中級</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="advanced" id="advanced" />
                  <Label htmlFor="advanced">上級</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="grid gap-2">
              <Label>カテゴリー</Label>
              <RadioGroup
                value={category}
                onValueChange={setCategory}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="general" id="general" />
                  <Label htmlFor="general">一般</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="business" id="business" />
                  <Label htmlFor="business">ビジネス</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="academic" id="academic" />
                  <Label htmlFor="academic">学術</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="grid gap-4">
              <div className="flex justify-between items-center">
                <Label>問題</Label>
                <Button type="button" onClick={addQuestion}>
                  問題を追加
                </Button>
              </div>
              {questions.map((q: any, index: number) => (
                <div key={q.id} className="border p-4 rounded-lg">
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label>問題文</Label>
                      <Input
                        value={q.question}
                        onChange={(e) =>
                          updateQuestion(index, 'question', e.target.value)
                        }
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>選択肢</Label>
                      {q.options.map((option: string, optionIndex: number) => (
                        <div key={optionIndex} className="flex gap-2 items-center">
                          <Input
                            value={option}
                            onChange={(e) =>
                              updateOption(index, optionIndex, e.target.value)
                            }
                            required
                          />
                          <RadioGroup
                            value={q.correctAnswer.toString()}
                            onValueChange={(value) =>
                              updateQuestion(index, 'correctAnswer', parseInt(value))
                            }
                          >
                            <RadioGroupItem
                              value={optionIndex.toString()}
                              id={`q${index}-option${optionIndex}`}
                            />
                          </RadioGroup>
                        </div>
                      ))}
                    </div>
                    <div className="grid gap-2">
                      <Label>解説</Label>
                      <Textarea
                        value={q.explanation}
                        onChange={(e) =>
                          updateQuestion(index, 'explanation', e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">保存</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
