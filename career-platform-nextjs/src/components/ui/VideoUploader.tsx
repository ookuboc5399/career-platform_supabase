'use client';

import { useState, useRef } from 'react';
import { Button } from './button';

export interface VideoUploaderProps {
  onUploadComplete: (url: string, duration: string, storagePath?: string) => void | Promise<void>;
  type?: 'certification' | 'programming' | 'english';
  disabled?: boolean;
}

export function VideoUploader({ onUploadComplete, type = 'certification', disabled = false }: VideoUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // 動画ファイルからメタデータ（duration）を取得
  const getVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        resolve(video.duration);
      };
      
      video.onerror = () => {
        window.URL.revokeObjectURL(video.src);
        reject(new Error('Failed to load video metadata'));
      };
      
      video.src = URL.createObjectURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setError(null);

      // 動画ファイルからdurationを取得
      let duration = '0';
      try {
        const videoDuration = await getVideoDuration(file);
        duration = videoDuration.toString();
        console.log('Video duration:', videoDuration, 'seconds');
      } catch (durationError) {
        console.warn('Failed to get video duration:', durationError);
        // durationの取得に失敗してもアップロードは続行
      }

      const formData = new FormData();
      formData.append('video', file);
      formData.append('type', type);
      formData.append('duration', duration);

      const response = await fetch('/api/upload/video', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Upload response:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        throw new Error(`Failed to upload video: ${errorText}`);
      }

      const data = await response.json();
      // サーバー側で取得したdurationを使用（クライアント側で取得できなかった場合のフォールバック）
      const finalDuration = data.duration || duration;
      // storagePathも含めて返す（Supabase Storageの場合）
      await onUploadComplete(data.url, finalDuration.toString(), data.storagePath);
    } catch (error) {
      console.error('Error uploading video:', error);
      setError(error instanceof Error ? error.message : 'Failed to upload video');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          className="hidden"
          id="video-upload"
          disabled={isUploading || disabled}
        />
        <label htmlFor="video-upload">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={isUploading || disabled}
            asChild
          >
            <span>
              {isUploading ? 'アップロード中...' : '動画を選択'}
            </span>
          </Button>
        </label>
      </div>

      {error && (
        <div className="text-red-500 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
