import {
  isStorageUploadFileNameAllowed,
  STORAGE_UPLOAD_FILENAME_HINT,
} from './storage-upload-filename';
import { supabaseAdmin } from './supabase';

export { STORAGE_UPLOAD_FILENAME_HINT, isStorageUploadFileNameAllowed } from './storage-upload-filename';

export const CONTAINERS = {
  UNIVERSITY_IMAGES: 'university-images',
  PROGRAMMING_VIDEOS: 'programming-videos',
  PROGRAMMING_THUMBNAILS: 'programming-thumbnails',
  CERTIFICATION_VIDEOS: 'certification-videos',
  CERTIFICATION_THUMBNAILS: 'certification-thumbnails',
  CERTIFICATION_IMAGES: 'certification-images',
  ENGLISH_NEWS_AUDIO: 'english-news-audio',
  ENGLISH_NEWS_IMAGES: 'english-news-images',
  ENGLISH_MOVIES: 'english-movies',
  PROGRAMMING_SLIDES: 'programming-slides',
} as const;

export class StorageUploadFileNameError extends Error {
  constructor(message: string = STORAGE_UPLOAD_FILENAME_HINT) {
    super(message);
    this.name = 'StorageUploadFileNameError';
  }
}

/**
 * アップロード時のストレージキー `${Date.now()}-${fileName}` になる前提で、fileName を検証する。
 */
export function assertStorageUploadFileName(fileName: string): void {
  if (!isStorageUploadFileNameAllowed(fileName)) {
    throw new StorageUploadFileNameError();
  }
}

export async function generateSasToken(bucketName: string, fileName: string): Promise<string> {
  const { data, error } = await supabaseAdmin!
    .storage
    .from(bucketName)
    .createSignedUrl(fileName, 3600);

  if (error) throw error;
  return data.signedUrl;
}

export async function generateSasUrl(url: string): Promise<string> {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/').filter(Boolean);
    const objectIdx = pathParts.indexOf('object');
    if (objectIdx >= 0 && pathParts[objectIdx + 1] === 'public') {
      const bucketName = pathParts[objectIdx + 2];
      const fileName = pathParts.slice(objectIdx + 3).join('/');
      return generateSasToken(bucketName, decodeURIComponent(fileName));
    }
    const publicIdx = pathParts.indexOf('public');
    if (publicIdx >= 0 && pathParts[publicIdx + 1]) {
      const bucketName = pathParts[publicIdx + 1];
      const fileName = pathParts.slice(publicIdx + 2).join('/');
      return generateSasToken(bucketName, decodeURIComponent(fileName));
    }
    if (pathParts.length >= 2) {
      const bucketName = pathParts[pathParts.length - 2];
      const fileName = pathParts[pathParts.length - 1];
      return generateSasToken(bucketName, decodeURIComponent(fileName));
    }
    throw new Error('Invalid storage URL format');
  } catch (error) {
    console.error('Error generating signed URL:', error);
    throw error;
  }
}

export async function uploadFile(
  bucketName: string,
  file: Buffer,
  fileName: string,
  contentType: string
): Promise<string> {
  assertStorageUploadFileName(fileName);
  const safeFileName = `${Date.now()}-${fileName}`;
  const { error } = await supabaseAdmin!
    .storage
    .from(bucketName)
    .upload(safeFileName, file, {
      contentType,
      upsert: false,
    });

  if (error) throw error;

  const { data } = supabaseAdmin!
    .storage
    .from(bucketName)
    .getPublicUrl(safeFileName);

  return data.publicUrl;
}

/** 動画タイプ → ストレージバケット名（/api/upload/video と共通） */
export function bucketNameForVideoUploadType(
  type: string,
  englishMoviesBucket: string
): string {
  switch (type) {
    case 'english':
      return englishMoviesBucket;
    case 'certification':
      return CONTAINERS.CERTIFICATION_VIDEOS;
    case 'programming':
      return CONTAINERS.PROGRAMMING_VIDEOS;
    default:
      throw new Error('Invalid video type');
  }
}

/**
 * 大容量動画は Next サーバー経由で Buffer 化すると undici が write ERANGE を起こすことがあるため、
 * ブラウザから Supabase へ直接 PUT するための署名付きアップロード URL を発行する。
 */
export async function createVideoSignedUpload(
  bucketName: string,
  fileName: string
): Promise<{ signedUrl: string; publicUrl: string; storagePath: string }> {
  assertStorageUploadFileName(fileName);
  const storagePath = `${Date.now()}-${fileName}`;
  const { data, error } = await supabaseAdmin!
    .storage
    .from(bucketName)
    .createSignedUploadUrl(storagePath);

  if (error) throw error;
  if (!data?.signedUrl) throw new Error('署名付きアップロード URL の取得に失敗しました');

  const { data: pub } = supabaseAdmin!.storage.from(bucketName).getPublicUrl(storagePath);

  return {
    signedUrl: data.signedUrl,
    publicUrl: pub.publicUrl,
    storagePath,
  };
}

export async function deleteFile(bucketName: string, url: string): Promise<void> {
  const fileName = url.split('/').pop()?.split('?')[0];
  if (!fileName) throw new Error('Invalid file URL');

  const { error } = await supabaseAdmin!
    .storage
    .from(bucketName)
    .remove([fileName]);

  if (error) throw error;
}
