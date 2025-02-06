"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CreateChapterModal } from '@/components/ui/CreateChapterModal';
import { EditChapterModal } from '@/components/ui/EditChapterModal';
import { CertificationChapter, CertificationQuestion } from '@/types/api';
import { processGoogleDriveImages, ChapterContent } from '@/lib/image-processor';

type Chapter = Omit<CertificationChapter, 'createdAt' | 'updatedAt' | 'thumbnailUrl' | 'status' | 'description'> & {
  certificationId: string;
  content: string;
  webText: string;
  questions: CertificationQuestion[];
};

export default function ChaptersPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [googleDriveFolderId, setGoogleDriveFolderId] = useState('');
  const [generatedChapters, setGeneratedChapters] = useState<ChapterContent[]>([]);
  const [selectedChapterIndex, setSelectedChapterIndex] = useState<number>(0);
  const certificationId = params.id;

  useEffect(() => {
    fetchChapters();
  }, [certificationId]);

  const fetchChapters = async () => {
    try {
      console.log('Fetching chapters for certification:', certificationId);
      setIsLoading(true);
      const response = await fetch(`/api/certifications/${certificationId}/chapters`);
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to fetch chapters:', errorData);
        throw new Error(`Failed to fetch chapters: ${JSON.stringify(errorData)}`);
      }
      const data = await response.json();
      console.log('Fetched chapters:', data);
      if (!Array.isArray(data)) {
        console.error('Unexpected response format:', data);
        throw new Error('Unexpected response format');
      }
      setChapters(data);
    } catch (error) {
      console.error('Error fetching chapters:', error);
      setChapters([]);
    } finally {
      setIsLoading(false);
    }
  };

  const convertToChapterQuestion = (question: ChapterContent['questions'][0]): CertificationQuestion => {
    return {
      id: `q-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      question: question.question,
      type: 'text',
      choices: question.options.map((text, index) => ({
        id: `c-${index}`,
        text
      })),
      correctAnswer: question.correctAnswers[0],
      explanation: question.explanation
    };
  };

  const handleCreateChapter = async (data: { 
    title: string; 
    content: string; 
    order: number; 
    videoUrl: string;
    duration: string;
    webText: string; 
    questions: CertificationQuestion[] 
  }) => {
    try {
      console.log('Creating chapter with data:', data);

      const response = await fetch(`/api/certifications/${certificationId}/chapters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          certificationId,
          status: 'draft',
          thumbnailUrl: '',
          duration: data.duration || '',
          description: data.content,
          questions: data.questions
        }),
      });

      const responseData = await response.json();
      console.log('Create chapter response:', responseData);

      if (!response.ok) {
        console.error('Failed to create chapter:', responseData);
        throw new Error(`Failed to create chapter: ${JSON.stringify(responseData)}`);
      }
      
      setIsCreateModalOpen(false);
      console.log('Refreshing chapters list after creation');
      await fetchChapters();
    } catch (error) {
      console.error('Error creating chapter:', error);
    }
  };

  const handleEditChapter = async (data: Chapter) => {
    try {
      const response = await fetch(`/api/certifications/${certificationId}/chapters/${data.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          certificationId,
          status: 'draft',
          thumbnailUrl: '',
          duration: '',
          description: data.content,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(`Failed to update chapter: ${JSON.stringify(errorData)}`);
      }
      
      setIsEditModalOpen(false);
      setSelectedChapter(null);
      fetchChapters();
    } catch (error) {
      console.error('Error updating chapter:', error);
    }
  };

  const handleDeleteChapter = async (chapterId: string) => {
    if (!confirm('このチャプターを削除してもよろしいですか？')) return;

    try {
      const response = await fetch(`/api/certifications/${certificationId}/chapters?chapterId=${chapterId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete chapter');
      
      fetchChapters();
    } catch (error) {
      console.error('Error deleting chapter:', error);
    }
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
        setSelectedChapterIndex(0);
      }
    } catch (error) {
      console.error('Error processing Google Drive images:', error);
      alert('画像の処理中にエラーが発生しました');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveAll = async () => {
    try {
      for (const [index, chapter] of generatedChapters.entries()) {
        await handleCreateChapter({
          title: chapter.title,
          content: chapter.content,
          order: chapters.length + index + 1,
          videoUrl: '',
          duration: '',
          webText: chapter.webText,
          questions: chapter.questions.map(convertToChapterQuestion)
        });
      }
      setGeneratedChapters([]);
      setSelectedChapterIndex(0);
    } catch (error) {
      console.error('Error saving all chapters:', error);
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
          <h1 className="text-2xl font-bold">チャプター管理</h1>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          新規チャプター作成
        </Button>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-8">
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

      {generatedChapters.length > 0 && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">生成されたチャプター</h3>
            <Button onClick={handleSaveAll}>すべて保存</Button>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {generatedChapters.map((chapter, index) => (
              <Button
                key={index}
                onClick={() => setSelectedChapterIndex(index)}
                variant={selectedChapterIndex === index ? "default" : "outline"}
              >
                {chapter.title || `チャプター${index + 1}`}
              </Button>
            ))}
          </div>
          {generatedChapters[selectedChapterIndex] && (
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-medium mb-2">{generatedChapters[selectedChapterIndex].title}</h4>
              <p className="text-gray-600 mb-4">{generatedChapters[selectedChapterIndex].content}</p>
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: generatedChapters[selectedChapterIndex].webText }} />
            </div>
          )}
        </div>
      )}

      {chapters.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">チャプターがありません</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {chapters.sort((a, b) => a.order - b.order).map((chapter) => (
            <div
              key={chapter.id}
              className="p-4 border rounded-lg bg-gray-50 shadow-sm hover:bg-white transition-colors duration-200"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{chapter.title}</h2>
                  <p className="text-gray-700 mt-1">{chapter.content}</p>
                  <p className="text-sm text-gray-600 mt-2">
                    表示順序: {chapter.order}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      setSelectedChapter(chapter);
                      setIsEditModalOpen(true);
                    }}
                    variant="outline"
                  >
                    編集
                  </Button>
                  <Button
                    onClick={() => handleDeleteChapter(chapter.id)}
                    variant="destructive"
                  >
                    削除
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <CreateChapterModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateChapter}
        currentMaxOrder={Math.max(0, ...chapters.map(c => c.order))}
      />

      {selectedChapter && (
        <EditChapterModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedChapter(null);
          }}
          onSave={handleEditChapter}
          chapter={selectedChapter}
        />
      )}
    </div>
  );
}
