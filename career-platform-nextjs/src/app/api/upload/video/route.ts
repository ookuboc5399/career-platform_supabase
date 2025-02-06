import { NextResponse } from 'next/server';
import { uploadFile, CONTAINERS } from '@/lib/storage';

// ファイルサイズ制限の設定（新しい形式）
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('video') as File;
    const type = formData.get('type') as string; // 'certification', 'programming', or 'english'
    
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

    // コンテナの選択
    let containerName;
    switch (type) {
      case 'certification':
        containerName = CONTAINERS.CERTIFICATION_VIDEOS;
        break;
      case 'programming':
        containerName = CONTAINERS.PROGRAMMING_VIDEOS;
        break;
      case 'english':
        containerName = CONTAINERS.ENGLISH_MOVIES;
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid video type' },
          { status: 400 }
        );
    }

    // Blobストレージにアップロード
    const url = await uploadFile(
      containerName,
      buffer,
      file.name,
      file.type
    );

    return NextResponse.json({ url });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
