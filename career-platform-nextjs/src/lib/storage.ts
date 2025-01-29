import { BlobServiceClient, generateBlobSASQueryParameters, SASProtocol, BlobSASPermissions as Permissions, StorageSharedKeyCredential } from '@azure/storage-blob';

// サーバーサイドでのみ使用する関数
function getBlobServiceClient() {
  if (typeof window !== 'undefined') {
    throw new Error('This function can only be used on the server side');
  }

  const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
  const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;

  if (!accountName || !accountKey) {
    throw new Error('Azure Storage credentials are not configured');
  }

  const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
  return new BlobServiceClient(
    `https://${accountName}.blob.core.windows.net`,
    sharedKeyCredential
  );
}

// コンテナクライアントの取得（サーバーサイド用）
function getContainerClient(containerName: string) {
  const blobServiceClient = getBlobServiceClient();
  return blobServiceClient.getContainerClient(containerName);
}

// 既存のコンテナ名
const CONTAINERS = {
  UNIVERSITY_IMAGES: 'university-images',
  PROGRAMMING_VIDEOS: 'programming-videos',
  PROGRAMMING_THUMBNAILS: 'programming-thumbnails',
  CERTIFICATION_VIDEOS: 'certification-videos',
  CERTIFICATION_THUMBNAILS: 'certification-thumbnails',
  CERTIFICATION_IMAGES: 'certification-images',
  ENGLISH_NEWS_AUDIO: 'english-news-audio',
  ENGLISH_NEWS_IMAGES: 'english-news-images',
  ENGLISH_MOVIES: 'english-movies',
} as const;

// SASトークンの生成（サーバーサイド用）
export async function generateSasToken(containerName: string, blobName: string) {
  if (typeof window !== 'undefined') {
    throw new Error('This function can only be used on the server side');
  }

  const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
  const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;

  if (!accountName || !accountKey) {
    throw new Error('Azure Storage credentials are not configured');
  }

  const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);

  const permissions = new Permissions();
  permissions.read = true;

  const startsOn = new Date();
  const expiresOn = new Date(new Date().valueOf() + 3600 * 1000); // 1時間有効

  const sasToken = generateBlobSASQueryParameters({
    containerName,
    blobName,
    permissions,
    startsOn,
    expiresOn,
    protocol: SASProtocol.Https,
  }, sharedKeyCredential).toString();

  return sasToken;
}

// 動画URLにSASトークンを付与する関数
export async function generateSasUrl(url: string) {
  try {
    console.log('Generating SAS URL for:', url);
    
    // URLからコンテナ名とBLOB名を抽出
    const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
    const baseUrl = `https://${accountName}.blob.core.windows.net/`;
    const urlWithCorrectDomain = url.replace(/^https:\/\/[^/]+\//, baseUrl);
    const urlObj = new URL(urlWithCorrectDomain);
    const pathParts = urlObj.pathname.split('/').filter(Boolean);
    const containerName = pathParts[0];
    const blobName = decodeURIComponent(pathParts.slice(1).join('/'));
    
    console.log('Extracted parts:', {
      originalUrl: url,
      correctedUrl: urlWithCorrectDomain,
      containerName,
      blobName
    });

    // BlobClientを使用してSASトークンを生成
    const containerClient = getContainerClient(containerName);
    
    // ファイル名の正規化とエンコード
    const normalizedBlobName = blobName
      .normalize('NFC')  // Unicode正規化
      .replace(/\s+/g, ' '); // 連続する空白を1つに
    const encodedBlobName = encodeURIComponent(normalizedBlobName).replace(/%2F/g, '/');
    console.log('Encoded blob name:', encodedBlobName);
    const blobClient = containerClient.getBlobClient(encodedBlobName);

    const startsOn = new Date();
    const expiresOn = new Date(new Date().valueOf() + 3600 * 1000);

    const sasToken = await blobClient.generateSasUrl({
      permissions: Permissions.parse("r"),
      startsOn,
      expiresOn,
      protocol: SASProtocol.Https,
    });

    console.log('Generated SAS URL:', sasToken);
    return sasToken;
  } catch (error) {
    console.error('Error generating SAS token:', error);
    throw error;
  }
}

// ファイルアップロード（サーバーサイド用）
export async function uploadFile(containerName: string, file: Buffer, fileName: string, contentType: string): Promise<string> {
  if (typeof window !== 'undefined') {
    throw new Error('This function can only be used on the server side');
  }

  const containerClient = getContainerClient(containerName);
  const blobName = `${Date.now()}-${fileName}`;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  
  await blockBlobClient.uploadData(file, {
    blobHTTPHeaders: { blobContentType: contentType }
  });

  // SASトークンを生成して返す
  const sasToken = await generateSasToken(containerName, blobName);
  return `${blockBlobClient.url}?${sasToken}`;
}

// ファイル削除（サーバーサイド用）
export async function deleteFile(containerName: string, url: string): Promise<void> {
  if (typeof window !== 'undefined') {
    throw new Error('This function can only be used on the server side');
  }

  const blobName = url.split('/').pop()?.split('?')[0]; // SASトークンを除去
  if (!blobName) throw new Error('Invalid blob URL');
  
  const containerClient = getContainerClient(containerName);
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  await blockBlobClient.delete();
}

// コンテナの初期化（サーバーサイド用）
export async function initializeStorageContainers() {
  if (typeof window !== 'undefined') {
    throw new Error('This function can only be used on the server side');
  }

  try {
    const blobServiceClient = getBlobServiceClient();

    // 各コンテナの初期化
    for (const containerName of Object.values(CONTAINERS)) {
      const containerClient = blobServiceClient.getContainerClient(containerName);
      const exists = await containerClient.exists();
      
      if (!exists) {
        await containerClient.create();
      }
    }

    console.log('Storage containers initialized successfully');
  } catch (error) {
    console.error('Error initializing storage containers:', error);
    throw error;
  }
}

export { CONTAINERS };
