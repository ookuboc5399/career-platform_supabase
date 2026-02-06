'use client';

import { useState, useEffect } from 'react';
import { Button } from './button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './dialog';
import { ProgrammingLanguage } from '@/types/api';

interface CreateLanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<ProgrammingLanguage, 'createdAt' | 'updatedAt'>) => void;
  editingLanguage?: ProgrammingLanguage | null;
}

export default function CreateLanguageModal({ isOpen, onClose, onSave, editingLanguage }: CreateLanguageModalProps) {
  const [id, setId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'language' | 'framework' | 'ai-platform' | 'data-warehouse' | 'others' | 'saas' | 'cloud' | 'network'>('language');

  // 編集モードの場合、初期値を設定
  useEffect(() => {
    if (editingLanguage) {
      setId(editingLanguage.id);
      setTitle(editingLanguage.title);
      setDescription(editingLanguage.description || '');
      setType(editingLanguage.type);
    } else {
      setId('');
      setTitle('');
      setDescription('');
      setType('language');
    }
  }, [editingLanguage, isOpen]);

  const generateId = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-') // 英数字以外をハイフンに変換
      .replace(/^-+|-+$/g, ''); // 先頭と末尾のハイフンを削除
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    // 編集モードの場合はIDを変更しない
    if (!editingLanguage) {
      setId(generateId(newTitle));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: id || generateId(title),
      title,
      description,
      type,
    });
    setId('');
    setTitle('');
    setDescription('');
    setType('language');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white">
        <DialogHeader>
          <DialogTitle>{editingLanguage ? 'プログラミング言語編集' : '新規プログラミング言語追加'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              種類
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as 'language' | 'framework' | 'ai-platform' | 'data-warehouse' | 'others' | 'saas' | 'cloud' | 'network')}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="language">プログラミング言語</option>
              <option value="framework">フレームワーク</option>
              <option value="ai-platform">ワークフロー開発プラットフォーム</option>
              <option value="data-warehouse">データウェアハウス</option>
              <option value="cloud">クラウド</option>
              <option value="network">ネットワーク</option>
              <option value="saas">SaaS</option>
              <option value="others">その他</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID（英数字）
            </label>
            <input
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              pattern="[a-zA-Z0-9]+"
              disabled={!!editingLanguage}
            />
            {editingLanguage && (
              <p className="mt-1 text-sm text-gray-500">IDは編集できません</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              タイトル
            </label>
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
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
