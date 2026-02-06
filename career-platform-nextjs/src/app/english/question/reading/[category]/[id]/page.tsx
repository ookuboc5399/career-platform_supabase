'use client';

import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ReadingQuestion } from '@/types/english';

export default function ReadingQuestionPage({ params }: { params: { category: string; id: string } }) {
  const [question, setQuestion] = useState<ReadingQuestion | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [answerResults, setAnswerResults] = useState<{
    isCorrect: boolean;
    correctAnswer: string;
    yourAnswer: string;
    explanation: string;
  }[]>([]);

  useEffect(() => {
    fetchQuestion();
  }, [params.id]);

  const fetchQuestion = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/english/questions/reading/${params.id}`
      );
      if (!response.ok) throw new Error('Failed to fetch question');
      const data = await response.json();
      setQuestion(data);
      setSelectedAnswers(new Array(data.questions.length).fill(-1));
    } catch (error) {
      console.error('Error fetching question:', error);
    }
  };

  const handleSubmit = async () => {
    if (!question) return;

    setSubmitting(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/english/questions/reading/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questionId: question.id,
          answers: selectedAnswers
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit answer');
      }

      const results = await response.json();
      setAnswerResults(results);
    } catch (error) {
      console.error('Error submitting answer:', error);
      alert('回答の送信に失敗しました。');
    } finally {
      setSubmitting(false);
    }
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

  if (!question) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">{getCategoryTitle(params.category)}</h1>
        <Button
          onClick={() => window.location.href = `/english/question/reading/${params.category}`}
          variant="outline"
        >
          問題一覧に戻る
        </Button>
      </div>

      <Card className="p-6">
        <div className="mb-4">
          <div className="flex gap-2 mb-2">
            <span className="text-sm px-2 py-1 rounded bg-blue-100 text-blue-800">
              {question.level === 'beginner' ? '初級' :
               question.level === 'intermediate' ? '中級' : '上級'}
            </span>
          </div>
          <h2 className="text-xl font-bold mb-4">{question.title}</h2>
          <div className="prose max-w-none mb-6">
            <p className="whitespace-pre-wrap">{question.content}</p>
          </div>
          <div className="space-y-8">
            {question.questions.map((subQuestion, index) => (
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
            onClick={handleSubmit}
            disabled={submitting || selectedAnswers.includes(-1) || answerResults.length > 0}
          >
            {submitting ? '送信中...' : '回答を送信'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
