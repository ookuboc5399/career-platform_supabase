'use client';

import { useState, useEffect, use } from 'react';
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

export default function ChapterPage({ params }: { params: Promise<{ id: string; chapterId: string }> }) {
  const resolvedParams = use(params);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchChapter = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/programming/chapters/${resolvedParams.chapterId}?languageId=${resolvedParams.id}`);
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
  }, [resolvedParams.id, resolvedParams.chapterId]);

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{chapter.title}</h1>
          <p className="text-gray-600">{chapter.description}</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <VideoPlayer url={chapter.videoUrl} />
          
          {chapter.exercises && chapter.exercises.length > 0 && (
            <div className="p-6 border-t bg-gray-50">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">演習問題</h3>
                  <p className="text-gray-600">このチャプターには {chapter.exercises.length} 問の演習問題があります</p>
                </div>
                <Link
                  href={`/programming/${resolvedParams.id}/chapters/${resolvedParams.chapterId}/exercises`}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 shadow-md"
                >
                  <span>演習問題へ進む</span>
                  <span className="text-sm bg-blue-500 px-2 py-1 rounded-md">
                    {chapter.exercises.length}問
                  </span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
  );
}
