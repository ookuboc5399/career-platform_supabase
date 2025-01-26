'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import { Button } from '@/components/ui/button';
import { CreateQuestionModal } from '@/components/ui/CreateQuestionModal';
import { EditQuestionModal } from '@/components/ui/EditQuestionModal';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswers: number[];
  explanation: string;
  explanationImages: string[];
  explanationTable?: {
    headers: string[];
    rows: string[][];
  };
  year: string;
  category: string;
}

export default function QuestionsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { id: certificationId } = use(params);

  useEffect(() => {
    fetchQuestions();
  }, [certificationId]);

  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/certifications/${certificationId}/questions`);
      if (!response.ok) {
        throw new Error('Failed to fetch questions');
      }
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setQuestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateQuestion = async (data: Omit<Question, 'id'>) => {
    try {
      const response = await fetch(`/api/certifications/${certificationId}/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to create question');
      
      setIsCreateModalOpen(false);
      fetchQuestions();
    } catch (error) {
      console.error('Error creating question:', error);
    }
  };

  const handleEditQuestion = async (data: Question) => {
    try {
      const response = await fetch(`/api/certifications/${certificationId}/questions/${data.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to update question');
      
      setIsEditModalOpen(false);
      setSelectedQuestion(null);
      fetchQuestions();
    } catch (error) {
      console.error('Error updating question:', error);
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!confirm('この問題を削除してもよろしいですか？')) return;

    try {
      const response = await fetch(`/api/certifications/${certificationId}/questions/${questionId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete question');
      
      fetchQuestions();
    } catch (error) {
      console.error('Error deleting question:', error);
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

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => router.push('/admin/certifications')}
            variant="outline"
            className="mb-4"
          >
            ← 戻る
          </Button>
          <h1 className="text-2xl font-bold">総合問題管理</h1>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          新規問題作成
        </Button>
      </div>

      {questions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">問題がありません</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {questions.map((question, index) => (
            <div
              key={question.id}
              className="p-6 border rounded-lg bg-white shadow-sm hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-semibold text-gray-900">問題 {index + 1}</h2>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {question.year}
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      {question.category}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      setSelectedQuestion(question);
                      setIsEditModalOpen(true);
                    }}
                    variant="outline"
                    size="sm"
                  >
                    編集
                  </Button>
                  <Button
                    onClick={() => handleDeleteQuestion(question.id)}
                    variant="destructive"
                    size="sm"
                  >
                    削除
                  </Button>
                </div>
              </div>
              <div className="prose max-w-none">
                <div className="text-gray-700 whitespace-pre-wrap mb-4" dangerouslySetInnerHTML={{ __html: question.question }} />
                <div className="pl-4">
                  {question.options.map((option, optIndex) => (
                    <div
                      key={optIndex}
                      className={`flex items-center gap-2 py-1 ${
                        question.correctAnswers.includes(optIndex)
                          ? 'text-green-700 font-medium'
                          : 'text-gray-600'
                      }`}
                    >
                      <span className="w-6 h-6 flex items-center justify-center rounded-full border border-current text-sm">
                        {optIndex + 1}
                      </span>
                      <span>{option}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <CreateQuestionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateQuestion}
      />

      {selectedQuestion && (
        <EditQuestionModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedQuestion(null);
          }}
          onSave={handleEditQuestion}
          question={selectedQuestion}
        />
      )}
    </div>
  );
}
