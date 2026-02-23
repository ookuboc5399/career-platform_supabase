import { NextRequest, NextResponse } from 'next/server';
import { generateSasToken } from '@/lib/storage';

export const dynamic = 'force-dynamic';

const PROGRAMMING_VIDEOS_BUCKET = 'programming-videos';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const blobName = searchParams.get('blobName');

    if (!blobName) {
      return NextResponse.json(
        { error: 'No blob name provided' },
        { status: 400 }
      );
    }

    const url = await generateSasToken(PROGRAMMING_VIDEOS_BUCKET, blobName);
    return NextResponse.json({ url });
  } catch (error) {
    console.error('SAS generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate signed URL' },
      { status: 500 }
    );
  }
}
