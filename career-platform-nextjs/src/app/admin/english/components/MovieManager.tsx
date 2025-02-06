'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { VideoUploader } from "@/components/ui/VideoUploader";
import { Loader2 } from 'lucide-react';

import { Movie } from '@/types/english';

export default function MovieManager() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      const response = await fetch('/api/admin/english/movies');
      if (!response.ok) {
        throw new Error('Failed to load movies');
      }
      const data = await response.json();
      setMovies(data);
    } catch (error) {
      console.error('Error loading movies:', error);
      setError('Failed to load movies');
    }
  };

  const handleVideoUpload = async (videoUrl: string, duration: string) => {
    if (!selectedMovie) return;
    
    setSelectedMovie({
      ...selectedMovie,
      videoUrl,
    });

    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/api/english/movies/youtube-info', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url: videoUrl }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to get YouTube video information');
        }

        const info = await response.json();
        setSelectedMovie(prev => ({
          ...prev!,
          title: info.title,
          description: info.description,
          level: info.level,
          tags: info.tags,
          videoUrl,
          originalTitle: info.originalTitle,
          originalDescription: info.originalDescription,
          duration: info.duration,
          thumbnailUrl: info.thumbnailUrl,
          lastProcessingTime: new Date().toISOString(),
          lastProcessingStage: 'youtube_processing'
        }));
      } catch (error) {
        console.error('Error getting YouTube info:', error);
        setError('Failed to get YouTube video information');
        setSelectedMovie(prev => ({
          ...prev!,
          error: error instanceof Error ? error.message : 'Failed to get YouTube video information',
          lastProcessingTime: new Date().toISOString(),
          lastProcessingStage: 'failed'
        }));
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSave = async () => {
    if (!selectedMovie) return;

    try {
      setIsUploading(true);
      setError(null);
      const method = selectedMovie.id ? 'PUT' : 'POST';
      const url = selectedMovie.id 
        ? `/api/admin/english/movies/${selectedMovie.id}`
        : '/api/admin/english/movies';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedMovie),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save movie');
      }

      await loadMovies();
      setSelectedMovie(null);
    } catch (error) {
      console.error('Error saving movie:', error);
      setError(error instanceof Error ? error.message : 'Failed to save movie');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setError(null);
      const response = await fetch(`/api/admin/english/movies/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete movie');
      }

      await loadMovies();
    } catch (error) {
      console.error('Error deleting movie:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete movie');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">映画で学ぶ</h2>
        <Button
          onClick={() => setSelectedMovie({
            id: '',
            title: '',
            description: '',
            videoUrl: '',
            transcript: '',
            level: 'intermediate',
            tags: [],
            subtitles: [],
            vocabulary: [],
            processed: false,
            isPublished: false,
            createdAt: new Date().toISOString(),
            originalTitle: '',
            originalDescription: '',
            duration: 0,
            thumbnailUrl: '',
            error: null,
            lastProcessingTime: new Date().toISOString(),
            lastProcessingStage: 'pending'
          })}
        >
          新規作成
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <div className="font-bold">エラーが発生しました</div>
          <div className="mt-1">{error}</div>
          {selectedMovie?.error && (
            <div className="mt-2 text-sm">
              <div className="font-semibold">処理エラー:</div>
              <div>{selectedMovie.error}</div>
              <div className="mt-1 text-xs text-gray-600">
                最終処理時刻: {new Date(selectedMovie.lastProcessingTime || new Date()).toLocaleString()}
                {selectedMovie.lastProcessingStage && (
                  <span className="ml-2">
                    ステージ: {selectedMovie.lastProcessingStage}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {selectedMovie && (
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">
            {selectedMovie.id ? '映画を編集' : '新規映画'}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">タイトル</label>
              <Input
                value={selectedMovie.title}
                onChange={(e) => setSelectedMovie({
                  ...selectedMovie,
                  title: e.target.value,
                })}
                placeholder="映画のタイトル"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">説明</label>
              <textarea
                className="w-full px-3 py-2 border rounded-md"
                value={selectedMovie.description}
                onChange={(e) => setSelectedMovie({
                  ...selectedMovie,
                  description: e.target.value,
                })}
                rows={4}
                placeholder="映画の説明"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">レベル</label>
              <select
                className="w-full px-3 py-2 border rounded-md"
                value={selectedMovie.level}
                onChange={(e) => setSelectedMovie({
                  ...selectedMovie,
                  level: e.target.value as 'beginner' | 'intermediate' | 'advanced',
                })}
                disabled={isLoading}
              >
                <option value="beginner">初級</option>
                <option value="intermediate">中級</option>
                <option value="advanced">上級</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">タグ</label>
              <Input
                value={selectedMovie.tags.join(', ')}
                onChange={(e) => setSelectedMovie({
                  ...selectedMovie,
                  tags: e.target.value.split(',').map(tag => tag.trim()),
                })}
                placeholder="タグをカンマ区切りで入力"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">公開設定</label>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedMovie.isPublished}
                  onChange={(e) => setSelectedMovie({
                    ...selectedMovie,
                    isPublished: e.target.checked,
                  })}
                  className="h-4 w-4 rounded border-gray-300"
                  disabled={isLoading}
                />
                <span className="text-sm text-gray-600">公開する</span>
              </div>
              {selectedMovie.processed ? (
                <div className="mt-2 text-sm">
                  <div className="text-green-600">処理完了</div>
                  <div className="text-xs text-gray-600 mt-1">
                    完了時刻: {new Date(selectedMovie.lastProcessingTime || new Date()).toLocaleString()}
                  </div>
                </div>
              ) : selectedMovie.error ? (
                <div className="mt-2 text-sm">
                  <div className="text-red-600">
                    処理エラー: {selectedMovie.error}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    エラー発生時刻: {new Date(selectedMovie.lastProcessingTime || new Date()).toLocaleString()}
                    {selectedMovie.lastProcessingStage && (
                      <div className="mt-1">
                        エラー発生ステージ: {selectedMovie.lastProcessingStage}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="mt-2 text-sm">
                      <div className="text-gray-600">
                        {isLoading ? '情報取得中...' : '処理中...'}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        開始時刻: {new Date(selectedMovie.lastProcessingTime || new Date()).toLocaleString()}
                        {selectedMovie.lastProcessingStage && (
                          <div className="mt-1">
                            現在のステージ: {selectedMovie.lastProcessingStage}
                          </div>
                        )}
                        {isLoading && (
                          <div className="mt-1 text-blue-500">
                            YouTube情報を取得しています...
                          </div>
                        )}
                      </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">動画</label>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">動画ファイルをアップロード</label>
                  <VideoUploader onUploadComplete={handleVideoUpload} type="english" disabled={isLoading} />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">または YouTube URL を入力</label>
                  <div className="relative">
                    <Input
                      value={selectedMovie.videoUrl}
                      onChange={async (e) => {
                        const url = e.target.value;
                        setSelectedMovie({
                          ...selectedMovie,
                          videoUrl: url,
                        });

                        if (url.includes('youtube.com') || url.includes('youtu.be')) {
                          try {
                            setIsLoading(true);
                            setError(null);

                            const response = await fetch('/api/english/movies/youtube-info', {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify({ url }),
                            });

                            if (!response.ok) {
                              const errorData = await response.json();
                              throw new Error(errorData.error || 'Failed to get YouTube video information');
                            }

                            const info = await response.json();
                            setSelectedMovie(prev => ({
                              ...prev!,
                              title: info.title,
                              description: info.description,
                              level: info.level,
                              tags: info.tags,
                              videoUrl: url,
                              originalTitle: info.originalTitle,
                              originalDescription: info.originalDescription,
                              duration: info.duration,
                              thumbnailUrl: info.thumbnailUrl,
                              lastProcessingTime: new Date().toISOString(),
                              lastProcessingStage: 'youtube_processing'
                            }));
                          } catch (error) {
                            console.error('Error getting YouTube info:', error);
                            setError('Failed to get YouTube video information');
                            setSelectedMovie(prev => ({
                              ...prev!,
                              error: error instanceof Error ? error.message : 'Failed to get YouTube video information',
                              lastProcessingTime: new Date().toISOString(),
                              lastProcessingStage: 'failed'
                            }));
                          } finally {
                            setIsLoading(false);
                          }
                        }
                      }}
                      placeholder="https://www.youtube.com/watch?v=..."
                      disabled={isLoading}
                    />
                    {isLoading && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                      <div className="ml-2 text-sm text-blue-500">
                        情報取得中...
                      </div>
                    </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                variant="outline"
                onClick={() => setSelectedMovie(null)}
                disabled={isLoading || isUploading}
              >
                キャンセル
              </Button>
              <Button
                disabled={isLoading || isUploading}
                onClick={handleSave}
                className="relative"
              >
                {isUploading ? '保存中...' : isLoading ? '情報取得中...' : '保存'}
                {(isLoading || isUploading) && (
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                )}
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4">
        {movies.map((movie) => (
          <Card key={movie.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <div>
                  <h3 className="text-lg font-semibold">{movie.title}</h3>
                  <div className="mt-1 flex items-center space-x-2">
                    {movie.processed ? (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">処理完了</span>
                    ) : movie.error ? (
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded" title={movie.error}>
                        処理エラー
                      </span>
                    ) : (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">処理中</span>
                    )}
                    {movie.isPublished ? (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">公開中</span>
                    ) : (
                      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">非公開</span>
                    )}
                  </div>
                </div>
                <p className="text-gray-500 text-sm mt-1">
                  {movie.description}
                  {movie.originalTitle && movie.originalTitle !== movie.title && (
                    <span className="block mt-1 text-xs text-gray-400">
                      Original: {movie.originalTitle}
                    </span>
                  )}
                </p>
                <div className="flex gap-2 mt-2">
                  {movie.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedMovie(movie)}
                >
                  編集
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(movie.id)}
                >
                  削除
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
