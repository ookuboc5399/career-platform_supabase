'use client';

import { useState, useRef } from 'react';
import {
  isStorageUploadFileNameAllowed,
  STORAGE_UPLOAD_FILENAME_HINT,
} from '@/lib/storage-upload-filename';
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

    if (!isStorageUploadFileNameAllowed(file.name)) {
      setError(STORAGE_UPLOAD_FILENAME_HINT);
      e.target.value = '';
      return;
    }

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

      // 1) 署名付き URL を取得（JSON のみ — 大容量を Next サーバーで Buffer 化しない）
      const prep = await fetch('/api/upload/video/prepare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: file.name, type }),
      });

      if (!prep.ok) {
        const errorText = await prep.text();
        let detail = errorText;
        try {
          const j = JSON.parse(errorText) as { error?: string };
          if (j.error) detail = j.error;
        } catch {
          /* そのまま */
        }
        throw new Error(detail || `アップロード準備に失敗しました (${prep.status})`);
      }

      const { signedUrl, publicUrl, storagePath } = (await prep.json()) as {
        signedUrl: string;
        publicUrl: string;
        storagePath: string;
      };

      // 2) Supabase storage-js の uploadToSignedUrl と同形の multipart でブラウザから直接 PUT
      const fd = new FormData();
      fd.append('cacheControl', '3600');
      fd.append('', file);

      const putRes = await fetch(signedUrl, { method: 'PUT', body: fd });

      if (!putRes.ok) {
        const errBody = await putRes.text();
        console.error('Direct storage PUT failed:', putRes.status, errBody);
        throw new Error(
          errBody || `ストレージへのアップロードに失敗しました (${putRes.status})`
        );
      }

      const finalDuration = duration;
      await onUploadComplete(publicUrl, finalDuration.toString(), storagePath);
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
