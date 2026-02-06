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
  subtitleUrl?: string;
}

export interface EnglishVideoPlayerHandle {
  seekTo: (time: number) => void;
}

const getYouTubeId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

const getVideoMimeType = (sourceUrl: string) => {
  if (sourceUrl.endsWith('.m3u8')) {
    return 'application/x-mpegURL';
  }
  if (sourceUrl.endsWith('.mpd')) {
    return 'application/dash+xml';
  }
  if (sourceUrl.endsWith('.webm')) {
    return 'video/webm';
  }
  if (sourceUrl.endsWith('.ogv')) {
    return 'video/ogg';
  }
  return 'video/mp4';
};

const EnglishVideoPlayer = forwardRef<EnglishVideoPlayerHandle, EnglishVideoPlayerProps>(({ 
  url,
  onComplete,
  completed = false,
  subtitles = [],
  onSubtitleChange,
  subtitleUrl
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
    console.log('========================================');
    console.log('[EnglishVideoPlayer] useEffect triggered');
    console.log('========================================');
    console.log('[EnglishVideoPlayer] videoRef.current:', videoRef.current);
    console.log('[EnglishVideoPlayer] url:', url);
    console.log('[EnglishVideoPlayer] subtitles count:', subtitles.length);
    console.log('[EnglishVideoPlayer] subtitleUrl:', subtitleUrl);
    console.log('========================================');
    
    // videoRefが設定されるまで待つ（dynamic importのため、マウントタイミングが遅れる可能性がある）
    let retryCount = 0;
    const MAX_RETRIES = 50; // 最大50回（約1秒）リトライ
    
    const checkVideoRef = () => {
      if (!videoRef.current) {
        retryCount++;
        if (retryCount >= MAX_RETRIES) {
          console.error('[EnglishVideoPlayer] videoRef.current is still null after max retries');
          setError('動画プレーヤーの初期化に失敗しました: video要素が見つかりません');
          setIsLoading(false);
          return;
        }
        console.log(`[EnglishVideoPlayer] videoRef.current is null, retrying... (${retryCount}/${MAX_RETRIES})`);
        // 次のフレームで再試行
        requestAnimationFrame(checkVideoRef);
        return;
      }
      
      console.log('[EnglishVideoPlayer] videoRef.current found, proceeding with initialization');
      // initializePlayerを呼び出す（checkDOMAndInitializeはinitializePlayer内で定義される）
      initializePlayer();
    };
    
    const initializePlayer = () => {
      if (!videoRef.current) {
        console.warn('[EnglishVideoPlayer] videoRef.current is still null after retry');
        return;
      }

    const youtubeId = getYouTubeId(url);
    const isYouTube = Boolean(youtubeId);
    
    // URLを正しくエンコード（アポストロフィなどの特殊文字を処理）
    let videoUrl: string;
    if (isYouTube) {
      videoUrl = `https://www.youtube.com/watch?v=${youtubeId}`;
    } else {
      // Supabase StorageのURLの場合、パス部分を正しくエンコード
      try {
        const urlObj = new URL(url);
        console.log('[EnglishVideoPlayer] Original URL pathname:', urlObj.pathname);
        
        // パス部分全体をエンコード
        // パスをスラッシュで分割し、各セグメントを個別にエンコード
        const pathParts = urlObj.pathname.split('/').filter(Boolean);
        console.log('[EnglishVideoPlayer] Path parts before encoding:', pathParts);
        
        const encodedPathParts = pathParts.map((part, index) => {
          // 最後の部分（ファイル名）のみエンコード
          if (index === pathParts.length - 1 && part) {
            // 各セグメントをデコードしてから再エンコード（二重エンコードを防ぐ）
            try {
              const decoded = decodeURIComponent(part);
              console.log(`[EnglishVideoPlayer] Decoded part ${index}:`, decoded);
              // アポストロフィなどの特殊文字を正しくエンコード
              // encodeURIComponentはアポストロフィを%27にエンコードするはずですが、
              // 念のため、手動でエンコードを確認
              const encoded = encodeURIComponent(decoded);
              console.log(`[EnglishVideoPlayer] Encoded part ${index}:`, encoded);
              console.log(`[EnglishVideoPlayer] Encoding check - ' in decoded:`, decoded.includes("'"));
              console.log(`[EnglishVideoPlayer] Encoding check - %27 in encoded:`, encoded.includes("%27"));
              
              // エンコードが正しく行われているか確認
              // encodeURIComponentはアポストロフィを%27にエンコードするはずですが、
              // 念のため確認して、正しくエンコードされていない場合は手動でエンコード
              if (decoded.includes("'")) {
                if (!encoded.includes("%27")) {
                  console.warn(`[EnglishVideoPlayer] Apostrophe not encoded correctly! Decoded: ${decoded}, Encoded: ${encoded}`);
                  // 手動でアポストロフィとスペースをエンコード
                  const manuallyEncoded = decoded
                    .replace(/'/g, "%27")
                    .replace(/ /g, "%20");
                  console.log(`[EnglishVideoPlayer] Manually encoded:`, manuallyEncoded);
                  return manuallyEncoded;
                } else {
                  console.log(`[EnglishVideoPlayer] Apostrophe correctly encoded as %27`);
                }
              }
              
              return encoded;
            } catch (error) {
              // デコードできない場合は既にエンコードされているのでそのまま
              console.log(`[EnglishVideoPlayer] Part ${index} already encoded:`, part, error);
              return part;
            }
          }
          return part;
        });
        
        urlObj.pathname = '/' + encodedPathParts.join('/');
        videoUrl = urlObj.toString();
        console.log('[EnglishVideoPlayer] Final encoded URL:', videoUrl);
      } catch (error) {
        // URLのパースに失敗した場合は元のURLを使用
        console.warn('[EnglishVideoPlayer] Failed to parse URL, using original:', error);
        videoUrl = url;
      }
    }
    
    console.log('========================================');
    console.log('[EnglishVideoPlayer] URL Processing');
    console.log('========================================');
    console.log('[EnglishVideoPlayer] Original URL:', url);
    console.log('[EnglishVideoPlayer] Normalized URL:', videoUrl);
    console.log('[EnglishVideoPlayer] Is YouTube:', isYouTube);
    console.log('[EnglishVideoPlayer] URL changed:', url !== videoUrl);
    console.log('========================================');

    const options = {
      controls: true,
      fluid: true,
      playbackRates: [0.5, 1, 1.5, 2],
      techOrder: isYouTube ? ['youtube', 'html5'] : ['html5', 'youtube'],
      sources: [{
        src: videoUrl,
        type: isYouTube ? 'video/youtube' : getVideoMimeType(videoUrl)
      }],
      youtube: isYouTube ? {
        iv_load_policy: 3,
        modestbranding: 1,
        ytControls: 2,
        playsinline: 1
      } : undefined
    };

    console.log('========================================');
    console.log('[EnglishVideoPlayer] Video.js Options');
    console.log('========================================');
    console.log('[EnglishVideoPlayer] Options:', JSON.stringify(options, null, 2));
    console.log('[EnglishVideoPlayer] Video element:', videoRef.current);
    console.log('[EnglishVideoPlayer] Video element exists:', !!videoRef.current);
    console.log('========================================');

    try {
      if (isYouTube && !videojs.getTech('Youtube')) {
        console.error('[EnglishVideoPlayer] YouTube tech not found');
        throw new Error('YouTube tech not found');
      }

      console.log('[EnglishVideoPlayer] Initializing Video.js player...');
      
      // DOMに要素が含まれているか確認
      const checkDOMAndInitialize = () => {
        if (!videoRef.current) {
          console.error('[EnglishVideoPlayer] videoRef.current is null');
          return;
        }
        
        // DOMに含まれているか確認（parentElementが存在し、かつdocument.bodyに含まれているか）
        const isInDOM = videoRef.current.parentElement !== null && document.body.contains(videoRef.current);
        
        if (!isInDOM) {
          console.warn('[EnglishVideoPlayer] Video element is not in DOM yet, retrying in next frame...');
          // DOMに含まれていない場合は、次のフレームで再試行
          requestAnimationFrame(() => {
            checkDOMAndInitialize();
          });
          return;
        }
        
        console.log('[EnglishVideoPlayer] Video element is in DOM, initializing Video.js...');
        initializeVideoJS();
      };
      
      const initializeVideoJS = () => {
        if (!videoRef.current) {
          console.error('[EnglishVideoPlayer] videoRef.current is null in initializeVideoJS');
          return;
        }
        
        console.log('[EnglishVideoPlayer] Video element parent:', videoRef.current.parentElement);
        console.log('[EnglishVideoPlayer] Video element in DOM:', document.body.contains(videoRef.current));
        console.log('[EnglishVideoPlayer] Video element offsetParent:', videoRef.current.offsetParent);
        
        // Video.jsを初期化する前に、既存のプレーヤーを破棄
        if (playerRef.current && !playerRef.current.isDisposed()) {
          console.log('[EnglishVideoPlayer] Disposing existing player before reinitializing');
          try {
            playerRef.current.dispose();
          } catch (disposeError) {
            console.warn('[EnglishVideoPlayer] Error disposing existing player:', disposeError);
          }
          playerRef.current = null;
        }
        
        const player = videojs(videoRef.current, options, function onPlayerReady() {
        console.log('========================================');
        console.log('[EnglishVideoPlayer] Player is ready');
        console.log('========================================');
        console.log('[EnglishVideoPlayer] Player object:', player);
        console.log('[EnglishVideoPlayer] Player source:', player.src());
        console.log('[EnglishVideoPlayer] Player currentSrc:', player.currentSrc());
        console.log('[EnglishVideoPlayer] Player readyState:', player.readyState());
        
        // ソースが設定されているか確認
        if (!player.currentSrc()) {
          console.warn('[EnglishVideoPlayer] No source set, attempting to set source manually...');
          player.src({
            src: videoUrl,
            type: isYouTube ? 'video/youtube' : getVideoMimeType(videoUrl)
          });
          player.load();
        }
        
        setIsLoading(false);
      });

      playerRef.current = player;
      console.log('[EnglishVideoPlayer] Player initialized, ref set');
      
      // プレーヤーが準備完了する前にソースを確認
      player.ready(() => {
        console.log('[EnglishVideoPlayer] Player ready callback fired');
        console.log('[EnglishVideoPlayer] Current source:', player.currentSrc());
        if (!player.currentSrc()) {
          console.warn('[EnglishVideoPlayer] No source in ready callback, setting manually...');
          player.src({
            src: videoUrl,
            type: isYouTube ? 'video/youtube' : getVideoMimeType(videoUrl)
          });
          player.load();
        }
      });

      const attachSubtitleTrack = (trackUrl?: string) => {
        if (!playerRef.current) {
          return;
        }

        const remoteTracks = playerRef.current.remoteTextTracks();
        const tracksArray = Array.from(remoteTracks ?? []);
        tracksArray.forEach((track) => playerRef.current?.removeRemoteTextTrack(track));

        if (!trackUrl) {
          return;
        }

        playerRef.current.addRemoteTextTrack({
          src: trackUrl,
          kind: 'subtitles',
          srclang: 'en',
          label: 'Subtitles',
          default: true,
        }, false);
      };

      attachSubtitleTrack(subtitleUrl);

      // 字幕の変更を監視
      // 字幕の更新（subtitlesとonSubtitleChangeはクロージャでキャプチャ）
      player.on('timeupdate', () => {
        const currentTime = player.currentTime();
        if (typeof currentTime === 'number' && subtitles && subtitles.length > 0) {
          const currentSubtitle = subtitles.find(
            sub => currentTime >= sub.startTime && currentTime <= sub.endTime
          );
          if (onSubtitleChange) {
            onSubtitleChange(currentSubtitle || null);
          }
        }
      });

      // 完了の監視（onCompleteとcompletedはクロージャでキャプチャ）
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
        console.error('========================================');
        console.error('[EnglishVideoPlayer] Video.js Error Occurred');
        console.error('========================================');
        console.error('Video URL:', videoUrl);
        console.error('Original URL:', url);
        console.error('Is YouTube:', isYouTube);
        
        if (error) {
          console.error('Error Code:', error.code);
          console.error('Error Message:', error.message);
          console.error('Error Type:', error.type);
          console.error('Full Error Object:', JSON.stringify(error, null, 2));
        } else {
          console.error('Error object is null or undefined');
        }
        
        // ネットワークエラーの詳細を確認
        if (error && error.code === 2) {
          console.error('[Network Error] Attempting to fetch video URL directly...');
          fetch(videoUrl, { method: 'HEAD' })
            .then(response => {
              console.error('[Network Error] HEAD request response:', {
                status: response.status,
                statusText: response.statusText,
                headers: Object.fromEntries(response.headers.entries())
              });
            })
            .catch(fetchError => {
              console.error('[Network Error] HEAD request failed:', fetchError);
            });
        }
        
        console.error('========================================');
        
        // エラーメッセージを詳細化
        let errorMessage = '動画の読み込みに失敗しました';
        if (error) {
          switch (error.code) {
            case 1: // MEDIA_ERR_ABORTED
              errorMessage = '動画の読み込みが中断されました';
              break;
            case 2: // MEDIA_ERR_NETWORK
              errorMessage = `ネットワークエラーが発生しました。動画URLを確認してください: ${videoUrl}`;
              break;
            case 3: // MEDIA_ERR_DECODE
              errorMessage = '動画のデコードに失敗しました。ファイル形式を確認してください。';
              break;
            case 4: // MEDIA_ERR_SRC_NOT_SUPPORTED
              errorMessage = 'サポートされていない動画形式です。';
              break;
            default:
              errorMessage = `動画の読み込みに失敗しました: ${error.message || 'Unknown error'}`;
          }
        }
        
        setError(errorMessage);
        setIsLoading(false);
      });

      // 動画のメタデータ読み込み完了時の処理
      player.on('loadedmetadata', () => {
        console.log('[EnglishVideoPlayer] Video metadata loaded, duration:', player.duration());
      });

      // 動画の読み込み開始時の処理
      player.on('loadstart', () => {
        console.log('========================================');
        console.log('[EnglishVideoPlayer] Video load started');
        console.log('========================================');
        console.log('[EnglishVideoPlayer] URL:', videoUrl);
        console.log('[EnglishVideoPlayer] Player source:', player.src());
        console.log('[EnglishVideoPlayer] Player currentSrc:', player.currentSrc());
        console.log('========================================');
      });

      // 動画の読み込み進行状況
      player.on('loadprogress', () => {
        const buffered = player.buffered();
        if (buffered && buffered.length > 0) {
          console.log('[EnglishVideoPlayer] Load progress:', {
            bufferedStart: buffered.start(0),
            bufferedEnd: buffered.end(0),
            duration: player.duration()
          });
        }
      });

      // 動画の読み込みが停止した場合
      player.on('stalled', () => {
        console.error('[EnglishVideoPlayer] Video loading stalled');
      });

      // 動画の読み込みが中断された場合
      player.on('abort', () => {
        console.error('[EnglishVideoPlayer] Video loading aborted');
      });

      // 動画のソースが変更された場合
      player.on('sourceset', () => {
        console.log('[EnglishVideoPlayer] Source set');
      });

      return () => {
        attachSubtitleTrack(undefined);
      };
      };
      
      // DOMチェックと初期化を実行
      // 次のフレームで実行（DOMが確実にマウントされた後）
      requestAnimationFrame(() => {
        checkDOMAndInitialize();
      });

    } catch (error) {
      console.error('========================================');
      console.error('[EnglishVideoPlayer] Error initializing video.js');
      console.error('========================================');
      console.error('[EnglishVideoPlayer] Error:', error);
      if (error instanceof Error) {
        console.error('[EnglishVideoPlayer] Error name:', error.name);
        console.error('[EnglishVideoPlayer] Error message:', error.message);
        console.error('[EnglishVideoPlayer] Error stack:', error.stack);
      }
      console.error('[EnglishVideoPlayer] Video element:', videoRef.current);
      console.error('[EnglishVideoPlayer] Video URL:', videoUrl);
      console.error('========================================');
      setError(`動画プレーヤーの初期化に失敗しました: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsLoading(false);
    }
    };
    
    // 初期化を開始
    checkVideoRef();
    
    return () => {
      console.log('[EnglishVideoPlayer] Cleanup: Starting cleanup...');
      if (playerRef.current) {
        try {
          console.log('[EnglishVideoPlayer] Cleanup: Disposing video.js player');
          if (!playerRef.current.isDisposed()) {
            playerRef.current.dispose();
          }
        } catch (disposeError) {
          console.warn('[EnglishVideoPlayer] Cleanup: Error disposing player:', disposeError);
        } finally {
          playerRef.current = null;
        }
      }
      console.log('[EnglishVideoPlayer] Cleanup: Cleanup complete');
    };
  }, [url, subtitleUrl]); // subtitles, onComplete, completed, onSubtitleChangeは依存配列から除外（安定した参照を期待）

  return (
    <div className="relative group aspect-video">
      {isLoading && (
        <div className="absolute inset-0 flex justify-center items-center bg-gray-100 z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex flex-col justify-center items-center bg-gray-100 p-4 z-10">
          <div className="text-red-500 text-center mb-2">動画の読み込みに失敗しました</div>
          <div className="text-sm text-gray-600 text-center break-all">{error}</div>
        </div>
      )}
      
      {/* video要素は常にレンダリング（refを設定するため） */}
      <div data-vjs-player className="w-full h-full">
        <video
          ref={videoRef}
          className="video-js vjs-big-play-centered w-full h-full"
          playsInline
        />
      </div>

      {/* 完了バッジ */}
      {completed && (
        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded z-20">
          完了
        </div>
      )}
    </div>
  );
});

EnglishVideoPlayer.displayName = 'EnglishVideoPlayer';

export default EnglishVideoPlayer;
