'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { getUniversities } from '@/lib/api';

interface University {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  location: string;
  website: string;
}

export default function UniversityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [university, setUniversity] = useState<University | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUniversityDetails();
  }, [params.id]);

  const fetchUniversityDetails = async () => {
    try {
      setIsLoading(true);
      const universities = await getUniversities();
      const found = universities.find(u => u.id === params.id);
      if (found) {
        setUniversity(found);
      } else {
        setError('大学情報が見つかりませんでした');
      }
    } catch (error) {
      console.error('Failed to fetch university details:', error);
      setError('大学情報の取得に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !university) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded p-4">
          <p className="text-red-600">{error || '大学情報が見つかりませんでした'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        onClick={() => router.back()}
        className="mb-6 bg-gray-600 hover:bg-gray-700"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        戻る
      </Button>

      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        {university.imageUrl && (
          <div className="aspect-[21/9] relative bg-gray-100">
            <Image
              src={university.imageUrl}
              alt={university.name}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </div>
        )}
        <div className="p-8">
          <h1 className="text-4xl font-bold mb-6 text-gray-800">{university.name}</h1>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-3 text-gray-700">概要</h2>
                <p className="text-gray-600 leading-relaxed">{university.description}</p>
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-3 text-gray-700">所在地</h2>
                <p className="text-gray-600 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {university.location}
                </p>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-3 text-gray-700">リンク</h2>
              <a
                href={university.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 hover:underline"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                公式サイトで詳細を見る
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
