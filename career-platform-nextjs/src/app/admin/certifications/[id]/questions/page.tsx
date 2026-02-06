"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import CreateQuestionModal from '@/components/ui/CreateQuestionModal';
import { EditQuestionModal } from '@/components/ui/EditQuestionModal';
import { searchQuestions, updateQuestion, getCertification, getQuestions } from '@/lib/api';
import { Certification, CertificationQuestion, Option } from '@/types/api';

export default function QuestionsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const certificationId = params.id;
  const [questions, setQuestions] = useState<CertificationQuestion[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<CertificationQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<CertificationQuestion | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [years, setYears] = useState<Set<string>>(new Set());
  const [categories, setCategories] = useState<Set<string>>(new Set());
  const [certification, setCertification] = useState<Certification | null>(null);

  useEffect(() => {
    fetchCertification();
  }, [certificationId]);

  const fetchCertification = async () => {
    try {
      const data = await getCertification(certificationId);
      setCertification(data);
      await fetchQuestions();
    } catch (error) {
      console.error('Error fetching certification:', error);
    }
  };

  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      
      // APIから直接問題を取得
      const questionsData = await getQuestions(certificationId);
      
      // 全ての問題を設定（検索用）
      setQuestions(questionsData || []);
      // 初期状態では問題を表示しない
      setFilteredQuestions([]);

      // 年度とカテゴリーの一覧を収集
      const yearSet = new Set<string>();
      const categorySet = new Set<string>();
      (questionsData || []).forEach((q: CertificationQuestion) => {
        if (q.year) yearSet.add(q.year);
        if (q.category) categorySet.add(q.category);
      });
      setYears(yearSet);
      setCategories(categorySet);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setQuestions([]);
      setFilteredQuestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filterQuestions = async () => {
    if (!certification) return;

    try {
      setIsLoading(true);
      console.log('検索開始');

      const params = {
        keyword: searchQuery || undefined,
        year: selectedYear || undefined,
        category: selectedCategory || undefined
      };
      
      const data = await searchQuestions(certificationId, params);
      setFilteredQuestions(data);
      console.log('検索結果:', data.length, '件');
    } catch (error) {
      console.error('検索エラー:', error);
      alert('検索中にエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };


  const highlightText = (text: string) => {
    if (!searchQuery) return text;
    const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === searchQuery.toLowerCase() ? 
        <span key={i} className="bg-yellow-200">{part}</span> : 
        part
    );
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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => router.push('/admin/certifications')}
            variant="outline"
          >
            ← 戻る
          </Button>
          <h1 className="text-2xl font-bold">問題管理</h1>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          新規問題作成
        </Button>
      </div>

      {/* 検索フィルター */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* キーワード検索 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              キーワード検索
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="問題文、選択肢、解説を検索"
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          {/* 年度フィルター */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              年度
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">すべて</option>
              {Array.from(years).sort().map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          {/* カテゴリーフィルター */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              カテゴリー
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">すべて</option>
              {Array.from(categories).sort().map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 検索ボタン */}
        <div className="flex justify-end">
          <Button onClick={filterQuestions}>
            検索
          </Button>
        </div>
      </div>

      {/* 問題一覧 */}
      <div className="space-y-6">
        {filteredQuestions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-500">該当する問題が見つかりません</p>
          </div>
        ) : (
          filteredQuestions.map((question) => (
            <div key={question.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  {question.questionNumber && (
                    <span className="text-sm font-semibold text-blue-600">問{question.questionNumber}</span>
                  )}
                  <span className="text-sm text-gray-500">{question.year}</span>
                  <span className="text-sm text-gray-500">{question.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedQuestion(question);
                      setIsEditModalOpen(true);
                    }}
                  >
                    編集
                  </Button>
                  <div className="text-sm text-gray-500">
                    作成日: {new Date(question.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  {question.questionNumber && (
                    <span className="text-lg font-bold text-blue-600">問{question.questionNumber}</span>
                  )}
                  <p className="text-lg font-medium">{highlightText(question.question)}</p>
                </div>
                <div className="space-y-2">
                  {question.options.map((option, index) => {
                    const letter = String.fromCharCode(65 + index);
                    const isCorrect = question.correctAnswers.includes(index);
                    return (
                      <div
                        key={index}
                        className={`p-3 rounded-md ${
                          isCorrect ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                        }`}
                      >
                        <span className="font-semibold mr-2">{letter}.</span>
                        <div>
                          <span>{highlightText(option.text)}</span>
                          {option.imageUrl && (
                            <div className="mt-2">
                              <Image
                                src={option.imageUrl}
                                alt={`選択肢${letter}の画像`}
                                width={200}
                                height={200}
                                className="rounded-md"
                              />
                            </div>
                          )}
                        </div>
                        {isCorrect && (
                          <span className="ml-2 text-green-600">✓</span>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="bg-gray-50 rounded-md p-4">
                  <p className="font-medium text-gray-700 mb-2">解説:</p>
                  <p className="text-gray-600">{highlightText(question.explanation)}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <CreateQuestionModal
        certificationId={certificationId}
        category={certification?.category || ''}
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          if (certification) {
            // 問題作成後も問題一覧は表示せず、検索条件をリセット
            setSearchQuery('');
            setSelectedYear('');
            setSelectedCategory('');
            setFilteredQuestions([]);
            // 年度とカテゴリーの選択肢は更新
            const yearSet = new Set<string>();
            const categorySet = new Set<string>();
            (certification.questions || []).forEach(q => {
              if (q.year) yearSet.add(q.year);
              if (q.category) categorySet.add(q.category);
            });
            setYears(yearSet);
            setCategories(categorySet);
          }
        }}
      />

      {selectedQuestion && (
        <EditQuestionModal
          question={{
            ...selectedQuestion,
            options: selectedQuestion.options.map(opt => ({
              text: typeof opt === 'string' ? opt : opt.text,
              imageUrl: typeof opt === 'string' ? null : opt.imageUrl
            }))
          }}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedQuestion(null);
            // 問題編集後も現在の検索結果を維持するため、検索を再実行
            filterQuestions();
          }}
          onSave={async (updatedQuestion) => {
            try {
              await updateQuestion(certificationId, updatedQuestion.id, updatedQuestion);
              setIsEditModalOpen(false);
              setSelectedQuestion(null);
              // 問題編集後も現在の検索条件を維持したまま検索を再実行
              filterQuestions();
            } catch (error) {
              console.error('Error updating question:', error);
              alert('問題の更新に失敗しました');
            }
          }}
        />
      )}
    </div>
  );
}
