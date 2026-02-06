'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import CreateLanguageModal from '@/components/ui/CreateLanguageModal';
import { ProgrammingLanguage } from '@/types/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function ProgrammingAdminPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingLanguage, setEditingLanguage] = useState<ProgrammingLanguage | null>(null);
  const [languages, setLanguages] = useState<ProgrammingLanguage[]>([]);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [languageToDelete, setLanguageToDelete] = useState<ProgrammingLanguage | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchLanguages = async () => {
      const response = await fetch('/api/programming/languages');
      if (response.ok) {
        const data = await response.json();
        setLanguages(data);
      }
    };
    fetchLanguages();
  }, []);

  const handleSaveLanguage = async (data: Omit<ProgrammingLanguage, 'createdAt' | 'updatedAt'>) => {
    if (editingLanguage) {
      // 編集モード
      const response = await fetch(`/api/programming/languages/${editingLanguage.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const updatedLanguage = await response.json();
        setLanguages(languages.map(lang => lang.id === updatedLanguage.id ? updatedLanguage : lang));
        setIsEditModalOpen(false);
        setEditingLanguage(null);
      } else {
        const error = await response.json();
        alert(error.error || '更新に失敗しました');
      }
    } else {
      // 新規作成モード
      const response = await fetch('/api/programming/languages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const newLanguage = await response.json();
        setLanguages([...languages, newLanguage]);
        setIsAddModalOpen(false);
      } else {
        const error = await response.json();
        alert(error.error || '作成に失敗しました');
      }
    }
  };

  const handleEditClick = (lang: ProgrammingLanguage) => {
    setEditingLanguage(lang);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (lang: ProgrammingLanguage) => {
    setLanguageToDelete(lang);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!languageToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/programming/languages/${languageToDelete.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setLanguages(languages.filter(lang => lang.id !== languageToDelete.id));
        setDeleteConfirmOpen(false);
        setLanguageToDelete(null);
      } else {
        const error = await response.json();
        alert(error.error || '削除に失敗しました');
      }
    } catch (error) {
      console.error('Error deleting language:', error);
      alert('削除中にエラーが発生しました');
    } finally {
      setIsDeleting(false);
    }
  };

  const languageItems = languages.filter(lang => lang.type === 'language');
  const frameworkItems = languages.filter(lang => lang.type === 'framework');
  const aiPlatformItems = languages.filter(lang => lang.type === 'ai-platform');
  const dataWarehouseItems = languages.filter(lang => lang.type === 'data-warehouse');
  const cloudItems = languages.filter(lang => lang.type === 'cloud');
  const networkItems = languages.filter(lang => lang.type === 'network');
  const saasItems = languages.filter(lang => lang.type === 'saas');
  const othersItems = languages.filter(lang => lang.type === 'others');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">プログラミング学習コンテンツ管理</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          新規コンテンツ追加
        </button>
      </div>

      <div className="space-y-12">
        <div>
          <h2 className="text-xl font-semibold mb-4">プログラミング言語</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {languageItems.map((lang) => (
              <div
                key={lang.id}
                className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6 relative"
              >
                <Link
                  href={`/admin/programming/${lang.id}/chapters`}
                  className="block"
                >
                  <h3 className="text-lg font-semibold mb-2">{lang.title}</h3>
                  <p className="text-gray-600 mb-4">{lang.description}</p>
                  <div className="text-blue-600 font-medium">
                    チャプター管理 →
                  </div>
                </Link>
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleEditClick(lang);
                    }}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                    title="編集"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDeleteClick(lang);
                    }}
                    className="text-red-600 hover:text-red-800 transition-colors"
                    title="削除"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">フレームワーク</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {frameworkItems.map((lang) => (
              <div
                key={lang.id}
                className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6 relative"
              >
                <Link
                  href={`/admin/programming/${lang.id}/chapters`}
                  className="block"
                >
                  <h3 className="text-lg font-semibold mb-2">{lang.title}</h3>
                  <p className="text-gray-600 mb-4">{lang.description}</p>
                  <div className="text-blue-600 font-medium">
                    チャプター管理 →
                  </div>
                </Link>
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleEditClick(lang);
                    }}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                    title="編集"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDeleteClick(lang);
                    }}
                    className="text-red-600 hover:text-red-800 transition-colors"
                    title="削除"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">ワークフロー開発プラットフォーム</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {aiPlatformItems.map((lang) => (
              <div
                key={lang.id}
                className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6 relative"
              >
                <Link
                  href={`/admin/programming/${lang.id}/chapters`}
                  className="block"
                >
                  <h3 className="text-lg font-semibold mb-2">{lang.title}</h3>
                  <p className="text-gray-600 mb-4">{lang.description}</p>
                  <div className="text-blue-600 font-medium">
                    チャプター管理 →
                  </div>
                </Link>
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleEditClick(lang);
                    }}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                    title="編集"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDeleteClick(lang);
                    }}
                    className="text-red-600 hover:text-red-800 transition-colors"
                    title="削除"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">データウェアハウス</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {dataWarehouseItems.map((lang) => (
              <div
                key={lang.id}
                className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6 relative"
              >
                <Link
                  href={`/admin/programming/${lang.id}/chapters`}
                  className="block"
                >
                  <h3 className="text-lg font-semibold mb-2">{lang.title}</h3>
                  <p className="text-gray-600 mb-4">{lang.description}</p>
                  <div className="text-blue-600 font-medium">
                    チャプター管理 →
                  </div>
                </Link>
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleEditClick(lang);
                    }}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                    title="編集"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDeleteClick(lang);
                    }}
                    className="text-red-600 hover:text-red-800 transition-colors"
                    title="削除"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">クラウド</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {cloudItems.length === 0 ? (
              <p className="text-gray-500">コンテンツがありません。</p>
            ) : (
              cloudItems.map((lang) => (
                <div
                  key={lang.id}
                  className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6 relative"
                >
                  <Link
                    href={`/admin/programming/${lang.id}/chapters`}
                    className="block"
                  >
                    <h3 className="text-lg font-semibold mb-2">{lang.title}</h3>
                    <p className="text-gray-600 mb-4">{lang.description}</p>
                    <div className="text-blue-600 font-medium">
                      チャプター管理 →
                    </div>
                  </Link>
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleEditClick(lang);
                      }}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                      title="編集"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDeleteClick(lang);
                      }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">ネットワーク</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {networkItems.length === 0 ? (
              <p className="text-gray-500">コンテンツがありません。</p>
            ) : (
              networkItems.map((lang) => (
                <div
                  key={lang.id}
                  className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6 relative"
                >
                  <Link
                    href={`/admin/programming/${lang.id}/chapters`}
                    className="block"
                  >
                    <h3 className="text-lg font-semibold mb-2">{lang.title}</h3>
                    <p className="text-gray-600 mb-4">{lang.description}</p>
                    <div className="text-blue-600 font-medium">
                      チャプター管理 →
                    </div>
                  </Link>
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleEditClick(lang);
                      }}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                      title="編集"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDeleteClick(lang);
                      }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">SaaS</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {saasItems.length === 0 ? (
              <p className="text-gray-500">コンテンツがありません。</p>
            ) : (
              saasItems.map((lang) => (
                <div
                  key={lang.id}
                  className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6 relative"
                >
                  <Link
                    href={`/admin/programming/${lang.id}/chapters`}
                    className="block"
                  >
                    <h3 className="text-lg font-semibold mb-2">{lang.title}</h3>
                    <p className="text-gray-600 mb-4">{lang.description}</p>
                    <div className="text-blue-600 font-medium">
                      チャプター管理 →
                    </div>
                  </Link>
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleEditClick(lang);
                      }}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                      title="編集"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDeleteClick(lang);
                      }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">その他</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {othersItems.map((lang) => (
              <div
                key={lang.id}
                className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6 relative"
              >
                <Link
                  href={`/admin/programming/${lang.id}/chapters`}
                  className="block"
                >
                  <h3 className="text-lg font-semibold mb-2">{lang.title}</h3>
                  <p className="text-gray-600 mb-4">{lang.description}</p>
                  <div className="text-blue-600 font-medium">
                    チャプター管理 →
                  </div>
                </Link>
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleEditClick(lang);
                    }}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                    title="編集"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDeleteClick(lang);
                    }}
                    className="text-red-600 hover:text-red-800 transition-colors"
                    title="削除"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <CreateLanguageModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingLanguage(null);
        }}
        onSave={handleSaveLanguage}
        editingLanguage={null}
      />

      <CreateLanguageModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingLanguage(null);
        }}
        onSave={handleSaveLanguage}
        editingLanguage={editingLanguage}
      />

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>削除の確認</DialogTitle>
            <DialogDescription>
              {languageToDelete && (
                <>
                  「<strong>{languageToDelete.title}</strong>」を削除してもよろしいですか？
                  <br />
                  <span className="text-red-600 mt-2 block">
                    この操作は取り消せません。関連するチャプターがある場合は削除できません。
                  </span>
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteConfirmOpen(false);
                setLanguageToDelete(null);
              }}
              disabled={isDeleting}
            >
              キャンセル
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? '削除中...' : '削除する'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
