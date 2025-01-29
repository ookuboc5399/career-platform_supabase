'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';

interface Chapter {
  id: string;
  title: string;
  description: string;
  duration: string;
  order: number;
  status: 'draft' | 'published';
  exercises: {
    title: string;
    description: string;
    testCases: {
      input: string;
      expectedOutput: string;
    }[];
  }[];
}

export default function ProgrammingPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchChapters = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/programming/chapters?languageId=${resolvedParams.id}`);
      if (!response.ok) throw new Error('Failed to fetch chapters');
      const data = await response.json();
      console.log('Fetched chapters:', data);
      const publishedChapters = data.filter((chapter: Chapter) => chapter.status === 'published');
      setChapters(publishedChapters.sort((a: Chapter, b: Chapter) => a.order - b.order));
    } catch (error) {
      console.error('Error fetching chapters:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChapters();
  }, [resolvedParams.id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          {resolvedParams.id.charAt(0).toUpperCase() + resolvedParams.id.slice(1)}プログラミング学習
        </h1>
        <p className="text-gray-600 mt-2">
          ステップバイステップで{resolvedParams.id.charAt(0).toUpperCase() + resolvedParams.id.slice(1)}プログラミングを学びましょう
        </p>
      </div>

      <div className="grid gap-6">
        {chapters.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            チャプターがありません
          </div>
        ) : (
          chapters.map((chapter) => (
            <div
              key={chapter.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start">
                  <div className="flex-grow">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold">
                        {chapter.order}. {chapter.title}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {chapter.duration}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">
                      {chapter.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        演習問題: {chapter.exercises?.length || 0}問
                      </div>
                      <Link
                        href={`/programming/${resolvedParams.id}/chapters/${chapter.id}`}
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        学習を始める
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
