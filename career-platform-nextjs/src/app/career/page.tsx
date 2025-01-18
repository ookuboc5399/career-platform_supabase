'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getUniversities } from '@/lib/api';

interface University {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  location: string;
  website: string;
}

const areas = [
  { id: 'hokkaido', name: '北海道・東北', icon: '🗾' },
  { id: 'kanto', name: '関東', icon: '🏙️' },
  { id: 'chubu', name: '甲信越・北陸', icon: '⛰️' },
  { id: 'kinki', name: '東海・近畿', icon: '🏯' },
  { id: 'chugoku', name: '中国・四国', icon: '🌉' },
  { id: 'kyushu', name: '九州・沖縄', icon: '🌴' },
];

const overseasAreas = [
  { id: 'north-america', name: '北米', icon: '🗽' },
  { id: 'europe', name: 'ヨーロッパ', icon: '🏰' },
  { id: 'asia', name: 'アジア', icon: '🏯' },
  { id: 'oceania', name: 'オセアニア', icon: '🦘' },
  { id: 'other', name: 'その他', icon: '🌍' },
];

const departmentGroups = [
  {
    departments: [
      { name: '文学系', icon: '📚' },
      { name: '外国語学系', icon: '🌏' },
      { name: '教員養成・教育学系', icon: '👨‍🏫' },
      { name: '人文・教養・総合科学系', icon: '🎓' },
      { name: '芸術学系', icon: '🎨' },
    ]
  },
  {
    departments: [
      { name: '法学・政治学系', icon: '⚖️' },
      { name: '経済・経営・商学系', icon: '💹' },
      { name: '社会・社会福祉学系', icon: '🤝' },
      { name: '国際関係学系', icon: '🌐' },
      { name: '理学系', icon: '🔬' },
    ]
  },
  {
    departments: [
      { name: '工学系', icon: '⚙️' },
      { name: '農・獣医・畜産・水産学系', icon: '🌾' },
      { name: '看護・栄養・保健学系', icon: '👨‍⚕️' },
      { name: '家政・生活科学系', icon: '🏠' },
      { name: '医・歯・薬学系', icon: '💊' },
    ]
  },
  {
    departments: [
      { name: '体育・健康科学系', icon: '🏃' },
      { name: 'その他', icon: '📋' },
    ]
  }
];

const ITEMS_PER_PAGE = 9;

export default function Page() {
  const router = useRouter();
  const [universities, setUniversities] = useState<University[]>([]);
  const [filteredUniversities, setFilteredUniversities] = useState<University[]>([]);
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<University[]>([]);
  const [isOverseas, setIsOverseas] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchUniversities();

    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = universities.filter(university => 
        university.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        university.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
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

  const handleSearch = () => {
    if (!selectedArea && !selectedDepartment && !searchQuery) {
      alert('検索条件を入力してください');
      return;
    }

    const filtered = universities.filter(university => {
      const matchesArea = !selectedArea || university.location.includes(areas.find(a => a.id === selectedArea)?.name || '');
      const matchesDepartment = !selectedDepartment || university.description.includes(selectedDepartment);
      const matchesQuery = !searchQuery || university.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesArea && matchesDepartment && matchesQuery;
    });

    setFilteredUniversities(filtered);
    setShowResults(true);
    setCurrentPage(1);
    setShowSuggestions(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSuggestionClick = (university: University) => {
    router.push(`/career/${university.id}`);
  };

  const handleReset = () => {
    setSelectedArea('');
    setSelectedDepartment('');
    setSearchQuery('');
    setShowResults(false);
    setFilteredUniversities(universities);
  };

  const totalPages = Math.ceil(filteredUniversities.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentUniversities = filteredUniversities.slice(startIndex, endIndex);

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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h1 className="text-2xl font-bold text-center mb-8">大学サイト検索</h1>
        
        <div className="mb-8">
          <div className="flex justify-center mb-6">
            <div className="inline-flex rounded-lg">
              <button
                onClick={() => setIsOverseas(false)}
                className={`px-4 py-2 rounded-l-lg ${
                  !isOverseas
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                日本の大学
              </button>
              <button
                onClick={() => setIsOverseas(true)}
                className={`px-4 py-2 rounded-r-lg ${
                  isOverseas
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                海外の大学
              </button>
            </div>
          </div>

          <div className="relative max-w-2xl mx-auto mb-8" ref={searchRef}>
            <input
              type="text"
              placeholder="大学名で検索"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full p-4 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
            />
            <div className="absolute right-4 top-4 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-10 w-full bg-white mt-1 rounded-lg shadow-lg border">
                {suggestions.map((university) => (
                  <div
                    key={university.id}
                    className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                    onClick={() => handleSuggestionClick(university)}
                  >
                    <div className="font-medium">{university.name}</div>
                    <div className="text-sm text-gray-500">{university.location}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            エリアで探す
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {(isOverseas ? overseasAreas : areas).map((area) => (
              <button
                key={area.id}
                onClick={() => setSelectedArea(area.id)}
                className={`p-4 border rounded-lg hover:bg-blue-50 transition-colors ${
                  selectedArea === area.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <div className="text-4xl mb-2 text-center">{area.icon}</div>
                <p className="text-sm text-center">{area.name}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            学問系統で探す
          </h2>
          <div className="grid gap-4">
            {departmentGroups.map((group, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {group.departments.map((dept) => (
                  <button
                    key={dept.name}
                    onClick={() => setSelectedDepartment(dept.name)}
                    className={`p-3 border rounded-lg hover:bg-blue-50 transition-colors ${
                      selectedDepartment === dept.name ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="text-2xl mb-2 text-center">{dept.icon}</div>
                    <p className="text-sm text-center">{dept.name}</p>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={handleReset}
            className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-lg transition-colors"
          >
            リセット
          </button>
          <button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-colors"
          >
            検索
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {showResults && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {currentUniversities.map((university) => (
              <div
                key={university.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105"
                onClick={() => router.push(`/career/${university.id}`)}
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
                  <div className="text-sm text-gray-500">
                    <p className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {university.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

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
        </>
      )}
    </div>
  );
}
