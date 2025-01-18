"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from './button';
import { VideoUploader } from './VideoUploader';
import { RichTextEditor } from './RichTextEditor';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './dialog';
import { processGoogleDriveImages, ChapterContent } from '@/lib/image-processor';

interface CreateChapterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<ChapterContent, 'id'> & { order: number; videoUrl: string }) => void;
  currentMaxOrder: number;
}

type Question = ChapterContent['questions'][0];

const defaultFolderId = process.env.NEXT_PUBLIC_GOOGLE_DRIVE_FOLDER_ID;

export function CreateChapterModal({ isOpen, onClose, onSave, currentMaxOrder }: CreateChapterModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [order, setOrder] = useState(currentMaxOrder + 1);
  const [videoUrl, setVideoUrl] = useState('');
  const [webText, setWebText] = useState('');
  const [questions, setQuestions] = useState<Question[]>([{
    question: '',
    options: ['', '', '', '', ''],
    correctAnswers: [],
    explanation: '',
    explanationImages: [],
    explanationTable: {
      headers: ['項目', '説明'],
      rows: [['', '']],
    },
  }]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [googleDriveFolderId, setGoogleDriveFolderId] = useState(defaultFolderId || '');
  const [generatedChapters, setGeneratedChapters] = useState<ChapterContent[]>([]);
  const [selectedChapterIndex, setSelectedChapterIndex] = useState<number>(0);

  const resetForm = useCallback(() => {
    setTitle('');
    setContent('');
    setOrder(currentMaxOrder + 1);
    setVideoUrl('');
    setWebText('');
    setQuestions([{
      question: '',
      options: ['', '', '', '', ''],
      correctAnswers: [],
      explanation: '',
      explanationImages: [],
      explanationTable: {
        headers: ['項目', '説明'],
        rows: [['', '']],
      },
    }]);
    setGeneratedChapters([]);
    setSelectedChapterIndex(0);
  }, [currentMaxOrder]);

  // モーダルが開かれたときに初期値を設定
  useEffect(() => {
    if (isOpen) {
      setOrder(currentMaxOrder + 1);
      setGoogleDriveFolderId(defaultFolderId || '');
    } else {
      resetForm();
    }
  }, [isOpen, currentMaxOrder, resetForm]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      content,
      order,
      videoUrl,
      webText,
      questions,
    });
    onClose();
    resetForm();
  };

  const handleGoogleDriveProcess = async () => {
    if (!googleDriveFolderId) {
      alert('Google DriveフォルダIDを入力してください');
      return;
    }

    setIsProcessing(true);
    try {
      const chapters = await processGoogleDriveImages(googleDriveFolderId);
      console.log('Generated chapters:', chapters);
      setGeneratedChapters(chapters);
      
      if (chapters.length > 0) {
        const firstChapter = chapters[0];
        setTitle(firstChapter.title);
        setContent(firstChapter.content);
        setWebText(firstChapter.webText);
        setQuestions(firstChapter.questions);
        setSelectedChapterIndex(0);
      }
    } catch (error) {
      console.error('Error processing Google Drive images:', error);
      alert('画像の処理中にエラーが発生しました');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleChapterSelect = (index: number) => {
    const chapter = generatedChapters[index];
    setTitle(chapter.title);
    setContent(chapter.content);
    setWebText(chapter.webText);
    setQuestions(chapter.questions);
    setSelectedChapterIndex(index);
  };

  const handleSaveAll = () => {
    generatedChapters.forEach((chapter, index) => {
      onSave({
        title: chapter.title,
        content: chapter.content,
        order: currentMaxOrder + index + 1,
        videoUrl: '',
        webText: chapter.webText,
        questions: chapter.questions,
      });
    });
    onClose();
    resetForm();
  };

  const handleQuestionChange = (index: number, field: string, value: any) => {
    const newQuestions = [...questions];
    if (field === 'options') {
      newQuestions[index].options[value.index] = value.text;
    } else if (field === 'correctAnswers') {
      const answers = value.split(',').map((num: string) => parseInt(num.trim())).filter((num: number) => !isNaN(num));
      newQuestions[index].correctAnswers = answers;
    } else if (field === 'explanation') {
      newQuestions[index].explanation = value;
    } else if (field === 'explanationTable') {
      newQuestions[index].explanationTable = value;
    } else {
      (newQuestions[index] as any)[field] = value;
    }
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, {
      question: '',
      options: ['', '', '', '', ''],
      correctAnswers: [],
      explanation: '',
      explanationImages: [],
      explanationTable: {
        headers: ['項目', '説明'],
        rows: [['', '']],
      },
    }]);
  };

  const removeQuestion = (index: number) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const addTableRow = (questionIndex: number) => {
    const newQuestions = [...questions];
    if (newQuestions[questionIndex].explanationTable) {
      newQuestions[questionIndex].explanationTable!.rows.push(['', '']);
      setQuestions(newQuestions);
    }
  };

  const removeTableRow = (questionIndex: number, rowIndex: number) => {
    const newQuestions = [...questions];
    if (newQuestions[questionIndex].explanationTable) {
      newQuestions[questionIndex].explanationTable!.rows.splice(rowIndex, 1);
      setQuestions(newQuestions);
    }
  };

  const handleTableChange = (questionIndex: number, rowIndex: number, colIndex: number, value: string) => {
    const newQuestions = [...questions];
    if (newQuestions[questionIndex].explanationTable) {
      newQuestions[questionIndex].explanationTable!.rows[rowIndex][colIndex] = value;
      setQuestions(newQuestions);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle>新規チャプター作成</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Google Drive画像からコンテンツを生成</h3>
            <div className="flex gap-4">
              <input
                type="text"
                value={googleDriveFolderId}
                onChange={(e) => setGoogleDriveFolderId(e.target.value)}
                placeholder="Google DriveフォルダID"
                className="flex-1 p-2 border rounded-lg"
              />
              <Button
                type="button"
                onClick={handleGoogleDriveProcess}
                disabled={isProcessing}
                className="min-w-[120px]"
              >
                {isProcessing ? '処理中...' : '生成'}
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Google DriveフォルダIDを入力して、フォルダ内の画像からコンテンツを自動生成します。
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              タイトル
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例: 第1章: 基礎知識"
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
              placeholder="チャプターの説明を入力してください"
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
                アップロード完了: {videoUrl}
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
              placeholder="WEBテキストの内容を入力してください"
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
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="mb-2">
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => handleQuestionChange(questionIndex, 'options', { index: optionIndex, text: e.target.value })}
                            placeholder={`選択肢 ${optionIndex + 1}`}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                        </div>
                      ))}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        正解の選択肢番号（カンマ区切りで複数選択可）
                      </label>
                      <input
                        type="text"
                        value={question.correctAnswers.join(', ')}
                        onChange={(e) => handleQuestionChange(questionIndex, 'correctAnswers', e.target.value)}
                        placeholder="例: 1, 3"
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

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        解説用テーブル
                      </label>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead>
                            <tr>
                              {question.explanationTable?.headers.map((header, index) => (
                                <th key={index} className="px-4 py-2 bg-gray-50">
                                  <input
                                    type="text"
                                    value={header}
                                    onChange={(e) => {
                                      const newQuestions = [...questions];
                                      newQuestions[questionIndex].explanationTable!.headers[index] = e.target.value;
                                      setQuestions(newQuestions);
                                    }}
                                    className="w-full p-1 border rounded"
                                  />
                                </th>
                              ))}
                              <th className="w-20 px-4 py-2 bg-gray-50">操作</th>
                            </tr>
                          </thead>
                          <tbody>
                            {question.explanationTable?.rows.map((row, rowIndex) => (
                              <tr key={rowIndex}>
                                {row.map((cell, colIndex) => (
                                  <td key={colIndex} className="px-4 py-2">
                                    <input
                                      type="text"
                                      value={cell}
                                      onChange={(e) => handleTableChange(questionIndex, rowIndex, colIndex, e.target.value)}
                                      className="w-full p-1 border rounded"
                                    />
                                  </td>
                                ))}
                                <td className="px-4 py-2">
                                  <Button
                                    type="button"
                                    onClick={() => removeTableRow(questionIndex, rowIndex)}
                                    variant="destructive"
                                    className="w-full"
                                  >
                                    削除
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <Button
                        type="button"
                        onClick={() => addTableRow(questionIndex)}
                        variant="outline"
                        className="mt-2"
                      >
                        行を追加
                      </Button>
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

          {generatedChapters.length > 0 && (
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-medium">生成されたチャプター</h3>
              <div className="flex flex-wrap gap-2">
                {generatedChapters.map((chapter, index) => (
                  <Button
                    key={index}
                    onClick={() => handleChapterSelect(index)}
                    variant={selectedChapterIndex === index ? "default" : "outline"}
                  >
                    {chapter.title || `チャプター${index + 1}`}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
            >
              キャンセル
            </Button>
            {generatedChapters.length > 0 ? (
              <>
                <Button
                  type="button"
                  onClick={handleSaveAll}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  すべて作成
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  選択中のチャプターを作成
                </Button>
              </>
            ) : (
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700"
              >
                作成
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
