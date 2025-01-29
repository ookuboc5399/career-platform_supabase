'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { VideoUploader } from "@/components/ui/VideoUploader";

interface Movie {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  transcript: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
}

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

  const handleVideoUpload = async (videoUrl: string) => {
    if (!selectedMovie) return;

    try {
      setIsUploading(true);
      const response = await fetch('/api/admin/english/movies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...selectedMovie,
          videoUrl,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save movie');
      }

      await loadMovies();
      setSelectedMovie(null);
    } catch (error) {
      console.error('Error saving movie:', error);
      setError('Failed to save movie');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/english/movies/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete movie');
      }

      await loadMovies();
    } catch (error) {
      console.error('Error deleting movie:', error);
      setError('Failed to delete movie');
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
          })}
        >
          新規作成
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
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
              >
                <option value="beginner">初級</option>
                <option value="intermediate">中級</option>
                <option value="advanced">上級</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">スクリプト</label>
              <textarea
                className="w-full px-3 py-2 border rounded-md"
                value={selectedMovie.transcript}
                onChange={(e) => setSelectedMovie({
                  ...selectedMovie,
                  transcript: e.target.value,
                })}
                rows={8}
                placeholder="映画のスクリプト"
              />
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
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">動画</label>
              <VideoUploader onUpload={handleVideoUpload} />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                variant="outline"
                onClick={() => setSelectedMovie(null)}
              >
                キャンセル
              </Button>
              <Button
                disabled={isUploading}
                onClick={() => handleVideoUpload(selectedMovie.videoUrl)}
              >
                {isUploading ? '保存中...' : '保存'}
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
                <h3 className="text-lg font-semibold">{movie.title}</h3>
                <p className="text-gray-500 text-sm mt-1">{movie.description}</p>
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
