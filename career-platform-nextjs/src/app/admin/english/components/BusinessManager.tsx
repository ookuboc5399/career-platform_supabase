'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface BusinessContent {
  id: string;
  title: string;
  description: string;
  category: 'meeting' | 'email' | 'presentation' | 'negotiation';
  level: 'beginner' | 'intermediate' | 'advanced';
  content: string;
  examples: string[];
  tips: string[];
}

export default function BusinessManager() {
  const [contents, setContents] = useState<BusinessContent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedContent, setSelectedContent] = useState<BusinessContent | null>(null);

  useEffect(() => {
    loadContents();
  }, []);

  const loadContents = async () => {
    try {
      const response = await fetch('/api/admin/english/business');
      if (!response.ok) {
        throw new Error('Failed to load business contents');
      }
      const data = await response.json();
      setContents(data);
    } catch (error) {
      console.error('Error loading business contents:', error);
      setError('Failed to load business contents');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContent) return;

    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/english/business', {
        method: selectedContent.id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedContent),
      });

      if (!response.ok) {
        throw new Error('Failed to save business content');
      }

      await loadContents();
      setSelectedContent(null);
    } catch (error) {
      console.error('Error saving business content:', error);
      setError('Failed to save business content');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/english/business/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete business content');
      }

      await loadContents();
    } catch (error) {
      console.error('Error deleting business content:', error);
      setError('Failed to delete business content');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">ビジネス英語</h2>
        <Button
          onClick={() => setSelectedContent({
            id: '',
            title: '',
            description: '',
            category: 'meeting',
            level: 'intermediate',
            content: '',
            examples: [],
            tips: [],
          })}
        >
          新規作成
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {selectedContent && (
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">
            {selectedContent.id ? 'コンテンツを編集' : '新規コンテンツ'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">タイトル</label>
              <Input
                value={selectedContent.title}
                onChange={(e) => setSelectedContent({
                  ...selectedContent,
                  title: e.target.value,
                })}
                placeholder="コンテンツのタイトル"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">説明</label>
              <textarea
                className="w-full px-3 py-2 border rounded-md"
                value={selectedContent.description}
                onChange={(e) => setSelectedContent({
                  ...selectedContent,
                  description: e.target.value,
                })}
                rows={4}
                placeholder="コンテンツの説明"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">カテゴリー</label>
                <select
                  className="w-full px-3 py-2 border rounded-md"
                  value={selectedContent.category}
                  onChange={(e) => setSelectedContent({
                    ...selectedContent,
                    category: e.target.value as BusinessContent['category'],
                  })}
                  required
                >
                  <option value="meeting">ミーティング</option>
                  <option value="email">メール</option>
                  <option value="presentation">プレゼンテーション</option>
                  <option value="negotiation">交渉</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">レベル</label>
                <select
                  className="w-full px-3 py-2 border rounded-md"
                  value={selectedContent.level}
                  onChange={(e) => setSelectedContent({
                    ...selectedContent,
                    level: e.target.value as BusinessContent['level'],
                  })}
                  required
                >
                  <option value="beginner">初級</option>
                  <option value="intermediate">中級</option>
                  <option value="advanced">上級</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">コンテンツ</label>
              <textarea
                className="w-full px-3 py-2 border rounded-md"
                value={selectedContent.content}
                onChange={(e) => setSelectedContent({
                  ...selectedContent,
                  content: e.target.value,
                })}
                rows={8}
                placeholder="メインコンテンツ"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">例文</label>
              <textarea
                className="w-full px-3 py-2 border rounded-md"
                value={selectedContent.examples.join('\n')}
                onChange={(e) => setSelectedContent({
                  ...selectedContent,
                  examples: e.target.value.split('\n').filter(line => line.trim()),
                })}
                rows={4}
                placeholder="例文を1行に1つずつ入力"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">ヒント</label>
              <textarea
                className="w-full px-3 py-2 border rounded-md"
                value={selectedContent.tips.join('\n')}
                onChange={(e) => setSelectedContent({
                  ...selectedContent,
                  tips: e.target.value.split('\n').filter(line => line.trim()),
                })}
                rows={4}
                placeholder="ヒントを1行に1つずつ入力"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setSelectedContent(null)}
              >
                キャンセル
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? '保存中...' : '保存'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4">
        {contents.map((content) => (
          <Card key={content.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium px-2 py-1 rounded bg-blue-100 text-blue-800">
                    {content.category === 'meeting' ? 'ミーティング' :
                     content.category === 'email' ? 'メール' :
                     content.category === 'presentation' ? 'プレゼンテーション' :
                     '交渉'}
                  </span>
                  <span className="text-sm font-medium px-2 py-1 rounded bg-green-100 text-green-800">
                    {content.level === 'beginner' ? '初級' :
                     content.level === 'intermediate' ? '中級' :
                     '上級'}
                  </span>
                </div>
                <h3 className="text-lg font-semibold">{content.title}</h3>
                <p className="text-gray-500 text-sm mt-1">{content.description}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedContent(content)}
                >
                  編集
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(content.id)}
                >
                  削除
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
