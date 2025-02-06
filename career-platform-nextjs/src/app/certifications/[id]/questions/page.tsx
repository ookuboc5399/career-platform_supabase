"use client";

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CertificationChapter } from '@/types/api';

interface Question {
  id: string;
  certificationId: string;
  questionNumber: number;
  question: string;
  options: string[];
  correctAnswers: number[];
  explanation: string;
  year: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

interface FilterOptions {
  years: Set<string>;
  mainCategories: Set<string>;
  subCategories: Set<string>;
}

export default function QuestionsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<FilterOptions>({
    years: new Set(),
    mainCategories: new Set(),
    subCategories: new Set(),
  });
  const [availableFilters, setAvailableFilters] = useState<FilterOptions>({
    years: new Set(),
    mainCategories: new Set(),
    subCategories: new Set(),
  });
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [isLoading, setIsLoading] = useState(true);
  const certificationId = params.id;

  useEffect(() => {
    fetchQuestions();
  }, [certificationId]);

  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      const certResponse = await fetch(`/api/certifications/${certificationId}`);
      if (!certResponse.ok) throw new Error('Failed to fetch certification');
      const certification = await certResponse.json();

      console.log('Certification data:', certification);

      if (!certification.questions) {
        console.log('No questions found');
        setQuestions([]);
        return;
      }

      console.log('Questions from database:', certification.questions);

      // 利用可能なフィルターオプションを収集
      const newAvailableFilters: FilterOptions = {
        years: new Set(),
        mainCategories: new Set(),
        subCategories: new Set(),
      };

      certification.questions.forEach((question: Question) => {
        if (question.year) newAvailableFilters.mainCategories.add(question.year);
        if (question.category) newAvailableFilters.subCategories.add(question.category);
      });

      setQuestions(certification.questions);
      setAvailableFilters(newAvailableFilters);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setQuestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartQuiz = () => {
    if (selectedQuestions.size === 0) {
      alert('問題を選択してください');
      return;
    }

    const selectedQuestionIds = Array.from(selectedQuestions);
    router.push(`/certifications/${certificationId}/questions/session?ids=${selectedQuestionIds.join(',')}`);
  };

  const toggleQuestion = (questionId: Question['id']) => {
    const newSelected = new Set(selectedQuestions);
    if (newSelected.has(questionId)) {
      newSelected.delete(questionId);
    } else {
      newSelected.add(questionId);
    }
    setSelectedQuestions(newSelected);
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
          onClick={() => router.push(`/certifications/${certificationId}`)}
          variant="outline"
          className="mb-4"
        >
          ← 戻る
        </Button>
        <h1 className="text-2xl font-bold">総合問題</h1>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* プログレスバー */}
        <div className="bg-gray-100 rounded-lg p-6">
          <div className="flex justify-between mb-2">
            <div className="text-gray-500">未出題</div>
            <div className="text-red-500">ミス</div>
            <div className="text-blue-500">ヒット</div>
            <div className="text-green-500">コンボ</div>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full flex">
              <div className="bg-gray-400" style={{ width: '70%' }} />
              <div className="bg-red-500" style={{ width: '10%' }} />
              <div className="bg-blue-500" style={{ width: '15%' }} />
              <div className="bg-green-500" style={{ width: '5%' }} />
            </div>
          </div>
        </div>

        {/* タブ */}
        <div className="border-b border-gray-200">
          <button className="px-4 py-2 border-b-2 border-blue-500 text-blue-500 font-medium">
            自由演習
          </button>
          <button className="px-4 py-2 text-gray-500">
            模擬試験
          </button>
        </div>

        {/* フィルターセクション */}
        <div>
          <h3 className="font-medium mb-2">出題対象</h3>
          <div className="flex flex-wrap gap-4 mb-6">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="h-4 w-4" />
              <span>未出題</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="h-4 w-4" />
              <span>ミス</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="h-4 w-4" />
              <span>ヒット</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="h-4 w-4" />
              <span>コンボ</span>
            </label>
          </div>

