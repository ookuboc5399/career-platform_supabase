import { NextRequest, NextResponse } from 'next/server';
import { googleDocsClient, GoogleDocsClient } from '@/lib/google-docs';

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'Google Docs URL is required' },
        { status: 400 }
      );
    }

    try {
      // URLからドキュメントIDを抽出
      const documentId = GoogleDocsClient.extractDocumentId(url);

      // ドキュメントのテキストを取得
      const text = await googleDocsClient.getDocumentText(documentId);

      return NextResponse.json({ text });
    } catch (error) {
      console.error('Error getting document text:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to get document text';
      return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in request handling:', error);
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}
