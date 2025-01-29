'use client';

import { useRef, useEffect, useState } from 'react';

interface VideoPlayerProps {
  url: string;
  onComplete?: () => void;
  completed?: boolean;
}

export default function VideoPlayer({ url, onComplete, completed = false }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchVideoUrl = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('Original video URL:', url);
      const response = await fetch(`/api/storage/video?url=${encodeURIComponent(url)}`);
      const responseText = await response.text();
      console.log('API Response:', responseText);

      if (!response.ok) {
        console.error('API Error:', responseText);
        throw new Error(responseText || 'Failed to get video URL');
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('JSON Parse Error:', e);
        throw new Error('Invalid response format');
      }

      console.log('Parsed response:', data);
      if (!data.url) {
        throw new Error('No URL received from server');
      }

      console.log('Setting video URL:', data.url);
      setVideoUrl(data.url);
    } catch (error) {
      console.error('Error fetching video URL:', error);
      setError(error instanceof Error ? error.message : 'Failed to load video');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadVideo = async () => {
      setIsLoading(true);
      setError(null);
      try {
        console.log('Original video URL:', url);
        const response = await fetch(`/api/storage/video?url=${encodeURIComponent(url)}`);
        const responseText = await response.text();
        console.log('API Response:', responseText);

        if (!response.ok) {
          console.error('API Error:', responseText);
          throw new Error(responseText || 'Failed to get video URL');
        }

        let data;
        try {
          data = JSON.parse(responseText);
        } catch (e) {
          console.error('JSON Parse Error:', e);
          throw new Error('Invalid response format');
        }

        console.log('Parsed response:', data);
        if (!data.url) {
          throw new Error('No URL received from server');
        }

        console.log('Setting video URL:', data.url);
        setVideoUrl(data.url);
      } catch (error) {
        console.error('Error fetching video URL:', error);
        setError(error instanceof Error ? error.message : 'Failed to load video');
      } finally {
        setIsLoading(false);
      }
    };

    loadVideo();
  }, [url]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const progress = (video.currentTime / video.duration) * 100;
      setProgress(progress);

      // 動画が95%以上再生されたら完了とみなす
      if (progress >= 95 && onComplete && !completed) {
        onComplete();
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [onComplete, completed]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative group">
      {isLoading ? (
        <div className="flex justify-center items-center h-64 bg-gray-100">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : error ? (
        <div className="flex flex-col justify-center items-center h-64 bg-gray-100 p-4">
          <div className="text-red-500 text-center mb-2">動画の読み込みに失敗しました</div>
          <div className="text-sm text-gray-600 text-center break-all">
            {error}
          </div>
          <button
            onClick={() => {
              setError(null);
              setIsLoading(true);
              fetchVideoUrl();
            }}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            再試行
          </button>
        </div>
      ) : videoUrl && (
        <video
          ref={videoRef}
          className="w-full h-full"
          onClick={togglePlay}
        >
          <source src={videoUrl} type="video/mp4" />
          お使いのブラウザは動画の再生に対応していません。
        </video>
      )}

      {/* コントロールオーバーレイ */}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
        <button
          onClick={togglePlay}
          className="w-16 h-16 bg-white bg-opacity-80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {isPlaying ? (
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>

      {/* プログレスバー */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
        <div
          className="h-full bg-blue-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* 時間表示 */}
      <div className="absolute bottom-2 right-2 text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
        {formatTime(videoRef.current?.currentTime || 0)} / {formatTime(duration)}
      </div>

      {/* 完了バッジ */}
      {completed && (
        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
          完了
        </div>
      )}
    </div>
  );
}
