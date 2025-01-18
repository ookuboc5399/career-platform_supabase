import { useState, useRef } from 'react';
import { Button } from './button';

interface VideoUploaderProps {
  onUploadComplete: (url: string) => void;
}

export function VideoUploader({ onUploadComplete }: VideoUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 動画ファイルの検証
    if (!file.type.startsWith('video/')) {
      setError('動画ファイルを選択してください');
      return;
    }

    // ファイルサイズの検証（例: 500MB以下）
    const maxSize = 500 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('ファイルサイズは500MB以下にしてください');
      return;
    }

    try {
      setIsUploading(true);
      setError(null);

      // FormDataの作成
      const formData = new FormData();
      formData.append('video', file);

      // アップロードリクエスト
      const response = await fetch('/api/upload/video', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('アップロードに失敗しました');
      }

      const data = await response.json();
      onUploadComplete(data.url);
    } catch (error) {
      console.error('Upload error:', error);
      setError('アップロードに失敗しました');
    } finally {
      setIsUploading(false);
      setProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <input
          type="file"
          accept="video/*"
          onChange={handleFileSelect}
          className="hidden"
          ref={fileInputRef}
        />
        <Button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          variant="outline"
          disabled={isUploading}
        >
          動画を選択
        </Button>
        {isUploading && (
          <div className="text-sm text-gray-600">
            アップロード中... {progress}%
          </div>
        )}
      </div>

      {error && (
        <div className="text-sm text-red-600">
          {error}
        </div>
      )}

      {isUploading && (
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
