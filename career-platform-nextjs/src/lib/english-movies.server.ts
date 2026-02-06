import type { Movie, Subtitle, Vocabulary } from '@/types/english';
import { supabaseAdmin } from '@/lib/supabase';

type SupabaseMovieRow = {
  id: string;
  title: string | null;
  content: Record<string, unknown> | null;
  type: string | null;
  difficulty: string | null;
  created_at: string;
  updated_at: string;
};

const DEFAULT_BUCKET = process.env.SUPABASE_ENGLISH_MOVIES_BUCKET
  || process.env.NEXT_PUBLIC_SUPABASE_ENGLISH_MOVIES_BUCKET
  || 'english-movies';

const MEDIA_BUCKET = DEFAULT_BUCKET;

const toNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
};

const toStringArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === 'string' ? item : null))
      .filter((item): item is string => Boolean(item));
  }
  if (typeof value === 'string') {
    return value.split(',').map((item) => item.trim()).filter(Boolean);
  }
  return [];
};

const toSubtitleArray = (value: unknown): Subtitle[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (!item || typeof item !== 'object') {
        return null;
      }

      const startTime = toNumber((item as Record<string, unknown>).startTime);
      const endTime = toNumber((item as Record<string, unknown>).endTime, startTime);
      const text = typeof (item as Record<string, unknown>).text === 'string'
        ? (item as Record<string, unknown>).text
        : '';
      const translation = typeof (item as Record<string, unknown>).translation === 'string'
        ? (item as Record<string, unknown>).translation
        : '';

      if (!Number.isFinite(startTime) || !Number.isFinite(endTime) || !text) {
        return null;
      }

      return {
        startTime,
        endTime,
        text,
        translation,
      } satisfies Subtitle;
    })
    .filter((item): item is Subtitle => Boolean(item));
};

const toVocabularyArray = (value: unknown): Vocabulary[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (!item || typeof item !== 'object') {
        return null;
      }

      const record = item as Record<string, unknown>;
      const word = typeof record.word === 'string' ? record.word : '';
      const partOfSpeech = typeof record.partOfSpeech === 'string'
        ? record.partOfSpeech
        : 'noun';
      const translation = typeof record.translation === 'string'
        ? record.translation
        : '';
      const example = typeof record.example === 'string'
        ? record.example
        : '';
      const timestamp = toNumber(record.timestamp, 0);

      if (!word) {
        return null;
      }

      return {
        word,
        partOfSpeech: partOfSpeech as Vocabulary['partOfSpeech'],
        translation,
        example,
        timestamp,
      } satisfies Vocabulary;
    })
    .filter((item): item is Vocabulary => Boolean(item));
};

