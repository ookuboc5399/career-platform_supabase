import express, { Request, Response, Router, RequestHandler } from 'express';
import {
  getEnglishQuestions,
  getEnglishQuestionById,
  createEnglishQuestion,
  updateEnglishQuestion,
  deleteEnglishQuestion,
} from '../lib/supabase-db';

const router = Router();

// CORS設定
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// 設定取得（スタブ化 - 音声は後で対応）
router.get('/settings', async (req, res) => {
  try {
    res.json({
      speech: { key: '', region: '', endpoint: '' },
    });
  } catch (error) {
    console.error('Error getting settings:', error);
    res.status(500).json({ error: 'Failed to get settings' });
  }
});

// 動画の処理（スタブ）
router.post('/movies/process', async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Video processing started',
    });
  } catch (error) {
    console.error('Error processing video:', error);
    res.status(500).json({ error: 'Failed to process video' });
  }
});

// 問題一覧の取得
const getQuestions: RequestHandler = async (req, res) => {
  try {
    const questions = await getEnglishQuestions();
    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
};

// 問題の作成
const createQuestion: RequestHandler = async (req, res) => {
  try {
    const newQuestion = await createEnglishQuestion({
      ...req.body,
      englishId: req.body.englishId || `question-${req.body.id}`,
    });
    res.status(201).json(newQuestion);
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
    delete updateData.englishId;

    const result = await updateEnglishQuestion(id, updateData);
    if (!result) {
      res.status(404).json({ error: 'Question not found' });
      return;
    }
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
    const existing = await getEnglishQuestionById(id);
    if (!existing) {
      res.status(404).json({ error: 'Question not found' });
      return;
    }
    await deleteEnglishQuestion(id);
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

    const questions = await getEnglishQuestions({
      type: 'writing',
      category,
      level,
    });

    if (questions.length === 0) {
      res.status(404).json({ error: 'No questions found' });
      return;
    }

    const randomIndex = Math.floor(Math.random() * questions.length);
    res.json(questions[randomIndex]);
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

    const filters: any = { type: 'reading' };
    if (category && category !== 'all') filters.category = category;
    if (level && level !== 'all') filters.level = level;

    const questions = await getEnglishQuestions(filters);

    if (questions.length === 0) {
      res.status(404).json({ error: 'No questions found' });
      return;
    }

    const randomIndex = Math.floor(Math.random() * questions.length);
    res.json(questions[randomIndex]);
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

    const question = await getEnglishQuestionById(questionId);
    if (!question) {
      res.status(404).json({ error: 'Question not found' });
      return;
    }

    const questions = question.content?.questions || question.questions || [];
    const results = questions.map((subQuestion: any, index: number) => {
      const isCorrect = answers[index] === subQuestion.correctAnswer;
      return {
        isCorrect,
        correctAnswer: subQuestion.options?.[subQuestion.correctAnswer],
        yourAnswer: subQuestion.options?.[answers[index]],
        explanation: subQuestion.explanation,
      };
    });

    res.json(results);
  } catch (error) {
    console.error('Error submitting reading answer:', error);
    res.status(500).json({ error: 'Failed to submit reading answer' });
  }
};

router.get('/questions/reading', getReadingQuestion);
router.get('/questions/writing', getWritingQuestion);
router.post('/questions/reading/submit', express.json(), submitReadingAnswer);
router.post('/questions/writing/submit', express.json(), submitWritingAnswer);
router.get('/questions', getQuestions);
router.post('/questions', express.json(), createQuestion);
router.put('/questions/:id', express.json(), updateQuestion);
router.delete('/questions/:id', deleteQuestion);

export default router;
