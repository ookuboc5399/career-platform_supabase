'use client';

import { useState, useRef, useEffect } from 'react';

interface VideoThumbnailProps {
  videoUrl: string;
  alt: string;
  className?: string;
  fallbackText?: string;
}

export function VideoThumbnail({ videoUrl, alt, className = '', fallbackText = 'サムネイルなし' }: VideoThumbnailProps) {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // YouTube動画の場合は、YouTubeのサムネイルAPIを使用
    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
      const youtubeId = getYouTubeId(videoUrl);
      if (youtubeId) {
        // YouTubeのサムネイルURLを生成（高解像度）
        const thumbnailUrl = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
        setThumbnailUrl(thumbnailUrl);
        setIsLoading(false);
        return;
      }
    }

    // その他の動画の場合は、HTML5 video要素からサムネイルを生成
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      try {
        // 動画の最初のフレーム（0秒）にシーク
        video.currentTime = 0.1; // 0秒だと読み込まれない場合があるため、0.1秒に設定
      } catch (error) {
        console.error('Error seeking video:', error);
        setHasError(true);
        setIsLoading(false);
      }
    };

    const handleSeeked = () => {
      try {
        const canvas = canvasRef.current;
        if (!canvas || !video) return;

        // キャンバスのサイズを動画のサイズに合わせる
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 360;

        // 動画のフレームをキャンバスに描画
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setHasError(true);
          setIsLoading(false);
          return;
        }

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // キャンバスから画像データを取得
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setThumbnailUrl(dataUrl);
        setIsLoading(false);
      } catch (error) {
        console.error('Error generating thumbnail:', error);
        setHasError(true);
        setIsLoading(false);
      }
    };

    const handleError = () => {
      console.error('Error loading video for thumbnail');
      setHasError(true);
      setIsLoading(false);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('seeked', handleSeeked);
    video.addEventListener('error', handleError);

    // 動画を読み込む
    video.src = videoUrl;
    video.load();

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('seeked', handleSeeked);
      video.removeEventListener('error', handleError);
    };
  }, [videoUrl]);

  // YouTube URLからIDを抽出
  const getYouTubeId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  if (hasError || (!thumbnailUrl && !isLoading)) {
    return (
      <div className={`w-full h-full bg-gray-200 flex items-center justify-center ${className}`}>
        <span className="text-gray-400">{fallbackText}</span>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`w-full h-full bg-gray-200 flex items-center justify-center ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <>
      <img
        src={thumbnailUrl!}
        alt={alt}
        className={className}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
      />
      {/* 非表示のvideo要素とcanvas要素（サムネイル生成用） */}
      <video
        ref={videoRef}
        className="hidden"
        preload="metadata"
        crossOrigin="anonymous"
      />
      <canvas ref={canvasRef} className="hidden" />
    </>
  );
}


