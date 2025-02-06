import { NextResponse } from 'next/server';
import { extractTextFromBuffer } from '@/lib/azure-vision';

export async function POST(request: Request) {
  try {
    console.log('OCR API called');
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      console.error('No file provided');
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    console.log('File received:', file.name, 'Size:', file.size);

    // ファイルをバッファに変換
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    console.log('File converted to buffer, size:', buffer.length);

    // Azure Computer Vision APIを使用してテキストを抽出
    try {
      const extractedText = await extractTextFromBuffer(buffer);
      console.log('Text extracted successfully');
      if (!extractedText) {
        return NextResponse.json(
          { error: 'No text was extracted from the image' },
          { status: 400 }
        );
      }
      return NextResponse.json({ text: extractedText });
    } catch (ocrError) {
      console.error('Error in OCR processing:', ocrError);
      // タイムアウトエラーの場合
      if (ocrError instanceof Error && ocrError.message.includes('timed out')) {
        return NextResponse.json(
          { error: 'OCR processing timed out. Please try again.' },
          { status: 504 }
        );
      }
      // その他のエラー
      return NextResponse.json(
        { error: ocrError instanceof Error ? ocrError.message : 'OCR processing failed' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in OCR API:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process image' },
      { status: 500 }
    );
  }
}
