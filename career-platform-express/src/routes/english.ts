import express from 'express';
import { BlobServiceClient, StorageSharedKeyCredential } from '@azure/storage-blob';
import axios from 'axios';
import cors from 'cors';

const router = express.Router();

// CORS設定を修正
router.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:4000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Azure OpenAI設定
const AZURE_OPENAI = {
  endpoint: process.env.AZURE_OPENAI_ENDPOINT || '',
  key: process.env.AZURE_OPENAI_API_KEY || '',
  deploymentName: process.env.AZURE_OPENAI_DEPLOYMENT_NAME || '',
};

// Azure Blob Storage設定
const blobServiceClient = new BlobServiceClient(
  `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
  new StorageSharedKeyCredential(
    process.env.AZURE_STORAGE_ACCOUNT_NAME!,
    process.env.AZURE_STORAGE_ACCOUNT_KEY!
  )
);

// ニュース一覧の取得
router.get('/english/news', async (req, res) => {
  try {
    console.log('Express API: Fetching news list...');
    // CosmosDBからニュース一覧を取得する処理を実装
    res.json([]);
  } catch (error) {
    console.error('Express API Error:', error);
    res.status(500).json({ error: 'Failed to fetch news list' });
  }
});

// ニュースの生成
router.post('/english/news/generate', async (req, res) => {
  try {
    // SSE設定
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    const progress = {
      step: 1,
      total: 5,
      message: 'ニュースを生成中...',
    };

    // 進捗状況の送信
    const sendProgress = () => {
      res.write(`data: ${JSON.stringify(progress)}\n\n`);
    };

    console.log('1. Starting news generation...');
    sendProgress();

    // ニュースの生成
    const newsPrompt = `Generate 3 current news summaries in the following format:
    1. [Title]
    [Brief summary]
    2. [Title]
    [Brief summary]
    3. [Title]
    [Brief summary]`;

    console.log('2. Generating news with Azure OpenAI...');
    const newsResponse = await axios.post(
      `${AZURE_OPENAI.endpoint}/openai/deployments/${AZURE_OPENAI.deploymentName}/chat/completions?api-version=2023-05-15`,
      {
        messages: [{ role: 'user', content: newsPrompt }],
        temperature: 0.7,
        max_tokens: 800,
      },
      {
        headers: {
          'api-key': AZURE_OPENAI.key,
          'Content-Type': 'application/json',
        },
      }
    );

    const newsSummaries = newsResponse.data.choices[0].message?.content || '';
    const firstNews = newsSummaries.split('2.')[0];

    // 進捗更新
    progress.step = 2;
    progress.message = '会話文を生成中...';
    sendProgress();

    // 会話文の生成
    console.log('3. Generating conversation...');
    const conversationPrompt = `Create a natural English conversation between two people (A and B) discussing the following news:\n${firstNews}\nMake it educational and include some useful vocabulary or expressions.`;

    const conversationResponse = await axios.post(
      `${AZURE_OPENAI.endpoint}/openai/deployments/${AZURE_OPENAI.deploymentName}/chat/completions?api-version=2023-05-15`,
      {
        messages: [{ role: 'user', content: conversationPrompt }],
        temperature: 0.7,
        max_tokens: 800,
      },
      {
        headers: {
          'api-key': AZURE_OPENAI.key,
          'Content-Type': 'application/json',
        },
      }
    );

    const conversation = conversationResponse.data.choices[0].message?.content || '';

    // 進捗更新
    progress.step = 3;
    progress.message = '音声を生成中...';
    sendProgress();

    // 音声の生成
    console.log('4. Generating audio...');
    const speechResponse = await axios.post(
      `https://${process.env.AZURE_SPEECH_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`,
      `<speak version='1.0' xml:lang='en-US'>
        <voice xml:lang='en-US' xml:gender='Female' name='en-US-JennyNeural'>
          ${conversation}
        </voice>
      </speak>`,
      {
        headers: {
          'Ocp-Apim-Subscription-Key': process.env.AZURE_SPEECH_KEY,
          'Content-Type': 'application/ssml+xml',
          'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
        },
        responseType: 'arraybuffer',
      }
    );

    // 音声ファイルのアップロード
    const audioFileName = `news-audio-${Date.now()}.mp3`;
    const audioContainerClient = blobServiceClient.getContainerClient('english-news-audio');
    const audioBlobClient = audioContainerClient.getBlockBlobClient(audioFileName);
    await audioBlobClient.uploadData(Buffer.from(speechResponse.data), {
      blobHTTPHeaders: { blobContentType: 'audio/mpeg' }
    });

    // 進捗更新
    progress.step = 4;
    progress.message = '画像を生成中...';
    sendProgress();

    // 画像生成のプロンプト作成
    console.log('5. Generating image...');
    const imagePrompt = `Create a detailed image description for this news story that could be used with DALL-E:\n${firstNews}`;

    const imageDescResponse = await axios.post(
      `${AZURE_OPENAI.endpoint}/openai/deployments/${AZURE_OPENAI.deploymentName}/chat/completions?api-version=2023-05-15`,
      {
        messages: [{ role: 'user', content: imagePrompt }],
        temperature: 0.7,
        max_tokens: 800,
      },
      {
        headers: {
          'api-key': AZURE_OPENAI.key,
          'Content-Type': 'application/json',
        },
      }
    );

    const imageDescription = imageDescResponse.data.choices[0].message?.content || '';

    // 画像の生成
    const imageResponse = await axios.post(
      `${AZURE_OPENAI.endpoint}/openai/deployments/${AZURE_OPENAI.deploymentName}/images/generations?api-version=2023-06-01-preview`,
      {
        prompt: imageDescription,
        n: 1,
        size: '1024x1024',
      },
      {
        headers: {
          'api-key': AZURE_OPENAI.key,
          'Content-Type': 'application/json',
        },
      }
    );

    // 生成された画像のダウンロードとアップロード
    const imageUrl = imageResponse.data.data[0].url;
    if (!imageUrl) {
      throw new Error('Failed to generate image');
    }

    const imageData = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    
    const imageFileName = `news-image-${Date.now()}.png`;
    const imageContainerClient = blobServiceClient.getContainerClient('english-news-images');
    const imageBlobClient = imageContainerClient.getBlockBlobClient(imageFileName);
    await imageBlobClient.uploadData(Buffer.from(imageData.data), {
      blobHTTPHeaders: { blobContentType: 'image/png' }
    });

    // 進捗更新
    progress.step = 5;
    progress.message = '完了';
    
    // 最終データの送信
    const result = {
      id: Date.now().toString(),
      title: firstNews.split('\n')[0].replace('1. ', ''),
      content: newsSummaries,
      conversation,
      audioUrl: audioBlobClient.url,
      imageUrl: imageBlobClient.url,
      createdAt: new Date().toISOString(),
      isPublished: false,
      publishedAt: null,
    };

    console.log('6. Generation complete');
    res.write(`data: ${JSON.stringify({ ...progress, result })}\n\n`);
    res.end();
  } catch (error) {
    console.error('Error generating news content:', error);
    res.write(`data: ${JSON.stringify({ error: 'Failed to generate news content' })}\n\n`);
    res.end();
  }
});

// ニュースの更新
router.patch('/english/news/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    console.log('Express API: Updating news:', { id, updateData });
    // CosmosDBでニュースを更新する処理を実装
    res.json({ id, ...updateData });
  } catch (error) {
    console.error('Express API Error:', error);
    res.status(500).json({ error: 'Failed to update news' });
  }
});

// ニュースの削除
router.delete('/english/news/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Express API: Deleting news:', id);
    // CosmosDBからニュースを削除する処理を実装
    res.status(204).send();
  } catch (error) {
    console.error('Express API Error:', error);
    res.status(500).json({ error: 'Failed to delete news' });
  }
});

export default router;
