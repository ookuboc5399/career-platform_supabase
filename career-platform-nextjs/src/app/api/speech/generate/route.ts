import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    // 音声ファイルの保存先ディレクトリを作成
    const publicDir = path.join(process.cwd(), 'public');
    const audioDir = path.join(publicDir, 'audios');
    await mkdir(audioDir, { recursive: true });

    // ファイル名を生成（タイムスタンプを含む）
    const timestamp = new Date().getTime();
    const filename = `speech-${timestamp}.wav`;
    const filePath = path.join(audioDir, filename);

    // Speech SDK の設定
    const speechConfig = sdk.SpeechConfig.fromSubscription(
      process.env.AZURE_SPEECH_KEY!,
      process.env.AZURE_SPEECH_REGION!
    );
    speechConfig.speechSynthesisVoiceName = 'ja-JP-NanamiNeural';

    // 音声ファイルの設定
    const audioConfig = sdk.AudioConfig.fromAudioFileOutput(filePath);

    // 音声合成クライアントの作成
    const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

    // 音声を生成して保存
    await new Promise((resolve, reject) => {
      synthesizer.speakTextAsync(
        text,
        result => {
          if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
            resolve(result);
          } else {
            reject(new Error(`Speech synthesis failed: ${result.errorDetails}`));
          }
          synthesizer.close();
        },
        error => {
          reject(error);
          synthesizer.close();
        }
      );
    });

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
