import { NextResponse } from 'next/server';
import { uploadFile, CONTAINERS } from '@/lib/storage';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('video') as File;
    const type = formData.get('type') as string; // 'certification' or 'programming'
    
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
    const containerName = type === 'certification' ? 
      CONTAINERS.CERTIFICATION_VIDEOS : 
      CONTAINERS.PROGRAMMING_VIDEOS;

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

// ファイルサイズ制限の設定
export const config = {
  api: {
    bodyParser: false,
  },
};
