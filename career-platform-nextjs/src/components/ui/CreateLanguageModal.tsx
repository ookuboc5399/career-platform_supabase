'use client';

import { useState } from 'react';
import { Button } from './button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './dialog';
import { ProgrammingLanguage } from '@/lib/cosmos-db';

interface CreateLanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<ProgrammingLanguage, 'createdAt' | 'updatedAt'>) => void;
}

export default function CreateLanguageModal({ isOpen, onClose, onSave }: CreateLanguageModalProps) {
  const [id, setId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'language' | 'framework'>('language');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: id.toLowerCase(),
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
          <DialogTitle>新規プログラミング言語追加</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              種類
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as 'language' | 'framework')}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="language">プログラミング言語</option>
              <option value="framework">フレームワーク</option>
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
            />
          </div>

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
