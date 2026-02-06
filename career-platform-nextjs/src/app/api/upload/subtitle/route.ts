import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const DEFAULT_BUCKET = process.env.SUPABASE_ENGLISH_MOVIES_BUCKET
  || process.env.NEXT_PUBLIC_SUPABASE_ENGLISH_MOVIES_BUCKET
  || 'english-movies';

function getSafeFileName(filename: string): string {
  const extension = filename.split('.').pop() || 'vtt';
  return `${uuidv4()}.${extension}`;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('subtitle') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // ファイルタイプの検証（VTTファイル）
    const validTypes = ['text/vtt', 'text/plain', 'application/x-subrip'];
    const validExtensions = ['.vtt', '.srt'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!validTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only VTT or SRT subtitle files are allowed.' },
        { status: 400 }
      );
    }

    // ファイルサイズの検証（10MB）
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit.' },
        { status: 400 }
      );
    }

    // ファイルをArrayBufferに変換
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const safeFileName = getSafeFileName(file.name);
    
    // Supabase Storageにアップロード
    const { data, error } = await supabaseAdmin!
      .storage
      .from(DEFAULT_BUCKET)
      .upload(safeFileName, buffer, {
        contentType: file.type || 'text/vtt',
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

    return NextResponse.json({ 
      url: urlData.publicUrl,
      storagePath: safeFileName
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}


