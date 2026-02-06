import express, { Request, Response, Router, RequestHandler } from 'express';
import { 
  BlobServiceClient, 
  StorageSharedKeyCredential, 
  ContainerClient,
  generateBlobSASQueryParameters, 
  BlobSASPermissions, 
  SASProtocol 
} from '@azure/storage-blob';
import { CosmosClient } from '@azure/cosmos';
import axios from 'axios';
import cors from 'cors';

// SASトークン生成関数
async function generateSasToken(
  containerClient: ContainerClient,
  blobName: string,
  permissions: string,
  expiryMinutes: number
): Promise<string> {
  const startsOn = new Date();
  const expiresOn = new Date(startsOn);
  expiresOn.setMinutes(startsOn.getMinutes() + expiryMinutes);

  const sasOptions = {
    containerName: containerClient.containerName,
    blobName: blobName,
    permissions: BlobSASPermissions.parse(permissions),
    startsOn: startsOn,
    expiresOn: expiresOn,
    protocol: SASProtocol.Https
  };

  const sasToken = generateBlobSASQueryParameters(
    sasOptions,
    containerClient.credential as StorageSharedKeyCredential
  ).toString();

  return sasToken;
}

const router = Router();

// CORS設定
router.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:4000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Cosmos DB設定
const client = new CosmosClient({
  endpoint: process.env.COSMOS_DB_ENDPOINT || '',
  key: process.env.COSMOS_DB_KEY || ''
});
const database = client.database('career-platform');
const container = database.container('english-questions');

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
router.get('/settings', async (req, res) => {
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
router.post('/movies/process', async (req, res) => {
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

// 英語問題のCRUDエンドポイント
// 問題一覧の取得
const getQuestions: RequestHandler = async (req, res) => {
  try {
    const { resources: questions } = await container.items
      .query({
        query: "SELECT * FROM c ORDER BY c.createdAt DESC"
      })
      .fetchAll();
    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
};

// 問題の作成
const createQuestion: RequestHandler = async (req, res) => {
  try {
    const newQuestion = {
      ...req.body,
      englishId: req.body.englishId || `question-${req.body.id}`
    };

    const { resource: createdQuestion } = await container.items.create(newQuestion);
    res.status(201).json(createdQuestion);
  } catch (error) {
    console.error('Error creating question:', error);
    res.status(500).json({ error: 'Failed to create question' });
  }
};

// 問題の更新
const updateQuestion: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const { englishId } = updateData;
    const partitionKey = englishId || id;

    const { resource: existingQuestion } = await container.item(id, partitionKey).read();
    if (!existingQuestion) {
      res.status(404).json({ error: 'Question not found' });
      return;
    }

    const updatedQuestion = {
      ...existingQuestion,
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    const { resource: result } = await container.item(id, partitionKey).replace(updatedQuestion);
    res.json(result);
  } catch (error) {
    console.error('Error updating question:', error);
    res.status(500).json({ error: 'Failed to update question' });
  }
};

// 問題の削除
const deleteQuestion: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { resource: existingQuestion } = await container.item(id, id).read();
    if (!existingQuestion) {
      res.status(404).json({ error: 'Question not found' });
      return;
    }

    const partitionKey = existingQuestion.englishId || id;
    await container.item(id, partitionKey).delete();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).json({ error: 'Failed to delete question' });
  }
};

// 英作文問題の取得
const getWritingQuestion: RequestHandler = async (req, res) => {
  try {
    const category = req.query.category as string;
    const level = req.query.level as string;

    if (!category || !level) {
      res.status(400).json({ error: 'Missing parameters' });
      return;
    }

    const { resources: questions } = await container.items
      .query({
        query: "SELECT * FROM c WHERE c.type = 'writing' AND c.category = @category AND c.level = @level",
        parameters: [
          { name: '@category', value: category },
          { name: '@level', value: level }
        ]
      })
      .fetchAll();

    if (questions.length === 0) {
      res.status(404).json({ error: 'No questions found' });
      return;
    }

    // ランダムに1問選択
    const randomIndex = Math.floor(Math.random() * questions.length);
    const question = questions[randomIndex];

    res.json(question);
  } catch (error) {
    console.error('Error fetching writing question:', error);
    res.status(500).json({ error: 'Failed to fetch writing question' });
  }
};

// 長文読解問題の取得
const getReadingQuestion: RequestHandler = async (req, res) => {
  try {
    const category = req.query.category as string;
    const level = req.query.level as string;

    console.log('Reading question request:', { category, level });

    let query = "SELECT * FROM c WHERE c.type = 'reading'";
    const parameters: { name: string; value: string }[] = [];

    if (category && category !== 'all') {
      query += " AND c.category = @category";
      parameters.push({ name: '@category', value: category });
    }

    if (level && level !== 'all') {
      query += " AND c.level = @level";
      parameters.push({ name: '@level', value: level });
    }

    console.log('Query:', query);
    console.log('Parameters:', parameters);

    const { resources: questions } = await container.items
      .query({
        query,
        parameters
      })
      .fetchAll();

    console.log('Found questions:', questions);

    if (questions.length === 0) {
      console.log('No questions found');
      res.status(404).json({ error: 'No questions found' });
      return;
    }

    // ランダムに1問選択
    const randomIndex = Math.floor(Math.random() * questions.length);
    const question = questions[randomIndex];

    console.log('Selected question:', question);
    res.json(question);
  } catch (error) {
    console.error('Error fetching reading question:', error);
    res.status(500).json({ error: 'Failed to fetch reading question' });
  }
};

// 英作文の回答を送信
const submitWritingAnswer: RequestHandler = async (req, res) => {
  try {
    const { questionId, answer } = req.body;

    if (!questionId || !answer) {
      res.status(400).json({ error: 'Missing parameters' });
      return;
    }

    // TODO: 回答の評価処理を実装

    res.json({ success: true });
  } catch (error) {
    console.error('Error submitting writing answer:', error);
    res.status(500).json({ error: 'Failed to submit writing answer' });
  }
};

// 長文読解の回答を送信
const submitReadingAnswer: RequestHandler = async (req, res) => {
  try {
    const { questionId, answers } = req.body;

    if (!questionId || !answers) {
      res.status(400).json({ error: 'Missing parameters' });
      return;
    }

    const { resource: question } = await container.item(questionId, questionId).read();
    if (!question) {
      res.status(404).json({ error: 'Question not found' });
      return;
    }

    const results = question.questions.map((subQuestion: any, index: number) => {
      const isCorrect = answers[index] === subQuestion.correctAnswer;
      return {
        isCorrect,
        correctAnswer: subQuestion.options[subQuestion.correctAnswer],
        yourAnswer: subQuestion.options[answers[index]],
        explanation: subQuestion.explanation
      };
    });

    res.json(results);
  } catch (error) {
    console.error('Error submitting reading answer:', error);
    res.status(500).json({ error: 'Failed to submit reading answer' });
  }
};

// ルーターの設定
// ルーティングの設定
router.get('/questions/reading', getReadingQuestion);
router.get('/questions/writing', getWritingQuestion);
router.post('/questions/reading/submit', express.json(), submitReadingAnswer);
router.post('/questions/writing/submit', express.json(), submitWritingAnswer);
router.post('/questions/reading/submit', express.json(), submitReadingAnswer);
router.get('/questions', getQuestions);
router.post('/questions', express.json(), createQuestion);
router.put('/questions/:id', express.json(), updateQuestion);
router.delete('/questions/:id', deleteQuestion);

export default router;
