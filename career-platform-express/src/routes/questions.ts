import express, { Request, Response, Router } from 'express';
import {
  getCertificationQuestions,
  searchCertificationQuestions,
  createCertificationQuestion,
  updateCertificationQuestion,
  deleteCertificationQuestion,
  CreateCertificationQuestionInput
} from '../lib/supabase-db';
import { recordQuestionAnswer, getUserQuestionProgress } from '../lib/supabase-db';

const router = express.Router({ mergeParams: true }) as Router;

// 問題を検索
router.get('/search', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id: certificationId } = req.params as Record<string, string>;
    const { keyword, year, category } = req.query as Record<string, string>;

    if (!certificationId) {
      res.status(400).json({ error: 'Missing certificationId in parameters' });
      return;
    }

    const questions = await searchCertificationQuestions(certificationId, {
      keyword: keyword as string,
      year: year as string,
      category: category as string,
    });

    // フロントエンド形式に変換（choices → options, correctAnswer → correctAnswers配列）
    const formattedQuestions = questions.map(q => ({
      ...q,
      options: (q.choices || []).map(choice => ({
        id: choice.id,
        text: choice.text,
        imageUrl: choice.imageUrl || null,
      })),
      correctAnswers: [q.correctAnswer],
      questionNumber: q.questionNumber || 0, // 問題番号を返す（なければ0）
    }));

    res.json(formattedQuestions);
  } catch (error) {
    console.error('Error searching questions:', error);
    res.status(500).json({ error: 'Failed to search questions' });
  }
});

