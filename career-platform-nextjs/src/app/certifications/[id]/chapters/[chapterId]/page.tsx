"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import VideoPlayer from '@/components/ui/VideoPlayer';
import { CertificationChapter, CertificationProgress } from '@/types/api';

export default function ChapterPage({ params }: { params: { id: string; chapterId: string } }) {
  const router = useRouter();
  const [chapter, setChapter] = useState<CertificationChapter | null>(null);
  const [progress, setProgress] = useState<CertificationProgress | null>(null);
  const [nextChapter, setNextChapter] = useState<CertificationChapter | null>(null);
  const [answeredQuestions, setAnsweredQuestions] = useState<Record<string, number>>({});
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
      
      // 現在のチャプターの次のチャプターを探す
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

  const handleAnswerSelect = async (questionIndex: number, choiceIndex: number) => {
    if (!chapter || !chapter.questions) return;
    
    const question = chapter.questions[questionIndex];
    if (!question) return;

    try {
      const response = await fetch('/api/certifications/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          certificationId,
          chapterId,
          questionId: question.id,
          isCorrect: choiceIndex === question.correctAnswer,
        }),
      });

      if (!response.ok) throw new Error('Failed to update progress');
      
      // 進捗を再取得して表示を更新
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
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <p className="text-gray-500">チャプターが見つかりません</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button
          onClick={() => router.push(`/certifications/${certificationId}/chapters`)}
          variant="outline"
          className="mb-4"
        >
          ← 戻る
        </Button>
        <h1 className="text-2xl font-bold">{chapter.title}</h1>
      </div>

      <div className="space-y-8 relative pb-16">
        {/* ビデオセクション */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="aspect-video">
            <VideoPlayer 
              url={chapter.videoUrl} 
              onComplete={handleVideoComplete}
              completed={progress?.videoCompleted}
            />
          </div>
          <div className="p-6">
            <p className="text-gray-700 mb-4">{chapter.description}</p>
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: chapter.content }} />
          </div>
        </div>

        {/* 問題セクション */}
        {chapter.questions && chapter.questions.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">確認問題</h2>
            <div className="space-y-6">
              {chapter.questions.map((question, index) => (
                <div key={question.id} className="space-y-4">
                  <p className="font-medium">{index + 1}. {question.question}</p>
                  <div className="grid gap-3">
                    {question.choices.map((choice, choiceIndex) => {
                      const letter = String.fromCharCode(65 + choiceIndex); // A, B, C...
                      const isAnswered = question.id in answeredQuestions;
                      const isSelected = answeredQuestions[question.id] === choiceIndex;
                      const isCorrect = choiceIndex === question.correctAnswer;
                      
                      return (
                        <button
                          key={choice.id}
                          onClick={() => {
                            if (!isAnswered) {
                              handleAnswerSelect(index, choiceIndex);
                              setAnsweredQuestions(prev => ({
                                ...prev,
                                [question.id]: choiceIndex
                              }));
                            }
                          }}
                          className={`p-3 border rounded-lg text-left hover:bg-gray-50 flex items-center gap-4 ${
                            isAnswered && isSelected
                              ? isCorrect
                                ? 'bg-green-100 border-green-500'
                                : 'bg-red-100 border-red-500'
                              : isAnswered && isCorrect
                              ? 'bg-green-100 border-green-500'
                              : ''
                          }`}
                          disabled={isAnswered}
                        >
                          <span className="font-semibold min-w-[24px]">{letter}.</span>
                          <span>{choice.text}</span>
                          {isAnswered && isSelected && (
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
                  {(question.id in answeredQuestions) && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-700 mb-2">
                        {answeredQuestions[question.id] === question.correctAnswer ? (
                          <span className="text-green-600">正解です！</span>
                        ) : (
                          <span className="text-red-600">不正解です。正解は {String.fromCharCode(65 + question.correctAnswer)} です。</span>
                        )}
                      </p>
                      <p className="font-medium text-gray-700">解説:</p>
                      <p className="text-gray-600">{question.explanation}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 次へボタン */}
        {nextChapter && (
          <div className="fixed bottom-8 right-8">
            <Button
              onClick={() => router.push(`/certifications/${certificationId}/chapters/${nextChapter.id}`)}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg shadow-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              次のチャプターへ
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
  );
}
