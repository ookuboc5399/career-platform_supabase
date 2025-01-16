import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';

const execAsync = promisify(exec);

interface TestCase {
  input: string;
  expectedOutput: string;
}

interface TestResult {
  input: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
}

interface CodeRunResult {
  success: boolean;
  testResults: TestResult[];
  error?: string;
}

function wrapCodeWithTestCase(code: string, input: string, language: string): string {
  switch (language) {
    case 'python':
      return `
import sys
def get_input():
    return """${input}"""
# Override input function
input = lambda: get_input()
${code}
`;

    case 'javascript':
      return `
const input = () => \`${input}\`;
${code}
`;

    default:
      throw new Error('Unsupported language');
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, language, testCases } = body;

    if (!code || !language || !testCases) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 一時ファイルのパスを生成
    const timestamp = Date.now();
    const tempDir = path.join(process.cwd(), 'temp');
    await fs.mkdir(tempDir, { recursive: true });

    let sourceFile: string;
    let command: string;

    switch (language) {
      case 'python':
        sourceFile = path.join(tempDir, `code_${timestamp}.py`);
        command = 'python';
        break;

      case 'javascript':
        sourceFile = path.join(tempDir, `code_${timestamp}.js`);
        command = 'node';
        break;

      default:
        return NextResponse.json(
          { error: 'Unsupported language' },
          { status: 400 }
        );
    }

    // テストケースを実行
    const testResults: TestResult[] = [];
    let allTestsPassed = true;

    try {
      for (const testCase of testCases) {
        // テストケースごとにコードを生成
        const wrappedCode = wrapCodeWithTestCase(code, testCase.input, language);
        await fs.writeFile(sourceFile, wrappedCode);

        const { stdout, stderr } = await execAsync(`${command} ${sourceFile}`, {
          timeout: 5000, // 5秒のタイムアウト
        });

        const actualOutput = stdout.trim();
        const passed = actualOutput === testCase.expectedOutput.trim();
        
        if (!passed) {
          allTestsPassed = false;
        }

        testResults.push({
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput,
          passed,
        });

        if (stderr) {
          throw new Error(stderr);
        }
      }

      // 一時ファイルを削除
      await fs.unlink(sourceFile);

      const result: CodeRunResult = {
        success: allTestsPassed,
        testResults,
      };

      return NextResponse.json(result);
    } catch (error) {
      // エラーが発生した場合も一時ファイルを削除
      await fs.unlink(sourceFile).catch(() => {});

      const result: CodeRunResult = {
        success: false,
        testResults,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };

      return NextResponse.json(result);
    }
  } catch (error) {
    console.error('Error running code:', error);
    return NextResponse.json(
      { error: 'Failed to run code' },
      { status: 500 }
    );
  }
}
