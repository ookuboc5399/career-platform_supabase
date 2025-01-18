import express, { Request, Response, NextFunction } from 'express';
import { google } from 'googleapis';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import { AzureOpenAI } from 'openai';
import { drive_v3 } from 'googleapis';
import { Readable } from 'stream';
import { OAuth2Client } from 'google-auth-library';
import fs from 'fs';

const router = express.Router();

console.log('Initializing Google Auth with credentials path:', process.env.GOOGLE_APPLICATION_CREDENTIALS);

let drive: drive_v3.Drive;
const vision = new ImageAnnotatorClient();
const openai = new AzureOpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  endpoint: process.env.AZURE_OPENAI_ENDPOINT,
  apiVersion: process.env.AZURE_OPENAI_API_VERSION,
  deployment: "gpt-4",
});

async function initializeGoogleDrive() {
  try {
    console.log('Creating Google Auth client with credentials...');
    const auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      scopes: [
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/drive.readonly',
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/drive.metadata.readonly'
      ],
    });

    console.log('Getting authenticated client...');
    const authClient = await auth.getClient() as OAuth2Client;
    console.log('Auth client created successfully');

    console.log('Creating Drive client...');
    drive = google.drive({ 
      version: 'v3', 
      auth: authClient 
    });
    console.log('Drive client created successfully');
  } catch (error) {
    console.error('Error initializing Google Drive:', error);
    throw error;
  }
}

// Initialize Google Drive client
initializeGoogleDrive().catch(console.error);

async function grantFolderAccess(folderId: string): Promise<void> {
  if (!drive) {
    throw new Error('Google Drive client not initialized');
  }

  try {
    console.log('Reading service account credentials...');
    const credentials = JSON.parse(
      fs.readFileSync(process.env.GOOGLE_APPLICATION_CREDENTIALS || '', 'utf8')
    );
    const serviceAccountEmail = credentials.client_email;
    console.log('Service account email:', serviceAccountEmail);

    console.log('Granting folder access...');
    const permission = {
      type: 'user',
      role: 'writer',
      emailAddress: serviceAccountEmail,
      sendNotificationEmail: false
    };

    await drive.permissions.create({
      fileId: folderId,
      requestBody: permission,
      fields: 'id',
      supportsAllDrives: true,
      transferOwnership: false,
    });
    console.log('Folder access granted successfully');
  } catch (error) {
    console.error('Error granting folder access:', error);
    throw error;
  }
}

interface ChapterContent {
  title: string;
  content: string;
  webText: string;
  questions: {
    question: string;
    options: string[];
    correctAnswers: number[];
    explanation: string;
    explanationImages: string[];
    explanationTable: {
      headers: string[];
      rows: string[][];
    };
  }[];
}

async function downloadFile(fileId: string): Promise<Buffer> {
  if (!drive) {
    throw new Error('Google Drive client not initialized');
  }

  console.log('Downloading file:', fileId);
  const response = await drive.files.get(
    { 
      fileId, 
      alt: 'media',
      supportsAllDrives: true 
    },
    { responseType: 'stream' }
  );

  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    (response.data as Readable)
      .on('data', (chunk) => chunks.push(Buffer.from(chunk)))
      .on('end', () => {
        console.log('File download completed');
        resolve(Buffer.concat(chunks));
      })
      .on('error', (error) => {
        console.error('File download error:', error);
        reject(error);
      });
  });
}

