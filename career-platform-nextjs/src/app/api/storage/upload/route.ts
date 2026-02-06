import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

// バケット名のマッピング
const BUCKET_MAP: { [key: string]: string } = {
  'university-image': 'university-images',
  'programming-video': 'programming-videos',
  'programming-thumbnail': 'programming-thumbnails',
  'certification-image': 'certification-images',
  'certification-video': 'certification-videos',
  'certification-thumbnail': 'certification-thumbnails',
};

function getSafeFileName(filename: string): string {
  const extension = filename.split('.').pop() || '';
  return `${uuidv4()}.${extension}`;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const bucketName = BUCKET_MAP[type];
    if (!bucketName) {
        return NextResponse.json(
          { error: 'Invalid file type' },
          { status: 400 }
        );
    }

    const buffer = await file.arrayBuffer();
    const safeFileName = getSafeFileName(file.name);

    // Supabase Storageにアップロード
    const { data, error } = await supabaseAdmin!
      .storage
      .from(bucketName)
      .upload(safeFileName, buffer, {
        contentType: file.type,
        upsert: false,
    });

    if (error) {
      console.error('Supabase upload error:', error);
      return NextResponse.json(
        { error: 'Upload failed: ' + error.message },
        { status: 500 }
      );
    }

    // 公開URLを取得
    const { data: urlData } = supabaseAdmin!
      .storage
      .from(bucketName)
      .getPublicUrl(safeFileName);

    return NextResponse.json({ url: urlData.publicUrl });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}
