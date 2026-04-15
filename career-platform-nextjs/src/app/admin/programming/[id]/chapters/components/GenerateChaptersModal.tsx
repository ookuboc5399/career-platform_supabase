'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface GenerateChaptersModalProps {
  isOpen: boolean;
  onClose: () => void;
  languageId: string;
  languageName?: string;
  onGenerated: () => void;
}

export default function GenerateChaptersModal({
  isOpen,
  onClose,
  languageId,
  languageName,
  onGenerated,
}: GenerateChaptersModalProps) {
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [generatedCount, setGeneratedCount] = useState<number | null>(null);
  const [usedObsidian, setUsedObsidian] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;

    setIsGenerating(true);
    setError('');
    setGeneratedCount(null);

    try {
      const response = await fetch('/api/programming/chapters/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ languageId, languageName, topic }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'チャプターの生成に失敗しました');
      }

      setGeneratedCount(data.chapters.length);
      setUsedObsidian(data.usedObsidian || false);
      onGenerated();
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期しないエラーが発生しました');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClose = () => {
    setTopic('');
    setError('');
    setGeneratedCount(null);
    setUsedObsidian(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg bg-white">
        <DialogHeader>
          <DialogTitle>AIでチャプターを自動生成</DialogTitle>
          <DialogDescription>
            トピックを入力すると、AI が学習カリキュラムを自動で作成します。事前にサイドバーの「学習ナレッジ」で GitHub Docs を Vault に同期しておくと、公式ドキュメントに基づいた案を出しやすくなります。
          </DialogDescription>
        </DialogHeader>

        {generatedCount !== null ? (
          <div className="py-4">
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <p className="text-green-800 font-medium">
                  {generatedCount}個のチャプターを生成しました（下書き状態）
                </p>
                {usedObsidian && (
                  <p className="text-green-700 text-sm mt-1 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    Obsidianのナレッジを参照して生成しました
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button onClick={handleClose}>閉じる</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                学習トピック
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="例: プロンプトエンジニアリング基礎、APIの使い方、RAGシステムの構築..."
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyDown={(e) => e.key === 'Enter' && !isGenerating && handleGenerate()}
                disabled={isGenerating}
              />
              <p className="mt-1 text-xs text-gray-500">
                具体的なトピックを入力すると、より適切なチャプター構成が生成されます
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {error}
              </div>
            )}

            {isGenerating && (
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                <span className="text-sm text-blue-700">チャプターを生成中...</span>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={handleClose} disabled={isGenerating}>
                キャンセル
              </Button>
              <Button
                onClick={handleGenerate}
                disabled={!topic.trim() || isGenerating}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isGenerating ? '生成中...' : 'AIで生成'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