          <h3 className="font-medium mb-2">出題年度で絞る</h3>
          <div className="grid grid-cols-6 gap-2 mb-6">
            {[
              'H21年春', 'H21年秋', 'H22年春', 'H22年秋',
              'H23年春', 'H23年秋', 'H24年春', 'H24年秋',
              'H25年春', 'H25年秋', 'H26年春', 'H26年秋',
              'H27年春', 'H27年秋', 'H28年春', 'H28年秋',
              'H29年春', 'H29年秋', 'H30年春', 'H30年秋',
              'H31年春', 'R1年秋', 'R2年春', 'R2年秋',
              'R3年春', 'R3年秋', 'R4年春', 'R4年秋'
            ].map(year => (
              <label key={year} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.mainCategories.has(year)}
                  onChange={() => {
                    const newCategories = new Set(filters.mainCategories);
                    if (newCategories.has(year)) {
                      newCategories.delete(year);
                    } else {
                      newCategories.add(year);
                    }
                    setFilters({ ...filters, mainCategories: newCategories });
                  }}
                  className="h-4 w-4"
                />
                <span>{year}</span>
              </label>
            ))}
          </div>

          {/* カテゴリー別セクション */}
          {Array.from(availableFilters.mainCategories).sort().map(mainCategory => {
            const subCategories = Array.from(availableFilters.subCategories).filter(sub => 
              questions.some(q => q.year === mainCategory && q.category === sub)
            );
            
            const categoryQuestions = questions.filter(q => q.year === mainCategory);
            const selectedCount = categoryQuestions.filter(q => selectedQuestions.has(q.id)).length;

            return (
              <div key={mainCategory} className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{mainCategory}</h3>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">
                      {selectedCount} / {categoryQuestions.length}
                    </span>
                    <button
                      onClick={() => {
                        const newSelected = new Set(selectedQuestions);
                        const allSelected = categoryQuestions.every(q => selectedQuestions.has(q.id));
                        
                        if (allSelected) {
                          categoryQuestions.forEach(q => newSelected.delete(q.id));
                        } else {
                          categoryQuestions.forEach(q => newSelected.add(q.id));
                        }
                        setSelectedQuestions(newSelected);
                      }}
                      className="text-sm text-blue-500"
                    >
                      選択
                    </button>
                    <button className="text-sm text-blue-500">
                      解除
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  {subCategories.map(subCategory => {
                    const subCategoryQuestions = questions.filter(q => 
                      q.year === mainCategory && 
                      q.category === subCategory
                    );
                    return (
                      <label key={subCategory} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={subCategoryQuestions.every(q => selectedQuestions.has(q.id))}
                          onChange={() => {
                            const newSelected = new Set(selectedQuestions);
                            const allSelected = subCategoryQuestions.every(q => selectedQuestions.has(q.id));
                            
                            if (allSelected) {
                              subCategoryQuestions.forEach(q => newSelected.delete(q.id));
                            } else {
                              subCategoryQuestions.forEach(q => newSelected.add(q.id));
                            }
                            setSelectedQuestions(newSelected);
                          }}
                          className="h-4 w-4"
                        />
                        <span>{subCategory}</span>
                        <span className="text-sm text-gray-500">
                          {subCategoryQuestions.length}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* スタートボタン */}
        <div className="sticky bottom-0 left-0 right-0 bg-gradient-to-r from-gray-600 to-blue-500 h-16 flex items-center">
          <div className="container max-w-4xl mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <select
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="bg-transparent text-white border border-white/30 rounded px-2 py-1"
              >
                <option value={10}>10問</option>
                <option value={20}>20問</option>
                <option value={30}>30問</option>
                <option value={50}>50問</option>
              </select>
              <span className="text-white/80">/8</span>
            </div>
            <button
              onClick={handleStartQuiz}
              disabled={selectedQuestions.size === 0}
              className="bg-blue-500 text-white px-8 py-2 rounded-full hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              スタート
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
