import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import { AzureOpenAI } from 'openai';
import { drive_v3 } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import fs from 'fs';
import path from 'path';

const vision = new ImageAnnotatorClient();
const openai = new AzureOpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  endpoint: process.env.AZURE_OPENAI_ENDPOINT,
  apiVersion: process.env.AZURE_OPENAI_API_VERSION,
  deployment: "gpt-4",
});

async function initializeGoogleDrive() {
  try {
    const credentialsPath = path.join(process.cwd(), 'roadtoentrepreneur-6b8b51ad767a.json');
    const credentials = JSON.parse(await fs.readFile(credentialsPath, 'utf8'));
    
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    });

    const authClient = await auth.getClient() as OAuth2Client;
    return google.drive({ 
      version: 'v3', 
      auth: authClient 
    });
  } catch (error) {
    console.error('Error initializing Google Drive:', error);
    throw error;
  }
}

async function downloadFile(drive: drive_v3.Drive, fileId: string): Promise<Buffer> {
  const response = await drive.files.get(
    { 
      fileId, 
      alt: 'media',
      supportsAllDrives: true 
    },
    { responseType: 'arraybuffer' }
  );

  return Buffer.from(response.data as ArrayBuffer);
}

export async function POST(request: Request) {
  try {
    const { fileId, type } = await request.json();

    // Google Driveクライアントを初期化
    const drive = await initializeGoogleDrive();

    // 画像をダウンロード
    const imageBuffer = await downloadFile(drive, fileId);

    // Cloud Visionで画像からテキストを抽出
    const [result] = await vision.textDetection(imageBuffer);
    const extractedText = result.fullTextAnnotation?.text || '';

    // Azure OpenAIで問題を生成
    const systemPrompt = type === 'grammar' 
      ? '英文法の問題を作成してください。文法的な誤りを見つけたり、適切な文法を選択する問題を作成してください。'
      : type === 'vocabulary'
      ? '英単語の問題を作成してください。単語の意味や使い方、類義語や反意語などの問題を作成してください。'
      : '英作文の問題を作成してください。与えられた状況や文章を英語で表現する問題を作成してください。';

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `あなたは英語学習のための問題を作成する教師です。以下のテキストから${systemPrompt}
          
          問題の形式：
          {
            "question": "問題文",
            "options": ["選択肢1", "選択肢2", "選択肢3", "選択肢4"],
            "correctAnswers": [1], // 1-based index
            "explanation": "解説（日本語で詳しく説明してください）"
          }`
        },
        {
          role: "user",
          content: extractedText
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const generatedQuestion = JSON.parse(completion.choices[0].message.content || '{}');

    // 問題を保存
    const question = {
      id: `question-${Date.now()}`,
      type,
      imageUrl: `https://drive.google.com/uc?id=${fileId}`,
      content: generatedQuestion,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(question);
  } catch (error) {
    console.error('Error generating question:', error);
    return NextResponse.json(
      { error: 'Failed to generate question' },
      { status: 500 }
    );
  }
}
