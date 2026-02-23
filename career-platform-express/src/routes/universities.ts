import express from 'express';
import { scrapeUniversities } from '../lib/university-scraper';
import { getUniversities, getUniversity, createUniversity, updateUniversity, deleteUniversity } from '../lib/supabase-db';
import { writeUniversitiesToSheet } from '../lib/sheets-writer';

const router = express.Router();

// 大学情報の取得
router.get('/', async (req, res, next) => {
  try {
    console.log('[' + new Date().toISOString() + '] GET /api/universities');
    console.log('Request Headers:', req.headers);

    const universities = await getUniversities();
    
    // フロントエンドの型定義に合わせて name と website を追加
    const formattedUniversities = universities.map(u => ({
      ...u,
      name: u.title,
      website: u.websiteUrl,
    }));

    console.log('Universities fetched successfully:', formattedUniversities.length);
    res.json(formattedUniversities);
  } catch (error) {
    console.error('Error loading universities:', error);
    next(error);
  }
});

// 大学情報の取得（単体）
router.get('/:id', async (req, res, next) => {
  try {
    const university = await getUniversity(req.params.id);
    if (!university) {
      res.status(404).json({ error: 'University not found' });
      return;
    }
    res.json({
      ...university,
      name: university.title,
      website: university.websiteUrl,
    });
  } catch (error) {
    console.error('Error loading university:', error);
    next(error);
  }
});

// 大学情報の更新
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, website, ...rest } = req.body;
    
    // フロントエンドが送る name と website を title と websiteUrl に変換
    const updateData = {
      ...rest,
      title: name || rest.title,
      websiteUrl: website || rest.websiteUrl,
    };

    const updatedUniversity = await updateUniversity(id, updateData);
    
    if (!updatedUniversity) {
      res.status(404).json({ error: 'University not found' });
      return;
    }

    // フロントエンドの型定義に合わせて name と website を追加
    res.json({
      ...updatedUniversity,
      name: updatedUniversity.title,
      website: updatedUniversity.websiteUrl,
    });
  } catch (error) {
    console.error('Error updating university:', error);
    next(error);
  }
});

// 大学情報の削除
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await deleteUniversity(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting university:', error);
    next(error);
  }
});

// 大学情報のスクレイピング
router.post('/scrape', async (req, res, next) => {
  try {
    // 大学情報をスクレイピング
    const scrapedUniversities = await scrapeUniversities();

    // 既存のデータを読み込む
    const existingUniversities = await getUniversities();
    let addedCount = 0;

    // 新しい大学情報をSupabaseに追加
    for (const university of scrapedUniversities) {
      const existingIndex = existingUniversities.findIndex(u => u.title === university.name);
      if (existingIndex === -1) {
        // スクレイピングデータからlocationを 'japan' または 'overseas' に変換
        const location = university.location && university.location.includes('海外') ? 'overseas' : 'japan';
        
        await createUniversity({
          title: university.name,
          description: university.description || '',
          imageUrl: university.imageUrl || '',
          websiteUrl: university.website || '',
          type: 'university' as const,
          location: location as 'japan' | 'overseas',
        });
        addedCount++;
      }
    }

    // スクレイピング結果をスプレッドシートに書き込む（重複チェック付き）
    let sheetResult = { written: 0, skipped: 0, total: 0 };
    try {
      sheetResult = await writeUniversitiesToSheet(scrapedUniversities);
      console.log('スプレッドシートへの書き込み結果:', sheetResult);
    } catch (sheetError) {
      console.error('スプレッドシートへの書き込みエラー（処理は続行）:', sheetError);
      // スプレッドシートへの書き込みが失敗しても、Supabaseへの追加は成功しているので処理を続行
    }

    const total = await getUniversities();

    res.json({
      message: '大学情報の収集が完了しました',
      added: addedCount,
      total: total.length,
      sheetWritten: sheetResult.written,
      sheetSkipped: sheetResult.skipped,
      sheetTotal: sheetResult.total,
    });
  } catch (error) {
    console.error('Error scraping universities:', error);
    next(error);
  }
});

// Googleスプレッドシートから大学情報をインポート
router.post('/import-from-sheet', async (req, res, next) => {
  try {
    const { importUniversitiesToSupabase } = await import('../scripts/import-universities-from-sheet');
    await importUniversitiesToSupabase();

    const total = await getUniversities();

    res.json({
      message: 'スプレッドシートからのインポートが完了しました',
      total: total.length,
    });
  } catch (error) {
    console.error('Error importing from sheet:', error);
    res.status(500).json({ 
      error: 'スプレッドシートからのインポートに失敗しました',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
    next(error);
  }
});

export default router;
