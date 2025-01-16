'use client';

import { getUniversity } from '@/lib/api';
import { University } from '@/lib/cosmos-db';
import { use } from 'react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function UniversityPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const resolvedParams = use(Promise.resolve(params));
  const [university, setUniversity] = useState<University | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUniversity = async () => {
      try {
        const data = await getUniversity(resolvedParams.id);
        setUniversity(data);
      } catch (error) {
        console.error('Failed to fetch university:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUniversity();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">読み込み中...</div>
      </div>
    );
  }

  if (!university) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">大学/プログラムが見つかりません</h3>
              <div className="mt-2 text-sm text-red-700">
                指定された大学/プログラムは存在しないか、削除された可能性があります。
              </div>
              <div className="mt-4">
                <Link
                  href="/career"
                  className="text-sm font-medium text-red-700 hover:text-red-600"
                >
                  キャリア支援トップに戻る
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="relative h-96">
        <Image
          src={university.imageUrl}
          alt={university.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {university.type === 'university' ? '大学' : 'プログラム'}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {university.location === 'overseas' ? '海外' : '日本'}
              </span>
              {university.programType && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  {university.programType === 'mba' ? 'MBA' : 'データサイエンス'}
                </span>
              )}
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">
              {university.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">概要</h2>
          <p className="text-gray-600 whitespace-pre-wrap">
            {university.description}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">公式サイト</h2>
          <a
            href={university.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            {university.websiteUrl}
          </a>
        </div>
      </div>
    </div>
  );
}
