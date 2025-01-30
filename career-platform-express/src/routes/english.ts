import express from 'express';
import { BlobServiceClient, StorageSharedKeyCredential } from '@azure/storage-blob';
import axios from 'axios';
import cors from 'cors';

const router = express.Router();

// CORS設定
router.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:4000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Azure設定
const AZURE_CONFIG = {
  openai: {
    endpoint: process.env.AZURE_OPENAI_ENDPOINT || '',
    key: process.env.AZURE_OPENAI_API_KEY || '',
    deploymentName: process.env.AZURE_OPENAI_DEPLOYMENT_NAME || '',
  },
  speech: {
    key: process.env.AZURE_SPEECH_KEY || '',
    region: process.env.AZURE_SPEECH_REGION || '',
    endpoint: `https://${process.env.AZURE_SPEECH_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`,
  },
  storage: {
    accountName: process.env.AZURE_STORAGE_ACCOUNT_NAME || '',
    accountKey: process.env.AZURE_STORAGE_ACCOUNT_KEY || '',
  }
};

// Azure Blob Storage設定
const blobServiceClient = new BlobServiceClient(
  `https://${AZURE_CONFIG.storage.accountName}.blob.core.windows.net`,
  new StorageSharedKeyCredential(
    AZURE_CONFIG.storage.accountName,
    AZURE_CONFIG.storage.accountKey
  )
);

// Azure設定の取得
router.get('/english/settings', async (req, res) => {
  try {
    const settings = {
      speech: {
        key: AZURE_CONFIG.speech.key,
        region: AZURE_CONFIG.speech.region,
        endpoint: AZURE_CONFIG.speech.endpoint,
      }
    };
    res.json(settings);
  } catch (error) {
    console.error('Error getting settings:', error);
    res.status(500).json({ error: 'Failed to get settings' });
  }
});

// 動画の処理
router.post('/english/movies/process', async (req, res) => {
  try {
    const { videoUrl } = req.body;

    // 1. 音声の抽出
    // 2. 音声認識
    // 3. 字幕生成
    // 4. 翻訳
    // 5. 単語抽出

    // TODO: 実装

    res.json({
      success: true,
      message: 'Video processing started'
    });
  } catch (error) {
    console.error('Error processing video:', error);
    res.status(500).json({ error: 'Failed to process video' });
  }
});

// 既存のニュース関連のルート
router.get('/english/news', async (req, res) => {
  try {
    console.log('Express API: Fetching news list...');
    res.json([]);
  } catch (error) {
    console.error('Express API Error:', error);
    res.status(500).json({ error: 'Failed to fetch news list' });
  }
});

router.post('/english/news/generate', async (req, res) => {
  try {
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

    const sendProgress = () => {
      res.write(`data: ${JSON.stringify(progress)}\n\n`);
    };

    console.log('1. Starting news generation...');
    sendProgress();

    const newsPrompt = `Generate 3 current news summaries in the following format:
    1. [Title]
    [Brief summary]
    2. [Title]
    [Brief summary]
    3. [Title]
    [Brief summary]`;

    console.log('2. Generating news with Azure OpenAI...');
    const newsResponse = await axios.post(
      `${AZURE_CONFIG.openai.endpoint}/openai/deployments/${AZURE_CONFIG.openai.deploymentName}/chat/completions?api-version=2023-05-15`,
      {
        messages: [{ role: 'user', content: newsPrompt }],
        temperature: 0.7,
        max_tokens: 800,
      },
      {
        headers: {
          'api-key': AZURE_CONFIG.openai.key,
          'Content-Type': 'application/json',
        },
      }
    );

    const newsSummaries = newsResponse.data.choices[0].message?.content || '';
    const firstNews = newsSummaries.split('2.')[0];

    progress.step = 2;
    progress.message = '会話文を生成中...';
    sendProgress();

    console.log('3. Generating conversation...');
    const conversationPrompt = `Create a natural English conversation between two people (A and B) discussing the following news:\n${firstNews}\nMake it educational and include some useful vocabulary or expressions.`;

    const conversationResponse = await axios.post(
      `${AZURE_CONFIG.openai.endpoint}/openai/deployments/${AZURE_CONFIG.openai.deploymentName}/chat/completions?api-version=2023-05-15`,
      {
        messages: [{ role: 'user', content: conversationPrompt }],
        temperature: 0.7,
        max_tokens: 800,
      },
      {
        headers: {
          'api-key': AZURE_CONFIG.openai.key,
          'Content-Type': 'application/json',
        },
      }
    );

    const conversation = conversationResponse.data.choices[0].message?.content || '';

    progress.step = 3;
    progress.message = '音声を生成中...';
    sendProgress();

    console.log('4. Generating audio...');
    const speechResponse = await axios.post(
      AZURE_CONFIG.speech.endpoint,
      `<speak version='1.0' xml:lang='en-US'>
        <voice xml:lang='en-US' xml:gender='Female' name='en-US-JennyNeural'>
          ${conversation}
        </voice>
      </speak>`,
      {
        headers: {
          'Ocp-Apim-Subscription-Key': AZURE_CONFIG.speech.key,
          'Content-Type': 'application/ssml+xml',
          'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
        },
        responseType: 'arraybuffer',
      }
    );

    const audioFileName = `news-audio-${Date.now()}.mp3`;
    const audioContainerClient = blobServiceClient.getContainerClient('english-news-audio');
    const audioBlobClient = audioContainerClient.getBlockBlobClient(audioFileName);
    await audioBlobClient.uploadData(Buffer.from(speechResponse.data), {
      blobHTTPHeaders: { blobContentType: 'audio/mpeg' }
    });

    progress.step = 4;
    progress.message = '画像を生成中...';
    sendProgress();

    console.log('5. Generating image...');
    const imagePrompt = `Create a detailed image description for this news story that could be used with DALL-E:\n${firstNews}`;

    const imageDescResponse = await axios.post(
      `${AZURE_CONFIG.openai.endpoint}/openai/deployments/${AZURE_CONFIG.openai.deploymentName}/chat/completions?api-version=2023-05-15`,
      {
        messages: [{ role: 'user', content: imagePrompt }],
        temperature: 0.7,
        max_tokens: 800,
      },
      {
        headers: {
          'api-key': AZURE_CONFIG.openai.key,
          'Content-Type': 'application/json',
        },
      }
    );

    const imageDescription = imageDescResponse.data.choices[0].message?.content || '';

    const imageResponse = await axios.post(
      `${AZURE_CONFIG.openai.endpoint}/openai/deployments/${AZURE_CONFIG.openai.deploymentName}/images/generations?api-version=2023-06-01-preview`,
      {
        prompt: imageDescription,
        n: 1,
        size: '1024x1024',
      },
      {
        headers: {
          'api-key': AZURE_CONFIG.openai.key,
          'Content-Type': 'application/json',
        },
      }
    );

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

    progress.step = 5;
    progress.message = '完了';
    
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

router.patch('/english/news/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    console.log('Express API: Updating news:', { id, updateData });
    res.json({ id, ...updateData });
  } catch (error) {
    console.error('Express API Error:', error);
    res.status(500).json({ error: 'Failed to update news' });
  }
});

router.delete('/english/news/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Express API: Deleting news:', id);
    res.status(204).send();
  } catch (error) {
    console.error('Express API Error:', error);
    res.status(500).json({ error: 'Failed to delete news' });
  }
});

export default router;
