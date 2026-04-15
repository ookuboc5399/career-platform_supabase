import { NextResponse } from 'next/server';
import {
  CONTAINERS,
  StorageUploadFileNameError,
  bucketNameForVideoUploadType,
  createVideoSignedUpload,
} from '@/lib/storage';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const DEFAULT_BUCKET = process.env.SUPABASE_ENGLISH_MOVIES_BUCKET
  || process.env.NEXT_PUBLIC_SUPABASE_ENGLISH_MOVIES_BUCKET
  || CONTAINERS.ENGLISH_MOVIES;

/**
 * 動画本体は送らず、Supabase への直接 PUT 用の signed URL のみ返す（大容量でサーバーが ERANGE にならないようにする）。
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { fileName?: string; type?: string };
    const fileName = body.fileName?.trim();
    const type = body.type;

    if (!fileName || !type) {
      return NextResponse.json({ error: 'fileName と type が必要です' }, { status: 400 });
    }

    const bucketName = bucketNameForVideoUploadType(type, DEFAULT_BUCKET);
    const { signedUrl, publicUrl, storagePath } = await createVideoSignedUpload(bucketName, fileName);

    return NextResponse.json({ signedUrl, publicUrl, storagePath });
  } catch (error) {
    console.error('prepare video upload error:', error);
    if (error instanceof StorageUploadFileNameError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '準備に失敗しました' },
      { status: 500 }
    );
  }
}
