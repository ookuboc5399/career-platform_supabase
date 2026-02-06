import { NextRequest, NextResponse } from 'next/server';
import { mkdir } from 'fs/promises';
import path from 'path';
import { voicevoxClient, SpeakerType } from '@/lib/voicevox-client';

export async function POST(req: NextRequest) {
  try {
    const { text, speaker = 'ZUNDAMON' } = await req.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required and must be a string' },
        { status: 400 }
      );
    }

    // 音声ファイルの保存先ディレクトリを作成
    const publicDir = path.join(process.cwd(), 'public');
    const audioDir = path.join(publicDir, 'audios');
    await mkdir(audioDir, { recursive: true });

    try {
      // 話者を設定
      voicevoxClient.setSpeaker(speaker as SpeakerType);

      // 音声を生成
      const audioUrl = await voicevoxClient.textToVoice(text);

      // 音声ファイルのURLを返す
      return NextResponse.json({ audioUrl });
    } catch (error) {
      console.error('Error in speech synthesis:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to synthesize speech';

      // VOICEVOXが起動していない場合のエラーメッセージを改善
      if (errorMessage.includes('not running')) {
        return NextResponse.json(
          { error: 'VOICEVOXが起動していません。VOICEVOXを起動してから再度お試しください。' },
          { status: 503 }
        );
      }

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
