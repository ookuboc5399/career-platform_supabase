'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import VideoPlayer from '@/components/ui/VideoPlayer';
import { CertificationChapter, CertificationProgress } from '@/types/api';

export default function ChapterPage({ params }: { params: { id: string; chapterId: string } }) {
  const router = useRouter();
  const [chapter, setChapter] = useState<CertificationChapter | null>(null);
  const [progress, setProgress] = useState<CertificationProgress | null>(null);
  const [nextChapter, setNextChapter] = useState<CertificationChapter | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const certificationId = params.id;
  const chapterId = params.chapterId;

  useEffect(() => {
    fetchChapter();
    fetchProgress();
    fetchNextChapter();
  }, [certificationId, chapterId]);

  const fetchNextChapter = async () => {
    try {
      const response = await fetch(`/api/certifications/${certificationId}/chapters`);
      if (!response.ok) throw new Error('Failed to fetch chapters');
      const chapters = await response.json();
      
      const sortedChapters = chapters.sort((a: CertificationChapter, b: CertificationChapter) => a.order - b.order);
      const currentIndex = sortedChapters.findIndex((c: CertificationChapter) => c.id === chapterId);
      if (currentIndex !== -1 && currentIndex < sortedChapters.length - 1) {
        setNextChapter(sortedChapters[currentIndex + 1]);
      }
    } catch (error) {
      console.error('Error fetching next chapter:', error);
    }
  };

  const fetchProgress = async () => {
    try {
      const response = await fetch(`/api/certifications/progress?certificationId=${certificationId}&chapterId=${chapterId}`);
      if (!response.ok) throw new Error('Failed to fetch progress');
      const data = await response.json();
      setProgress(data);
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  const fetchChapter = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/certifications/chapters/${chapterId}?certificationId=${certificationId}`);
      if (!response.ok) throw new Error('Failed to fetch chapter');
      const data = await response.json();
      setChapter(data);
    } catch (error) {
      console.error('Error fetching chapter:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = async (questionIndex: number, optionIndex: number) => {
    if (!chapter || !chapter.questions) return;
    
    const question = chapter.questions[questionIndex];
    if (!question) return;

    // 選択した回答を更新
    setSelectedAnswers(prev => {
      const current = prev[question.id] || [];
      const updated = current.includes(optionIndex)
        ? current.filter(i => i !== optionIndex)
        : [...current, optionIndex];
      return {
        ...prev,
        [question.id]: updated
      };
    });
  };

  const handleAnswerSubmit = async (questionId: string, selectedIndexes: number[]) => {
    try {
      const question = chapter?.questions.find(q => q.id === questionId);
      if (!question) return;

      // 選択した回答と正解を比較
      const isCorrect = selectedIndexes.length === question.correctAnswers.length &&
        selectedIndexes.every(index => question.correctAnswers.includes(index));

      const response = await fetch('/api/certifications/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          certificationId,
          chapterId,
          questionId,
          isCorrect,
        }),
      });

      if (!response.ok) throw new Error('Failed to update progress');
      
      fetchProgress();
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const handleVideoComplete = async () => {
    try {
      const response = await fetch('/api/certifications/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          certificationId,
          chapterId,
          videoCompleted: true,
        }),
      });

      if (!response.ok) throw new Error('Failed to update progress');
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="text-center py-12 text-gray-500">
        チャプターが見つかりません
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href={`/certifications/${certificationId}/chapters`}
          className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          戻る
        </Link>
        <h1 className="text-3xl font-bold">{chapter.title}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 左側: ビデオプレイヤー */}
        <div>
          <div className="aspect-video mb-6">
            <VideoPlayer 
              url={chapter.videoUrl} 
              onComplete={handleVideoComplete}
              completed={progress?.videoCompleted}
            />
          </div>
          <div className="prose max-w-none">
            <p className="text-gray-700 mb-4">{chapter.description}</p>
            <div dangerouslySetInnerHTML={{ __html: chapter.content }} />
          </div>
        </div>

        {/* 右側: 問題または次のチャプターへのボタン */}
        <div>
          {chapter.questions && chapter.questions.length > 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6">確認問題</h2>
              <div className="space-y-6">
                {chapter.questions.map((question, index) => {
                  const isAnswered = progress?.completedQuestions?.includes(question.id);
                  const currentAnswers = selectedAnswers[question.id] || [];
                  
                  return (
                    <div key={question.id} className="space-y-4">
                      <p className="font-medium">{index + 1}. {question.question}</p>
                      {question.questionImage && (
                        <img 
                          src={question.questionImage} 
                          alt="問題の図" 
                          className="max-w-full h-auto rounded-lg shadow-sm"
                        />
                      )}
                      <div className="grid gap-3">
                        {question.options.map((option, optionIndex) => {
                          const letter = String.fromCharCode(65 + optionIndex);
                          const isSelected = currentAnswers.includes(optionIndex);
                          const showResult = isAnswered;
                          const isCorrect = question.correctAnswers.includes(optionIndex);
                          
                          return (
                            <button
                              key={optionIndex}
                              onClick={() => {
                                if (!isAnswered) {
                                  handleAnswerSelect(index, optionIndex);
                                }
                              }}
                              className={`p-3 border rounded-lg text-left hover:bg-gray-50 flex items-center gap-4 ${
                                showResult
                                  ? isCorrect
                                    ? 'bg-green-100 border-green-500'
                                    : isSelected
                                    ? 'bg-red-100 border-red-500'
                                    : ''
                                  : isSelected
                                  ? 'bg-blue-100 border-blue-500'
                                  : ''
                              }`}
                              disabled={isAnswered}
                            >
                              <span className="font-semibold min-w-[24px]">{letter}.</span>
                              <span>{option.text}</span>
                              {option.imageUrl && (
                                <img 
                                  src={option.imageUrl} 
                                  alt={`選択肢${letter}の図`} 
                                  className="max-w-[100px] h-auto rounded"
                                />
                              )}
                              {showResult && isSelected && (
                                <span className="ml-auto">
                                  {isCorrect ? (
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                  ) : (
                                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  )}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                      {!isAnswered && currentAnswers.length > 0 && (
                        <div className="mt-4">
                          <Button
                            onClick={() => handleAnswerSubmit(question.id, currentAnswers)}
                            className="w-full bg-blue-600 text-white"
                          >
                            回答を送信
                          </Button>
                        </div>
                      )}
                      {isAnswered && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                          <p className="font-medium text-gray-700 mb-2">
                            {progress?.answers?.[question.id] ? (
                              <span className="text-green-600">正解です！</span>
                            ) : (
                              <span className="text-red-600">
                                不正解です。正解は {question.correctAnswers.map(i => String.fromCharCode(65 + i)).join(', ')} です。
                              </span>
                            )}
                          </p>
                          <p className="font-medium text-gray-700">解説:</p>
                          <p className="text-gray-600">{question.explanation}</p>
                          {question.explanationImages && question.explanationImages.length > 0 && (
                            <div className="mt-4 space-y-2">
                              {question.explanationImages.map((imageUrl, i) => (
                                <img 
                                  key={i}
                                  src={imageUrl} 
                                  alt={`解説図${i + 1}`} 
                                  className="max-w-full h-auto rounded-lg shadow-sm"
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : nextChapter && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">次のチャプター</h2>
              <p className="text-gray-600 mb-6">{nextChapter.title}</p>
              <Button
                onClick={() => router.push(`/certifications/${certificationId}/chapters/${nextChapter.id}`)}
                className="w-full bg-blue-600 text-white px-8 py-4 rounded-lg shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                次のチャプターへ進む
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
