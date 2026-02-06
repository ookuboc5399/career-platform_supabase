import { spawn, ChildProcess } from 'child_process';
import axios from 'axios';

export class VoicevoxProcess {
  private process: ChildProcess | null = null;
  private voicevoxPath: string;
  private isStarting: boolean = false;

  constructor(voicevoxPath: string = 'C:\\Program Files\\VOICEVOX\\VOICEVOX.exe') {
    this.voicevoxPath = voicevoxPath;
  }

  /**
   * VOICEVOXのプロセスを起動する
   */
  async start(): Promise<void> {
    if (this.process || this.isStarting) {
      return;
    }

    this.isStarting = true;

    try {
      // VOICEVOXプロセスを起動
      this.process = spawn(this.voicevoxPath, ['--host', 'localhost', '--port', '50021']);

      // エラーハンドリング
      this.process.on('error', (error) => {
        console.error('Failed to start VOICEVOX:', error);
        this.process = null;
      });

      this.process.on('exit', (code) => {
        console.log('VOICEVOX process exited with code:', code);
        this.process = null;
      });

      // サーバーが起動するまで待機
      await this.waitForServer();
    } finally {
      this.isStarting = false;
    }
  }

  /**
   * VOICEVOXのプロセスを停止する
   */
  stop(): void {
    if (this.process) {
      this.process.kill();
      this.process = null;
    }
  }

  /**
   * サーバーが起動するまで待機する
   */
  private async waitForServer(maxAttempts: number = 30): Promise<void> {
    for (let i = 0; i < maxAttempts; i++) {
      try {
        await axios.get('http://localhost:50021/version');
        return;
      } catch (error) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    throw new Error('Failed to start VOICEVOX server');
  }

  /**
   * サーバーが起動しているかどうかを確認する
   */
  async isServerRunning(): Promise<boolean> {
    try {
      await axios.get('http://localhost:50021/version');
      return true;
    } catch (error) {
      return false;
    }
  }
}

// シングルトンインスタンスを作成
export const voicevoxProcess = new VoicevoxProcess();
