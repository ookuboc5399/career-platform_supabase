import dotenv from 'dotenv';
import { createEnglishQuestion } from '../lib/supabase-db';

dotenv.config();

const sampleQuestions = [
  {
    type: 'writing',
    category: 'ai',
    level: 'junior',
    difficulty: 'easy',
    content: {
      question: 'AIとは何ですか？あなたの言葉で説明してください。',
      format: 'translation',
    },
  },
  {
    type: 'writing',
    category: 'book',
    level: 'high',
    difficulty: 'medium',
    content: {
      question: 'あなたが最近読んだ本について、その内容と感想を述べてください。',
      format: 'translation',
    },
  },
  {
    type: 'writing',
    category: 'school',
    level: 'university',
    difficulty: 'hard',
    content: {
      question: '理想的な教育システムについて、あなたの考えを述べてください。',
      format: 'translation',
    },
  },
  {
    type: 'writing',
    category: 'ai',
    level: 'high',
    difficulty: 'medium',
    content: {
      question: 'AIが社会に与える影響について、あなたの意見を述べてください。',
      format: 'translation',
    },
  },
  {
    type: 'writing',
    category: 'ai',
    level: 'university',
    difficulty: 'hard',
    content: {
      question: 'AIの倫理的な課題について、具体例を挙げながら論じてください。',
      format: 'translation',
    },
  },
  {
    type: 'writing',
    category: 'book',
    level: 'junior',
    difficulty: 'easy',
    content: {
      question: 'あなたの好きな本のキャラクターについて説明してください。',
      format: 'translation',
    },
  },
  {
    type: 'writing',
    category: 'book',
    level: 'university',
    difficulty: 'hard',
    content: {
      question: '文学作品が社会に与える影響について、具体例を挙げながら論じてください。',
      format: 'translation',
    },
  },
  {
    type: 'writing',
    category: 'school',
    level: 'junior',
    difficulty: 'easy',
    content: {
      question: 'あなたの学校生活について説明してください。',
      format: 'translation',
    },
  },
  {
    type: 'writing',
    category: 'school',
    level: 'high',
    difficulty: 'medium',
    content: {
      question: '学校でのグループ活動の重要性について、あなたの意見を述べてください。',
      format: 'translation',
    },
  },
];

async function createSampleQuestions() {
  try {
    for (const question of sampleQuestions) {
      const created = await createEnglishQuestion(question);
      console.log(`Created question: ${created.id}`);
    }
    console.log('All sample questions created successfully');
  } catch (error) {
    console.error('Error creating sample questions:', error);
  }
}

createSampleQuestions();