const getPublicUrl = (path?: unknown): string | null => {
  if (typeof path !== 'string' || !path) {
    return null;
  }

  console.log('[getPublicUrl] ========================================');
  console.log('[getPublicUrl] Original path:', path);
  console.log('[getPublicUrl] Bucket:', MEDIA_BUCKET);

  // Supabase StorageのgetPublicUrlは、パスをそのまま使用してURLを生成します
  // 特殊文字（アポストロフィなど）が含まれている場合、URLにそのまま含まれてしまいます
  // そのため、生成されたURLのパス部分を手動でエンコードする必要があります
  
  try {
    const { data, error: supabaseError } = supabaseAdmin.storage.from(MEDIA_BUCKET).getPublicUrl(path);
    
    if (supabaseError) {
      console.error('[getPublicUrl] Supabase getPublicUrl error:', supabaseError);
      return null;
    }
    
    let publicUrl = data?.publicUrl ?? null;
    console.log('[getPublicUrl] Raw public URL from Supabase:', publicUrl);
    
    if (publicUrl) {
      try {
        const urlObj = new URL(publicUrl);
        console.log('[getPublicUrl] Parsed URL:', {
          origin: urlObj.origin,
          pathname: urlObj.pathname,
          search: urlObj.search,
          hash: urlObj.hash
        });
        
        // パス部分をスラッシュで分割し、各セグメントを個別にエンコード
        // Supabase StorageのURL構造: /storage/v1/object/public/{bucket}/{path}
        // 最後の部分（ファイル名）をエンコード
        const pathParts = urlObj.pathname.split('/').filter(Boolean);
        console.log('[getPublicUrl] Path parts before encoding:', pathParts);
        
        if (pathParts.length > 0) {
          // 最後の部分（ファイル名）をエンコード
          const fileName = pathParts[pathParts.length - 1];
          console.log('[getPublicUrl] File name before encoding:', fileName);
          
          try {
            // 既にエンコードされている場合はデコードしてから再エンコード（二重エンコードを防ぐ）
            const decoded = decodeURIComponent(fileName);
            console.log('[getPublicUrl] Decoded file name:', decoded);
            const encoded = encodeURIComponent(decoded);
            console.log('[getPublicUrl] Encoded file name:', encoded);
            pathParts[pathParts.length - 1] = encoded;
          } catch (decodeError) {
            console.warn('[getPublicUrl] Failed to decode file name, using as-is:', decodeError);
            // デコードできない場合は既にエンコードされているのでそのまま
          }
          
          urlObj.pathname = '/' + pathParts.join('/');
          publicUrl = urlObj.toString();
          console.log('[getPublicUrl] Final encoded URL:', publicUrl);
        }
      } catch (error) {
        console.error('[getPublicUrl] Failed to encode URL path:', error);
        if (error instanceof Error) {
          console.error('[getPublicUrl] Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack
          });
        }
        // エンコードに失敗した場合は元のURLを使用
      }
    } else {
      console.error('[getPublicUrl] No public URL returned from Supabase');
    }
    
    console.log('[getPublicUrl] ========================================');
    
    return publicUrl;
  } catch (error) {
    console.error('[getPublicUrl] Unexpected error:', error);
    if (error instanceof Error) {
      console.error('[getPublicUrl] Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
    return null;
  }
};

export const mapSupabaseMovieRow = (row: SupabaseMovieRow): Movie => {
  const content = (row.content ?? {}) as Record<string, unknown>;

  const videoStoragePath = typeof content.videoStoragePath === 'string'
    ? content.videoStoragePath
    : typeof content.video_path === 'string'
      ? content.video_path
      : undefined;
  const subtitleStoragePath = typeof content.subtitleStoragePath === 'string'
    ? content.subtitleStoragePath
    : typeof content.subtitle_path === 'string'
      ? content.subtitle_path
      : undefined;
  const thumbnailStoragePath = typeof content.thumbnailStoragePath === 'string'
    ? content.thumbnailStoragePath
    : typeof content.thumbnail_path === 'string'
      ? content.thumbnail_path
      : undefined;

  const videoUrlFromContent = typeof content.videoUrl === 'string' ? content.videoUrl : undefined;
  const thumbnailUrlFromContent = typeof content.thumbnailUrl === 'string'
    ? content.thumbnailUrl
    : undefined;
  const subtitleUrlFromContent = typeof content.subtitleUrl === 'string'
    ? content.subtitleUrl
    : undefined;

  const levelFromContent = typeof content.level === 'string'
    ? content.level
    : row.difficulty ?? 'beginner';

  const processed = typeof content.processed === 'boolean'
    ? content.processed
    : Boolean(row.type === 'processed');

  const description = typeof content.description === 'string'
    ? content.description
    : '';

  const transcript = typeof content.transcript === 'string'
    ? content.transcript
    : '';

  // isPublishedを正しくブール値に変換（文字列の"true"/"false"にも対応）
  const isPublished = typeof content.isPublished === 'boolean'
    ? content.isPublished
    : typeof content.isPublished === 'string'
      ? content.isPublished.toLowerCase() === 'true'
      : false;

  const error = typeof content.error === 'string' ? content.error : null;

  const lastProcessingTime = typeof content.lastProcessingTime === 'string'
    ? content.lastProcessingTime
    : row.updated_at;

  const lastProcessingStage = typeof content.lastProcessingStage === 'string'
    ? (content.lastProcessingStage as Movie['lastProcessingStage'])
    : undefined;

  const videoUrl = videoUrlFromContent ?? getPublicUrl(videoStoragePath) ?? '';
  const duration = toNumber(content.duration, 0);
  
  // デバッグ: 動画URLの生成過程をログ出力
  if (row.id) {
    console.log(`[mapSupabaseMovieRow] Movie ${row.id}:`, {
      videoUrlFromContent,
      videoStoragePath,
      publicUrl: videoStoragePath ? getPublicUrl(videoStoragePath) : null,
      finalVideoUrl: videoUrl,
      isPublished,
      duration,
      contentDuration: content.duration,
      contentKeys: Object.keys(content)
    });
  }

  return {
    id: row.id,
    title: row.title ?? (typeof content.title === 'string' ? content.title : 'Untitled Movie'),
    description,
    videoUrl,
    videoStoragePath,
    subtitleUrl: subtitleUrlFromContent ?? getPublicUrl(subtitleStoragePath) ?? undefined,
    subtitleStoragePath,
    thumbnailUrl: thumbnailUrlFromContent ?? getPublicUrl(thumbnailStoragePath) ?? undefined,
    thumbnailStoragePath,
    transcript,
    level: (levelFromContent as Movie['level']) ?? 'beginner',
    tags: toStringArray(content.tags),
    subtitles: toSubtitleArray(content.subtitles),
    vocabulary: toVocabularyArray(content.vocabulary),
    processed,
    isPublished,
    createdAt: row.created_at,
    originalTitle: typeof content.originalTitle === 'string' ? content.originalTitle : undefined,
    originalDescription: typeof content.originalDescription === 'string'
      ? content.originalDescription
      : undefined,
    duration: toNumber(content.duration, 0),
    error,
    lastProcessingTime,
    lastProcessingStage,
  } satisfies Movie;
};

export const fetchEnglishMovies = async (): Promise<Movie[]> => {
  // データベース側で直接フィルタリング（効率的）
  // content->>'isPublished' = 'true' の条件でフィルタリング
  const { data, error } = await supabaseAdmin
    .from('english_movies')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[fetchEnglishMovies] Supabase error:', error);
    throw error;
  }

  // マッピングしてからフィルタリング（isPublishedとvideoUrlの両方が必要）
  const movies = (data ?? []).map(mapSupabaseMovieRow);
  
  // デバッグ: フィルタリング前の状態をログ出力
  console.log('[fetchEnglishMovies] Total movies from DB:', movies.length);
  movies.forEach((movie) => {
    console.log(`[fetchEnglishMovies] Movie ${movie.id}:`, {
      title: movie.title,
      isPublished: movie.isPublished,
      hasVideoUrl: !!movie.videoUrl,
      videoUrl: movie.videoUrl ? movie.videoUrl.substring(0, 50) + '...' : 'N/A'
    });
  });

  return movies;
};

