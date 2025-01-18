'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getUniversities, scrapeUniversities, updateUniversity, deleteUniversity } from '@/lib/api';
import { EditUniversityModal } from '@/components/ui/EditUniversityModal';
import { Button } from '@/components/ui/button';

interface University {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  location: string;
  website: string;
}

const ITEMS_PER_PAGE = 9;

export default function UniversitiesPage() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [filteredUniversities, setFilteredUniversities] = useState<University[]>([]);
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScraping, setIsScraping] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchUniversities();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = universities.filter(university => 
        university.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        university.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUniversities(filtered);
      setCurrentPage(1); // 検索時にページを1に戻す
    } else {
      setFilteredUniversities(universities);
    }
  }, [searchQuery, universities]);

  const fetchUniversities = async () => {
    try {
      setIsLoading(true);
      const data = await getUniversities();
      setUniversities(data);
      setFilteredUniversities(data);
    } catch (error) {
      console.error('Failed to fetch universities:', error);
      setError('大学情報の取得に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleScrape = async () => {
    try {
      setIsScraping(true);
      const result = await scrapeUniversities();
      console.log('Scraping result:', result);
      await fetchUniversities();
    } catch (error) {
      console.error('Failed to scrape universities:', error);
      setError('大学情報の収集に失敗しました');
    } finally {
      setIsScraping(false);
    }
  };

  const handleEdit = (university: University) => {
    setSelectedUniversity(university);
    setIsModalOpen(true);
  };

  const handleDelete = async (university: University) => {
    if (window.confirm(`${university.name}を削除してもよろしいですか？`)) {
      try {
        await deleteUniversity(university.id);
        await fetchUniversities();
      } catch (error) {
        console.error('Failed to delete university:', error);
        setError('大学情報の削除に失敗しました');
      }
    }
  };

  const handleSave = async (updatedUniversity: University) => {
    try {
      await updateUniversity(updatedUniversity.id, updatedUniversity);
      await fetchUniversities();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to update university:', error);
      setError('大学情報の更新に失敗しました');
    }
  };

  // ページネーション関連の計算
  const totalPages = Math.ceil(filteredUniversities.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentUniversities = filteredUniversities.slice(startIndex, endIndex);

  // ページネーションのボタンを生成
  const renderPaginationButtons = () => {
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`px-4 py-2 mx-1 rounded ${
            currentPage === i
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">大学情報管理</h1>
        <Button
          onClick={handleScrape}
          disabled={isScraping}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isScraping ? '収集中...' : '大学情報を収集'}
        </Button>
      </div>

      <div className="mb-8">
        <div className="relative max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="大学名や地域で検索"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-4 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
          />
          <div className="absolute right-4 top-4 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {currentUniversities.map((university) => (
          <div
            key={university.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            {university.imageUrl && (
              <div className="aspect-video relative">
                <Image
                  src={university.imageUrl}
                  alt={university.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            )}
            <div className="p-6">
              <h2 className="text-xl font-bold mb-2">{university.name}</h2>
              <p className="text-gray-600 mb-4 line-clamp-2">{university.description}</p>
              <div className="text-sm text-gray-500 mb-4">
                <p className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {university.location}
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  onClick={() => handleEdit(university)}
                  variant="outline"
                >
                  編集
                </Button>
                <Button
                  onClick={() => handleDelete(university)}
                  variant="destructive"
                >
                  削除
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ページネーション */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            前へ
          </button>
          {renderPaginationButtons()}
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            次へ
          </button>
        </div>
      )}

      {selectedUniversity && (
        <EditUniversityModal
          university={selectedUniversity}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
