'use client';

import { useState } from 'react';
import { Button } from './button';

export interface VideoUploaderProps {
  onUpload: (url: string) => void | Promise<void>;
}

export function VideoUploader({ onUpload }: VideoUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload/video', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload video');
      }

      const data = await response.json();
      await onUpload(data.url);
    } catch (error) {
      console.error('Error uploading video:', error);
      setError('Failed to upload video');
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
          disabled={isUploading}
        />
        <label htmlFor="video-upload">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={isUploading}
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
