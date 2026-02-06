'use client';

import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface ReadingQuestionContent {
  title: string;
  content: string;
  questions: Question[];
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
}

interface ReadingQuestion {
  id: string;
  type: 'reading';
  content: ReadingQuestionContent;
}

interface AnswerResult {
  isCorrect: boolean;
  correctAnswer: string;
  yourAnswer: string;
  explanation: string;
}

export default function ReadingCategoryPage({ params }: { params: { category: string } }) {
  const [questions, setQuestions] = useState<ReadingQuestion[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [answerResults, setAnswerResults] = useState<AnswerResult[]>([]);
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  useEffect(() => {
    fetchQuestions();
  }, [params.category, selectedLevel]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/english/questions/reading?category=${params.category}&level=${selectedLevel}`
      );
      if (!response.ok) throw new Error('Failed to fetch questions');
      const data = await response.json();
      console.log('Fetched questions:', data);
      const questionData = Array.isArray(data) ? data : [data];
      setQuestions(questionData);
      setSelectedAnswers(new Array(questionData[0]?.content?.questions?.length || 0).fill(-1));
      setAnswerResults([]);
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!questions[0]) return;

    setSubmitting(true);
    try {
      const response = await fetch(
        `${window.location.origin}/api/english/questions/reading/submit`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            questionId: questions[0].id,
            answers: selectedAnswers,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to submit answer');
      }

      const results = await response.json();
      setAnswerResults(results);

      // 正解数をカウント
      const correctCount = results.filter((result: AnswerResult) => result.isCorrect).length;
      setCorrectAnswers(prev => prev + correctCount);
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
    setSelectedAnswers([]);
    setAnswerResults([]);
    fetchQuestions();
  };

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'general':
        return '一般';
      case 'business':
        return 'ビジネス';
      case 'academic':
        return '学術';
      default:
        return category;
    }
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
            <h2 className="text-lg font-bold mb-4">難易度選択</h2>
            <div className="space-y-2">
              <Button
                onClick={() => setSelectedLevel('beginner')}
                variant={selectedLevel === 'beginner' ? "default" : "outline"}
                className="w-full justify-start"
              >
                初級
              </Button>
              <Button
                onClick={() => setSelectedLevel('intermediate')}
                variant={selectedLevel === 'intermediate' ? "default" : "outline"}
                className="w-full justify-start"
              >
                中級
              </Button>
              <Button
                onClick={() => setSelectedLevel('advanced')}
                variant={selectedLevel === 'advanced' ? "default" : "outline"}
                className="w-full justify-start"
              >
                上級
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">{getCategoryTitle(params.category)}</h1>
          <Button
            onClick={() => window.location.href = '/english/question/reading'}
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
                <div className="flex gap-2 mb-2">
                  <span className="text-sm px-2 py-1 rounded bg-blue-100 text-blue-800">
                    {questions[0].content.level === 'beginner' ? '初級' :
                     questions[0].content.level === 'intermediate' ? '中級' : '上級'}
                  </span>
                </div>
                <h2 className="text-xl font-bold mb-4">{questions[0].content.title}</h2>
                <div className="prose max-w-none mb-6">
                  <p className="whitespace-pre-wrap">{questions[0].content.content}</p>
                </div>
                <div className="space-y-8">
                  {questions[0]?.content?.questions?.map((subQuestion, index) => (
                    <div key={subQuestion.id} className="space-y-4">
                      <h3 className="text-lg font-semibold">
                        問題 {index + 1}. {subQuestion.question}
                      </h3>
                      <RadioGroup
                        value={selectedAnswers[index]?.toString() || ''}
                        onValueChange={(value) => {
                          const newAnswers = [...selectedAnswers];
                          newAnswers[index] = parseInt(value);
                          setSelectedAnswers(newAnswers);
                        }}
                        className="space-y-2"
                      >
                        {subQuestion.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center space-x-2">
                            <RadioGroupItem
                              value={optionIndex.toString()}
                              id={`q${index}-option${optionIndex}`}
                            />
                            <Label htmlFor={`q${index}-option${optionIndex}`}>
                              {option}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                      {answerResults[index] && (
                        <div className={`p-4 rounded-lg ${
                          answerResults[index].isCorrect
                            ? 'bg-green-50 border border-green-200'
                            : 'bg-red-50 border border-red-200'
                        }`}>
                          <p className={`font-bold ${
                            answerResults[index].isCorrect ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {answerResults[index].isCorrect ? '正解！' : '不正解'}
                          </p>
                          <p className="mt-2">
                            <span className="font-semibold">解説：</span>
                            {answerResults[index].explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <Button
                  onClick={handleNextQuestion}
                  variant="outline"
                  disabled={answerResults.length === 0}
                >
                  {currentQuestionNumber >= totalQuestions ? '結果を見る' : '次の問題へ'}
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={submitting || selectedAnswers.includes(-1) || answerResults.length > 0}
                >
                  {submitting ? '送信中...' : '回答を送信'}
                </Button>
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
