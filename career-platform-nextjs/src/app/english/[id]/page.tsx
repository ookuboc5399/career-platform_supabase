'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import VideoPlayer from '@/components/ui/VideoPlayer';
import { EnglishContent, EnglishProgress } from '@/types/api';
import { getEnglishContentById, updateEnglishProgress } from '@/lib/api';

export default function EnglishLessonPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [content, setContent] = useState<EnglishContent | null>(null);
  const [progress, setProgress] = useState<EnglishProgress | null>(null);
  const [selectedExerciseIndex, setSelectedExerciseIndex] = useState<number>(-1);
  const [selectedAnswer, setSelectedAnswer] = useState<number>(-1);
  const [showExplanation, setShowExplanation] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const contentData = await getEnglishContentById(params.id);
        setContent(contentData);

        // 進捗情報を取得（ユーザーIDは仮で'user1'を使用）
        const progressData = await updateEnglishProgress('user1', params.id, {});
        setProgress(progressData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load content');
      }
    };

    fetchData();
  }, [params.id]);

  const handleVideoComplete = async () => {
    try {
      if (!progress) return;

      const updatedProgress = await updateEnglishProgress(
        'user1',
        params.id,
        {
          videoCompleted: true,
          completedExercises: progress.completedExercises,
        }
      );
      setProgress(updatedProgress);
    } catch (error) {
      console.error('Error updating progress:', error);
      setError('Failed to update progress');
    }
  };

  const handleAnswerSubmit = async () => {
    if (!content || !progress || selectedExerciseIndex === -1 || selectedAnswer === -1) return;

    const exercise = content.exercises[selectedExerciseIndex];
    const isCorrect = selectedAnswer === exercise.correctAnswer;

    if (isCorrect) {
      try {
        const updatedProgress = await updateEnglishProgress(
          'user1',
          params.id,
          {
            videoCompleted: progress.videoCompleted,
            completedExercises: [...progress.completedExercises, exercise.id],
          }
        );
        setProgress(updatedProgress);
      } catch (error) {
        console.error('Error updating progress:', error);
        setError('Failed to update progress');
      }
    }

    setShowExplanation(true);
  };

  const handleNextExercise = () => {
    setSelectedAnswer(-1);
    setShowExplanation(false);
    setSelectedExerciseIndex(prev => 
      prev < (content?.exercises.length || 0) - 1 ? prev + 1 : -1
    );
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!content || !progress) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">{content.title}</h1>
        <p className="text-gray-600 mb-8">{content.description}</p>

        {/* ビデオセクション */}
        {content.videoUrl && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">レッスン動画</h2>
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              <VideoPlayer
                url={content.videoUrl}
                onComplete={handleVideoComplete}
                completed={progress.videoCompleted}
              />
            </div>
          </div>
        )}

        {/* コンテンツセクション */}
        {content.content && (
          <div className="prose max-w-none mb-8">
            <div dangerouslySetInnerHTML={{ __html: content.content }} />
          </div>
        )}

        {/* 問題セクション */}
        {selectedExerciseIndex === -1 ? (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">確認テスト</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {content.exercises.map((exercise, index) => (
                <button
                  key={exercise.id}
                  onClick={() => setSelectedExerciseIndex(index)}
                  className={`p-4 rounded-lg border ${
                    progress.completedExercises.includes(exercise.id)
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-blue-500'
                  }`}
                >
                  <h3 className="font-medium">問題 {index + 1}</h3>
                  <p className="text-sm text-gray-600 mt-1">{exercise.question}</p>
                  {progress.completedExercises.includes(exercise.id) && (
                    <span className="inline-block px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full mt-2">
                      完了
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">問題 {selectedExerciseIndex + 1}</h2>
              <button
                onClick={() => setSelectedExerciseIndex(-1)}
                className="text-gray-600 hover:text-gray-900"
              >
                問題一覧に戻る
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6 mb-4">
              <p className="text-lg mb-6">{content.exercises[selectedExerciseIndex].question}</p>

              <div className="space-y-4">
                {content.exercises[selectedExerciseIndex].choices.map((choice, index) => (
                  <button
                    key={choice.id}
                    onClick={() => !showExplanation && setSelectedAnswer(index)}
                    disabled={showExplanation}
                    className={`w-full text-left p-4 rounded-lg border ${
                      selectedAnswer === index
                        ? showExplanation
                          ? index === content.exercises[selectedExerciseIndex].correctAnswer
                            ? 'border-green-500 bg-green-50'
                            : 'border-red-500 bg-red-50'
                          : 'border-blue-500 bg-blue-50'
                        : showExplanation && index === content.exercises[selectedExerciseIndex].correctAnswer
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-blue-500'
                    }`}
                  >
                    {choice.text}
                  </button>
                ))}
              </div>

              {!showExplanation && selectedAnswer !== -1 && (
                <button
                  onClick={handleAnswerSubmit}
                  className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  回答を確定
                </button>
              )}

              {showExplanation && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-2">解説</h3>
                  <p className="text-gray-600">
                    {content.exercises[selectedExerciseIndex].explanation}
                  </p>
                  <button
                    onClick={handleNextExercise}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    次の問題へ
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 関連リソース */}
        {content.resources.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">関連リソース</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {content.resources.map((resource) => (
                <a
                  key={resource.url}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-lg border border-gray-200 hover:border-blue-500"
                >
                  <h3 className="font-medium">{resource.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {resource.type === 'video' && '動画'}
                    {resource.type === 'article' && '記事'}
                    {resource.type === 'document' && 'ドキュメント'}
                  </p>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
