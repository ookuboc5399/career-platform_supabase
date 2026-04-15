import { NextResponse } from 'next/server';
import { uploadFile, CONTAINERS, bucketNameForVideoUploadType, StorageUploadFileNameError } from '@/lib/storage';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const DEFAULT_BUCKET = process.env.SUPABASE_ENGLISH_MOVIES_BUCKET
  || process.env.NEXT_PUBLIC_SUPABASE_ENGLISH_MOVIES_BUCKET
  || CONTAINERS.ENGLISH_MOVIES;

/** サーバー経由は小さめのみ（大きいファイルは /api/upload/video/prepare + クライアント直接 PUT） */
const SERVER_PROXY_MAX_BYTES = 8 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('video') as File;
    const type = formData.get('type') as string;
    const duration = formData.get('duration') as string | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    if (!file.type.startsWith('video/')) {
      return NextResponse.json(
        { error: 'Invalid file type. Only video files are allowed.' },
        { status: 400 }
      );
    }

    const maxSize = 500 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 500MB limit.' },
        { status: 400 }
      );
    }

    if (file.size > SERVER_PROXY_MAX_BYTES) {
      return NextResponse.json(
        {
          error:
            'このサイズの動画はサーバー経由ではアップロードできません。最新の画面から再度お試しください（署名付き URL で直接アップロードされます）。',
          usePrepareFlow: true,
        },
        { status: 413 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let bucketName: string;
    try {
      bucketName = bucketNameForVideoUploadType(type, DEFAULT_BUCKET);
    } catch {
      return NextResponse.json({ error: 'Invalid video type' }, { status: 400 });
    }

    const url = await uploadFile(bucketName, buffer, file.name, file.type);

    const durationSeconds = duration ? parseFloat(duration) : 0;

    return NextResponse.json({
      url,
      duration: durationSeconds,
      storagePath: url.split('/').pop()?.split('?')[0],
    });
  } catch (error) {
    console.error('Upload error:', error);
    if (error instanceof StorageUploadFileNameError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
