'use client';

import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { WritingLevel } from '@/types/english';
import { createClient } from '@/lib/supabase-client';

interface WritingQuestion {
  id: string;
  content: {
    question: string;
    format: 'translation';
    japanese?: string | string[];
    english?: string | string[];
    explanation?: string;
    schoolName?: string;
  };
  level: WritingLevel;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface AnswerResult {
  isCorrect: boolean;
  correctAnswer: string;
  yourAnswer: string;
  explanation?: string;
}

interface WordWithIndex {
  word: string;
  index: number;
}

const levelLabels: { [key in WritingLevel]: string } = {
  'junior': '中学レベル',
  'high': '高校レベル',
  'university': '大学レベル'
};

export default function WritingCategoryPage({ params }: { params: { category: string } }) {
  const [questions, setQuestions] = useState<WritingQuestion[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<WritingLevel>('junior');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [loading, setLoading] = useState(true);
  const [answer, setAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [shuffledWords, setShuffledWords] = useState<WordWithIndex[][]>([]);
  const [selectedWords, setSelectedWords] = useState<WordWithIndex[][]>([]);
  const [answerResult, setAnswerResult] = useState<AnswerResult | null>(null);
  const [isCorrectOrder, setIsCorrectOrder] = useState(false);
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showJapanese, setShowJapanese] = useState(true); // 日本語表示/英語表示の切り替え
  const [includeSolved, setIncludeSolved] = useState(false); // 正解済み問題も含めるかどうか
  const [isLoggedIn, setIsLoggedIn] = useState(false); // ログイン状態

  useEffect(() => {
    checkAuth();
    fetchQuestions();
  }, [params.category, selectedLevel, selectedDifficulty, includeSolved]);

  const checkAuth = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
    } catch (error) {
      console.error('Error checking auth:', error);
      setIsLoggedIn(false);
    }
  };