// 特定の資格の問題を取得
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id: certificationId } = req.params as Record<string, string>;
    if (!certificationId) {
      res.status(400).json({ error: 'Missing certificationId in parameters' });
      return;
    }

    const questions = await getCertificationQuestions(certificationId);
    
    // フロントエンド形式に変換（choices → options, correctAnswer → correctAnswers配列）
    const formattedQuestions = questions.map(q => ({
      ...q,
      options: (q.choices || []).map(choice => ({
        id: choice.id,
        text: choice.text,
        imageUrl: choice.imageUrl || null,
      })),
      correctAnswers: [q.correctAnswer],
      questionNumber: q.questionNumber || 0, // 問題番号を返す（なければ0）
    }));
    
    res.json(formattedQuestions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

// 問題を作成
router.post('/', express.json(), async (req: Request, res: Response): Promise<void> => {
  try {
    const { id: certificationId } = req.params as Record<string, string>;
    if (!certificationId) {
      res.status(400).json({ error: 'Missing certificationId in parameters' });
      return;
    }

    const questionData = req.body;

    // フロントエンドの形式（options, correctAnswers）からSupabase形式（choices, correctAnswer）に変換
    const choices = (questionData.options || []).map((option: any, index: number) => ({
      id: option.id || `choice-${index}`,
      text: option.text || '',
      imageUrl: option.imageUrl || null,
    }));

    // correctAnswersが配列の場合は最初の要素を使用（単一選択の場合）
    const correctAnswer = Array.isArray(questionData.correctAnswers) 
      ? questionData.correctAnswers[0] 
      : questionData.correctAnswer || questionData.correctAnswers || 0;

    const createInput: CreateCertificationQuestionInput = {
      certificationId,
      question: questionData.question,
      explanation: questionData.explanation || '',
      year: questionData.year || '',
      category: questionData.category || '',
      mainCategory: questionData.mainCategory || '',
      choices,
      correctAnswer,
      questionImage: questionData.questionImage || null,
      explanationImage: questionData.explanationImage || null,
      questionType: questionData.questionType || 'normal',
      codeSnippet: questionData.codeSnippet || null,
    };

    // 任意の問題番号を受け取り
    if (typeof questionData.questionNumber === 'number') {
      (createInput as any).questionNumber = questionData.questionNumber;
    }

    const createdQuestion = await createCertificationQuestion(createInput);
    
    // フロントエンド形式に変換
    const formattedQuestion = {
      ...createdQuestion,
      options: (createdQuestion.choices || []).map(choice => ({
        id: choice.id,
        text: choice.text,
        imageUrl: choice.imageUrl || null,
      })),
      correctAnswers: [createdQuestion.correctAnswer],
      questionNumber: createdQuestion.questionNumber || 0, // 問題番号を返す
    };
    
    res.status(201).json(formattedQuestion);
  } catch (error) {
    console.error('Error creating question:', error);
    res.status(500).json({ error: 'Failed to create question' });
  }
});

// 問題を更新
router.put('/:questionId', express.json(), async (req: Request, res: Response): Promise<void> => {
  try {
    const { id: certificationId, questionId } = req.params as Record<string, string>;
    if (!certificationId || !questionId) {
      res.status(400).json({ error: 'Missing required parameters' });
      return;
    }

    const questionData = req.body;

    // フロントエンドの形式からSupabase形式に変換
    const updateData: Partial<CreateCertificationQuestionInput> = {};

    if (questionData.question !== undefined) updateData.question = questionData.question;
    if (questionData.explanation !== undefined) updateData.explanation = questionData.explanation;
    if (questionData.year !== undefined) updateData.year = questionData.year;
    if (questionData.category !== undefined) updateData.category = questionData.category;
    if (questionData.mainCategory !== undefined) updateData.mainCategory = questionData.mainCategory;
    if (questionData.options !== undefined) {
      updateData.choices = questionData.options.map((option: any, index: number) => ({
        id: option.id || `choice-${index}`,
        text: option.text || '',
        imageUrl: option.imageUrl || null,
      }));
    }
    if (questionData.correctAnswers !== undefined) {
      updateData.correctAnswer = Array.isArray(questionData.correctAnswers)
        ? questionData.correctAnswers[0]
        : questionData.correctAnswers;
    }
    if (questionData.questionImage !== undefined) updateData.questionImage = questionData.questionImage;
    if (questionData.explanationImage !== undefined) updateData.explanationImage = questionData.explanationImage;
    if (questionData.questionType !== undefined) updateData.questionType = questionData.questionType;
    if (questionData.questionNumber !== undefined) updateData.questionNumber = questionData.questionNumber;
    if (questionData.codeSnippet !== undefined) updateData.codeSnippet = questionData.codeSnippet;

    const updatedQuestion = await updateCertificationQuestion(questionId, updateData);
    if (!updatedQuestion) {
      res.status(404).json({ error: 'Question not found' });
      return;
    }

    // フロントエンド形式に変換
    const formattedQuestion = {
      ...updatedQuestion,
      options: (updatedQuestion.choices || []).map(choice => ({
        id: choice.id,
        text: choice.text,
        imageUrl: choice.imageUrl || null,
      })),
      correctAnswers: [updatedQuestion.correctAnswer],
      questionNumber: updatedQuestion.questionNumber || 0, // 問題番号を返す
    };

    res.json(formattedQuestion);
  } catch (error) {
    console.error('Error updating question:', error);
    res.status(500).json({ error: 'Failed to update question' });
  }
});

// 問題を削除
router.delete('/:questionId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id: certificationId, questionId } = req.params as Record<string, string>;
    if (!certificationId || !questionId) {
      res.status(400).json({ error: 'Missing required parameters' });
      return;
    }

    await deleteCertificationQuestion(questionId);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).json({ error: 'Failed to delete question' });
  }
});

export default router;

// ユーザー回答の記録
router.post('/answers', express.json(), async (req: Request, res: Response): Promise<void> => {
  try {
    const { id: certificationId } = req.params as Record<string, string>;
    const { userId, questionId, correct, selectedAnswer } = req.body || {};

    if (!certificationId || !userId || !questionId || typeof correct !== 'boolean') {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const progress = await recordQuestionAnswer({
      userId,
      certificationId,
      questionId,
      correct,
      selectedAnswer: typeof selectedAnswer === 'number' ? selectedAnswer : null,
    });

    res.json(progress);
  } catch (error) {
    console.error('Error recording answer:', error);
    res.status(500).json({ error: 'Failed to record answer' });
  }
});

// ユーザーの進捗取得
router.get('/progress', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id: certificationId } = req.params as Record<string, string>;
    const userId = (req.query.userId as string) || '';
    if (!certificationId || !userId) {
      res.status(400).json({ error: 'Missing required parameters' });
      return;
    }

    const progress = await getUserQuestionProgress(userId, certificationId);
    res.json(progress || null);
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});
