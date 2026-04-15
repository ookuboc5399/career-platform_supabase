'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProgrammingChapter } from '@/types/api';
import AddChapterModal from './components/AddChapterModal';
import EditChapterModal from './components/EditChapterModal';
import GenerateChaptersModal from './components/GenerateChaptersModal';

export default function ChaptersPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [chapters, setChapters] = useState<ProgrammingChapter[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<ProgrammingChapter | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'chapters' | 'practice'>('chapters');
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [languageName, setLanguageName] = useState('');
  const [generatingSlideId, setGeneratingSlideId] = useState<string | null>(null);
  const [generatingVideoId, setGeneratingVideoId] = useState<string | null>(null);
  // サブチャプター追加用: どの親チャプターにサブを追加するか
  const [addSubParentId, setAddSubParentId] = useState<string | null>(null);
  const [addSubParentTitle, setAddSubParentTitle] = useState('');

  const fetchChapters = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/programming/chapters?languageId=${params.id}`);
      if (!response.ok) throw new Error('Failed to fetch chapters');
      const data = await response.json();
      setChapters(data);
    } catch (error) {
      console.error('Error fetching chapters:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLanguageName = async () => {
    try {
      const response = await fetch(`/api/programming/languages/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setLanguageName(data.title || params.id);
      }
    } catch {
      setLanguageName(params.id);
    }
  };

  useEffect(() => {
    fetchChapters();
    fetchLanguageName();
  }, [params.id]);

  // トップレベルのチャプター並び替え
  const moveChapter = async (fromIndex: number, toIndex: number) => {
    const updated = [...chapters];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    const reordered = updated.map((ch, i) => ({ ...ch, order: i + 1 }));
    setChapters(reordered);

    try {
      await fetch('/api/programming/chapters/order', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          languageId: params.id,
          chapters: reordered.map(ch => ({ id: ch.id, order: ch.order })),
        }),
      });
    } catch {
      fetchChapters();
    }
  };

  // スライド生成
  const handleGenerateSlide = async (chapter: ProgrammingChapter) => {
    if (!window.confirm(`「${chapter.title}」のスライドをNotebookLMで生成しますか？（3〜5分かかります）`)) return;
    setGeneratingSlideId(chapter.id);
    try {
      const res = await fetch(`/api/programming/chapters/${chapter.id}/generate-slides`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      fetchChapters();
      alert('スライドを生成しました！');
    } catch (e: any) {
      alert('エラー: ' + e.message);
    } finally {
      setGeneratingSlideId(null);
    }
  };

  // 動画生成
  const handleGenerateVideo = async (chapter: ProgrammingChapter) => {
    if (!window.confirm(`「${chapter.title}」の解説動画をRemotionで生成しますか？（数分かかります）`)) return;
    setGeneratingVideoId(chapter.id);
    try {
      const res = await fetch(`/api/programming/chapters/${chapter.id}/generate-video`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      fetchChapters();
      alert('解説動画を生成しました！');
    } catch (e: any) {
      alert('エラー: ' + e.message);
    } finally {
      setGeneratingVideoId(null);
    }
  };

  // チャプター削除
  const handleDelete = async (chapter: ProgrammingChapter) => {
    if (!window.confirm('このチャプターを削除してもよろしいですか？')) return;
    try {
      const res = await fetch(
        `/api/programming/chapters/${chapter.id}?languageId=${chapter.languageId}`,
        { method: 'DELETE' }
      );
      if (!res.ok) throw new Error('Failed to delete chapter');
      fetchChapters();
    } catch (error) {
      console.error('Error deleting chapter:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // チャプター1行（親・サブ共通）
  const ChapterRow = ({
    chapter,
    isSub = false,
    index,
    totalSiblings,
    onMoveUp,
    onMoveDown,
  }: {
    chapter: ProgrammingChapter;
    isSub?: boolean;
    index: number;
    totalSiblings: number;
    onMoveUp?: () => void;
    onMoveDown?: () => void;
  }) => (
    <div className={`border rounded-lg transition-colors ${isSub ? 'bg-white border-blue-100' : 'bg-gray-50 hover:bg-gray-100'}`}>
      <div className="p-4">
        <div className="flex items-start gap-2">
          {/* サブチャプターのインジケーター */}
          {isSub && (
            <div className="mt-1 shrink-0">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-xs flex items-center justify-center font-bold">
                {index + 1}
              </span>
            </div>
          )}

          <div className="flex-grow">
            <div className="flex items-center justify-between mb-1">
              <h3 className={`font-medium flex items-center gap-2 ${isSub ? 'text-base' : 'text-lg'}`}>
                {!isSub && `${chapter.order}. `}{chapter.title}
                {chapter.subChapters && chapter.subChapters.length > 0 && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-normal">
                    {chapter.subChapters.length}セクション
                  </span>
                )}
              </h3>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  chapter.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {chapter.status === 'published' ? '公開中' : '下書き'}
                </span>
                {chapter.duration && (
                  <span className="text-sm text-gray-500">{chapter.duration}</span>
                )}
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-3">{chapter.description}</p>

            <div className="flex justify-between items-center">
              {/* バッジ類 */}
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span>演習問題: {chapter.exercises?.length || 0}問</span>
                {chapter.slideUrl && (
                  <span className="flex items-center gap-1 text-green-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    スライドあり
                  </span>
                )}
                {chapter.videoUrl && (
                  <span className="flex items-center gap-1 text-blue-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    動画あり
                  </span>
                )}
              </div>

              {/* アクションボタン */}
              <div className="flex items-center gap-1 flex-wrap justify-end">
                {/* 並び替え */}
                <div className="flex gap-1 mr-2">
                  {index > 0 && (
                    <button onClick={onMoveUp} className="text-gray-400 hover:text-gray-600 px-1">↑</button>
                  )}
                  {index < totalSiblings - 1 && (
                    <button onClick={onMoveDown} className="text-gray-400 hover:text-gray-600 px-1">↓</button>
                  )}
                </div>

                {!isSub && (
                  <button
                    className="text-purple-600 hover:text-purple-800 disabled:opacity-40 text-sm flex items-center gap-1"
                    disabled={generatingSlideId === chapter.id}
                    onClick={() => handleGenerateSlide(chapter)}
                  >
                    {generatingSlideId === chapter.id
                      ? <><span className="animate-spin inline-block w-3 h-3 border-2 border-purple-600 border-t-transparent rounded-full" />生成中</>
                      : 'スライド生成'}
                  </button>
                )}
                {!isSub && (
                  <button
                    className="text-cyan-600 hover:text-cyan-800 disabled:opacity-40 text-sm flex items-center gap-1"
                    disabled={generatingVideoId === chapter.id}
                    onClick={() => handleGenerateVideo(chapter)}
                  >
                    {generatingVideoId === chapter.id
                      ? <><span className="animate-spin inline-block w-3 h-3 border-2 border-cyan-600 border-t-transparent rounded-full" />生成中</>
                      : '動画生成'}
                  </button>
                )}
                <button
                  className="text-blue-600 hover:text-blue-800 text-sm"
                  onClick={() => { setSelectedChapter(chapter); setIsEditModalOpen(true); }}
                >
                  編集
                </button>
                <button
                  className="text-red-500 hover:text-red-700 text-sm"
                  onClick={() => handleDelete(chapter)}
                >
                  削除
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  /** 任意の深さのサブチャプター（孫以下）を再帰表示 */
  const SubChapterTree = ({
    siblings,
    depth,
  }: {
    siblings: ProgrammingChapter[];
    depth: number;
  }) => {
    const sorted = [...siblings].sort((a, b) => a.order - b.order);
    const putOrder = async (reordered: ProgrammingChapter[]) => {
      await fetch('/api/programming/chapters/order', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          languageId: params.id,
          chapters: reordered.map((s, i) => ({ id: s.id, order: i + 1 })),
        }),
      });
      fetchChapters();
    };
    return (
      <div
        className={
          depth === 0
            ? 'ml-8 space-y-2 border-l-2 border-blue-100 pl-4'
            : 'ml-4 space-y-2 border-l border-slate-200 pl-3'
        }
      >
        {sorted.map((sub, subIndex) => (
          <div key={sub.id} className="space-y-2">
            <ChapterRow
              chapter={sub}
              isSub
              index={subIndex}
              totalSiblings={sorted.length}
              onMoveUp={async () => {
                if (subIndex === 0) return;
                const subs = [...sorted];
                [subs[subIndex - 1], subs[subIndex]] = [subs[subIndex], subs[subIndex - 1]];
                const reordered = subs.map((s, i) => ({ ...s, order: i + 1 }));
                await putOrder(reordered);
              }}
              onMoveDown={async () => {
                if (subIndex >= sorted.length - 1) return;
                const subs = [...sorted];
                [subs[subIndex], subs[subIndex + 1]] = [subs[subIndex + 1], subs[subIndex]];
                const reordered = subs.map((s, i) => ({ ...s, order: i + 1 }));
                await putOrder(reordered);
              }}
            />
            {sub.subChapters && sub.subChapters.length > 0 && (
              <SubChapterTree siblings={sub.subChapters} depth={depth + 1} />
            )}
            <div className={depth === 0 ? 'ml-0 pl-0' : 'ml-2 pl-2'}>
              <button
                type="button"
                className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-700 border border-dashed border-blue-200 hover:border-blue-400 rounded-lg px-3 py-1.5 transition-colors"
                onClick={() => {
                  setAddSubParentId(sub.id);
                  setAddSubParentTitle(sub.title);
                  setIsAddModalOpen(true);
                }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                サブチャプターを追加
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/admin/programming')}
            className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            戻る
          </button>
          <h1 className="text-2xl font-bold">コンテンツ管理</h1>
          <p className="text-gray-600 mt-1">
            {params.id.charAt(0).toUpperCase() + params.id.slice(1)}の学習コンテンツ
          </p>
        </div>
        {activeTab === 'chapters' && (
          <div className="flex gap-2">
            <button
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
              onClick={() => setIsGenerateModalOpen(true)}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              AIで自動生成
            </button>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              onClick={() => { setAddSubParentId(null); setIsAddModalOpen(true); }}
            >
              新規チャプター追加
            </button>
          </div>
        )}
      </div>

      {/* タブ */}
      <div className="border-b mb-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('chapters')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'chapters' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            チャプター管理
          </button>
          <button
            onClick={() => setActiveTab('practice')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'practice' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            試験対策問題
          </button>
        </div>
      </div>

      {activeTab === 'practice' && (
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 mb-4">
            チャプター学習用の問題とは別に、試験対策用の問題を登録できます。
          </p>
          <Link
            href={`/admin/programming/${params.id}/practice-exercises`}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            試験対策問題を管理
          </Link>
        </div>
      )}

      {activeTab === 'chapters' && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="space-y-4">
              {chapters.length === 0 ? (
                <div className="text-center py-12 text-gray-500">チャプターがありません</div>
              ) : (
                chapters.map((chapter, index) => (
                  <div key={chapter.id} className="space-y-2">
                    {/* 親チャプター */}
                    <ChapterRow
                      chapter={chapter}
                      index={index}
                      totalSiblings={chapters.length}
                      onMoveUp={() => moveChapter(index, index - 1)}
                      onMoveDown={() => moveChapter(index, index + 1)}
                    />

                    {/* サブチャプター一覧（任意の深さ） */}
                    {chapter.subChapters && chapter.subChapters.length > 0 && (
                      <SubChapterTree siblings={chapter.subChapters} depth={0} />
                    )}

                    {/* ＋サブチャプター追加ボタン */}
                    <div className="ml-8 pl-4">
                      <button
                        className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-700 border border-dashed border-blue-200 hover:border-blue-400 rounded-lg px-3 py-1.5 transition-colors"
                        onClick={() => {
                          setAddSubParentId(chapter.id);
                          setAddSubParentTitle(chapter.title);
                          setIsAddModalOpen(true);
                        }}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        サブチャプターを追加
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      <GenerateChaptersModal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        languageId={params.id}
        languageName={languageName}
        onGenerated={() => { setIsGenerateModalOpen(false); fetchChapters(); }}
      />

      <AddChapterModal
        isOpen={isAddModalOpen}
        parentId={addSubParentId}
        parentTitle={addSubParentTitle}
        onClose={() => {
          setIsAddModalOpen(false);
          setAddSubParentId(null);
          setAddSubParentTitle('');
          fetchChapters();
        }}
        languageId={params.id}
      />

      {selectedChapter && (
        <EditChapterModal
          isOpen={isEditModalOpen}
          onClose={() => { setIsEditModalOpen(false); setSelectedChapter(null); fetchChapters(); }}
          onSave={async (data) => {
            try {
              const res = await fetch(
                `/api/programming/chapters/${selectedChapter.id}?languageId=${params.id}`,
                {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ ...data, languageId: params.id, updatedAt: new Date().toISOString() }),
                }
              );
              if (!res.ok) throw new Error('Failed to update chapter');
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
