import axios from 'axios';
import { writeFile } from 'fs/promises';
import path from 'path';

const VOICEVOX_ENDPOINT = 'http://localhost:50021';

// 話者の設定
const SPEAKERS = {
  ZUNDAMON: {
    name: 'ずんだもん',
    speaker_uuid: '388f246b-8c41-4ac1-8e2d-5d79f3ff56d9',
    styleId: 3 // ノーマル
  },
  AOYAMA: {
    name: '青山龍生',
    speaker_uuid: '4f51116a-d9ee-4516-925d-21f183e2afad',
    styleId: 13 // ノーマル
  }
} as const;

export type SpeakerType = keyof typeof SPEAKERS;

export class VoicevoxClient {
  private styleId: number;

  constructor(speakerType: SpeakerType = 'ZUNDAMON') {
    this.styleId = SPEAKERS[speakerType].styleId;
  }

  /**
   * サーバーが起動しているかどうかを確認する
   */
  private async isServerRunning(): Promise<boolean> {
    try {
      const response = await axios.get(`${VOICEVOX_ENDPOINT}/version`);
      console.log('VOICEVOX version:', response.data);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * テキストから音声を生成する
   * @param text 音声に変換するテキスト
   * @returns 生成された音声ファイルのパス
   */
  async textToVoice(text: string): Promise<string> {
    try {
      // サーバーが起動しているか確認
      const isRunning = await this.isServerRunning();
      console.log('VOICEVOX server running:', isRunning);
      
      if (!isRunning) {
        throw new Error('VOICEVOXが起動していません。VOICEVOXを起動してから再度お試しください。');
      }

      // 利用可能な話者を取得して確認
      const speakers = await this.getSpeakers();
      console.log('Current styleId:', this.styleId);
      console.log('Available speakers:', JSON.stringify(speakers, null, 2));

      console.log('Generating audio query with styleId:', this.styleId);
      console.log('Text to convert:', text);
      
      // 音声合成用のクエリを生成
      const query = await axios.post(
        `${VOICEVOX_ENDPOINT}/audio_query`,
        null,
        {
          params: {
            text,
            speaker: this.styleId
          }
        }
      );

      console.log('Audio query response:', JSON.stringify(query.data, null, 2));
      console.log('Synthesizing audio...');
      
      // 音声を合成
      const synthesis = await axios.post(
        `${VOICEVOX_ENDPOINT}/synthesis`,
        query.data,
        {
          params: {
            speaker: this.styleId
          },
          responseType: 'arraybuffer',
          headers: {
            'accept': 'audio/wav',
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Saving audio file...');
      // 音声ファイルを保存
      const timestamp = new Date().getTime();
      const filename = `voicevox-${timestamp}.wav`;
      const publicDir = path.join(process.cwd(), 'public');
      const audioDir = path.join(publicDir, 'audios');
      const filePath = path.join(audioDir, filename);

      await writeFile(filePath, Buffer.from(synthesis.data));
      console.log('Audio file saved:', filePath);

      return `/audios/${filename}`;
    } catch (error) {
      console.error('Error in VOICEVOX text to speech:', error);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const errorData = error.response.data;
          const errorMessage = typeof errorData === 'string' 
            ? errorData 
            : errorData instanceof Buffer
              ? errorData.toString('utf-8')
              : JSON.stringify(errorData);
          console.error('VOICEVOX error details:', {
            status: error.response.status,
            statusText: error.response.statusText,
            data: errorData,
            headers: error.response.headers
          });
          throw new Error(`VOICEVOX error: ${errorMessage}`);
        } else if (error.request) {
          throw new Error('VOICEVOXが起動していません。VOICEVOXを起動してから再度お試しください。');
        }
        throw new Error(`Network error: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * 利用可能な話者の一覧を取得する
   * @returns 話者の一覧
   */
  async getSpeakers(): Promise<any[]> {
    try {
      // サーバーが起動しているか確認
      if (!await this.isServerRunning()) {
        throw new Error('VOICEVOXが起動していません。VOICEVOXを起動してから再度お試しください。');
      }

      const response = await axios.get(`${VOICEVOX_ENDPOINT}/speakers`);
      console.log('Available speakers:', JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error) {
      console.error('Error getting VOICEVOX speakers:', error);
      throw new Error('Failed to get VOICEVOX speakers');
    }
  }

  /**
   * スタイルを設定する
   * @param speakerType 話者タイプ
   */
  setSpeaker(speakerType: SpeakerType): void {
    this.styleId = SPEAKERS[speakerType].styleId;
  }

  /**
   * 利用可能な話者の設定を取得する
   * @returns 話者の設定一覧
   */
  static getSpeakerSettings() {
    return SPEAKERS;
  }
}

// シングルトンインスタンスを作成
export const voicevoxClient = new VoicevoxClient();
