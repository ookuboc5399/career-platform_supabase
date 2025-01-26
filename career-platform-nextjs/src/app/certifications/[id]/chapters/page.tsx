"use client";

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CertificationChapter, CertificationProgress } from '@/types/api';
import { CheckCircle } from 'lucide-react';

export default function ChaptersPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [chapters, setChapters] = useState<CertificationChapter[]>([]);
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { id: certificationId } = use(params);

  useEffect(() => {
    fetchChapters();
    fetchProgress();
  }, [certificationId]);

  const fetchProgress = async () => {
    try {
      const response = await fetch(`/api/certifications/progress?certificationId=${certificationId}`);
      if (!response.ok) throw new Error('Failed to fetch progress');
      const data: CertificationProgress[] = await response.json();
      
      // チャプターIDごとの完了状態をオブジェクトに変換
      const progressMap = data.reduce((acc, curr) => ({
        ...acc,
        [curr.chapterId]: curr.videoCompleted
      }), {});
      
      setProgress(progressMap);
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  const fetchChapters = async () => {
    try {
      console.log('Fetching chapters for certification:', certificationId);
      setIsLoading(true);
      const response = await fetch(`/api/certifications/${certificationId}/chapters`);
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to fetch chapters:', errorData);
        throw new Error(`Failed to fetch chapters: ${JSON.stringify(errorData)}`);
      }
      const data = await response.json();
      console.log('Fetched chapters:', data);
      if (!Array.isArray(data)) {
        console.error('Unexpected response format:', data);
        throw new Error('Unexpected response format');
      }
      setChapters(data);
    } catch (error) {
      console.error('Error fetching chapters:', error);
      setChapters([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button
          onClick={() => router.push('/certifications')}
          variant="outline"
          className="mb-4"
        >
          ← 戻る
        </Button>
        <h1 className="text-2xl font-bold">チャプター一覧</h1>
      </div>

      {chapters.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">チャプターがありません</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {chapters.sort((a, b) => a.order - b.order).map((chapter) => (
            <div
              key={chapter.id}
              onClick={() => router.push(`/certifications/${certificationId}/chapters/${chapter.id}`)}
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">{chapter.title}</h2>
                  {progress[chapter.id] && (
                    <CheckCircle className="text-green-500 w-6 h-6" />
                  )}
                </div>
                <p className="text-gray-700">{chapter.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
