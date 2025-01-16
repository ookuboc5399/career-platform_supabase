'use client';

import { useState, useEffect } from 'react';
import VideoPlayer from '@/components/ui/VideoPlayer';

interface Chapter {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  content: string;
}

interface ChapterProgress {
  videoCompleted: boolean;
  completed: boolean;
}

interface ChapterContentProps {
  chapter: Chapter;
  onComplete?: () => void;
}

export default function ChapterContent({ chapter, onComplete }: ChapterContentProps) {
  const [progress, setProgress] = useState<ChapterProgress>({
    videoCompleted: false,
    completed: false,
  });

  useEffect(() => {
    // 進捗情報を取得（仮の実装）
    setProgress({
      videoCompleted: false,
      completed: false,
    });
  }, [chapter.id]);

  const handleVideoComplete = async () => {
    try {
      // 進捗を更新
      setProgress(prev => ({
        ...prev,
        videoCompleted: true,
      }));

      // 親コンポーネントに完了を通知
      onComplete?.();
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  return (
    <div className="space-y-8">
      {/* ビデオセクション */}
      <div>
        <h2 className="text-xl font-semibold mb-4">レッスン動画</h2>
        <div className="aspect-video bg-black rounded-lg overflow-hidden">
          <VideoPlayer
            url={chapter.videoUrl}
            onComplete={handleVideoComplete}
            completed={progress.videoCompleted}
          />
        </div>
      </div>

      {/* コンテンツセクション */}
      <div>
        <h2 className="text-xl font-semibold mb-4">レッスン内容</h2>
        <div className="prose max-w-none">
          <div dangerouslySetInnerHTML={{ __html: chapter.content }} />
        </div>
      </div>

      {/* 完了ステータス */}
      {progress.completed && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">
                このチャプターは完了しています
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
