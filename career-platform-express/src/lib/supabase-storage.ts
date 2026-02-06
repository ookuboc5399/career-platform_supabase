import { supabaseAdmin } from './supabase';
import { v4 as uuidv4 } from 'uuid';

// バケット名の定義
export const BUCKETS = {
  CERTIFICATION_IMAGES: 'certification-images',
  CERTIFICATION_DATA: 'certification-data',
  CERTIFICATION_VIDEOS: 'certification-videos',
  CERTIFICATION_THUMBNAILS: 'certification-thumbnails',
  UNIVERSITY_DATA: 'university-data',
  UNIVERSITY_IMAGES: 'university-images',
  PROGRAMMING_VIDEOS: 'programming-videos',
  PROGRAMMING_THUMBNAILS: 'programming-thumbnails',
} as const;

/**
 * ファイル名を安全な形式に変換する
 * @param filename オリジナルのファイル名
 * @returns 安全なファイル名
 */
function getSafeFileName(filename: string): string {
  const extension = filename.split('.').pop() || '';
  return `${uuidv4()}.${extension}`;
}

/**
 * ファイルをSupabase Storageにアップロードする
 * @param bucketName バケット名
 * @param buffer ファイルのバッファ
 * @param filename ファイル名
 * @param contentType MIMEタイプ
 * @returns アップロードされたファイルのURL
 */
export async function uploadFile(
  bucketName: string,
  buffer: Buffer,
  filename: string,
  contentType: string
): Promise<string> {
  try {
    console.log('\n=== File Upload Started (Supabase) ===');
    console.log('Bucket:', bucketName);
    console.log('Original Filename:', filename);
    console.log('Content Type:', contentType);
    console.log('Buffer Size:', buffer.length);

    const safeFileName = getSafeFileName(filename);
    console.log('Safe filename:', safeFileName);

    // Supabase Storageにアップロード
    const { data, error } = await supabaseAdmin!
      .storage
      .from(bucketName)
      .upload(safeFileName, buffer, {
        contentType,
        upsert: false,
      });

    if (error) {
      console.error('Supabase upload error:', error);
      throw new Error(`Failed to upload file: ${error.message}`);
    }

    // 公開URLを取得
    const { data: urlData } = supabaseAdmin!
      .storage
      .from(bucketName)
      .getPublicUrl(safeFileName);

    const publicUrl = urlData.publicUrl;
    console.log('Upload successful. URL:', publicUrl);
    return publicUrl;

  } catch (error) {
    console.error('\n=== Error in File Upload ===');
    console.error('Error details:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    throw new Error(`Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * JSONデータをSupabase Storageに保存する
 * @param bucketName バケット名
 * @param filename ファイル名
 * @param data JSONデータ
 */
export async function saveJsonData(
  bucketName: string,
  filename: string,
  data: any
): Promise<void> {
  try {
    console.log('\n=== JSON Data Save Started (Supabase) ===');
    console.log('Bucket:', bucketName);
    console.log('Filename:', filename);

    const content = JSON.stringify(data, null, 2);
    const buffer = Buffer.from(content, 'utf-8');

    const { error } = await supabaseAdmin!
      .storage
      .from(bucketName)
      .upload(filename, buffer, {
        contentType: 'application/json',
        upsert: true, // 既存ファイルを上書き
      });

    if (error) {
      console.error('Error saving JSON data:', error);
      throw new Error(`Failed to save JSON data: ${error.message}`);
    }

    console.log('JSON data saved successfully');

  } catch (error) {
    console.error('\n=== Error in JSON Data Save ===');
    console.error('Error details:', error);
    throw new Error(`Failed to save JSON data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * JSONデータをSupabase Storageから読み込む
 * @param bucketName バケット名
 * @param filename ファイル名
 * @returns JSONデータ
 */
export async function loadJsonData(
  bucketName: string,
  filename: string
): Promise<any> {
  try {
    console.log('\n=== JSON Data Load Started (Supabase) ===');
    console.log('Bucket:', bucketName);
    console.log('Filename:', filename);

    const { data, error } = await supabaseAdmin!
      .storage
      .from(bucketName)
      .download(filename);

    if (error) {
      if (error.message.includes('not found')) {
        console.log('File does not exist, returning empty array');
        return [];
      }
      throw error;
    }

    if (!data) {
      console.log('File does not exist, returning empty array');
      return [];
    }

    // BlobをArrayBufferに変換
    const arrayBuffer = await data.arrayBuffer();
    const content = Buffer.from(arrayBuffer).toString('utf-8');
    
    console.log('JSON data loaded successfully');
    return JSON.parse(content);

  } catch (error) {
    console.error('\n=== Error in JSON Data Load ===');
    console.error('Error details:', error);
    if (error instanceof Error && error.message.includes('not found')) {
      return [];
    }
    throw new Error(`Failed to load JSON data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * ファイルをSupabase Storageから削除する
 * @param bucketName バケット名
 * @param url ファイルのURL
 */
export async function deleteFile(bucketName: string, url: string): Promise<void> {
  try {
    console.log('\n=== File Deletion Started (Supabase) ===');
    console.log('Bucket:', bucketName);
    console.log('URL:', url);

    // URLからファイル名を抽出
    // Supabase StorageのURL形式: https://<project>.supabase.co/storage/v1/object/public/<bucket>/<filename>
    const urlParts = url.split('/');
    const filename = urlParts[urlParts.length - 1].split('?')[0]; // クエリパラメータを除去
    
    if (!filename) {
      throw new Error('Invalid file URL');
    }

    console.log('Filename:', filename);

    const { error } = await supabaseAdmin!
      .storage
      .from(bucketName)
      .remove([filename]);

    if (error) {
      console.error('Error deleting file:', error);
      throw new Error(`Failed to delete file: ${error.message}`);
    }

    console.log('Deletion successful');

  } catch (error) {
    console.error('\n=== Error in File Deletion ===');
    console.error('Error details:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    throw new Error(`Failed to delete file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * 署名付きURLを生成する（一時的なアクセス用）
 * @param bucketName バケット名
 * @param filename ファイル名
 * @param expiresIn 有効期限（秒）。デフォルトは1時間
 * @returns 署名付きURL
 */
export async function generateSignedUrl(
  bucketName: string,
  filename: string,
  expiresIn: number = 3600
): Promise<string> {
  const { data, error } = await supabaseAdmin!
    .storage
    .from(bucketName)
    .createSignedUrl(filename, expiresIn);

  if (error) {
    throw new Error(`Failed to generate signed URL: ${error.message}`);
  }

  return data.signedUrl;
}