export const fetchEnglishMovieById = async (id: string): Promise<Movie | null> => {
  if (!id) {
    console.log('[fetchEnglishMovieById] No ID provided');
    return null;
  }

  console.log('[fetchEnglishMovieById] Fetching movie with ID:', id);
  console.log('[fetchEnglishMovieById] supabaseAdmin initialized:', !!supabaseAdmin);

  try {
    // Supabaseクライアントの確認
    if (!supabaseAdmin) {
      throw new Error('Supabase admin client is not initialized. Please check SUPABASE_SERVICE_ROLE_KEY environment variable.');
    }

    const { data, error } = await supabaseAdmin
      .from('english_movies')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('[fetchEnglishMovieById] Supabase error:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw error;
    }

    if (!data) {
      console.log('[fetchEnglishMovieById] Movie not found in database for ID:', id);
      return null;
    }

    console.log('[fetchEnglishMovieById] Movie found in database:', {
      id: data.id,
      title: data.title,
      hasContent: !!data.content,
      contentKeys: data.content ? Object.keys(data.content) : []
    });

    console.log('[fetchEnglishMovieById] Mapping data...');
    const movie = mapSupabaseMovieRow(data);
    console.log('[fetchEnglishMovieById] Mapped movie:', {
      id: movie.id,
      title: movie.title,
      isPublished: movie.isPublished,
      hasVideoUrl: !!movie.videoUrl,
      videoUrl: movie.videoUrl ? movie.videoUrl.substring(0, 100) + '...' : 'N/A'
    });

    return movie;
  } catch (error) {
    console.error('[fetchEnglishMovieById] Error:', error);
    if (error instanceof Error) {
      console.error('[fetchEnglishMovieById] Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
    throw error;
  }
};


