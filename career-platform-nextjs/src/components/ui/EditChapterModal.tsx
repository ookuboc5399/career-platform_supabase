"use client";

import { useState, useEffect } from 'react';
import { Button } from './button';
import { VideoUploader } from './VideoUploader';
import { RichTextEditor } from './RichTextEditor';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './dialog';
import { CertificationChapter, CertificationQuestion } from '@/types/api';

type Chapter = Omit<CertificationChapter, 'createdAt' | 'updatedAt' | 'thumbnailUrl' | 'duration' | 'status' | 'description'> & {
  certificationId: string;
  content: string;
  webText: string;
  questions: CertificationQuestion[];
};

interface EditChapterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Chapter) => void;
  chapter: Chapter;
}

export function EditChapterModal({ isOpen, onClose, onSave, chapter }: EditChapterModalProps) {
  const [title, setTitle] = useState(chapter.title);
  const [content, setContent] = useState(chapter.content);
  const [order, setOrder] = useState(chapter.order);
  const [videoUrl, setVideoUrl] = useState(chapter.videoUrl);
  const [webText, setWebText] = useState(chapter.webText);
  const [questions, setQuestions] = useState(chapter.questions);

  useEffect(() => {
    setTitle(chapter.title);
    setContent(chapter.content);
    setOrder(chapter.order);
    setVideoUrl(chapter.videoUrl);
    setWebText(chapter.webText);
    setQuestions(chapter.questions);
  }, [chapter]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...chapter,
      title,
      content,
      order,
      videoUrl,
      webText,
      questions,
    });
  };

  const handleQuestionChange = (index: number, field: string, value: any) => {
    const newQuestions = [...questions];
    if (field === 'choices') {
      newQuestions[index].choices[value.index] = { id: value.id || Math.random().toString(36).substring(2, 15), text: value.text };
    } else if (field === 'correctAnswer') {
      const answer = parseInt(value);
      if (!isNaN(answer)) {
        newQuestions[index].correctAnswer = answer;
      }
    } else {
      (newQuestions[index] as any)[field] = value;
    }
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    const newQuestion: CertificationQuestion = {
      id: Math.random().toString(36).substring(2, 15),
      question: '',
      choices: Array(5).fill('').map(() => ({ id: Math.random().toString(36).substring(2, 15), text: '' })),
      correctAnswer: 0,
      explanation: '',
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (index: number) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle>チャプターの編集</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              タイトル
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              説明
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              動画
            </label>
            <VideoUploader onUploadComplete={setVideoUrl} />
            {videoUrl && (
              <div className="mt-2 text-sm text-gray-600">
                現在の動画: {videoUrl}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              WEBテキスト
            </label>
            <RichTextEditor
              value={webText}
              onChange={setWebText}
              height="h-64"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              練習問題
            </label>
            <div className="space-y-6">
              {questions.map((question, questionIndex) => (
                <div key={questionIndex} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">問題 {questionIndex + 1}</h3>
                    {questions.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeQuestion(questionIndex)}
                        variant="destructive"
                      >
                        削除
                      </Button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        問題文
                      </label>
                      <RichTextEditor
                        value={question.question}
                        onChange={(value) => handleQuestionChange(questionIndex, 'question', value)}
                        height="h-32"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        選択肢
                      </label>
                      {question.choices.map((choice, choiceIndex) => (
                        <div key={choice.id} className="mb-2">
                          <input
                            type="text"
                            value={choice.text}
                            onChange={(e) => handleQuestionChange(questionIndex, 'choices', { index: choiceIndex, text: e.target.value, id: choice.id })}
                            placeholder={`選択肢 ${choiceIndex + 1}`}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                        </div>
                      ))}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        正解の選択肢番号
                      </label>
                      <input
                        type="number"
                        value={question.correctAnswer}
                        onChange={(e) => handleQuestionChange(questionIndex, 'correctAnswer', e.target.value)}
                        min={0}
                        max={4}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        解説
                      </label>
                      <RichTextEditor
                        value={question.explanation}
                        onChange={(value) => handleQuestionChange(questionIndex, 'explanation', value)}
                        height="h-48"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                onClick={addQuestion}
                variant="outline"
                className="w-full"
              >
                問題を追加
              </Button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              表示順序
            </label>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(parseInt(e.target.value))}
              min={1}
              className="w-32 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
            >
              キャンセル
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
            >
              保存
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
