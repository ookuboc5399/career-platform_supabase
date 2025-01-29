import { NextRequest, NextResponse } from 'next/server';
import { generateSasUrl } from '@/lib/storage';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const videoUrl = searchParams.get('url');

    if (!videoUrl) {
      return NextResponse.json(
        { error: 'Video URL is required' },
        { status: 400 }
      );
    }

    const sasUrl = await generateSasUrl(videoUrl);
    return NextResponse.json({ url: sasUrl });
  } catch (error) {
    console.error('Error generating SAS URL:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate SAS URL' },
      { status: 500 }
    );
  }
}
