'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface Question {
  question: string;
  options: string[];
  correctAnswers: number[];
}

interface Chapter {
  id: string;
  title: string;
  content: string;
  order: number;
  videoUrl: string;
  questions: Question[];
  webText: string;
}

enum ContentType {
  Video = 'video',
  WebText = 'webtext',
  Questions = 'questions',
}

export default function ChapterPage({ params }: { params: Promise<{ id: string; chapterId: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentContent, setCurrentContent] = useState<ContentType>(ContentType.Video);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number[] }>({});
  const [showResults, setShowResults] = useState(false);
  const [nextChapterId, setNextChapterId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchChapter();
  }, [resolvedParams.id, resolvedParams.chapterId]);

  const fetchChapter = async () => {
    try {
      setIsLoading(true);
      // TODO: APIからチャプター情報を取得
      const mockData = {
        id: '1',
        title: '第1章: 基礎知識',
        content: '基本的な概念と用語の解説',
        order: 1,
        videoUrl: '/uploads/videos/sample.mp4',
        webText: '# 基礎知識\n\nここでは基本的な概念について学びます。',
        questions: [
          {
            question: '次の記述のうち、正しいものを選んでください。',
            options: [
              '選択肢1',
              '選択肢2',
              '選択肢3',
              '選択肢4',
              '選択肢5',
            ],
            correctAnswers: [1, 3],
          },
        ],
      };
      setChapter(mockData);
      // TODO: 次のチャプターIDを取得
      setNextChapterId('2');
    } catch (error) {
      console.error('Failed to fetch chapter:', error);
      setError('チャプター情報の取得に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (questionIndex: number, optionIndex: number) => {
    const currentAnswers = selectedAnswers[questionIndex] || [];
    const newAnswers = currentAnswers.includes(optionIndex)
      ? currentAnswers.filter(a => a !== optionIndex)
      : [...currentAnswers, optionIndex];
    setSelectedAnswers({ ...selectedAnswers, [questionIndex]: newAnswers });
  };

  const checkAnswers = () => {
    setShowResults(true);
  };

  const handleNext = () => {
    if (currentContent === ContentType.Video) {
      setCurrentContent(ContentType.WebText);
    } else if (currentContent === ContentType.WebText) {
      setCurrentContent(ContentType.Questions);
    } else if (nextChapterId) {
      router.push(`/certifications/${resolvedParams.id}/chapters/${nextChapterId}`);
    }
  };

  const handleBack = () => {
    if (currentContent === ContentType.Questions) {
      setCurrentContent(ContentType.WebText);
    } else if (currentContent === ContentType.WebText) {
      setCurrentContent(ContentType.Video);
    }
  };

  // マウント前はnullを返す
  if (!mounted) return null;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!chapter) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">{chapter.title}</h1>
        <p className="text-gray-600">{chapter.content}</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {currentContent === ContentType.Video && (
          <div className="aspect-video relative">
            <iframe
              src={chapter.videoUrl}
              className="absolute inset-0 w-full h-full"
              allowFullScreen
            />
          </div>
        )}

        {currentContent === ContentType.WebText && (
          <div className="p-6">
            <div className="prose max-w-none">
              {chapter.webText}
            </div>
          </div>
        )}

        {currentContent === ContentType.Questions && (
          <div className="p-6">
            <h2 className="text-xl font-bold mb-6">練習問題</h2>
            <div className="space-y-8">
              {chapter.questions.map((question, questionIndex) => (
                <div key={questionIndex} className="border rounded-lg p-4">
                  <p className="font-medium mb-4">{question.question}</p>
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <label
                        key={optionIndex}
                        className={`flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                          selectedAnswers[questionIndex]?.includes(optionIndex)
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200'
                        } ${
                          showResults
                            ? question.correctAnswers.includes(optionIndex)
                              ? 'border-green-500 bg-green-50'
                              : selectedAnswers[questionIndex]?.includes(optionIndex)
                              ? 'border-red-500 bg-red-50'
                              : ''
                            : ''
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="mr-3"
                          checked={selectedAnswers[questionIndex]?.includes(optionIndex) || false}
                          onChange={() => handleAnswerSelect(questionIndex, optionIndex)}
                          disabled={showResults}
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {!showResults && (
              <div className="mt-6">
                <Button
                  onClick={checkAnswers}
                  className="bg-blue-600 hover:bg-blue-700 w-full"
                >
                  解答する
                </Button>
              </div>
            )}
          </div>
        )}

        <div className="p-6 border-t flex justify-between">
          <Button
            onClick={handleBack}
            variant="outline"
            disabled={currentContent === ContentType.Video}
          >
            戻る
          </Button>
          <Button
            onClick={handleNext}
            className="bg-blue-600 hover:bg-blue-700"
            disabled={currentContent === ContentType.Questions && !showResults}
          >
            {currentContent === ContentType.Questions ? '次のチャプターへ' : '次へ'}
          </Button>
        </div>
      </div>
    </div>
  );
}
