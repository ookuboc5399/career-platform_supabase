'use client';

import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from '@/components/ui/dialog';
import { Textarea } from "@/components/ui/textarea";
import Image from 'next/image';
import { Question } from '@/types/english';
import { processGoogleDriveImages } from '@/lib/image-processor';
import ChatQuestionGenerator from './ChatQuestionGenerator';

const defaultFolderId = process.env.NEXT_PUBLIC_GOOGLE_DRIVE_FOLDER_ID;

export default function QuestionManager() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedType, setSelectedType] = useState<'grammar' | 'vocabulary' | 'writing'>('grammar');
  const [searchType, setSearchType] = useState<'all' | 'grammar' | 'vocabulary' | 'writing'>('all');
  const [searchText, setSearchText] = useState('');
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [googleDriveFolderId, setGoogleDriveFolderId] = useState(defaultFolderId || '');
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number>(0);

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
      filtered = filtered.filter(q => 
        q.content.question.toLowerCase().includes(searchLower) ||
        q.content.explanation.toLowerCase().includes(searchLower)
      );
    }

    setFilteredQuestions(filtered);
  };

  const fetchQuestions = async () => {
    try {
      const response = await fetch('/api/admin/english/questions');
      if (!response.ok) throw new Error('Failed to fetch questions');
      const data = await response.json();
      setQuestions(data);
      setFilteredQuestions(data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleGoogleDriveProcess = async () => {
    if (!googleDriveFolderId) {
      alert('Google DriveフォルダIDを入力してください');
      return;
    }

    setIsGenerating(true);
    setIsGenerateModalOpen(true);
    try {
      const chapters = await processGoogleDriveImages(googleDriveFolderId);
      console.log('Generated chapters:', chapters);

      const newQuestions: Question[] = chapters.map((chapter, index) => ({
        id: `question-${Date.now()}-${index}`,
        type: selectedType,
        imageUrl: chapter.questions[0]?.explanationImages?.[0] || '',
        content: {
          question: chapter.title,
          options: chapter.questions[0]?.options || [],
          correctAnswers: chapter.questions[0]?.correctAnswers || [],
          explanation: chapter.questions[0]?.explanation || '',
        },
        createdAt: new Date().toISOString(),
      }));

      setGeneratedQuestions(newQuestions);
      
      if (newQuestions.length > 0) {
        const firstQuestion = newQuestions[0];
        setImagePreview(firstQuestion.imageUrl || null);
        setGeneratedContent(JSON.stringify(firstQuestion.content, null, 2));
        setSelectedQuestionIndex(0);
      }
    } catch (error) {
      console.error('Error processing Google Drive images:', error);
      alert('画像の処理中にエラーが発生しました');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleQuestionSelect = (index: number) => {
    const question = generatedQuestions[index];
        setImagePreview(question.imageUrl || null);
    setGeneratedContent(JSON.stringify(question.content, null, 2));
    setSelectedQuestionIndex(index);
  };

  const handleSaveAll = async () => {
    try {
      for (const question of generatedQuestions) {
        const response = await fetch('/api/admin/english/questions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(question),
        });

        if (!response.ok) {
          throw new Error('Failed to save question');
        }
      }

      setIsGenerateModalOpen(false);
      fetchQuestions();
    } catch (error) {
      console.error('Error saving questions:', error);
      alert('問題の保存中にエラーが発生しました');
    }
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setIsEditModalOpen(true);
  };

  const handleUpdateQuestion = async () => {
    if (!editingQuestion) return;

    try {
      const response = await fetch(`/api/admin/english/questions/${editingQuestion.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingQuestion),
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

  const handleDeleteQuestion = async (questionId: string) => {
    if (!confirm('この問題を削除してもよろしいですか？')) return;

    try {
      const response = await fetch(`/api/admin/english/questions/${questionId}`, {
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
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Google Driveから問題を生成</h2>
        <div className="space-y-4">
          <div>
            <Label>問題タイプ</Label>
            <Select
              value={selectedType}
              onValueChange={(value: string) => setSelectedType(value as 'grammar' | 'vocabulary' | 'writing')}
            >
              <SelectTrigger>
                <SelectValue placeholder="タイプを選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grammar">文法</SelectItem>
                <SelectItem value="vocabulary">単語</SelectItem>
                <SelectItem value="writing">英作文</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Google DriveフォルダID</Label>
            <div className="flex gap-4">
              <input
                type="text"
                value={googleDriveFolderId}
                onChange={(e) => setGoogleDriveFolderId(e.target.value)}
                placeholder="Google DriveフォルダID"
                className="flex-1 p-2 border rounded-lg"
              />
              <Button
                onClick={handleGoogleDriveProcess}
                disabled={isGenerating}
                className="min-w-[120px]"
              >
                {isGenerating ? '生成中...' : '生成'}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <ChatQuestionGenerator />

      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">問題一覧</h2>
        <div className="space-y-4">
          <div className="flex gap-4 mb-4">
            <div className="w-1/3">
              <Label>タイプで絞り込み</Label>
              <Select
                value={searchType}
                onValueChange={(value: string) => setSearchType(value as 'all' | 'grammar' | 'vocabulary' | 'writing')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="タイプを選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  <SelectItem value="grammar">文法</SelectItem>
                  <SelectItem value="vocabulary">単語</SelectItem>
                  <SelectItem value="writing">英作文</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Label>問題文で検索</Label>
              <Input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="問題文を入力..."
              />
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
                      <span className="text-sm px-2 py-1 rounded bg-blue-100 text-blue-800">
                        {getTypeText(question.type)}
                      </span>
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
                    <p className="font-medium">{question.content.question}</p>
                    <div className="space-y-2">
                      {question.content.options.map((option, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-md ${
                            question.content.correctAnswers.includes(index + 1)
                              ? 'bg-green-50 border border-green-200'
                              : 'bg-gray-50'
                          }`}
                        >
                          <span className="font-semibold mr-2">{String.fromCharCode(65 + index)}.</span>
                          <span>{option}</span>
                          {question.content.correctAnswers.includes(index + 1) && (
                            <span className="ml-2 text-green-600">✓</span>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="bg-gray-50 rounded-md p-4">
                      <p className="font-medium text-gray-700 mb-2">解説:</p>
                      <p className="text-gray-600">{question.content.explanation}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      <Dialog open={isGenerateModalOpen} onOpenChange={setIsGenerateModalOpen}>
        <DialogContent className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle>生成された問題</DialogTitle>
          </DialogHeader>
          <div className="space-y-8">
            {generatedQuestions.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {generatedQuestions.map((_, index) => (
                  <Button
                    key={index}
                    onClick={() => handleQuestionSelect(index)}
                    variant={selectedQuestionIndex === index ? "default" : "outline"}
                  >
                    問題 {index + 1}
                  </Button>
                ))}
              </div>
            )}

            {imagePreview && (
              <div>
                <h3 className="text-lg font-semibold mb-4">選択された画像</h3>
                <Image
                  src={imagePreview}
                  alt="選択された画像"
                  width={400}
                  height={300}
                  className="rounded-lg"
                />
              </div>
            )}

            <div>
              <h3 className="text-lg font-semibold mb-4">生成された問題</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="whitespace-pre-wrap">{generatedContent}</pre>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                onClick={() => setIsGenerateModalOpen(false)}
                variant="outline"
              >
                キャンセル
              </Button>
              {generatedQuestions.length > 0 && (
                <Button
                  onClick={handleSaveAll}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  すべて保存
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle>問題の編集</DialogTitle>
          </DialogHeader>
          {editingQuestion && (
            <div className="space-y-6">
              <div>
                <Label>問題文</Label>
                <Textarea
                  value={editingQuestion.content.question}
                  onChange={(e) => setEditingQuestion({
                    ...editingQuestion,
                    content: {
                      ...editingQuestion.content,
                      question: e.target.value
                    }
                  })}
                />
              </div>

              <div>
                <Label>選択肢</Label>
                {editingQuestion.content.options.map((option, index) => (
                  <div key={index} className="flex gap-2 mt-2">
                    <Input
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...editingQuestion.content.options];
                        newOptions[index] = e.target.value;
                        setEditingQuestion({
                          ...editingQuestion,
                          content: {
                            ...editingQuestion.content,
                            options: newOptions
                          }
                        });
                      }}
                    />
                    <Select
                      value={editingQuestion.content.correctAnswers.includes(index + 1) ? 'true' : 'false'}
                      onValueChange={(value) => {
                        const newCorrectAnswers = value === 'true'
                          ? [...editingQuestion.content.correctAnswers, index + 1]
                          : editingQuestion.content.correctAnswers.filter(a => a !== index + 1);
                        setEditingQuestion({
                          ...editingQuestion,
                          content: {
                            ...editingQuestion.content,
                            correctAnswers: newCorrectAnswers
                          }
                        });
                      }}
                    >
                      <SelectTrigger className="w-[100px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">正解</SelectItem>
                        <SelectItem value="false">不正解</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>

              <div>
                <Label>解説</Label>
                <Textarea
                  value={editingQuestion.content.explanation}
                  onChange={(e) => setEditingQuestion({
                    ...editingQuestion,
                    content: {
                      ...editingQuestion.content,
                      explanation: e.target.value
                    }
                  })}
                />
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  onClick={() => setIsEditModalOpen(false)}
                  variant="outline"
                >
                  キャンセル
                </Button>
                <Button
                  onClick={handleUpdateQuestion}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  更新
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
