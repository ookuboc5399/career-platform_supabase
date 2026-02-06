import { CosmosClient } from '@azure/cosmos';
import dotenv from 'dotenv';

dotenv.config();

const client = new CosmosClient({
  endpoint: process.env.COSMOS_DB_ENDPOINT || '',
  key: process.env.COSMOS_DB_KEY || ''
});

const database = client.database('career-platform');
const container = database.container('english-questions');

const sampleQuestions = [
  {
    id: Date.now().toString(),
    type: 'writing',
    category: 'ai',
    level: 'junior',
    content: {
      question: 'AIとは何ですか？あなたの言葉で説明してください。',
      format: 'translation'
    },
    createdAt: new Date().toISOString()
  },
  {
    id: (Date.now() + 1).toString(),
    type: 'writing',
    category: 'book',
    level: 'high',
    content: {
      question: 'あなたが最近読んだ本について、その内容と感想を述べてください。',
      format: 'translation'
    },
    createdAt: new Date().toISOString()
  },
  {
    id: (Date.now() + 2).toString(),
    type: 'writing',
    category: 'school',
    level: 'university',
    content: {
      question: '理想的な教育システムについて、あなたの考えを述べてください。',
      format: 'translation'
    },
    createdAt: new Date().toISOString()
  },
  // 各カテゴリーに各レベルの問題を追加
  {
    id: (Date.now() + 3).toString(),
    type: 'writing',
    category: 'ai',
    level: 'high',
    content: {
      question: 'AIが社会に与える影響について、あなたの意見を述べてください。',
      format: 'translation'
    },
    createdAt: new Date().toISOString()
  },
  {
    id: (Date.now() + 4).toString(),
    type: 'writing',
    category: 'ai',
    level: 'university',
    content: {
      question: 'AIの倫理的な課題について、具体例を挙げながら論じてください。',
      format: 'translation'
    },
    createdAt: new Date().toISOString()
  },
  {
    id: (Date.now() + 5).toString(),
    type: 'writing',
    category: 'book',
    level: 'junior',
    content: {
      question: 'あなたの好きな本のキャラクターについて説明してください。',
      format: 'translation'
    },
    createdAt: new Date().toISOString()
  },
  {
    id: (Date.now() + 6).toString(),
    type: 'writing',
    category: 'book',
    level: 'university',
    content: {
      question: '文学作品が社会に与える影響について、具体例を挙げながら論じてください。',
      format: 'translation'
    },
    createdAt: new Date().toISOString()
  },
  {
    id: (Date.now() + 7).toString(),
    type: 'writing',
    category: 'school',
    level: 'junior',
    content: {
      question: 'あなたの学校生活について説明してください。',
      format: 'translation'
    },
    createdAt: new Date().toISOString()
  },
  {
    id: (Date.now() + 8).toString(),
    type: 'writing',
    category: 'school',
    level: 'high',
    content: {
      question: '学校でのグループ活動の重要性について、あなたの意見を述べてください。',
      format: 'translation'
    },
    createdAt: new Date().toISOString()
  }
];

async function createSampleQuestions() {
  try {
    for (const question of sampleQuestions) {
      await container.items.create(question);
      console.log(`Created question: ${question.id}`);
    }
    console.log('All sample questions created successfully');
  } catch (error) {
    console.error('Error creating sample questions:', error);
  }
}

createSampleQuestions();
