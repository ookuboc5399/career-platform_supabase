import { Router, Request, Response ,RequestHandler  } from 'express';
import { BlobServiceClient, StorageSharedKeyCredential } from '@azure/storage-blob';
import axios from 'axios';
import { generateSasToken } from '../lib/storage';
import { NewsContent } from '../types/api';
import { database } from '../lib/cosmos-db';
import { fetchEnglishNews } from '../lib/news-api';

interface Result {
  id: string;
  title: string;
  content: string;
  conversation?: string;
  audioUrl: string;
  audioFileName: string;
  imageUrl: string;
  createdAt: string;
  isPublished: boolean;
  publishedAt: string | null;
  sourceUrl?: string;
}

const router = Router();

// Azure Blob Storage設定
const blobServiceClient = new BlobServiceClient(
  `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
  new StorageSharedKeyCredential(
    process.env.AZURE_STORAGE_ACCOUNT_NAME || '',
    process.env.AZURE_STORAGE_ACCOUNT_KEY || ''
  )
);

// NewsAPIからニュースを取得
router.post('/external', async (req, res) => {
  try {
    const articles = await fetchEnglishNews();
    
    // 取得したニュースをCosmosDBに保存
    for (const article of articles) {
      await database.container('english-news').items.create(article);
    }

    res.status(201).json({ message: 'News articles fetched and saved successfully' });
  } catch (error) {
    console.error('Error fetching news from NewsAPI:', error);
    res.status(500).json({ error: 'Failed to fetch news from NewsAPI' });
  }
});

// ニュース一覧の取得
router.get('/', async (req, res) => {
  try {
    console.log('Express API: Fetching news list...');
    
    // 内部ニュースを取得
    const { resources: internalNews } = await database.container('english-news').items
      .query({
        query: "SELECT * FROM c ORDER BY c.createdAt DESC"
      })
      .fetchAll();

    // 外部ニュースを取得
    let externalNews: NewsContent[] = [];
    try {
      externalNews = await fetchEnglishNews();
    } catch (error) {
      console.error('Error fetching external news:', error);
    }

    // 内部ニュースと外部ニュースを結合して日付順にソート
    const allNews = [...internalNews, ...externalNews].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    res.json(allNews);
  } catch (error) {
    console.error('Express API Error:', error);
    res.status(500).json({ error: 'Failed to fetch news list' });
  }
});

// 自動生成ニュース
router.post('/generate', async (req, res) => {
  try {
    if (!process.env.AZURE_OPENAI_GPT4_ENDPOINT || !process.env.AZURE_OPENAI_GPT4_API_KEY || !process.env.AZURE_OPENAI_GPT4_DEPLOYMENT_NAME) {
      throw new Error('Required Azure OpenAI GPT-4 configuration is missing');
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    const progress = {
      step: 1,
      total: 4,
      message: 'ニュースを生成中...',
    };

    const sendProgress = () => {
      res.write(`data: ${JSON.stringify(progress)}\n\n`);
    };

    sendProgress();

    const newsPrompt = `Generate 3 current news summaries in the following format:
    1. [Title]
    [Brief summary]
    2. [Title]
    [Brief summary]
    3. [Title]
    [Brief summary]

    For each news summary, also provide:
    - 5 important vocabulary words with their definitions and example sentences
    - 3 key grammar points used in the text with explanations
    - 2 useful expressions or idioms from the text with their meanings`;

    const newsResponse = await axios.post(
      `${process.env.AZURE_OPENAI_GPT4_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_GPT4_DEPLOYMENT_NAME}/chat/completions?api-version=${process.env.AZURE_OPENAI_GPT4_API_VERSION}`,
      {
        messages: [{ role: 'user', content: newsPrompt }],
        temperature: 0.7,
        max_tokens: 1500,
      },
      {
        headers: {
          'api-key': process.env.AZURE_OPENAI_GPT4_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    const newsSummaries = newsResponse.data.choices[0].message?.content || '';

    // ニュースの内容をファイルに保存
    const fs = require('fs');
    const path = require('path');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const newsFilePath = path.join(process.cwd(), '..', 'career-platform-nextjs', 'public', 'logs', `news-${timestamp}.txt`);
    
    // logsディレクトリが存在しない場合は作成
    const logsDir = path.join(process.cwd(), '..', 'career-platform-nextjs', 'public', 'logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    fs.writeFileSync(newsFilePath, newsSummaries);

    // 3つのニュースに分割して順番に処理
    const newsArray = newsSummaries.split(/\d+\.\s+/).filter(Boolean);
    const results = [];

    // 会話文生成を直列化
    for (let i = 0; i < newsArray.length; i++) {
      const newsItem = newsArray[i];
      // 各会話文生成の間に待機
      if (i > 0) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      progress.step = 2;
      progress.message = `会話文を生成中... (${i + 1}/${newsArray.length})`;
      sendProgress();

      // 会話文の生成
      const conversationPrompt = `Create a natural 5-minute English conversation about this news. Make it educational and include useful vocabulary. Write it as a flowing dialogue without speaker names or labels. Each new line should be a different speaker, with the context and tone making it clear who is speaking:\n${newsItem}`;

      const conversationResponse = await axios.post(
        `${process.env.AZURE_OPENAI_GPT4_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_GPT4_DEPLOYMENT_NAME}/chat/completions?api-version=${process.env.AZURE_OPENAI_GPT4_API_VERSION}`,
        {
          messages: [{ role: 'user', content: conversationPrompt }],
          temperature: 0.7,
          max_tokens: 1500,
        },
        {
          headers: {
            'api-key': process.env.AZURE_OPENAI_GPT4_API_KEY,
            'Content-Type': 'application/json',
          },
        }
      );

      const conversation = conversationResponse.data.choices[0].message?.content || '';

      // 会話の内容をファイルに保存
      const conversationFilePath = path.join(process.cwd(), '..', 'career-platform-nextjs', 'public', 'logs', `conversation-${timestamp}-${results.length + 1}.txt`);
      fs.writeFileSync(conversationFilePath, conversation);

      progress.step = 3;
      progress.message = '音声を生成中...';
      sendProgress();

      // 音声の生成（2人の話者）
      const lines = conversation.split('\n');
      let currentSpeaker = 'Female';
      const ssml = `<speak version='1.0' xml:lang='en-US'>
        ${lines.map((line: string) => {
          if (line.trim() === '') return '';
          currentSpeaker = currentSpeaker === 'Female' ? 'Male' : 'Female';
          const voice = currentSpeaker === 'Female' ? 'en-US-JennyNeural' : 'en-US-GuyNeural';
          return `<voice xml:lang='en-US' xml:gender='${currentSpeaker}' name='${voice}'>${line}</voice>`;
        }).join('\n')}
      </speak>`;

      const speechResponse = await axios.post(
        `https://${process.env.AZURE_SPEECH_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`,
        ssml,
        {
          headers: {
            'Ocp-Apim-Subscription-Key': process.env.AZURE_SPEECH_KEY,
            'Content-Type': 'application/ssml+xml',
            'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
          },
          responseType: 'arraybuffer',
        }
      );

      // 音声ファイルの保存
      const audioFileName = `news-audio-${timestamp}-${results.length + 1}.mp3`;
      const audioContainerClient = blobServiceClient.getContainerClient('english-news-audio');
      const audioBlobClient = audioContainerClient.getBlockBlobClient(audioFileName);
      await audioBlobClient.uploadData(Buffer.from(speechResponse.data), {
        blobHTTPHeaders: { blobContentType: 'audio/mpeg' }
      });

      const sasToken = generateSasToken('english-news-audio', audioFileName);
      const audioUrl = `${audioBlobClient.url}?${sasToken}`;

      const result: Result = {
        id: `${Date.now()}-${results.length + 1}`,
        title: newsItem.split('\n')[0].trim(),
        content: newsItem.trim(),
        conversation,
        audioUrl,
        audioFileName,
        imageUrl: '/images/news-placeholder.jpg',
        createdAt: new Date().toISOString(),
        isPublished: false,
        publishedAt: null,
      };

      results.push(result);
    }

    progress.step = 4;
    progress.message = '完了';

    res.write(`data: ${JSON.stringify({ ...progress, results })}\n\n`);
    res.end();
  } catch (error) {
    console.error('Error generating news content:', error);
    if (axios.isAxiosError(error)) {
      res.write(`data: ${JSON.stringify({ error: `API Error: ${error.message}` })}\n\n`);
    } else if (error instanceof Error) {
      res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    } else {
      res.write(`data: ${JSON.stringify({ error: 'Failed to generate news content' })}\n\n`);
    }
    res.end();
  }
});

