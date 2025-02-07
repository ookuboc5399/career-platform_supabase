import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { ComputerVisionClient} from '@azure/cognitiveservices-computervision';
import { ApiKeyCredentials } from '@azure/ms-rest-js';

// Azure Computer Vision クライアントの初期化
const computerVisionClient = new ComputerVisionClient(
  new ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': process.env.AZURE_COMPUTER_VISION_KEY! } }),
  process.env.AZURE_COMPUTER_VISION_ENDPOINT!
);

export async function POST(request: Request) {
  try {
    const { folderId } = await request.json();

    // Google Drive APIの認証
    const auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    });

    const drive = google.drive({ version: 'v3', auth });

    // フォルダ内のファイル一覧を取得
    const response = await drive.files.list({
      q: `'${folderId}' in parents and mimeType contains 'image/'`,
      fields: 'files(id, name, webContentLink)',
    });

    const files = response.data.files;
    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No images found in the folder' }, { status: 404 });
    }

    const chapters = [];
    let currentChapter: any = null;

    // 各画像を処理
    for (const file of files) {
      if (!file.webContentLink) continue;

      // 画像のテキストを抽出
      const result = await computerVisionClient.read(file.webContentLink);
      
      // 操作IDを取得
      const operationLocation = result.operationLocation;
      const operationId = operationLocation.split('/').pop();

      // 結果が利用可能になるまで待機
      let textResult;
      do {
        textResult = await computerVisionClient.getReadResult(operationId!);
        await new Promise(resolve => setTimeout(resolve, 1000));
      } while ((textResult.status as string) === "Running");

      if ((textResult.status as string) !== "Succeeded") continue;

      // テキストを抽出
      let text = '';
      if (textResult.analyzeResult?.readResults) {
        for (const page of textResult.analyzeResult.readResults) {
          for (const line of page.lines || []) {
            text += line.text + '\n';
          }
        }
      }

      // チャプター情報を解析して構造化
      if (text.toLowerCase().includes('chapter') || text.toLowerCase().includes('section')) {
        if (currentChapter) {
          chapters.push(currentChapter);
        }
        currentChapter = {
          title: text.split('\n')[0],
          content: text,
          webText: text,
          questions: []
        };
      } else if (currentChapter) {
        currentChapter.content += '\n' + text;
        currentChapter.webText += '\n' + text;
      }
    }

    if (currentChapter) {
      chapters.push(currentChapter);
    }

    return NextResponse.json(chapters);
  } catch (error) {
    console.error('Error processing images:', error);
    return NextResponse.json({ error: 'Failed to process images' }, { status: 500 });
  }
}
