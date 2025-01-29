'use client';

import { useState, useEffect, use } from 'react';
import { ProgrammingChapter } from '@/lib/cosmos-db';
import AddChapterModal from './components/AddChapterModal';
import EditChapterModal from './components/EditChapterModal';

export default function ChaptersPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [chapters, setChapters] = useState<ProgrammingChapter[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<ProgrammingChapter | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchChapters = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/programming/chapters?languageId=${resolvedParams.id}`);
      if (!response.ok) throw new Error('Failed to fetch chapters');
      const data = await response.json();
      setChapters(data);
    } catch (error) {
      console.error('Error fetching chapters:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChapters();
  }, [resolvedParams.id]);

  const moveChapter = async (fromIndex: number, toIndex: number) => {
    const updatedChapters = [...chapters];
    const [movedChapter] = updatedChapters.splice(fromIndex, 1);
    updatedChapters.splice(toIndex, 0, movedChapter);

    // Update order property
    const reorderedChapters = updatedChapters.map((chapter, index) => ({
      ...chapter,
      order: index + 1,
    }));

    setChapters(reorderedChapters);

    try {
      const response = await fetch('/api/programming/chapters/order', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          languageId: resolvedParams.id,
          chapters: reorderedChapters.map(chapter => ({
            id: chapter.id,
            order: chapter.order,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update chapter order');
      }
    } catch (error) {
      console.error('Error updating chapter order:', error);
      fetchChapters();
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">チャプター管理</h1>
          <p className="text-gray-600 mt-1">
            {resolvedParams.id.charAt(0).toUpperCase() + resolvedParams.id.slice(1)}の学習コンテンツ
          </p>
        </div>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          onClick={() => setIsAddModalOpen(true)}
        >
          新規チャプター追加
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="space-y-4">
            {chapters.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                チャプターがありません
              </div>
            ) : (
              chapters.map((chapter, index) => (
                <div
                  key={chapter.id}
                  className="border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="p-4">
                    <div className="flex items-start">
                      <div className="flex-grow">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-medium">
                            {chapter.order}. {chapter.title}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              chapter.status === 'published'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {chapter.status === 'published' ? '公開中' : '下書き'}
                            </span>
                            <span className="text-sm text-gray-500">
                              {chapter.duration}
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-600 mb-4">
                          {chapter.description}
                        </p>
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-gray-500">
                            演習問題: {chapter.exercises?.length || 0}問
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="flex space-x-2">
                              {index > 0 && (
                                <button
                                  onClick={() => moveChapter(index, index - 1)}
                                  className="text-gray-500 hover:text-gray-700"
                                >
                                  ↑
                                </button>
                              )}
                              {index < chapters.length - 1 && (
                                <button
                                  onClick={() => moveChapter(index, index + 1)}
                                  className="text-gray-500 hover:text-gray-700"
                                >
                                  ↓
                                </button>
                              )}
                            </div>
                            <div className="flex space-x-2">
                              <button 
                                className="text-blue-600 hover:text-blue-800"
                                onClick={() => {
                                  setSelectedChapter(chapter);
                                  setIsEditModalOpen(true);
                                }}
                              >
                                編集
                              </button>
                              <button 
                                className="text-red-600 hover:text-red-800"
                                onClick={async () => {
                                  if (window.confirm('このチャプターを削除してもよろしいですか？')) {
                                    try {
                                      const response = await fetch(
                                        `/api/programming/chapters/${chapter.id}?languageId=${chapter.languageId}`,
                                        { method: 'DELETE' }
                                      );
                                      if (!response.ok) throw new Error('Failed to delete chapter');
                                      fetchChapters();
                                    } catch (error) {
                                      console.error('Error deleting chapter:', error);
                                    }
                                  }
                                }}
                              >
                                削除
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <AddChapterModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          fetchChapters();
        }}
        languageId={resolvedParams.id}
      />

      {selectedChapter && (
        <EditChapterModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedChapter(null);
            fetchChapters();
          }}
          onSave={async (data) => {
            try {
              const response = await fetch(`/api/programming/chapters/${selectedChapter.id}?languageId=${resolvedParams.id}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  ...data,
                  updatedAt: new Date().toISOString(),
                }),
              });

              if (!response.ok) {
                throw new Error('Failed to update chapter');
              }

              setIsEditModalOpen(false);
              setSelectedChapter(null);
              fetchChapters();
            } catch (error) {
              console.error('Error updating chapter:', error);
            }
          }}
          chapter={selectedChapter}
        />
      )}
    </div>
  );
}