  const fetchQuestions = async () => {
    try {
      const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/english/questions/writing`);
      url.searchParams.set('category', params.category);
      url.searchParams.set('level', selectedLevel);
      url.searchParams.set('difficulty', selectedDifficulty);
      if (includeSolved) {
        url.searchParams.set('includeSolved', 'true');
      }
      
      const response = await fetch(url.toString());
      if (!response.ok) throw new Error('Failed to fetch questions');
      const data = await response.json();
      const questionArray = Array.isArray(data) ? data : [data];
      setQuestions(questionArray);

      // 英文が存在する場合、単語に分割してシャッフル
      if (questionArray[0]?.content.english) {
        if (Array.isArray(questionArray[0].content.english)) {
          // 複数の英文がある場合、それぞれを単語に分割してシャッフル
          const allWords = questionArray[0].content.english.map((text: string, textIndex: number) => {
            const words = text
              .split(' ')
              .map((word: string, index: number) => ({
                word: word.trim(),
                index
              }))
              .filter((w: WordWithIndex) => w.word.length > 0);
            return [...words].sort(() => Math.random() - 0.5);
          });
          setShuffledWords(allWords);
          setSelectedWords(new Array(allWords.length).fill([]));
        } else {
          // 単一の英文の場合
          const words = questionArray[0].content.english
            .split(' ')
            .map((word: string, index: number) => ({
              word: word.trim(),
              index
            }))
            .filter((w: WordWithIndex) => w.word.length > 0);
          setShuffledWords([[...words].sort(() => Math.random() - 0.5)]);
          setSelectedWords([[]]);
        }
      }
      
      // 新しい問題を取得したら結果をリセット
      setAnswerResult(null);
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'ai':
        return 'AI問題';
      case 'book':
        return '書籍問題';
      case 'school':
        return '学校問題';
      default:
        return category;
    }
  };

  const handleWordClick = (wordWithIndex: WordWithIndex, selectedIndex: number, isSelected: boolean, englishIndex: number) => {
    console.log('Word click:', { wordWithIndex, selectedIndex, isSelected, englishIndex, currentSelected: selectedWords });
    
    if (isSelected) {
      // 選択済みの単語を削除し、その後の単語を前に詰める
      const newSelectedWords = [...selectedWords];
      newSelectedWords[englishIndex] = newSelectedWords[englishIndex].filter((_, i) => i !== selectedIndex);
      console.log('After removal:', newSelectedWords);
      setSelectedWords(newSelectedWords);
    } else {
      // 新しい単語を追加（既に選択されている場合は何もしない）
      const currentWords = selectedWords[englishIndex] || [];
      if (!currentWords.find(sw => sw.index === wordWithIndex.index)) {
        const newSelectedWords = [...selectedWords];
        newSelectedWords[englishIndex] = [...currentWords, wordWithIndex];
        console.log('After addition:', newSelectedWords);
        setSelectedWords(newSelectedWords);
      }
    }
  };

  const handleSubmit = async () => {
    if (!questions[0]) return;

    console.log('Selected words order:', selectedWords.map(words => 
      words.map(w => ({
        word: w.word,
        originalIndex: w.index
      }))
    ));

    // 単語の順序が正しいかチェック
    const correctOrder = selectedWords.every((words, i) => 
      words.every((word, j) => word.index === j)
    );
    setIsCorrectOrder(correctOrder);
    console.log('Order check:', { correctOrder });

    // 選択された単語を文字列に変換
    const submittedAnswer = questions[0].content.english 
      ? selectedWords.map(words => words.map(w => w.word).join(' '))
      : answer;

    console.log('Submission:', {
      answer: submittedAnswer,
      correctAnswer: questions[0].content.english,
      correctOrder
    });

    setSubmitting(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/english/questions/writing/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questionId: questions[0].id,
          answer: submittedAnswer,
          isCorrectOrder: correctOrder
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit answer');
      }

      const result = await response.json();
      setAnswerResult(result);
      
      // 正解の場合、正解数をインクリメント
      if (correctOrder) {
        setCorrectAnswers(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      alert('回答の送信に失敗しました。');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionNumber >= totalQuestions) {
      // 全問題が終了した場合
      const accuracy = Math.round((correctAnswers / totalQuestions) * 100);
      alert(`${totalQuestions}問中${correctAnswers}問正解！\n正答率: ${accuracy}%`);
      
      // 状態をリセット
      setCurrentQuestionNumber(1);
      setCorrectAnswers(0);
    } else {
      // 次の問題へ
      setCurrentQuestionNumber(prev => prev + 1);
    }
    
    setLoading(true);
    setAnswer('');
    setSelectedWords([]);
    setAnswerResult(null);
    fetchQuestions();
  };

  return (
    <div className="flex">
      {/* サイドバー */}
      <div className="w-64 min-h-screen bg-gray-50 p-6">
        <div className="space-y-6">
          {/* 問題数選択 */}
          <div>
            <h2 className="text-lg font-bold mb-4">問題数選択</h2>
            <div className="space-y-2">
              {[5, 10, 15].map((num) => (
                <Button
                  key={num}
                  onClick={() => {
                    setTotalQuestions(num);
                    setCurrentQuestionNumber(1);
                    setCorrectAnswers(0);
                  }}
                  variant={totalQuestions === num ? "default" : "outline"}
                  className="w-full justify-start"
                >
                  {num}問
                </Button>
              ))}
            </div>
          </div>

          {/* 進捗状況 */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-bold mb-2">進捗状況</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>問題数:</span>
                <span>{currentQuestionNumber} / {totalQuestions}</span>
              </div>
              <div className="flex justify-between">
                <span>正解数:</span>
                <span>{correctAnswers}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${(currentQuestionNumber / totalQuestions) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* レベル選択 */}
          <div>
            <h2 className="text-lg font-bold mb-4">レベル選択</h2>
            <div className="space-y-2">
              {Object.entries(levelLabels).map(([level, label]) => (
                <Button
                  key={level}
                  onClick={() => setSelectedLevel(level as WritingLevel)}
                  variant={selectedLevel === level ? "default" : "outline"}
                  className="w-full justify-start"
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold mb-4">難易度選択</h2>
            <div className="space-y-2">
              <Button
                onClick={() => setSelectedDifficulty('beginner')}
                variant={selectedDifficulty === 'beginner' ? "default" : "outline"}
                className="w-full justify-start"
              >
                初級
              </Button>
              <Button
                onClick={() => setSelectedDifficulty('intermediate')}
                variant={selectedDifficulty === 'intermediate' ? "default" : "outline"}
                className="w-full justify-start"
              >
                中級
              </Button>
              <Button
                onClick={() => setSelectedDifficulty('advanced')}
                variant={selectedDifficulty === 'advanced' ? "default" : "outline"}
                className="w-full justify-start"
              >
                上級
              </Button>
            </div>
          </div>

          {/* 正解済み問題を含めるオプション（ログイン時のみ表示） */}
          {isLoggedIn && (
            <div>
              <h2 className="text-lg font-bold mb-4">オプション</h2>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeSolved}
                    onChange={(e) => setIncludeSolved(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">正解済み問題も含める</span>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">{getCategoryTitle(params.category)}</h1>
          <Button
            onClick={() => window.location.href = '/english/question/writing'}
            variant="outline"
          >
            問題一覧に戻る
          </Button>
        </div>

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : questions.length > 0 ? (
          <div className="space-y-6">
            <Card className="p-6">
              <div className="mb-4">
                <div className="flex gap-2 mb-2 items-center justify-between">
                  <div className="flex gap-2">
                    <span className="text-sm px-2 py-1 rounded bg-blue-100 text-blue-800">
                      {levelLabels[questions[0].level]}
                    </span>
                    <span className="text-sm px-2 py-1 rounded bg-green-100 text-green-800">
                      {questions[0].difficulty === 'beginner' ? '初級' :
                       questions[0].difficulty === 'intermediate' ? '中級' : '上級'}
                    </span>
                  </div>
                  {/* 言語切り替えボタン */}
                  {questions[0].content.japanese && questions[0].content.english && (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setShowJapanese(true)}
                        variant={showJapanese ? "default" : "outline"}
                        size="sm"
                      >
                        日本語
                      </Button>
                      <Button
                        onClick={() => setShowJapanese(false)}
                        variant={!showJapanese ? "default" : "outline"}
                        size="sm"
                      >
                        英語
                      </Button>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  {questions[0].content.schoolName && (
                    <div className="text-sm text-gray-600">
                      {questions[0].content.schoolName}
                    </div>
                  )}
                  {showJapanese ? (
                    // 日本語表示
                    Array.isArray(questions[0].content.japanese) ? (
                      questions[0].content.japanese.map((text, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <span className="text-sm text-gray-500 mt-1">({index + 1})</span>
                          <h3 className="text-lg font-semibold flex-1 whitespace-pre-wrap">
                            {text}
                          </h3>
                        </div>
                      ))
                    ) : (
                      <h3 className="text-lg font-semibold whitespace-pre-wrap">
                        {questions[0].content.japanese || questions[0].content.question}
                      </h3>
                    )
                  ) : (
                    // 英語表示
                    Array.isArray(questions[0].content.english) ? (
                      questions[0].content.english.map((text, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <span className="text-sm text-gray-500 mt-1">({index + 1})</span>
                          <h3 className="text-lg font-semibold flex-1 whitespace-pre-wrap">
                            {text}
                          </h3>
                        </div>
                      ))
                    ) : (
                      <h3 className="text-lg font-semibold whitespace-pre-wrap">
                        {questions[0].content.english || questions[0].content.question}
                      </h3>
                    )
                  )}
                </div>
              </div>
              <div className="space-y-4">
                {questions[0].content.english ? (
                  <>
                    {Array.isArray(questions[0].content.english) ? (
                      questions[0].content.english.map((text, englishIndex) => (
                        <div key={englishIndex} className="space-y-4">
                          <div className="flex items-start gap-2">
                            <span className="text-sm text-gray-500 mt-1">({englishIndex + 1})</span>
                            {/* 選択された単語の表示エリア */}
                            <div className="min-h-[100px] p-4 bg-gray-50 rounded-lg flex-1">
                              <p className="text-lg">
                                {selectedWords[englishIndex]?.map((wordWithIndex, index) => (
                                  <span
                                    key={index}
                                    onClick={() => handleWordClick(wordWithIndex, index, true, englishIndex)}
                                    className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded m-1 cursor-pointer"
                                  >
                                    {wordWithIndex.word}
                                  </span>
                                ))}
                              </p>
                            </div>
                          </div>
                          {/* 利用可能な単語の表示エリア */}
                          <div className="ml-6 p-4 bg-gray-100 rounded-lg">
                            <p className="text-lg">
                              {shuffledWords[englishIndex]?.map((wordWithIndex, index) => (
                                !selectedWords[englishIndex]?.find(sw => sw.index === wordWithIndex.index) && (
                                  <span
                                    key={index}
                                    onClick={() => handleWordClick(wordWithIndex, selectedWords[englishIndex]?.length || 0, false, englishIndex)}
                                    className="inline-block bg-white text-gray-800 px-2 py-1 rounded m-1 cursor-pointer hover:bg-gray-200"
                                  >
                                    {wordWithIndex.word}
                                  </span>
                                )
                              ))}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <>
                        {/* 選択された単語の表示エリア */}
                        <div className="min-h-[100px] p-4 bg-gray-50 rounded-lg">
                          <p className="text-lg">
                            {selectedWords[0]?.map((wordWithIndex, index) => (
                              <span
                                key={index}
                                onClick={() => handleWordClick(wordWithIndex, index, true, 0)}
                                className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded m-1 cursor-pointer"
                              >
                                {wordWithIndex.word}
                              </span>
                            ))}
                          </p>
                        </div>
                        {/* 利用可能な単語の表示エリア */}
                        <div className="p-4 bg-gray-100 rounded-lg">
                          <p className="text-lg">
                            {shuffledWords[0]?.map((wordWithIndex, index) => (
                              !selectedWords[0]?.find(sw => sw.index === wordWithIndex.index) && (
                                <span
                                  key={index}
                                  onClick={() => handleWordClick(wordWithIndex, selectedWords[0]?.length || 0, false, 0)}
                                  className="inline-block bg-white text-gray-800 px-2 py-1 rounded m-1 cursor-pointer hover:bg-gray-200"
                                >
                                  {wordWithIndex.word}
                                </span>
                              )
                            ))}
                          </p>
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <Textarea
                    placeholder="ここに英語で回答を入力してください..."
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    rows={8}
                    className="w-full"
                  />
                )}

                {/* 回答結果の表示 */}
                {answerResult && (
                  <div className="space-y-4">
                    <div className="flex flex-col items-center justify-center space-y-4 relative">
                      {isCorrectOrder && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="animate-ping absolute h-32 w-32 rounded-full bg-green-400 opacity-20"></div>
                          <div className="animate-ping absolute h-24 w-24 rounded-full bg-green-500 opacity-20 delay-75"></div>
                          <div className="animate-ping absolute h-16 w-16 rounded-full bg-green-600 opacity-20 delay-150"></div>
                        </div>
                      )}
                      <div className={`text-4xl font-bold ${
                        isCorrectOrder 
                          ? 'animate-bounce text-green-500'
                          : 'animate-shake text-red-500'
                      }`}>
                        {isCorrectOrder 
                          ? '正解！'
                          : 'もう一度！'}
                      </div>
                      <div className={`text-2xl transform transition-all duration-500 ${
                        isCorrectOrder
                          ? 'text-green-400 scale-110'
                          : 'text-red-400'
                      }`}>
                        {isCorrectOrder
                          ? 'レベルアップ！ +10EXP'
                          : 'チャレンジを続けよう！'}
                      </div>
                      {isCorrectOrder && (
                        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                          <div className="absolute animate-float-up-1 left-1/4 text-4xl">🌟</div>
                          <div className="absolute animate-float-up-2 left-1/2 text-4xl">✨</div>
                          <div className="absolute animate-float-up-3 left-3/4 text-4xl">🌟</div>
                        </div>
                      )}
                    </div>
                    <div className={`p-6 rounded-lg shadow-lg transform transition-all duration-300 ${
                      isCorrectOrder 
                        ? 'bg-green-50 border-2 border-green-200 scale-105' 
                        : 'bg-red-50 border-2 border-red-200'
                    }`}>
                      <div className="space-y-2">
                        {Array.isArray(questions[0].content.english) ? (
                          questions[0].content.english.map((_, index) => (
                            <div key={index}>
                              <p className="whitespace-pre-wrap">
                                <span className="font-semibold">あなたの回答 ({index + 1})：</span>
                                {selectedWords[index]?.map(w => w.word).join(' ')}
                              </p>
                              <p className="whitespace-pre-wrap">
                                <span className="font-semibold">正解 ({index + 1})：</span>
                                {questions[0]?.content?.english?.[index]}
                              </p>
                            </div>
                          ))
                        ) : (
                          <>
                            <p className="whitespace-pre-wrap">
                              <span className="font-semibold">あなたの回答：</span>
                              {questions[0].content.english 
                                ? selectedWords[0]?.map(w => w.word).join(' ')
                                : answer}
                            </p>
                            <p className="whitespace-pre-wrap">
                              <span className="font-semibold">正解：</span>
                              {questions[0].content.english}
                            </p>
                          </>
                        )}
                        {answerResult.explanation && (
                          <div className="mt-4 p-4 bg-white rounded-lg">
                            <p className="font-semibold mb-2">解説：</p>
                            <p>{answerResult.explanation}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-4">
                  <Button
                    onClick={handleNextQuestion}
                    variant="outline"
                  >
                    {currentQuestionNumber >= totalQuestions ? '結果を見る' : '次の問題へ'}
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={submitting || (!answer && selectedWords.every(words => words.length === 0))}
                  >
                    {submitting ? '送信中...' : '回答を送信'}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            問題が見つかりませんでした。
          </div>
        )}
      </div>
    </div>
  );
}
