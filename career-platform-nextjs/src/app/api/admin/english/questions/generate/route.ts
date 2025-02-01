import { NextResponse } from 'next/server';
import { CosmosClient } from '@azure/cosmos';
import { BlobServiceClient } from '@azure/storage-blob';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import path from 'path';
import fs from 'fs/promises';

const client = new CosmosClient({
  endpoint: process.env.COSMOS_DB_ENDPOINT || '',
  key: process.env.COSMOS_DB_KEY || '',
});

const database = client.database('career-platform');
const container = database.container('english-questions');

const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.AZURE_STORAGE_CONNECTION_STRING || ''
);

const containerClient = blobServiceClient.getContainerClient('english-questions');

async function getGoogleDriveAuth(): Promise<OAuth2Client> {
  const credentialsPath = path.join(process.cwd(), 'roadtoentrepreneur-6b8b51ad767a.json');
  const credentials = JSON.parse(await fs.readFile(credentialsPath, 'utf8'));
  
  const auth = new OAuth2Client({
    clientId: credentials.client_id,
    clientSecret: credentials.client_secret,
    redirectUri: credentials.redirect_uris[0]
  });

  auth.setCredentials({
    refresh_token: credentials.refresh_token
  });

  return auth;
}

async function downloadImage(auth: OAuth2Client, fileId: string): Promise<Buffer> {
  const drive = google.drive({ version: 'v3', auth });
  const response = await drive.files.get(
    { fileId, alt: 'media' },
    { responseType: 'arraybuffer' }
  );
  return Buffer.from(response.data as ArrayBuffer);
}

async function uploadImageToBlob(imageBuffer: Buffer, fileName: string): Promise<string> {
  const blockBlobClient = containerClient.getBlockBlobClient(fileName);
  await blockBlobClient.upload(imageBuffer, imageBuffer.length);
  return blockBlobClient.url;
}

async function extractQuestionsFromImage(imageUrl: string): Promise<any[]> {
  const response = await fetch(`${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_VISION_DEPLOYMENT_ID}/chat/completions?api-version=2024-02-15-preview`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': process.env.AZURE_OPENAI_KEY || '',
    },
    body: JSON.stringify({
      messages: [
        {
          role: "system",
          content: "画像内の英語の問題を解析してください。画像には複数の問題が含まれています。各問題について以下の形式でJSONを生成してください：\n" +
            "{\n" +
            "  \"questions\": [\n" +
            "    {\n" +
            "      \"question\": \"画像内の問題文をそのまま抽出\",\n" +
            "      \"options\": [\"選択肢1\", \"選択肢2\", \"選択肢3\", \"選択肢4\"],\n" +
            "      \"correctAnswers\": [正解の番号（1から4）],\n" +
            "      \"explanation\": \"解説（日本語訳を含む）\"\n" +
            "    },\n" +
            "    // 画像内の他の問題も同様に抽出\n" +
            "  ]\n" +
            "}\n\n" +
            "注意点：\n" +
            "1. 問題文は画像内のテキストをそのまま抽出してください\n" +
            "2. 選択肢は1, 2, 3, 4の形式で表示されているものをそのまま使用してください\n" +
            "3. 正解は画像内の解答を参照してください\n" +
            "4. 解説には問題の日本語訳と文法的な説明を含めてください"
        },
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                url: imageUrl,
                detail: "high"
              }
            }
          ]
        }
      ],
      max_tokens: 2000,
      temperature: 0,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to extract questions from image');
  }

  const result = await response.json();
  const content = result.choices[0].message?.content;
  if (!content) {
    throw new Error('No content in response');
  }

  try {
    const parsed = JSON.parse(content);
    return parsed.questions;
  } catch (error) {
    console.error('Error parsing questions:', error);
    return [];
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fileId, type } = body;

    // Google Drive認証
    const auth = await getGoogleDriveAuth();

    // Google Driveから画像を取得
    const drive = google.drive({ version: 'v3', auth });
    const { data: { files } } = await drive.files.list({
      q: `'${fileId}' in parents and mimeType contains 'image/'`,
      fields: 'files(id, name)',
      orderBy: 'name',
    });

    if (!files) {
      throw new Error('No files found');
    }

    // 各画像から問題を抽出
    const allQuestions = [];
    for (const file of files) {
      if (file.id) {
        // 画像をダウンロードしてアップロード
        const imageBuffer = await downloadImage(auth, file.id);
        const fileName = `${Date.now()}-${file.id}.png`;
        const imageUrl = await uploadImageToBlob(imageBuffer, fileName);

        // 画像から問題を抽出
        const questions = await extractQuestionsFromImage(imageUrl);
        
        // 各問題にメタデータを追加
        const questionsWithMeta = questions.map((q: any, index: number) => ({
          id: `question-${Date.now()}-${file.id}-${index}`,
          type,
          imageUrl,
          content: q,
          createdAt: new Date().toISOString(),
        }));

        allQuestions.push(...questionsWithMeta);
      }
    }

    // 問題をCosmosDBに保存
    const createdQuestions = [];
    for (const question of allQuestions) {
      const { resource: createdQuestion } = await container.items.create(question);
      createdQuestions.push(createdQuestion);
    }

    return NextResponse.json(createdQuestions);
  } catch (error) {
    console.error('Error generating questions:', error);
    return NextResponse.json(
      { error: 'Failed to generate questions' },
      { status: 500 }
    );
  }
}
