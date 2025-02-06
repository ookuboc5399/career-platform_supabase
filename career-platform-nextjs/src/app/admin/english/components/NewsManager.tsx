'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { VideoUploader } from "@/components/ui/VideoUploader";
import  ImageUploader from "@/components/ui/ImageUploader";
import { NewsContent } from '@/types/english';
import axios from 'axios';

interface GenerationProgress {
  step: number;
  total: number;
  message: string;
  result?: NewsContent;
}

export default function NewsManager() {
  const [news, setNews] = useState<(NewsContent & {
    publishedAt?: string;
    conversation?: string;
    audioUrl?: string;
  })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState<GenerationProgress | null>(null);
  const [selectedNews, setSelectedNews] = useState<NewsContent & {
    publishedAt?: string;
    conversation?: string;
    audioUrl?: string;
  } | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fetchNews = async () => {
    try {
      setError(null);
      console.log('1. Starting news fetch...');
      const response = await axios.get('/api/english/news');
      console.log('2. News response:', response);
      if (response.status !== 200) throw new Error('Failed to fetch news');
      setNews(response.data);
    } catch (error) {
      console.error('Error fetching news:', error);
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const axiosError = error;
      console.error('Axios error details:', {
        message: axiosError.message,
        status: axiosError.response?.status,
        data: axiosError.response?.data,
        config: {
          url: axiosError.config?.url,
          method: axiosError.config?.method,
          baseURL: axiosError.config?.baseURL,
          headers: axiosError.config?.headers,
        }
      });
      setError(`API Error: ${axiosError.message}`);
    } else if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      setError(`Error: ${error.message}`);
    } else {
      console.error('Unknown error:', error);
      setError('不明なエラーが発生しました');
    }
  };

  const handleGenerate = async () => {
    try {
      setGenerating(true);
      setProgress(null);
      setError(null);

      console.log('1. Starting news generation...');
      const response = await fetch('/api/english/news/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to start news generation');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Failed to get response reader');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          try {
            const data = JSON.parse(line.slice(6));
            console.log('Received data:', data);

            if (data.error) {
              throw new Error(data.error);
            }

            if (data.result) {
              // 生成完了
              setGenerating(false);
              setProgress(null);
              setNews([data.result, ...news]);
            } else if (data.step && data.total && data.message) {
              // 進捗更新
              setProgress(data);
            }
          } catch (e) {
            console.error('Error parsing SSE data:', e, 'Line:', line);
          }
        }
      }

      // 最後のバッファをチェック
      if (buffer.trim() !== '') {
        try {
          const data = JSON.parse(buffer.slice(6));
          if (data.result) {
            setGenerating(false);
            setProgress(null);
            setNews([data.result, ...news]);
          }
        } catch (e) {
          console.error('Error parsing final SSE data:', e);
        }
      }
    } catch (error) {
      console.error('Error in handleGenerate:', error);
      handleError(error);
      setGenerating(false);
      setProgress(null);
    }
  };

  const handlePublish = async (id: string) => {
    try {
      setError(null);
      console.log('Publishing news:', id);
      const response = await axios.patch('/api/english/news', {
        id,
        isPublished: true,
        publishedAt: new Date().toISOString(),
      });
      
      if (response.status !== 200) throw new Error('Failed to publish news');
      
      // 更新されたニュースを取得
      const updatedNews = response.data;
      setNews(news.map(item => item.id === id ? updatedNews : item));
    } catch (error) {
      handleError(error);
    }
  };

  const handleUnpublish = async (id: string) => {
    try {
      setError(null);
      console.log('Unpublishing news:', id);
      const response = await axios.patch('/api/english/news', {
        id,
        isPublished: false,
        publishedAt: null,
      });
      
      if (response.status !== 200) throw new Error('Failed to unpublish news');
      
      // 更新されたニュースを取得
      const updatedNews = response.data;
      setNews(news.map(item => item.id === id ? updatedNews : item));
    } catch (error) {
      handleError(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('このニュースを削除してもよろしいですか？')) return;

    try {
      setError(null);
      console.log('Deleting news:', id);
      const response = await axios.delete('/api/english/news', {
        data: { id }
      });
      if (response.status !== 204) throw new Error('Failed to delete news');
      setNews(news.filter(item => item.id !== id));
    } catch (error) {
      handleError(error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">ニュース管理</h2>
          <div className="space-x-2">
            <Button
              onClick={() => setSelectedNews({
                id: '',
                title: '',
                description: '',
                content: '',
                category: 'world',
                level: 'intermediate',
                tags: [],
                isPublished: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                publishedAt: undefined,
                conversation: '',
                audioUrl: undefined,
                videoUrl: undefined,
                imageUrl: undefined,
              })}
            >
              手動作成
            </Button>
            <Button 
              onClick={handleGenerate}
              disabled={generating}
            >
              {generating ? '生成中...' : '自動生成'}
            </Button>
          </div>
        </div>

        {/* 手動作成/編集フォーム */}
        {selectedNews && (
          <div className="bg-white p-6 rounded-lg shadow space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">
                {selectedNews.id ? 'ニュースを編集' : '新規ニュース作成'}
              </h3>
              <Button
                variant="outline"
                onClick={() => setSelectedNews(null)}
              >
                閉じる
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">タイトル</label>
                <input
                  type="text"
                  value={selectedNews.title}
                  onChange={(e) => setSelectedNews({
                    ...selectedNews,
                    title: e.target.value,
                  })}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">説明</label>
                <textarea
                  value={selectedNews.description}
                  onChange={(e) => setSelectedNews({
                    ...selectedNews,
                    description: e.target.value,
                  })}
                  rows={2}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">本文</label>
                <textarea
                  value={selectedNews.content}
                  onChange={(e) => setSelectedNews({
                    ...selectedNews,
                    content: e.target.value,
                  })}
                  rows={10}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">カテゴリー</label>
                  <select
                    value={selectedNews.category}
                    onChange={(e) => setSelectedNews({
                      ...selectedNews,
                      category: e.target.value,
                    })}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="world">世界</option>
                    <option value="business">ビジネス</option>
                    <option value="technology">テクノロジー</option>
                    <option value="science">科学</option>
                    <option value="entertainment">エンターテイメント</option>
                  </select>
                </div>

              <div>
                <label className="block text-sm font-medium mb-1">動画</label>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">動画ファイルをアップロード</label>
                    <VideoUploader
                      onUploadComplete={(url: string) => setSelectedNews({
                        ...selectedNews,
                        videoUrl: url,
                      })}
                      type="english"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">または YouTube URL を入力</label>
                    <input
                      type="text"
                      value={selectedNews.videoUrl || ''}
                      onChange={(e) => setSelectedNews({
                        ...selectedNews,
                        videoUrl: e.target.value,
                      })}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  {selectedNews.videoUrl && (
                    <div className="mt-2 text-sm text-gray-600">
                      現在の動画: {selectedNews.videoUrl}
                    </div>
                  )}
                </div>
              </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">タグ</label>
                <input
                  type="text"
                  value={selectedNews.tags.join(', ')}
                  onChange={(e) => setSelectedNews({
                    ...selectedNews,
                    tags: e.target.value.split(',').map(tag => tag.trim()),
                  })}
                  placeholder="カンマ区切りでタグを入力"
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">画像</label>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">画像ファイルをアップロード</label>
                    <ImageUploader
                      onUploadComplete={(url: string) => setSelectedNews({
                        ...selectedNews,
                        imageUrl: url,
                      })}
                      type="english"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">または 画像URL を入力</label>
                    <input
                      type="text"
                      value={selectedNews.imageUrl || ''}
                      onChange={(e) => setSelectedNews({
                        ...selectedNews,
                        imageUrl: e.target.value,
                      })}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  {selectedNews.imageUrl && (
                    <div className="mt-2">
                      <label className="block text-sm text-gray-600 mb-1">プレビュー</label>
                      <img
                        src={selectedNews.imageUrl}
                        alt="Preview"
                        className="max-w-full h-auto rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </div>


              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedNews.isPublished}
                  onChange={(e) => setSelectedNews({
                    ...selectedNews,
                    isPublished: e.target.checked,
                  })}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <span className="text-sm text-gray-600">公開する</span>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={async () => {
                    try {
                      setIsUploading(true);
                      const response = await fetch('/api/english/news', {
                        method: selectedNews.id ? 'PUT' : 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(selectedNews),
                      });

                      if (!response.ok) {
                        throw new Error('Failed to save news');
                      }

                      const savedNews = await response.json();
                      setNews(news.map(item => 
                        item.id === savedNews.id ? savedNews : item
                      ));
                      setSelectedNews(null);
                    } catch (error) {
                      console.error('Error saving news:', error);
                      setError(error instanceof Error ? error.message : '保存に失敗しました');
                    } finally {
                      setIsUploading(false);
                    }
                  }}
                  disabled={isUploading}
                >
                  {isUploading ? '保存中...' : '保存'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* エラー表示 */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700 whitespace-pre-line">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* 進捗表示 */}
        {generating && progress && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">{progress.message}</span>
              <span className="text-sm text-gray-500">
                {progress.step} / {progress.total}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${(progress.step / progress.total) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {news.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            ニュースがありません
          </div>
        ) : (
          news.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-lg shadow space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-500">
                    作成日時: {new Date(item.createdAt).toLocaleString()}
                  </p>
                  {item.publishedAt && (
                    <p className="text-sm text-gray-500">
                      公開日時: {new Date(item.publishedAt).toLocaleString()}
                    </p>
                  )}
                </div>
                <div className="space-x-2">
                  {item.isPublished ? (
                    <Button
                      variant="outline"
                      onClick={() => handleUnpublish(item.id)}
                    >
                      非公開にする
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handlePublish(item.id)}
                    >
                      公開する
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(item.id)}
                  >
                    削除
                  </Button>
                </div>
              </div>

              <div className="prose max-w-none">
                <h4 className="text-lg font-medium">ニュース本文</h4>
                <p className="whitespace-pre-line">{item.content}</p>
              </div>

              <div className="prose max-w-none">
                <h4 className="text-lg font-medium">会話練習</h4>
                <p className="whitespace-pre-line">{item.conversation}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-lg font-medium mb-2">音声</h4>
                  <audio controls className="w-full">
                    <source src={item.audioUrl} type="audio/mpeg" />
                    お使いのブラウザは音声再生に対応していません。
                  </audio>
                </div>
                <div>
                  <h4 className="text-lg font-medium mb-2">画像</h4>
                  <img
                    src={item.imageUrl}
                    alt="News visualization"
                    className="w-full rounded-lg"
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
