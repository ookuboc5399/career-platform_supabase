import express, { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { BlobServiceClient, StorageSharedKeyCredential, BlobSASPermissions } from '@azure/storage-blob';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Azure Storage設定
const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;

if (!accountName || !accountKey) {
  throw new Error('Azure Storage credentials are not configured');
}

const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
const blobServiceClient = new BlobServiceClient(
  `https://${accountName}.blob.core.windows.net`,
  sharedKeyCredential
);

// コンテナ名の定義
const CONTAINERS = {
  UNIVERSITY_IMAGES: 'university-images',
  PROGRAMMING_VIDEOS: 'programming-videos',
  PROGRAMMING_THUMBNAILS: 'programming-thumbnails',
  CERTIFICATION_VIDEOS: 'certification-videos',
  CERTIFICATION_THUMBNAILS: 'certification-thumbnails',
  CERTIFICATION_IMAGES: 'certification-images',
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

    // ファイルの種類に基づいてコンテナを選択
    let containerName: string;
    switch (type) {
      case 'university':
        containerName = CONTAINERS.UNIVERSITY_IMAGES;
        break;
      case 'programming-video':
        containerName = CONTAINERS.PROGRAMMING_VIDEOS;
        break;
      case 'programming-thumbnail':
        containerName = CONTAINERS.PROGRAMMING_THUMBNAILS;
        break;
      case 'certification-video':
        containerName = CONTAINERS.CERTIFICATION_VIDEOS;
        break;
      case 'certification-thumbnail':
        containerName = CONTAINERS.CERTIFICATION_THUMBNAILS;
        break;
      case 'certification-image':
        containerName = CONTAINERS.CERTIFICATION_IMAGES;
        break;
      default:
        res.status(400).json({ error: 'Invalid file type' });
        return next();
    }

    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobName = `${Date.now()}-${uuidv4()}-${file.originalname}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadData(file.buffer, {
      blobHTTPHeaders: { blobContentType: file.mimetype }
    });

    res.json({ url: blockBlobClient.url });
    return next();
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Failed to upload file' });
    return next(error);
  }
});

// SASトークン生成エンドポイント
router.post('/sas', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { containerName, blobName } = req.body;

    if (!containerName || !blobName) {
      res.status(400).json({ error: 'Container name and blob name are required' });
      return next();
    }

    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    const startsOn = new Date();
    const expiresOn = new Date(new Date().valueOf() + 3600 * 1000); // 1時間有効

    const permissions = new BlobSASPermissions();
    permissions.read = true;

    const sasToken = await blockBlobClient.generateSasUrl({
      permissions,
      startsOn,
      expiresOn,
    });

    res.json({ sasToken });
    return next();
  } catch (error) {
    console.error('Error generating SAS token:', error);
    res.status(500).json({ error: 'Failed to generate SAS token' });
    return next(error);
  }
});

// ファイル削除エンドポイント
router.delete('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { containerName, url } = req.body;

    if (!containerName || !url) {
      res.status(400).json({ error: 'Container name and URL are required' });
      return next();
    }

    const blobName = url.split('/').pop();
    if (!blobName) {
      res.status(400).json({ error: 'Invalid blob URL' });
      return next();
    }

    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.delete();

    res.status(204).send();
    return next();
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ error: 'Failed to delete file' });
    return next(error);
  }
});

export default router;