// 外部ニュースの処理
router.post('/generate/external', async (req, res) => {
  try {
    const { title, url } = req.body;

    if (!title || !url) {
      throw new Error('Title and URL are required');
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    const progress = {
      step: 1,
      total: 3,
      message: 'ニュースを生成中...',
    };

    const sendProgress = () => {
      res.write(`data: ${JSON.stringify(progress)}\n\n`);
    };

    sendProgress();

    const newsPrompt = `Create a detailed news article based on this title: "${title}" and URL: ${url}. 
    Include:
    - A comprehensive summary of the news
    - 5 important vocabulary words with their definitions and example sentences
    - 3 key grammar points used in the text with explanations
    - 2 useful expressions or idioms from the text with their meanings`;

    const newsResponse = await axios.post(
      `${process.env.AZURE_OPENAI_GPT4_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_GPT4_DEPLOYMENT_NAME}/chat/completions?api-version=${process.env.AZURE_OPENAI_GPT4_API_VERSION}`,
      {
        messages: [{ role: 'user', content: newsPrompt }],
        temperature: 0.7,
        max_tokens: 1500,
      },
      {
        headers: {
          'api-key': process.env.AZURE_OPENAI_GPT4_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    const newsContent = newsResponse.data.choices[0].message?.content || '';

    progress.step = 2;
    progress.message = '音声を生成中...';
    sendProgress();

    // 単一の話者で記事を読み上げ
    const ssml = `<speak version='1.0' xml:lang='en-US'>
      <voice xml:lang='en-US' xml:gender='Male' name='en-US-GuyNeural'>
        ${newsContent}
      </voice>
    </speak>`;

    const speechResponse = await axios.post(
      `https://${process.env.AZURE_SPEECH_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`,
      ssml,
      {
        headers: {
          'Ocp-Apim-Subscription-Key': process.env.AZURE_SPEECH_KEY,
          'Content-Type': 'application/ssml+xml',
          'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
        },
        responseType: 'arraybuffer',
      }
    );

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const audioFileName = `news-audio-external-${timestamp}.mp3`;
    const audioContainerClient = blobServiceClient.getContainerClient('english-news-audio');
    const audioBlobClient = audioContainerClient.getBlockBlobClient(audioFileName);
    await audioBlobClient.uploadData(Buffer.from(speechResponse.data), {
      blobHTTPHeaders: { blobContentType: 'audio/mpeg' }
    });

    const sasToken = generateSasToken('english-news-audio', audioFileName);
    const audioUrl = `${audioBlobClient.url}?${sasToken}`;

    const result: Result = {
      id: Date.now().toString(),
      title,
      content: newsContent,
      sourceUrl: url,
      audioUrl,
      audioFileName,
      imageUrl: '/images/news-placeholder.jpg',
      createdAt: new Date().toISOString(),
      isPublished: false,
      publishedAt: null,
    };

    progress.step = 3;
    progress.message = '完了';

    res.write(`data: ${JSON.stringify({ ...progress, result })}\n\n`);
    res.end();
  } catch (error) {
    console.error('Error processing external news:', error);
    if (axios.isAxiosError(error)) {
      res.write(`data: ${JSON.stringify({ error: `API Error: ${error.message}` })}\n\n`);
    } else if (error instanceof Error) {
      res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    } else {
      res.write(`data: ${JSON.stringify({ error: 'Failed to process external news' })}\n\n`);
    }
    res.end();
  }
});

// ニュースの削除
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const container = database.container('english-news');

    // ニュースの存在確認
    const { resource: existingNews } = await container.item(id, id).read();
    if (!existingNews) {
      res.status(404).json({ error: 'News not found' });
      return;
    }

    // ニュースの削除
    await container.item(id, id).delete();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting news:', error);
    res.status(500).json({ error: 'Failed to delete news' });
  }
});


// 音声ファイルのダウンロード
router.get('/audio/:filename', async (req, res) => {
  try {
    const containerClient = blobServiceClient.getContainerClient('english-news-audio');
    const blobClient = containerClient.getBlobClient(req.params.filename);

    const exists = await blobClient.exists();
    if (!exists) {
      res.status(404).json({ error: 'Audio file not found' });
      return;
    }

    const downloadBlockBlobResponse = await blobClient.download();
    if (!downloadBlockBlobResponse.readableStreamBody) {
      throw new Error('Failed to download audio file');
    }

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Disposition', `attachment; filename=${req.params.filename}`);

    downloadBlockBlobResponse.readableStreamBody.pipe(res);
  } catch (error) {
    console.error('Error downloading audio:', error);
    res.status(500).json({ error: 'Failed to download audio file' });
  }
});

export default router;
