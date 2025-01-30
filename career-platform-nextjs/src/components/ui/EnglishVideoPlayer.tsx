'use client';

import { forwardRef, useRef, useEffect, useState, useImperativeHandle } from 'react';
import { Subtitle } from '@/types/english';
import videojs from 'video.js';
import Player from 'video.js/dist/types/player';
import 'video.js/dist/video-js.css';
import 'videojs-youtube';

interface EnglishVideoPlayerProps {
  url: string;
  onComplete?: () => void;
  completed?: boolean;
  subtitles?: Subtitle[];
  onSubtitleChange?: (subtitle: Subtitle | null) => void;
}

export interface EnglishVideoPlayerHandle {
  seekTo: (time: number) => void;
}

const getYouTubeId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

const EnglishVideoPlayer = forwardRef<EnglishVideoPlayerHandle, EnglishVideoPlayerProps>(({
  url,
  onComplete,
  completed = false,
  subtitles = [],
  onSubtitleChange
}, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<Player | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  console.log('EnglishVideoPlayer props:', { url, completed, subtitles }); // デバッグログ

  useImperativeHandle(ref, () => ({
    seekTo: (time: number) => {
      if (playerRef.current) {
        playerRef.current.currentTime(time);
      }
    }
  }));

  useEffect(() => {
    if (!videoRef.current) return;

    // YouTubeのURLを正規化
    const youtubeId = getYouTubeId(url);
    const videoUrl = youtubeId ? `https://www.youtube.com/watch?v=${youtubeId}` : url;
    console.log('Normalized URL:', videoUrl); // デバッグログ

    // video.js プレーヤーの初期化
    const options = {
      controls: true,
      fluid: true,
      playbackRates: [0.5, 1, 1.5, 2],
      techOrder: ['youtube'],
      sources: [{
        src: videoUrl,
        type: 'video/youtube'
      }],
      youtube: {
        iv_load_policy: 3,
        modestbranding: 1,
        ytControls: 2,
        playsinline: 1
      }
    };

    console.log('Video.js options:', options); // デバッグログ

    try {
      // プラグインの読み込みを確認
      if (!videojs.getTech('Youtube')) {
        console.error('YouTube tech not found'); // デバッグログ
        throw new Error('YouTube tech not found');
      }

      const player = videojs(videoRef.current, options, function onPlayerReady() {
        console.log('Player is ready'); // デバッグログ
        setIsLoading(false);
      });

      playerRef.current = player;

      // 字幕の変更を監視
      player.on('timeupdate', () => {
        const currentTime = player.currentTime();
        if (typeof currentTime === 'number') {
          const currentSubtitle = subtitles.find(
            sub => currentTime >= sub.startTime && currentTime <= sub.endTime
          );
          if (onSubtitleChange) {
            onSubtitleChange(currentSubtitle || null);
          }
        }
      });

      // 完了の監視
      player.on('timeupdate', () => {
        const currentTime = player.currentTime();
        const duration = player.duration();
        if (typeof currentTime === 'number' && typeof duration === 'number' && duration > 0) {
          const progress = (currentTime / duration) * 100;
          if (progress >= 95 && onComplete && !completed) {
            onComplete();
          }
        }
      });

      // エラーハンドリング
      player.on('error', () => {
        const error = player.error();
        console.error('Video.js error:', error); // デバッグログ
        setError('動画の読み込みに失敗しました');
      });

    } catch (error) {
      console.error('Error initializing video.js:', error); // デバッグログ
      setError('動画プレーヤーの初期化に失敗しました');
      setIsLoading(false);
    }

    return () => {
      if (playerRef.current) {
        console.log('Disposing video.js player'); // デバッグログ
        playerRef.current.dispose();
      }
    };
  }, [url, subtitles, onComplete, completed, onSubtitleChange]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full bg-gray-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-full bg-gray-100 p-4">
        <div className="text-red-500 text-center mb-2">動画の読み込みに失敗しました</div>
        <div className="text-sm text-gray-600 text-center break-all">{error}</div>
      </div>
    );
  }

  return (
    <div className="relative group aspect-video">
      <div data-vjs-player>
        <video
          ref={videoRef}
          className="video-js vjs-big-play-centered"
        />
      </div>

      {/* 完了バッジ */}
      {completed && (
        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
          完了
        </div>
      )}
    </div>
  );
});

EnglishVideoPlayer.displayName = 'EnglishVideoPlayer';

export default EnglishVideoPlayer;
