'use client';

import { forwardRef, useRef, useEffect, useState, useImperativeHandle } from 'react';
import { Subtitle } from '@/types/english';

// YouTube URLからIDを抽出
const getYouTubeId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

interface SimpleVideoPlayerProps {
  url: string;
  onComplete?: () => void;
  completed?: boolean;
  subtitles?: Subtitle[];
  onSubtitleChange?: (subtitle: Subtitle | null) => void;
  subtitleUrl?: string;
}

export interface SimpleVideoPlayerHandle {
  seekTo: (time: number) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
}

const SimpleVideoPlayer = forwardRef<SimpleVideoPlayerHandle, SimpleVideoPlayerProps>(({ 
  url,
  onComplete,
  completed = false,
  subtitles = [],
  onSubtitleChange,
  subtitleUrl
}, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSubtitle, setCurrentSubtitle] = useState<Subtitle | null>(null);
  const [activeCueText, setActiveCueText] = useState<string | null>(null);

  useImperativeHandle(ref, () => ({
    seekTo: (time: number) => {
      if (getYouTubeId(url)) {
        // YouTube動画の場合は、iframeのAPIを使用（実装が必要な場合は後で追加）
        console.warn('YouTube動画のシーク機能は未実装です');
        return;
      }
      if (videoRef.current) {
        videoRef.current.currentTime = time;
      }
    },
    getCurrentTime: () => {
      if (getYouTubeId(url)) {
        return 0; // YouTube動画の場合は0を返す（実装が必要な場合は後で追加）
      }
      return videoRef.current?.currentTime || 0;
    },
    getDuration: () => {
      if (getYouTubeId(url)) {
        return 0; // YouTube動画の場合は0を返す（実装が必要な場合は後で追加）
      }
      return videoRef.current?.duration || 0;
    }
  }));

  useEffect(() => {
    // YouTube動画の場合は、video要素の処理をスキップ
    if (getYouTubeId(url)) {
      setIsLoading(false);
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setIsLoading(false);
    };

    const handleError = () => {
      console.error('[SimpleVideoPlayer] Video error:', video.error);
      let errorMessage = '動画の読み込みに失敗しました';
      if (video.error) {
        switch (video.error.code) {
          case 1:
            errorMessage = '動画の読み込みが中断されました';
            break;
          case 2:
            errorMessage = 'ネットワークエラーが発生しました';
            break;
          case 3:
            errorMessage = '動画のデコードに失敗しました';
            break;
          case 4:
            errorMessage = 'サポートされていない動画形式です';
            break;
        }
      }
      setError(errorMessage);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      if (!video) return;

      const currentTime = video.currentTime;

      // まず、subtitles配列から現在の時間に一致する字幕を検索（これが最も確実）
      if (subtitles && subtitles.length > 0) {
        const subtitle = subtitles.find(
          sub => currentTime >= sub.startTime && currentTime <= sub.endTime
        );
        
        // 参照比較ではなく、内容比較で変更を検出
        const subtitleChanged = 
          (!currentSubtitle && subtitle) ||
          (currentSubtitle && !subtitle) ||
          (currentSubtitle && subtitle && (
            currentSubtitle.startTime !== subtitle.startTime ||
            currentSubtitle.endTime !== subtitle.endTime ||
            currentSubtitle.text !== subtitle.text
          ));
        
        if (subtitleChanged) {
          setCurrentSubtitle(subtitle || null);
          if (onSubtitleChange) {
            onSubtitleChange(subtitle || null);
          }
        }
      } else {
        // subtitles配列がない場合は、TextTrack APIから取得
        const textTracks = video.textTracks;
        let activeCue: TextTrackCue | null = null;
        
        for (let i = 0; i < textTracks.length; i++) {
          const track = textTracks[i];
          if (track.mode === 'showing' || track.mode === 'hidden') {
            const cues = track.activeCues;
            if (cues && cues.length > 0) {
              activeCue = cues[0] as TextTrackCue;
              break;
            }
          }
        }

        if (activeCue) {
          const cueText = activeCue.text || '';
          setActiveCueText(cueText);
        } else {
          setActiveCueText(null);
          if (currentSubtitle) {
            setCurrentSubtitle(null);
            if (onSubtitleChange) {
              onSubtitleChange(null);
            }
          }
        }
      }

      // 完了チェック
      if (onComplete && !completed && video.duration > 0) {
        const progress = (video.currentTime / video.duration) * 100;
        if (progress >= 95) {
          onComplete();
        }
      }
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    // TextTrackの変更を監視
    const handleTrackChange = () => {
      const textTracks = video.textTracks;
      for (let i = 0; i < textTracks.length; i++) {
        const track = textTracks[i];
        // 字幕トラックを自動的に有効化
        if (track.kind === 'subtitles' && subtitleUrl) {
          track.mode = 'showing';
        }
      }
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('error', handleError);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('loadedmetadata', handleTrackChange);

    // 動画のURLを設定
    video.src = url;
    video.load();

    // TextTrackが読み込まれたら自動的に有効化
    const textTracks = video.textTracks;
    for (let i = 0; i < textTracks.length; i++) {
      const track = textTracks[i];
      track.addEventListener('load', () => {
        if (track.kind === 'subtitles' && subtitleUrl) {
          track.mode = 'showing';
        }
      });
      if (track.kind === 'subtitles' && subtitleUrl && track.readyState === 2) {
        track.mode = 'showing';
      }
    }

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('error', handleError);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('loadedmetadata', handleTrackChange);
      
      // TextTrackのイベントリスナーを削除
      const textTracks = video.textTracks;
      for (let i = 0; i < textTracks.length; i++) {
        const track = textTracks[i];
        track.removeEventListener('load', handleTrackChange);
      }
    };
  }, [url, subtitleUrl]); // subtitles, onComplete, completed, onSubtitleChangeは依存配列から除外（クロージャでキャプチャ）

  return (
    <div className="relative group aspect-video bg-black rounded-lg overflow-hidden video-player-container">
      {isLoading && (
        <div className="absolute inset-0 flex justify-center items-center bg-gray-900 z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex flex-col justify-center items-center bg-gray-900 p-4 z-10">
          <div className="text-red-500 text-center mb-2 font-semibold">動画の読み込みに失敗しました</div>
          <div className="text-sm text-gray-400 text-center break-all">{error}</div>
        </div>
      )}
      
      {/* YouTube動画の場合はiframeで埋め込み、それ以外はHTML5 video要素を使用 */}
      {getYouTubeId(url) ? (
        <div className="w-full h-full">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${getYouTubeId(url)}?enablejsapi=1&rel=0`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <video
          ref={videoRef}
          className="w-full h-full"
          controls
          playsInline
          preload="metadata"
        >
          {subtitleUrl && (
            <track
              kind="subtitles"
              srcLang="en"
              src={subtitleUrl}
              label="English"
              default
            />
          )}
        </video>
      )}
      
      {/* 動画内に字幕をオーバーレイ表示（subtitles配列から取得した字幕を使用） */}
      {currentSubtitle && (
        <div className="absolute bottom-20 left-0 right-0 px-4 py-2 pointer-events-none z-30">
          <div className="bg-black bg-opacity-80 text-white text-center rounded-lg px-6 py-3 max-w-5xl mx-auto shadow-2xl">
            {/* 英語字幕 */}
            <div className="text-xl font-semibold mb-1">{currentSubtitle.text}</div>
            {/* 日本語翻訳 */}
            {currentSubtitle.translation && (
              <div className="text-base text-gray-200">{currentSubtitle.translation}</div>
            )}
          </div>
        </div>
      )}
      
      {/* TextTrack APIから取得した字幕（subtitles配列がない場合のフォールバック） */}
      {!currentSubtitle && activeCueText && (
        <div className="absolute bottom-20 left-0 right-0 px-4 py-2 pointer-events-none z-30">
          <div className="bg-black bg-opacity-80 text-white text-center rounded-lg px-6 py-3 max-w-5xl mx-auto shadow-2xl">
            <div className="text-xl font-semibold">{activeCueText}</div>
          </div>
        </div>
      )}

      {/* 完了バッジ */}
      {completed && (
        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded z-20">
          完了
        </div>
      )}
    </div>
  );
});

SimpleVideoPlayer.displayName = 'SimpleVideoPlayer';

export default SimpleVideoPlayer;

