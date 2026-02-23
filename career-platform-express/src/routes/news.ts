import { Router, Request, Response } from 'express';
import {
  getEnglishNewsList,
  getEnglishNewsById,
  createEnglishNews,
  deleteEnglishNews,
} from '../lib/supabase-db';
import { fetchEnglishNews } from '../lib/news-api';
import { NewsContent } from '../types/api';

const router = Router();

// NewsAPIからニュースを取得してSupabaseに保存
router.post('/external', async (req, res) => {
  try {
    const articles = await fetchEnglishNews();

    for (const article of articles) {
      await createEnglishNews({
        id: article.id || `news-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        title: article.title,
        content: article,
        type: 'external',
        difficulty: article.level,
      });
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
    const internalNews = await getEnglishNewsList();

    let externalNews: NewsContent[] = [];
    try {
      externalNews = await fetchEnglishNews();
    } catch (error) {
      console.error('Error fetching external news:', error);
    }

    const allNews = [...internalNews, ...externalNews].sort(
      (a, b) =>
        new Date((b as any).createdAt || 0).getTime() -
        new Date((a as any).createdAt || 0).getTime()
    );

    res.json(allNews);
  } catch (error) {
    console.error('Express API Error:', error);
    res.status(500).json({ error: 'Failed to fetch news list' });
  }
});

// 自動生成ニュース（スタブ化 - Phase 3でAI機能をスタブ化）
router.post('/generate', async (req, res) => {
  try {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    res.write(
      `data: ${JSON.stringify({
        step: 4,
        total: 4,
        message: 'AI機能は一時的に無効です。後でOpenAI API等に置き換えます。',
        results: [],
      })}\n\n`
    );
    res.end();
  } catch (error) {
    console.error('Error generating news content:', error);
    res.write(`data: ${JSON.stringify({ error: 'Failed to generate news content' })}\n\n`);
    res.end();
  }
});

// 外部ニュースの処理（スタブ化）
router.post('/generate/external', async (req, res) => {
  try {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    res.write(
      `data: ${JSON.stringify({
        step: 3,
        total: 3,
        message: 'AI機能は一時的に無効です。',
        result: null,
      })}\n\n`
    );
    res.end();
  } catch (error) {
    console.error('Error processing external news:', error);
    res.write(`data: ${JSON.stringify({ error: 'Failed to process external news' })}\n\n`);
    res.end();
  }
});

// ニュースの削除
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const existing = await getEnglishNewsById(id);
    if (!existing) {
      res.status(404).json({ error: 'News not found' });
      return;
    }
    await deleteEnglishNews(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting news:', error);
    res.status(500).json({ error: 'Failed to delete news' });
  }
});

// 音声ファイルのダウンロード（スタブ - Supabase Storage移行後に実装）
router.get('/audio/:filename', async (req, res) => {
  try {
    res.status(503).json({
      error: 'Audio service is temporarily unavailable. Migrating to Supabase Storage.',
    });
  } catch (error) {
    console.error('Error downloading audio:', error);
    res.status(500).json({ error: 'Failed to download audio file' });
  }
});

export default router;
