'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import VideoPlayer from '@/components/ui/VideoPlayer';

interface Chapter {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: string;
  exercises: {
    id: string;
    title: string;
    description: string;
    testCases: {
      input: string;
      expectedOutput: string;
    }[];
  }[];
}

export default function ChapterPage({ params }: { params: { id: string; chapterId: string } }) {
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchChapter = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/programming/chapters/${params.chapterId}?languageId=${params.id}`);
      if (!response.ok) throw new Error('Failed to fetch chapter');
      const data = await response.json();
      setChapter(data);
    } catch (error) {
      console.error('Error fetching chapter:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChapter();
  }, [params.id, params.chapterId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="text-center py-12 text-gray-500">
        チャプターが見つかりません
      </div>
    );
  }

  return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link
            href={`/programming/${params.id}`}
            className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            戻る
          </Link>
          <h1 className="text-3xl font-bold mb-2">{chapter.title}</h1>
          <p className="text-gray-600">{chapter.description}</p>
        </div>

        <div className="w-full max-w-3xl mb-8">
          <VideoPlayer url={chapter.videoUrl} />
        </div>
          
        {chapter.exercises && chapter.exercises.length > 0 && (
          <div className="flex justify-between items-center max-w-3xl">
            <div>
              <h3 className="text-lg font-semibold">演習問題</h3>
              <p className="text-gray-600">このチャプターには {chapter.exercises.length} 問の演習問題があります</p>
            </div>
            <Link
              href={`/programming/${params.id}/chapters/${params.chapterId}/exercises`}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 shadow-md"
            >
              <span>演習問題へ進む</span>
              <span className="text-sm bg-blue-500 px-2 py-1 rounded-md">
                {chapter.exercises.length}問
              </span>
            </Link>
          </div>
        )}
      </div>
  );
}
