'use client';

import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const categories = [
  { value: 'daily', label: '日常' },
  { value: 'self-introduction', label: '自己紹介' },
  { value: 'business', label: 'ビジネス' },
  { value: 'academic', label: 'アカデミック' },
  { value: 'review', label: 'レビュー' },
  { value: 'book', label: '書籍' },
  { value: 'school', label: '学校問題' },
  { value: 'ai', label: 'AI問題' }
];

const difficulties = [
  { value: 'beginner', label: '初級' },
  { value: 'intermediate', label: '中級' },
  { value: 'advanced', label: '上級' }
];

interface JapaneseInput {
  id: string;
  text: string;
}

export default function CreateWritingQuestionModal({ isOpen, onClose }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    japaneseInputs: [{ id: '1', text: '' }],
    english: '',
    explanation: '',
    category: '',
    difficulty: '',
    type: 'writing',
    schoolName: ''
  });

  const addJapaneseInput = () => {
    setFormData(prev => ({
      ...prev,
      japaneseInputs: [
        ...prev.japaneseInputs,
        { id: String(prev.japaneseInputs.length + 1), text: '' }
      ]
    }));
  };

  const updateJapaneseInput = (id: string, text: string) => {
    setFormData(prev => ({
      ...prev,
      japaneseInputs: prev.japaneseInputs.map(input =>
        input.id === id ? { ...input, text } : input
      )
    }));
  };

  const removeJapaneseInput = (id: string) => {
    setFormData(prev => ({
      ...prev,
      japaneseInputs: prev.japaneseInputs.filter(input => input.id !== id)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      const response = await fetch('/api/admin/english/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: {
            japanese: formData.japaneseInputs.map(input => input.text),
            english: formData.english,
            explanation: formData.explanation,
            schoolName: formData.category === 'school' ? formData.schoolName : undefined
          },
          category: formData.category,
          difficulty: formData.difficulty,
          type: formData.type
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create question');
      }

      // リセットして閉じる
      setFormData({
        japaneseInputs: [{ id: '1', text: '' }],
        english: '',
        explanation: '',
        category: '',
        difficulty: '',
        type: 'writing',
        schoolName: ''
      });
      onClose();
    } catch (error) {
      console.error('Error creating question:', error);
      alert('問題の作成に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white p-8">
        <h2 className="text-3xl font-bold mb-8">新規英作文問題作成</h2>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* カテゴリー */}
          <div>
            <label className="block text-base font-medium text-gray-900 mb-2">
              カテゴリー
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">選択してください</option>
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          {/* 学校名（学校問題の場合のみ表示） */}
          {formData.category === 'school' && (
            <div>
              <label className="block text-base font-medium text-gray-900 mb-2">
                学校名
              </label>
              <input
                type="text"
                value={formData.schoolName}
                onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="例：東京大学"
                required
              />
            </div>
          )}

          {/* 難易度 */}
          <div>
            <label className="block text-base font-medium text-gray-900 mb-2">
              難易度
            </label>
            <select
              value={formData.difficulty}
              onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">選択してください</option>
              {difficulties.map(diff => (
                <option key={diff.value} value={diff.value}>{diff.label}</option>
              ))}
            </select>
          </div>

          {/* 日本語（複数入力可能） */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-base font-medium text-gray-900">
                日本語
              </label>
              <Button
                type="button"
                onClick={addJapaneseInput}
                variant="outline"
                size="sm"
              >
                入力欄を追加
              </Button>
            </div>
            {formData.japaneseInputs.map((input, index) => (
              <div key={input.id} className="flex gap-2">
                <textarea
                  value={input.text}
                  onChange={(e) => updateJapaneseInput(input.id, e.target.value)}
                  className="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={2}
                  placeholder={`日本語 ${index + 1}`}
                  required
                />
                {formData.japaneseInputs.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => removeJapaneseInput(input.id)}
                    variant="destructive"
                    size="icon"
                  >
                    ×
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* 英語 */}
          <div>
            <label className="block text-base font-medium text-gray-900 mb-2">
              英語（模範解答）
            </label>
            <textarea
              value={formData.english}
              onChange={(e) => setFormData({ ...formData, english: e.target.value })}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={4}
              required
            />
          </div>

          {/* 解説 */}
          <div>
            <label className="block text-base font-medium text-gray-900 mb-2">
              解説
            </label>
            <textarea
              value={formData.explanation}
              onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={4}
              required
            />
          </div>

          {/* ボタン */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              onClick={() => {
                setFormData({
                  japaneseInputs: [{ id: '1', text: '' }],
                  english: '',
                  explanation: '',
                  category: '',
                  difficulty: '',
                  type: 'writing',
                  schoolName: ''
                });
                onClose();
              }}
              variant="outline"
            >
              キャンセル
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? '作成中...' : '作成'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
