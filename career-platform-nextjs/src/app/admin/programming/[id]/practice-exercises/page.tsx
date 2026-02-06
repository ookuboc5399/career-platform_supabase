'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProgrammingPracticeExercise, ProgrammingChapter } from '@/types/api';
import AddPracticeExerciseModal from './components/AddPracticeExerciseModal';
import EditPracticeExerciseModal from './components/EditPracticeExerciseModal';

export default function PracticeExercisesPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [exercises, setExercises] = useState<ProgrammingPracticeExercise[]>([]);
  const [allExercises, setAllExercises] = useState<ProgrammingPracticeExercise[]>([]); // 重複チェック用（全問題）
  const [chapters, setChapters] = useState<ProgrammingChapter[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<ProgrammingPracticeExercise | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filterChapterId, setFilterChapterId] = useState<string>('');
  const [isChaptersLoading, setIsChaptersLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [recentExercises, setRecentExercises] = useState<ProgrammingPracticeExercise[]>([]);

  const fetchExercises = async () => {
    // チャプターが選択されていない場合は取得しない
    if (!filterChapterId) {
      setExercises([]);
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      const url = `/api/programming/practice-exercises?languageId=${params.id}&chapterId=${filterChapterId}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch exercises');
      const data = await response.json();
      setExercises(data);
    } catch (error) {
      console.error('Error fetching exercises:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 重複チェック用に全問題を取得（フィルターなし）
  const fetchAllExercises = async () => {
    try {
      const response = await fetch(`/api/programming/practice-exercises?languageId=${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setAllExercises(data);
        // 直近5件を取得（作成日時でソート）
        const sorted = [...data].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setRecentExercises(sorted.slice(0, 5));
      }
    } catch (error) {
      console.error('Error fetching all exercises:', error);
    }
  };

  const fetchChapters = async () => {
    try {
      setIsChaptersLoading(true);
      const response = await fetch(`/api/programming/chapters?languageId=${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setChapters(data);
      }
    } catch (error) {
      console.error('Error fetching chapters:', error);
    } finally {
      setIsChaptersLoading(false);
    }
  };

  useEffect(() => {
    fetchChapters();
    fetchAllExercises();
  }, [params.id]);

  useEffect(() => {
    fetchExercises();
  }, [params.id, filterChapterId]);

  if (isChaptersLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push(`/admin/programming/${params.id}/chapters`)}
            className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            戻る
          </button>
          <h1 className="text-2xl font-bold">試験対策問題管理</h1>
        </div>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          onClick={() => setIsAddModalOpen(true)}
        >
          新規問題追加
        </button>
      </div>

      {/* フィルターと検索 */}
      <div className="bg-white rounded-lg shadow p-4 mb-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            チャプターでフィルター
          </label>
          <select
            value={filterChapterId}
            onChange={(e) => {
              setFilterChapterId(e.target.value);
              setSearchQuery(''); // チャプター変更時は検索をクリア
            }}
            className="w-full md:w-64 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">全てのチャプター</option>
            {chapters.map((chapter) => (
              <option key={chapter.id} value={chapter.id}>
                {chapter.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            検索
          </label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="タイトルや問題文で検索..."
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="space-y-4">
            {(() => {
              // 検索クエリがある場合、全問題から検索
              let displayExercises: ProgrammingPracticeExercise[] = [];
              
              if (searchQuery.trim()) {
                // 検索モード：全問題から検索
                const query = searchQuery.toLowerCase();
                displayExercises = allExercises.filter(ex => 
                  ex.title.toLowerCase().includes(query) ||
                  ex.description.toLowerCase().includes(query)
                );
              } else if (filterChapterId) {
                // チャプターフィルターモード
                displayExercises = exercises;
              } else {
                // デフォルト：直近5件を表示
                displayExercises = recentExercises;
              }

              if (isLoading && filterChapterId) {
                return (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                );
              }

              if (displayExercises.length === 0) {
                if (searchQuery.trim()) {
                  return (
                    <div className="text-center py-12 text-gray-500">
                      検索結果が見つかりませんでした
                    </div>
                  );
                } else if (filterChapterId) {
                  return (
                    <div className="text-center py-12 text-gray-500">
                      選択したチャプターに問題が登録されていません
                    </div>
                  );
                } else {
                  return (
                    <div className="text-center py-12 text-gray-500">
                      問題が登録されていません
                    </div>
                  );
                }
              }

              return displayExercises.map((exercise) => {
                const chapter = chapters.find(c => c.id === exercise.chapterId);
                return (
                  <div
                    key={exercise.id}
                    className="border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-medium">{exercise.title}</h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            exercise.status === 'published'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {exercise.status === 'published' ? '公開中' : '下書き'}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            exercise.difficulty === 'easy'
                              ? 'bg-blue-100 text-blue-800'
                              : exercise.difficulty === 'medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {exercise.difficulty === 'easy' ? '易' : exercise.difficulty === 'medium' ? '中' : '難'}
                          </span>
                          <span className="text-sm text-gray-500">
                            {exercise.type === 'code' ? 'コード入力' : '4択問題'}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-2">{exercise.description}</p>
                        {chapter && (
                          <p className="text-sm text-gray-500 mb-2">
                            チャプター: {chapter.title}
                          </p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => {
                            setSelectedExercise(exercise);
                            setIsEditModalOpen(true);
                          }}
                        >
                          編集
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800"
                          onClick={async () => {
                            if (window.confirm('この問題を削除してもよろしいですか？')) {
                              try {
                                const response = await fetch(
                                  `/api/programming/practice-exercises/${exercise.id}`,
                                  { method: 'DELETE' }
                                );
                                if (!response.ok) throw new Error('Failed to delete exercise');
                                fetchExercises();
                              } catch (error) {
                                console.error('Error deleting exercise:', error);
                                alert('削除に失敗しました');
                              }
                            }
                          }}
                        >
                          削除
                        </button>
                      </div>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      </div>

      <AddPracticeExerciseModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          fetchExercises();
          fetchAllExercises();
          if (!filterChapterId && !searchQuery) {
            // チャプター選択なしの場合は、直近5件を再取得
            fetchAllExercises();
          }
        }}
        languageId={params.id}
        chapters={chapters}
        existingExercises={allExercises}
      />

      {selectedExercise && (
        <EditPracticeExerciseModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedExercise(null);
            fetchExercises();
            fetchAllExercises();
            if (!filterChapterId && !searchQuery) {
              // チャプター選択なしの場合は、直近5件を再取得
              fetchAllExercises();
            }
          }}
          exercise={selectedExercise}
          chapters={chapters}
          existingExercises={allExercises}
        />
      )}
    </div>
  );
}

