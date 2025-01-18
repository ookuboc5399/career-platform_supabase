"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import { Button } from '@/components/ui/button';
import { CreateChapterModal } from '@/components/ui/CreateChapterModal';
import { EditChapterModal } from '@/components/ui/EditChapterModal';

interface Chapter {
  id: string;
  title: string;
  content: string;
  order: number;
  videoUrl: string;
  questions: {
    question: string;
    options: string[];
    correctAnswers: number[];
    explanation: string;
    explanationImages: string[];
    explanationTable?: {
      headers: string[];
      rows: string[][];
    };
  }[];
  webText: string;
}

export default function ChaptersPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { id: certificationId } = use(params);

  useEffect(() => {
    fetchChapters();
  }, [certificationId]);

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

  const handleCreateChapter = async (data: Omit<Chapter, 'id'>) => {
    try {
      console.log('Creating chapter with data:', data);
      const response = await fetch(`/api/certifications/${certificationId}/chapters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      console.log('Create chapter response:', responseData);

      if (!response.ok) {
        console.error('Failed to create chapter:', responseData);
        throw new Error(`Failed to create chapter: ${JSON.stringify(responseData)}`);
      }
      
      setIsCreateModalOpen(false);
      console.log('Refreshing chapters list after creation');
      await fetchChapters();
    } catch (error) {
      console.error('Error creating chapter:', error);
    }
  };

  const handleEditChapter = async (data: Chapter) => {
    try {
      const response = await fetch(`/api/certifications/${certificationId}/chapters/${data.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to update chapter');
      
      setIsEditModalOpen(false);
      setSelectedChapter(null);
      fetchChapters();
    } catch (error) {
      console.error('Error updating chapter:', error);
    }
  };

  const handleDeleteChapter = async (chapterId: string) => {
    if (!confirm('このチャプターを削除してもよろしいですか？')) return;

    try {
      const response = await fetch(`/api/certifications/${certificationId}/chapters?chapterId=${chapterId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete chapter');
      
      fetchChapters();
    } catch (error) {
      console.error('Error deleting chapter:', error);
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
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => router.push('/admin/certifications')}
            variant="outline"
            className="mb-4"
          >
            ← 戻る
          </Button>
          <h1 className="text-2xl font-bold">チャプター管理</h1>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          新規チャプター作成
        </Button>
      </div>

      {chapters.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">チャプターがありません</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {chapters.sort((a, b) => a.order - b.order).map((chapter) => (
            <div
              key={chapter.id}
              className="p-4 border rounded-lg bg-gray-50 shadow-sm hover:bg-white transition-colors duration-200"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{chapter.title}</h2>
                  <p className="text-gray-700 mt-1">{chapter.content}</p>
                  <p className="text-sm text-gray-600 mt-2">
                    表示順序: {chapter.order}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      setSelectedChapter(chapter);
                      setIsEditModalOpen(true);
                    }}
                    variant="outline"
                  >
                    編集
                  </Button>
                  <Button
                    onClick={() => handleDeleteChapter(chapter.id)}
                    variant="destructive"
                  >
                    削除
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <CreateChapterModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateChapter}
        currentMaxOrder={Math.max(0, ...chapters.map(c => c.order))}
      />

      {selectedChapter && (
        <EditChapterModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedChapter(null);
          }}
          onSave={handleEditChapter}
          chapter={selectedChapter}
        />
      )}
    </div>
  );
}
