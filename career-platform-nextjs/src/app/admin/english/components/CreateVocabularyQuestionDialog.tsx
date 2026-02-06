'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from '@/components/ui/dialog';
import { VocabularyQuestion } from '@/types/english';
import { Input } from '@/components/ui/input';

interface CreateVocabularyQuestionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (question: VocabularyQuestion) => Promise<void>;
}

export default function CreateVocabularyQuestionDialog({ open, onOpenChange, onCreate }: CreateVocabularyQuestionDialogProps) {
  const [newQuestion, setNewQuestion] = useState<VocabularyQuestion>({
    id: '',
    word: '',
    meaning: '',
    pronunciation: '',
    partOfSpeech: 'noun',
    examples: [''],
    synonyms: [''],
    antonyms: [''],
    level: 'beginner',
    category: 'general',
    createdAt: ''
  });

  const addExample = () => {
    setNewQuestion({
      ...newQuestion,
      examples: [...newQuestion.examples, '']
    });
  };

  const removeExample = (index: number) => {
    setNewQuestion({
      ...newQuestion,
      examples: newQuestion.examples.filter((_: string, i: number) => i !== index)
    });
  };

  const updateExample = (index: number, value: string) => {
    const updatedExamples = [...newQuestion.examples];
    updatedExamples[index] = value;
    setNewQuestion({
      ...newQuestion,
      examples: updatedExamples
    });
  };

  const addSynonym = () => {
    setNewQuestion({
      ...newQuestion,
      synonyms: [...newQuestion.synonyms, '']
    });
  };

  const removeSynonym = (index: number) => {
    setNewQuestion({
      ...newQuestion,
      synonyms: newQuestion.synonyms.filter((_: string, i: number) => i !== index)
    });
  };

  const updateSynonym = (index: number, value: string) => {
    const updatedSynonyms = [...newQuestion.synonyms];
    updatedSynonyms[index] = value;
    setNewQuestion({
      ...newQuestion,
      synonyms: updatedSynonyms
    });
  };

  const addAntonym = () => {
    setNewQuestion({
      ...newQuestion,
      antonyms: [...newQuestion.antonyms, '']
    });
  };

  const removeAntonym = (index: number) => {
    setNewQuestion({
      ...newQuestion,
      antonyms: newQuestion.antonyms.filter((_: string, i: number) => i !== index)
    });
  };

  const updateAntonym = (index: number, value: string) => {
    const updatedAntonyms = [...newQuestion.antonyms];
    updatedAntonyms[index] = value;
    setNewQuestion({
      ...newQuestion,
      antonyms: updatedAntonyms
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle>新規単語問題作成</DialogTitle>
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
              <Label>品詞</Label>
              <Select
                value={newQuestion.partOfSpeech}
                onValueChange={(value: 'noun' | 'verb' | 'adjective' | 'adverb' | 'preposition' | 'conjunction' | 'interjection') => setNewQuestion({
                  ...newQuestion,
                  partOfSpeech: value
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="noun">名詞</SelectItem>
                  <SelectItem value="verb">動詞</SelectItem>
                  <SelectItem value="adjective">形容詞</SelectItem>
                  <SelectItem value="adverb">副詞</SelectItem>
                  <SelectItem value="preposition">前置詞</SelectItem>
                  <SelectItem value="conjunction">接続詞</SelectItem>
                  <SelectItem value="interjection">間投詞</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>カテゴリー</Label>
              <Select
                value={newQuestion.category}
                onValueChange={(value: 'general' | 'business' | 'academic' | 'toeic') => setNewQuestion({
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
                  <SelectItem value="toeic">TOEIC</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>単語</Label>
            <Input
              value={newQuestion.word}
              onChange={(e) => setNewQuestion({
                ...newQuestion,
                word: e.target.value
              })}
              placeholder="英単語を入力"
            />
          </div>

          <div>
            <Label>発音記号</Label>
            <Input
              value={newQuestion.pronunciation}
              onChange={(e) => setNewQuestion({
                ...newQuestion,
                pronunciation: e.target.value
              })}
              placeholder="発音記号を入力"
            />
          </div>

          <div>
            <Label>意味</Label>
            <Textarea
              value={newQuestion.meaning}
              onChange={(e) => setNewQuestion({
                ...newQuestion,
                meaning: e.target.value
              })}
              placeholder="日本語の意味を入力"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>例文</Label>
              <Button
                type="button"
                onClick={addExample}
                variant="outline"
                size="sm"
              >
                例文を追加
              </Button>
            </div>
            {newQuestion.examples.map((example: string, index: number) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={example}
                  onChange={(e) => updateExample(index, e.target.value)}
                  placeholder={`例文 ${index + 1}`}
                  className="flex-1"
                />
                {index > 0 && (
                  <Button
                    type="button"
                    onClick={() => removeExample(index)}
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
              <Label>類義語</Label>
              <Button
                type="button"
                onClick={addSynonym}
                variant="outline"
                size="sm"
              >
                類義語を追加
              </Button>
            </div>
            {newQuestion.synonyms.map((synonym: string, index: number) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={synonym}
                  onChange={(e) => updateSynonym(index, e.target.value)}
                  placeholder={`類義語 ${index + 1}`}
                  className="flex-1"
                />
                {index > 0 && (
                  <Button
                    type="button"
                    onClick={() => removeSynonym(index)}
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
              <Label>反意語</Label>
              <Button
                type="button"
                onClick={addAntonym}
                variant="outline"
                size="sm"
              >
                反意語を追加
              </Button>
            </div>
            {newQuestion.antonyms.map((antonym: string, index: number) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={antonym}
                  onChange={(e) => updateAntonym(index, e.target.value)}
                  placeholder={`反意語 ${index + 1}`}
                  className="flex-1"
                />
                {index > 0 && (
                  <Button
                    type="button"
                    onClick={() => removeAntonym(index)}
                    variant="destructive"
                    size="icon"
                  >
                    ×
                  </Button>
                )}
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
