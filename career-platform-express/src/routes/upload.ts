import express, { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { uploadFile, generateSignedUrl, deleteFile as deleteSupabaseFile, BUCKETS } from '../lib/supabase-storage';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// バケット名のマッピング
const BUCKET_MAP: { [key: string]: string } = {
  'university-images': BUCKETS.UNIVERSITY_IMAGES,
  'programming-video': BUCKETS.PROGRAMMING_VIDEOS,
  'programming-thumbnail': BUCKETS.PROGRAMMING_THUMBNAILS,
  'certification-video': BUCKETS.CERTIFICATION_VIDEOS,
  'certification-thumbnail': BUCKETS.CERTIFICATION_THUMBNAILS,
  'certification-image': BUCKETS.CERTIFICATION_IMAGES,
} as const;

// Multerの設定
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

interface FileRequest extends Request {
  file?: Express.Multer.File;
}

// ファイルアップロードエンドポイント
router.post('/', upload.single('file'), async (req: FileRequest, res: Response, next: NextFunction) => {
  try {
    const file = req.file;
    const type = req.body.type;

    if (!file) {
      res.status(400).json({ error: 'No file provided' });
      return next();
    }

    // ファイルの種類に基づいてバケットを選択
    const bucketName = BUCKET_MAP[type];
    if (!bucketName) {
        console.error('Invalid file type:', type);
        res.status(400).json({ error: `Invalid file type: ${type}` });
        return next();
    }

    // Supabase Storageにアップロード
    const url = await uploadFile(
      bucketName,
      file.buffer,
      file.originalname,
      file.mimetype
    );

    res.json({ url });
    return next();
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Failed to upload file' });
    return next(error);
  }
});

// 署名付きURL生成エンドポイント（Supabase Storage用）
router.post('/sas', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bucketName, fileName } = req.body;

    if (!bucketName || !fileName) {
      res.status(400).json({ error: 'Bucket name and file name are required' });
      return next();
    }

    // Supabase Storageの署名付きURLを生成（1時間有効）
    const signedUrl = await generateSignedUrl(bucketName, fileName, 3600);

    res.json({ sasToken: signedUrl });
    return next();
  } catch (error) {
    console.error('Error generating signed URL:', error);
    res.status(500).json({ error: 'Failed to generate signed URL' });
    return next(error);
  }
});

// ファイル削除エンドポイント
router.delete('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bucketName, url } = req.body;

    if (!bucketName || !url) {
      res.status(400).json({ error: 'Bucket name and URL are required' });
      return next();
    }

    // Supabase Storageからファイルを削除
    await deleteSupabaseFile(bucketName, url);

    res.status(204).send();
    return next();
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ error: 'Failed to delete file' });
    return next(error);
  }
});

export default router;