router.post('/process-images', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!drive) {
      throw new Error('Google Drive client not initialized');
    }

    console.log('Processing request for folder:', req.body.folderId);
    const { folderId: rawFolderId } = req.body;

    if (!rawFolderId) {
      console.error('No folder ID provided');
      res.status(400).json({ error: 'Folder ID is required' });
      return next();
    }

    // フォルダIDをサニタイズ（末尾のピリオドを削除）
    const folderId = rawFolderId.replace(/\.$/, '');
    console.log('Sanitized folder ID:', folderId);

    // 1. Google Driveフォルダから画像を取得
    console.log('Fetching files from Google Drive folder');
    try {
      // まずフォルダの存在と種類を確認
      console.log('Checking folder existence and type...');
      const folderResponse = await drive.files.get({
        fileId: folderId,
        fields: 'id, name, mimeType, permissions, owners, shared, capabilities',
        supportsAllDrives: true,
      });
      
      if (!folderResponse.data) {
        console.error('Folder not found');
        res.status(404).json({ error: 'Folder not found' });
        return next();
      }

      if (folderResponse.data.mimeType !== 'application/vnd.google-apps.folder') {
        console.error('Resource is not a folder:', folderResponse.data.mimeType);
        res.status(400).json({ error: 'Resource is not a folder' });
        return next();
      }

      console.log('Folder details:', JSON.stringify(folderResponse.data, null, 2));

      // フォルダへのアクセス権限を付与
      try {
        await grantFolderAccess(folderId);
      } catch (error) {
        console.error('Error granting folder access:', error);
        if (error instanceof Error) {
          console.error('Permission error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack
          });
        }
        // アクセス権限の付与に失敗しても処理を続行
      }

      // フォルダ内のファイルを検索
      console.log('Searching for image files...');
      const response = await drive.files.list({
        q: `'${folderId}' in parents`,
        fields: 'files(id, name, mimeType, parents, permissions, webViewLink)',
        pageSize: 100,
        orderBy: 'name',
        supportsAllDrives: true,
        includeItemsFromAllDrives: true,
      });

      console.log('Drive API Response:', JSON.stringify(response.data, null, 2));
      const allFiles = response.data.files;
      console.log('Found files:', allFiles?.length || 0);
      console.log('All file details:', allFiles);

      // 画像ファイルのみをフィルタリング
      const imageFiles = allFiles?.filter(file => 
        file.mimeType?.includes('image/png') || 
        file.mimeType?.includes('image/jpeg') || 
        file.mimeType?.includes('image/jpg')
      ) || [];

      console.log('Found image files:', imageFiles.length);
      console.log('Image file details:', imageFiles);

      if (imageFiles.length === 0) {
        console.log('No images found in folder');
        res.status(404).json({ error: 'No images found in the specified folder' });
        return next();
      }

      // 2. 各画像から文字を抽出
      console.log('Starting text extraction from images');
      const extractedTexts = await Promise.all(
        imageFiles.map(async (file: drive_v3.Schema$File) => {
          if (!file.id) return '';

          try {
            console.log('Processing file:', file.name, 'Type:', file.mimeType);
            // 画像をダウンロード
            const imageBuffer = await downloadFile(file.id);

            // Cloud Visionで文字抽出
            console.log('Extracting text with Cloud Vision');
            const [result] = await vision.textDetection(imageBuffer);
            const extractedText = result.fullTextAnnotation?.text || '';
            console.log('Extracted text length:', extractedText.length);
            return extractedText;
          } catch (error) {
            console.error(`Error processing file ${file.id}:`, error);
            return '';
          }
        })
      );

      // 3. 抽出したテキストをOpenAI GPT-4で解析
      console.log('Starting OpenAI analysis');
      const combinedText = extractedTexts.join('\n\n');
      console.log('Combined text length:', combinedText.length);

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `以下のテキストから教育コンテンツの複数のチャプターを作成してください。
            テキストの内容を適切な単位で分割し、それぞれをチャプターとして構成してください。
            以下の形式で出力してください：
            [
              {
                "title": "チャプタータイトル",
                "content": "チャプターの説明",
                "webText": "詳細な解説テキスト",
                "questions": [
                  {
                    "question": "問題文",
                    "options": ["選択肢1", "選択肢2", "選択肢3", "選択肢4", "選択肢5"],
                    "correctAnswers": [1], // 1-based index
                    "explanation": "解説",
                    "explanationImages": [],
                    "explanationTable": {
                      "headers": ["項目", "説明"],
                      "rows": [["例1", "説明1"], ["例2", "説明2"]]
                    }
                  }
                ]
              }
            ]
            
            注意点：
            1. テキストの内容を論理的な単位で分割してください
            2. 各チャプターは独立して理解できる内容にしてください
            3. チャプター間の順序は学習の流れに沿うように設定してください
            4. 各チャプターには少なくとも1つの練習問題を含めてください`
          },
          {
            role: "user",
            content: combinedText
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      });

      // 4. 生成されたJSONをパース
      console.log('Parsing OpenAI response');
      const generatedContent = JSON.parse(completion.choices[0].message.content || '[]');

      const result = Array.isArray(generatedContent) ? generatedContent.map((chapter: any, index: number) => ({
        title: chapter.title || `チャプター${index + 1}`,
        content: chapter.content || '',
        webText: chapter.webText || '',
        questions: chapter.questions?.map((q: any) => ({
          ...q,
          explanationImages: q.explanationImages || [],
          explanationTable: q.explanationTable || {
            headers: ['項目', '説明'],
            rows: [['', '']]
          }
        })) || [],
      })) : [];

      console.log('Generated chapters:', result.length);

      console.log('Processing completed successfully');
      res.json(result);
      return next();
    } catch (error) {
      console.error('Google Drive API error:', error);
      if (error instanceof Error) {
        const errorDetails = {
          name: error.name,
          message: error.message,
          stack: error.stack
        };
        console.error('Error details:', errorDetails);
        
        // エラーの種類に応じて適切なステータスコードを返す
        if (error.message.includes('File not found')) {
          res.status(404).json({ error: 'Folder not found', details: errorDetails });
        } else if (error.message.includes('insufficient permissions')) {
          res.status(403).json({ error: 'Insufficient permissions', details: errorDetails });
        } else {
          res.status(500).json({ error: 'Failed to access Google Drive', details: errorDetails });
        }
        return next();
      }
      throw error;
    }
  } catch (error) {
    console.error('Error processing images:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
    res.status(500).json({ error: 'Failed to process images' });
    return next(error);
  }
});

export default router;
