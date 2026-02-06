import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { textToSpeechJa } from '@/lib/azure-speech-ja';

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    // 音声ファイルの保存先ディレクトリを作成
    const publicDir = path.join(process.cwd(), 'public');
    const audioDir = path.join(publicDir, 'audios');
    await mkdir(audioDir, { recursive: true });

    // ファイル名を生成（タイムスタンプを含む）
    const timestamp = new Date().getTime();
    const filename = `speech-ja-${timestamp}.wav`;
    const filePath = path.join(audioDir, filename);

    try {
      // 音声を生成
      const audioData = await textToSpeechJa(text);

      // 音声データをファイルに保存
      await writeFile(filePath, Buffer.from(audioData));
    } catch (error) {
      console.error('Error in speech synthesis:', error);
      throw new Error('Failed to synthesize speech');
    }

    // 音声ファイルのURLを返す
    return NextResponse.json({ audioUrl: `/audios/${filename}` });
  } catch (error) {
    console.error('Error generating speech:', error);
    return NextResponse.json(
      { error: 'Failed to generate speech' },
      { status: 500 }
    );
  }
}
