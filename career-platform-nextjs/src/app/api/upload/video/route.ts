import { NextResponse } from 'next/server';
import { uploadFile, CONTAINERS } from '@/lib/storage';
import { supabaseAdmin } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

// ファイルサイズ制限の設定（新しい形式）
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const DEFAULT_BUCKET = process.env.SUPABASE_ENGLISH_MOVIES_BUCKET
  || process.env.NEXT_PUBLIC_SUPABASE_ENGLISH_MOVIES_BUCKET
  || 'english-movies';

function getSafeFileName(filename: string): string {
  const extension = filename.split('.').pop() || 'mp4';
  return `${uuidv4()}.${extension}`;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('video') as File;
    const type = formData.get('type') as string; // 'certification', 'programming', or 'english'
    const duration = formData.get('duration') as string | null; // クライアント側で取得したduration
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // ファイルタイプの検証
    if (!file.type.startsWith('video/')) {
      return NextResponse.json(
        { error: 'Invalid file type. Only video files are allowed.' },
        { status: 400 }
      );
    }

    // ファイルサイズの検証（500MB）
    const maxSize = 500 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 500MB limit.' },
        { status: 400 }
      );
    }

    // ファイルをArrayBufferに変換
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let url: string;
    let storagePath: string | undefined;

    // typeが'english'の場合はSupabase Storageにアップロード
    if (type === 'english') {
      const safeFileName = getSafeFileName(file.name);
      
      // Supabase Storageにアップロード
      const { data, error } = await supabaseAdmin!
        .storage
        .from(DEFAULT_BUCKET)
        .upload(safeFileName, buffer, {
          contentType: file.type,
          upsert: false,
        });

      if (error) {
        console.error('Supabase upload error:', error);
        return NextResponse.json(
          { error: `Failed to upload to Supabase: ${error.message}` },
          { status: 500 }
        );
      }

      // 公開URLを取得
      const { data: urlData } = supabaseAdmin!
        .storage
        .from(DEFAULT_BUCKET)
        .getPublicUrl(safeFileName);

      url = urlData.publicUrl;
      storagePath = safeFileName;
    } else {
      // その他のタイプはAzure Blob Storageにアップロード（既存の実装）
      let containerName;
      switch (type) {
        case 'certification':
          containerName = CONTAINERS.CERTIFICATION_VIDEOS;
          break;
        case 'programming':
          containerName = CONTAINERS.PROGRAMMING_VIDEOS;
          break;
        default:
          return NextResponse.json(
            { error: 'Invalid video type' },
            { status: 400 }
          );
      }

      url = await uploadFile(
        containerName,
        buffer,
        file.name,
        file.type
      );
    }

    // durationを数値に変換（秒単位）
    const durationSeconds = duration ? parseFloat(duration) : 0;

    return NextResponse.json({ 
      url,
      duration: durationSeconds,
      storagePath // Supabase Storageのパス（englishの場合のみ）
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
