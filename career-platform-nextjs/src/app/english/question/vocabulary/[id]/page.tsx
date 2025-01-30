'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card } from "@/components/ui/card";

interface Word {
  id: string;
  english: string;
  japanese: string;
  example: string;
  exampleTranslation: string;
  partOfSpeech: string;
}

export default function VocabularyDetailPage() {
  const params = useParams();
  const setId = params?.id as string;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [knownWords, setKnownWords] = useState<Set<string>>(new Set());

  // サンプル単語データ
  const words: Word[] = [
    {
      id: '1',
      english: 'accomplish',
      japanese: '達成する、成し遂げる',
      example: 'She accomplished her goal of running a marathon.',
      exampleTranslation: '彼女はマラソンを走るという目標を達成した。',
      partOfSpeech: '動詞',
    },
    {
      id: '2',
      english: 'beneficial',
      japanese: '有益な、有利な',
      example: 'Regular exercise is beneficial for your health.',
      exampleTranslation: '定期的な運動は健康に有益です。',
      partOfSpeech: '形容詞',
    },
    {
      id: '3',
      english: 'crucial',
      japanese: '重要な、決定的な',
      example: 'Communication is crucial in any relationship.',
      exampleTranslation: 'コミュニケーションはどんな関係でも重要です。',
      partOfSpeech: '形容詞',
    },
  ];

  const currentWord = words[currentIndex];
  const isLastWord = currentIndex === words.length - 1;

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowAnswer(false);
    }
  };

  const toggleKnown = () => {
    const newKnownWords = new Set(knownWords);
    if (knownWords.has(currentWord.id)) {
      newKnownWords.delete(currentWord.id);
    } else {
      newKnownWords.add(currentWord.id);
    }
    setKnownWords(newKnownWords);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">単語学習</h1>
        <Link
          href="/english/question/vocabulary"
          className="text-blue-500 hover:text-blue-700 flex items-center"
        >
          ← 単語セット一覧に戻る
        </Link>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* 進捗バー */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span>進捗</span>
            <span>{currentIndex + 1} / {words.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${((currentIndex + 1) / words.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* 単語カード */}
        <Card className="p-6 mb-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">{currentWord.english}</h2>
            <p className="text-gray-500 mb-4">{currentWord.partOfSpeech}</p>
            
            {showAnswer ? (
              <div className="space-y-4">
                <p className="text-xl">{currentWord.japanese}</p>
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-gray-700">{currentWord.example}</p>
                  <p className="text-gray-500 mt-2">{currentWord.exampleTranslation}</p>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowAnswer(true)}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
              >
                答えを見る
              </button>
            )}
          </div>
        </Card>

        {/* ナビゲーションボタン */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className={`px-4 py-2 rounded-lg ${
              currentIndex === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            前の単語
          </button>

          <button
            onClick={toggleKnown}
            className={`px-4 py-2 rounded-lg ${
              knownWords.has(currentWord.id)
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {knownWords.has(currentWord.id) ? '覚えた！' : 'まだ'}
          </button>

          {!isLastWord ? (
            <button
              onClick={handleNext}
              className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
            >
              次の単語
            </button>
          ) : (
            <Link
              href="/english/question/vocabulary"
              className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600"
            >
              完了！
            </Link>
          )}
        </div>

        {/* 学習進捗 */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">学習進捗</h3>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="mb-2">
              覚えた単語: {knownWords.size} / {words.length}
              <span className="text-gray-500 ml-2">
                ({Math.round((knownWords.size / words.length) * 100)}%)
              </span>
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-green-500 h-2.5 rounded-full"
                style={{ width: `${(knownWords.size / words.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
