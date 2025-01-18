import express from 'express';
import { scrapeUniversities } from '../lib/university-scraper';
import { BlobServiceClient, StorageSharedKeyCredential } from '@azure/storage-blob';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Azure Storage設定
const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
const containerName = 'university-data';

if (!accountName || !accountKey) {
  throw new Error('Azure Storage credentials are not configured');
}

// 認証情報の作成
const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);

// BlobServiceClientの作成
const blobServiceClient = new BlobServiceClient(
  `https://${accountName}.blob.core.windows.net`,
  sharedKeyCredential
);

// コンテナクライアントの取得
const containerClient = blobServiceClient.getContainerClient(containerName);

// 大学情報の取得
router.get('/', async (req, res, next) => {
  try {
    console.log('[' + new Date().toISOString() + '] GET /api/universities');
    console.log('Request Headers:', req.headers);

    // JSONファイルの読み込み
    console.log('\n=== JSON Data Load Started ===');
    console.log('Container:', containerName);
    console.log('Filename: universities.json');

    const blobClient = containerClient.getBlockBlobClient('universities.json');
    const downloadResponse = await blobClient.download(0);

    if (!downloadResponse.readableStreamBody) {
      throw new Error('Failed to download universities data');
    }

    const chunks: Buffer[] = [];
    for await (const chunk of downloadResponse.readableStreamBody) {
      chunks.push(Buffer.from(chunk));
    }
    const jsonString = Buffer.concat(chunks).toString('utf-8');
    const data = JSON.parse(jsonString);

    console.log('JSON data loaded successfully');
    res.json(data);
  } catch (error) {
    console.error('Error loading universities:', error);
    next(error);
  }
});

// 大学情報の更新
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedUniversity = req.body;

    // 現在のデータを読み込む
    const blobClient = containerClient.getBlockBlobClient('universities.json');
    const downloadResponse = await blobClient.download(0);

    if (!downloadResponse.readableStreamBody) {
      throw new Error('Failed to download universities data');
    }

    const chunks: Buffer[] = [];
    for await (const chunk of downloadResponse.readableStreamBody) {
      chunks.push(Buffer.from(chunk));
    }
    const jsonString = Buffer.concat(chunks).toString('utf-8');
    const universities = JSON.parse(jsonString);

    // 大学情報を更新
    const index = universities.findIndex((u: any) => u.id === id);
    if (index === -1) {
      res.status(404).json({ error: 'University not found' });
      return;
    }

    universities[index] = { ...universities[index], ...updatedUniversity };

    // 更新したデータを保存
    await blobClient.upload(JSON.stringify(universities, null, 2), JSON.stringify(universities).length);

    res.json(universities[index]);
  } catch (error) {
    console.error('Error updating university:', error);
    next(error);
  }
});

// 大学情報の削除
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    // 現在のデータを読み込む
    const blobClient = containerClient.getBlockBlobClient('universities.json');
    const downloadResponse = await blobClient.download(0);

    if (!downloadResponse.readableStreamBody) {
      throw new Error('Failed to download universities data');
    }

    const chunks: Buffer[] = [];
    for await (const chunk of downloadResponse.readableStreamBody) {
      chunks.push(Buffer.from(chunk));
    }
    const jsonString = Buffer.concat(chunks).toString('utf-8');
    const universities = JSON.parse(jsonString);

    // 大学情報を削除
    const filteredUniversities = universities.filter((u: any) => u.id !== id);

    // 更新したデータを保存
    await blobClient.upload(JSON.stringify(filteredUniversities, null, 2), JSON.stringify(filteredUniversities).length);

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
    const universities = await scrapeUniversities();

    // 既存のデータを読み込む
    const blobClient = containerClient.getBlockBlobClient('universities.json');
    let existingUniversities: any[] = [];
    try {
      const downloadResponse = await blobClient.download(0);
      if (downloadResponse.readableStreamBody) {
        const chunks: Buffer[] = [];
        for await (const chunk of downloadResponse.readableStreamBody) {
          chunks.push(Buffer.from(chunk));
        }
        const jsonString = Buffer.concat(chunks).toString('utf-8');
        existingUniversities = JSON.parse(jsonString);
      }
    } catch (error) {
      console.log('No existing universities data found');
    }

    // 新しい大学情報をマージ
    const mergedUniversities = [...existingUniversities];
    for (const university of universities) {
      const existingIndex = mergedUniversities.findIndex(u => u.name === university.name);
      if (existingIndex === -1) {
        mergedUniversities.push(university);
      } else {
        mergedUniversities[existingIndex] = {
          ...mergedUniversities[existingIndex],
          ...university,
          id: mergedUniversities[existingIndex].id,
        };
      }
    }

    // 更新したデータを保存
    await blobClient.upload(JSON.stringify(mergedUniversities, null, 2), JSON.stringify(mergedUniversities).length);

    res.json({
      message: '大学情報の収集が完了しました',
      added: universities.length,
      total: mergedUniversities.length,
    });
  } catch (error) {
    console.error('Error scraping universities:', error);
    next(error);
  }
});

export default router;
