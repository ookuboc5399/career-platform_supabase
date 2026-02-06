'use client';

import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from 'next/image';
import { Question, ReadingQuestion, VocabularyQuestion } from '@/types/english';
import ChatQuestionGenerator from './ChatQuestionGenerator';
import EditQuestionDialog from './EditQuestionDialog';
import CreateReadingQuestionDialog from './CreateReadingQuestionDialog';
import CreateWritingQuestionDialog from './CreateWritingQuestionDialog';
import CreateVocabularyQuestionDialog from './CreateVocabularyQuestionDialog';

export default function QuestionManager() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [searchType, setSearchType] = useState<'all' | 'grammar' | 'vocabulary' | 'writing' | 'reading'>('all');
  const [searchText, setSearchText] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateReadingModalOpen, setIsCreateReadingModalOpen] = useState(false);
  const [isCreateWritingModalOpen, setIsCreateWritingModalOpen] = useState(false);
  const [isCreateVocabularyModalOpen, setIsCreateVocabularyModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    filterQuestions();
  }, [questions, searchType, searchText]);

  const filterQuestions = () => {
    let filtered = [...questions];
    
    // タイプでフィルター
    if (searchType !== 'all') {
      filtered = filtered.filter(q => q.type === searchType);
    }

    // テキストでフィルター
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(q => {
        const matchQuestion = q.content.question.toLowerCase().includes(searchLower);
        const matchExplanation = q.content.explanation?.toLowerCase().includes(searchLower);
        const matchJapanese = Array.isArray(q.content.japanese)
          ? q.content.japanese.some(text => text?.toLowerCase().includes(searchLower))
          : q.content.japanese?.toLowerCase().includes(searchLower);
        const matchEnglish = Array.isArray(q.content.english)
          ? q.content.english.some(text => text?.toLowerCase().includes(searchLower))
          : q.content.english?.toLowerCase().includes(searchLower);
        
        return matchQuestion || matchExplanation || matchJapanese || matchEnglish;
      });
    }

    setFilteredQuestions(filtered);
  };

  const fetchQuestions = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/english/questions`);
      if (!response.ok) throw new Error('Failed to fetch questions');
      const data = await response.json();
      console.log('Fetched questions:', data);
      setQuestions(data);
      setFilteredQuestions(data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setIsEditModalOpen(true);
  };

  const handleUpdateQuestion = async (updatedQuestion: Question) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/english/questions/${updatedQuestion.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...updatedQuestion,
          englishId: updatedQuestion.englishId || `question-${updatedQuestion.id}`
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update question');
      }

      setIsEditModalOpen(false);
      fetchQuestions();
    } catch (error) {
      console.error('Error updating question:', error);
      alert('問題の更新中にエラーが発生しました');
    }
  };

  const handleCreateReadingQuestion = async (newQuestion: ReadingQuestion) => {
    try {
      const questionData: Question = {
        id: '',
        type: 'reading',
        imageUrl: '',
        content: {
          question: newQuestion.title,
          options: [],
          correctAnswers: [],
          explanation: '',
          format: 'reading',
          ...newQuestion
        },
        difficulty: newQuestion.level,
        createdAt: new Date().toISOString()
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/english/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(questionData),
      });

      if (!response.ok) {
        throw new Error('Failed to create question');
      }

      setIsCreateReadingModalOpen(false);
      fetchQuestions();
    } catch (error) {
      console.error('Error creating question:', error);
      alert('問題の作成中にエラーが発生しました');
    }
  };

  const handleCreateWritingQuestion = async (newQuestion: Question) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/english/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newQuestion),
      });

      if (!response.ok) {
        throw new Error('Failed to create question');
      }

      setIsCreateWritingModalOpen(false);
      fetchQuestions();
    } catch (error) {
      console.error('Error creating question:', error);
      alert('問題の作成中にエラーが発生しました');
    }
  };

  const handleCreateVocabularyQuestion = async (newQuestion: VocabularyQuestion) => {
    try {
      const questionData: Question = {
        id: '',
        type: 'vocabulary',
        imageUrl: '',
        content: {
          question: newQuestion.word,
          options: [],
          correctAnswers: [],
          explanation: newQuestion.meaning,
          format: 'vocabulary',
          word: newQuestion.word,
          meaning: newQuestion.meaning,
          pronunciation: newQuestion.pronunciation,
          partOfSpeech: newQuestion.partOfSpeech,
          examples: newQuestion.examples,
          synonyms: newQuestion.synonyms,
          antonyms: newQuestion.antonyms
        },
        difficulty: newQuestion.level,
        createdAt: new Date().toISOString()
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/english/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(questionData),
      });

      if (!response.ok) {
        throw new Error('Failed to create question');
      }

      setIsCreateVocabularyModalOpen(false);
      fetchQuestions();
    } catch (error) {
      console.error('Error creating question:', error);
      alert('問題の作成中にエラーが発生しました');
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!confirm('この問題を削除してもよろしいですか？')) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/english/questions/${questionId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete question');
      }

      fetchQuestions();
    } catch (error) {
      console.error('Error deleting question:', error);
      alert('問題の削除中にエラーが発生しました');
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'grammar':
        return '文法';
      case 'vocabulary':
        return '単語';
      case 'writing':
        return '英作文';
      case 'reading':
        return '長文読解';
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6">
      <ChatQuestionGenerator />

      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">問題一覧</h2>
          <div className="flex gap-2">
            <Button
              onClick={() => setIsCreateReadingModalOpen(true)}
              className="bg-yellow-600 hover:bg-yellow-700"
            >
              長文読解問題作成
            </Button>
            <Button
              onClick={() => setIsCreateWritingModalOpen(true)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              英作文問題作成
            </Button>
            <Button
              onClick={() => setIsCreateVocabularyModalOpen(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              単語問題作成
            </Button>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex gap-4 mb-4">
            <div className="w-1/3">
              <Label>タイプで絞り込み</Label>
              <Select
                value={searchType}
                onValueChange={(value: string) => setSearchType(value as 'all' | 'grammar' | 'vocabulary' | 'writing' | 'reading')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="タイプを選択" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="all">すべて</SelectItem>
                  <SelectItem value="grammar">文法</SelectItem>
                  <SelectItem value="vocabulary">単語</SelectItem>
                  <SelectItem value="writing">英作文</SelectItem>
                  <SelectItem value="reading">長文読解</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Label>問題文で検索</Label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="問題文を入力..."
                />
                <Button
                  onClick={filterQuestions}
                  className="whitespace-nowrap"
                >
                  検索
                </Button>
              </div>
            </div>
          </div>

          {filteredQuestions.map((question) => (
            <Card key={question.id} className="p-4">
              <div className="flex gap-4">
                {question.imageUrl && (
                  <div className="w-32 h-32 relative">
                    <Image
                      src={question.imageUrl}
                      alt="Question"
                      width={128}
                      height={128}
                      className="object-cover rounded-lg"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex gap-2 items-center">
                      <div className="flex gap-2">
                        <span className="text-sm px-2 py-1 rounded bg-blue-100 text-blue-800">
                          {getTypeText(question.type)}
                        </span>
                        {question.difficulty && (
                          <span className={`text-sm px-2 py-1 rounded ${
                            question.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                            question.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {question.difficulty === 'beginner' ? '初級' :
                             question.difficulty === 'intermediate' ? '中級' : '上級'}
                          </span>
                        )}
                        {question.type === 'writing' && question.category && (
                          <span className="text-sm px-2 py-1 rounded bg-purple-100 text-purple-800">
                            {question.category === 'book' ? '書籍' :
                             question.category === 'school' ? '学校問題' :
                             question.category === 'ai' ? 'AI問題' : 'レビュー'}
                          </span>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditQuestion(question)}
                      >
                        編集
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteQuestion(question.id)}
                      >
                        削除
                      </Button>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(question.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="space-y-4">
                    {question.content.format === 'translation' ? (
                      <>
                        <div className="space-y-2">
                          <p className="font-medium">日本語:</p>
                          {Array.isArray(question.content.japanese) ? (
                            question.content.japanese.map((text, index) => (
                              <div key={index} className="flex items-start gap-2">
                                <span className="text-sm text-gray-500 mt-1">({index + 1})</span>
                                <p className="p-3 bg-gray-50 rounded-md flex-1 whitespace-pre-wrap">{text}</p>
                              </div>
                            ))
                          ) : (
                            <p className="p-3 bg-gray-50 rounded-md whitespace-pre-wrap">
                              {question.content.japanese || question.content.question}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <p className="font-medium">英語:</p>
                          {Array.isArray(question.content.english) ? (
                            question.content.english.map((text, index) => (
                              <div key={index} className="flex items-start gap-2">
                                <span className="text-sm text-gray-500 mt-1">({index + 1})</span>
                                <p className="p-3 bg-green-50 border border-green-200 rounded-md flex-1 whitespace-pre-wrap">{text}</p>
                              </div>
                            ))
                          ) : (
                            <p className="p-3 bg-green-50 border border-green-200 rounded-md whitespace-pre-wrap">
                              {question.content.english}
                            </p>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="font-medium">{question.content.question}</p>
                        <div className="space-y-2">
                          {question.content.options?.map((option, index) => (
                            <div
                              key={index}
                              className={`p-3 rounded-md ${
                                question.content.correctAnswers?.includes(index + 1)
                                  ? 'bg-green-50 border border-green-200'
                                  : 'bg-gray-50'
                              }`}
                            >
                              <span className="font-semibold mr-2">{String.fromCharCode(65 + index)}.</span>
                              <span>{option}</span>
                              {question.content.correctAnswers?.includes(index + 1) && (
                                <span className="ml-2 text-green-600">✓</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                    {question.content.explanation && (
                      <div className="bg-gray-50 rounded-md p-4">
                        <p className="font-medium text-gray-700 mb-2">解説:</p>
                        <p className="text-gray-600">{question.content.explanation}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      <EditQuestionDialog
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        question={editingQuestion}
        onUpdate={handleUpdateQuestion}
      />

      <CreateReadingQuestionDialog
        open={isCreateReadingModalOpen}
        onOpenChange={setIsCreateReadingModalOpen}
        onCreate={handleCreateReadingQuestion}
      />

      <CreateWritingQuestionDialog
        open={isCreateWritingModalOpen}
        onOpenChange={setIsCreateWritingModalOpen}
        onCreate={handleCreateWritingQuestion}
      />

      <CreateVocabularyQuestionDialog
        open={isCreateVocabularyModalOpen}
        onOpenChange={setIsCreateVocabularyModalOpen}
        onCreate={handleCreateVocabularyQuestion}
      />
    </div>
  );
}
