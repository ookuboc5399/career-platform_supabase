'use client';

import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent } from '@/components/ui/dialog';
import Image from 'next/image';
import { useGoogleDrive } from '@/hooks/useGoogleDrive';

interface Question {
  id: string;
  title: string;
  type: 'grammar' | 'vocabulary' | 'writing';
  imageUrl?: string;
  content: string;
  createdAt: string;
}

interface PickerResponse {
  action: string;
  docs: Array<{
    id: string;
    name: string;
  }>;
}

export default function QuestionManager() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedType, setSelectedType] = useState<'grammar' | 'vocabulary' | 'writing'>('grammar');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const { openPicker } = useGoogleDrive();

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch('/api/admin/english/questions');
      if (!response.ok) throw new Error('Failed to fetch questions');
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleOpenPicker = () => {
    openPicker({
      viewId: "DOCS_IMAGES",
      showUploadView: true,
      showUploadFolders: true,
      supportDrives: true,
      multiselect: false,
      callbackFunction: async (data: PickerResponse) => {
        if (data.action === 'picked') {
          const file = data.docs[0];
          await generateQuestion(file.id);
        }
      },
    });
  };

  const generateQuestion = async (fileId: string) => {
    setIsGenerating(true);
    setIsModalOpen(true);
    try {
      const response = await fetch('/api/admin/english/questions/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileId,
          type: selectedType,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate question');
      }

      const newQuestion = await response.json();
      setQuestions([newQuestion, ...questions]);
      setImagePreview(newQuestion.imageUrl);
      setGeneratedContent(newQuestion.content);
    } catch (error) {
      console.error('Error generating question:', error);
    } finally {
      setIsGenerating(false);
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
        <h2 className="text-xl font-bold mb-4">問題生成</h2>
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

          <Button
            onClick={handleOpenPicker}
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? '生成中...' : 'Google Driveから画像を選択'}
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">問題一覧</h2>
        <div className="space-y-4">
          {questions.map((question) => (
            <Card key={question.id} className="p-4">
              <div className="flex gap-4">
                {question.imageUrl && (
                  <div className="w-32 h-32 relative">
                    <img
                      src={question.imageUrl}
                      alt="Question"
                      className="object-cover rounded-lg"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm px-2 py-1 rounded bg-blue-100 text-blue-800">
                      {getTypeText(question.type)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(question.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="whitespace-pre-wrap">{question.content}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white p-8">
          <h2 className="text-3xl font-bold mb-8">生成された問題</h2>
          <div className="space-y-8">
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
                <p className="whitespace-pre-wrap">{generatedContent}</p>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                onClick={() => setIsModalOpen(false)}
                variant="outline"
              >
                閉じる
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
