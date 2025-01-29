import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';
import { mkdir } from 'fs/promises';

const execAsync = promisify(exec);

interface TestCase {
  input: string;
  expectedOutput: string;
}

export async function POST(request: NextRequest) {
  const tempDir = path.join(process.cwd(), 'temp');
  let tempFile: string | null = null;
  let output = '';

  try {
    // 一時ディレクトリの作成
    await mkdir(tempDir, { recursive: true });

    const body = await request.json();
    const { code, language, testCases } = body as { code: string; language: string; testCases: TestCase[] };

    if (!code || !language) {
      return NextResponse.json({ error: 'Code and language are required' }, { status: 400 });
    }

    // 一時的なPythonファイルを作成
    tempFile = path.join(tempDir, `${Date.now()}.py`);
    await writeFile(tempFile, code);

    // テストケースごとに実行
    for (const testCase of testCases) {
      // 入力を一時ファイルに書き込む
      const inputFile = path.join(tempDir, `input_${Date.now()}.txt`);
      await writeFile(inputFile, testCase.input);

      try {
        const { stdout, stderr } = await execAsync(
          `python3 ${tempFile} < ${inputFile}`,
          { timeout: 5000 } // 5秒のタイムアウト
        );

        if (stderr) {
          output += `エラー: ${stderr}\n`;
          continue;
        }

        const actualOutput = stdout.trim();
        const expectedOutput = testCase.expectedOutput.trim();
        
        if (actualOutput === expectedOutput) {
          output += `✅ テストケース通過: 入力="${testCase.input}"\n`;
          output += `期待される出力: ${expectedOutput}\n`;
          output += `実際の出力: ${actualOutput}\n\n`;
        } else {
          output += `❌ テストケース失敗: 入力="${testCase.input}"\n`;
          output += `期待される出力: ${expectedOutput}\n`;
          output += `実際の出力: ${actualOutput}\n\n`;
        }
      } catch (error) {
        output += `実行エラー: ${error instanceof Error ? error.message : '不明なエラー'}\n`;
      } finally {
        // 入力ファイルを削除
        await unlink(inputFile).catch(() => {});
      }
    }

    return NextResponse.json({ output });
  } catch (error) {
    console.error('Error running code:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to run code' },
      { status: 500 }
    );
  } finally {
    // 一時ファイルを削除
    if (tempFile) {
      await unlink(tempFile).catch(() => {});
    }
  }
}
