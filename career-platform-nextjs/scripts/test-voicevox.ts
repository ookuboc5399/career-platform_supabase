import axios from 'axios';
import { spawn } from 'child_process';

const VOICEVOX_PATH = 'C:\\Program Files\\VOICEVOX\\run.exe';
const VOICEVOX_ENDPOINT = 'http://localhost:50021';

async function isServerRunning(): Promise<boolean> {
  try {
    const response = await axios.get(`${VOICEVOX_ENDPOINT}/version`);
    console.log('VOICEVOX server version:', response.data);
    return true;
  } catch (error) {
    return false;
  }
}

async function startServer() {
  console.log('Starting VOICEVOX server...');
  
  const process = spawn(VOICEVOX_PATH, ['--host', 'localhost', '--port', '50021']);

  process.stdout?.on('data', (data) => {
    console.log('VOICEVOX stdout:', data.toString());
  });

  process.stderr?.on('data', (data) => {
    console.error('VOICEVOX stderr:', data.toString());
  });

  process.on('error', (error) => {
    console.error('Failed to start VOICEVOX:', error);
  });

  process.on('exit', (code, signal) => {
    console.log('VOICEVOX process exited with code:', code, 'signal:', signal);
  });

  // サーバーが起動するまで待機
  for (let i = 0; i < 30; i++) {
    console.log(`Checking server status (attempt ${i + 1}/30)...`);
    if (await isServerRunning()) {
      console.log('VOICEVOX server is running!');
      return;
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  throw new Error('Failed to start VOICEVOX server: timeout');
}

async function main() {
  try {
    // サーバーが起動しているか確認
    const running = await isServerRunning();
    console.log('VOICEVOX server is running:', running);

    if (!running) {
      // サーバーが起動していない場合は起動
      await startServer();
    }

    // 話者一覧を取得してテスト
    const speakers = await axios.get(`${VOICEVOX_ENDPOINT}/speakers`);
    console.log('Available speakers:', speakers.data);

  } catch (error) {
    console.error('Error:', error);
  }
}

main();
