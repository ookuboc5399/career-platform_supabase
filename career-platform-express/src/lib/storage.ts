import { BlobServiceClient, StorageSharedKeyCredential, generateBlobSASQueryParameters, BlobSASPermissions, SASProtocol } from '@azure/storage-blob';
import { v4 as uuidv4 } from 'uuid';

// Azure Storage設定
const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;

console.log('\n=== Azure Storage Configuration ===');
console.log('Account Name:', accountName);
console.log('Account Key:', accountKey ? 'Set' : 'Not set');

if (!accountName || !accountKey) {
  throw new Error('Azure Storage credentials are not configured');
}

const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);

const blobServiceClient = new BlobServiceClient(
  `https://${accountName}.blob.core.windows.net`,
  sharedKeyCredential
);

// コンテナ名の定義
export const CONTAINERS = {
  CERTIFICATION_IMAGES: 'certification-images',
  CERTIFICATION_DATA: 'certification-data',
  CERTIFICATION_VIDEOS: 'certification-videos',
  CERTIFICATION_THUMBNAILS: 'certification-thumbnails',
  UNIVERSITY_DATA: 'university-data',
  UNIVERSITY_IMAGES: 'university-images',
} as const;

// 初期化時にコンテナを作成
async function initializeContainers() {
  console.log('\n=== Initializing Containers ===');
  for (const containerName of Object.values(CONTAINERS)) {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const exists = await containerClient.exists();
    if (!exists) {
      console.log(`Creating container: ${containerName}`);
      await containerClient.create();
      console.log(`Container ${containerName} created successfully`);
    } else {
      console.log(`Container ${containerName} already exists`);
    }
  }
}

// 初期化を実行
initializeContainers().catch(console.error);

/**
 * ファイル名を安全な形式に変換する
 * @param filename オリジナルのファイル名
 * @returns 安全なファイル名
 */
function getSafeFileName(filename: string): string {
  const extension = filename.split('.').pop() || '';
  return `${uuidv4()}.${extension}`;
}

/**
 * ファイルをAzure Storageにアップロードする
 * @param containerName コンテナ名
 * @param buffer ファイルのバッファ
 * @param filename ファイル名
 * @param contentType MIMEタイプ
 * @returns アップロードされたファイルのURL
 */
export async function uploadFile(
  containerName: string,
  buffer: Buffer,
  filename: string,
  contentType: string
): Promise<string> {
  try {
    console.log('\n=== File Upload Started ===');
    console.log('Container:', containerName);
    console.log('Original Filename:', filename);
    console.log('Content Type:', contentType);
    console.log('Buffer Size:', buffer.length);

    const containerClient = blobServiceClient.getContainerClient(containerName);
    
    // コンテナが存在しない場合は作成
    console.log('Checking container existence...');
    const containerExists = await containerClient.exists();
    if (!containerExists) {
      console.log('Container does not exist. Creating...');
      await containerClient.create();
      console.log('Container created successfully');
    }

    const safeFileName = getSafeFileName(filename);
    console.log('Safe filename:', safeFileName);

    const blockBlobClient = containerClient.getBlockBlobClient(safeFileName);
    console.log('Uploading blob...');

    await blockBlobClient.uploadData(buffer, {
      blobHTTPHeaders: { blobContentType: contentType }
    });

    // SASトークンを生成して、長期間有効なURLを作成
    const startsOn = new Date();
    const expiresOn = new Date(startsOn);
    expiresOn.setFullYear(expiresOn.getFullYear() + 1); // 1年間有効

    const sasUrl = await blockBlobClient.generateSasUrl({
      permissions: BlobSASPermissions.parse("r"),
      startsOn,
      expiresOn,
      protocol: SASProtocol.Https
    });
    
    console.log('Upload successful. URL:', sasUrl);
    return sasUrl;

  } catch (error) {
    console.error('\n=== Error in File Upload ===');
    console.error('Error details:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    throw new Error(`Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * JSONデータをAzure Storageに保存する
 * @param containerName コンテナ名
 * @param filename ファイル名
 * @param data JSONデータ
 */
export async function saveJsonData(
  containerName: string,
  filename: string,
  data: any
): Promise<void> {
  try {
    console.log('\n=== JSON Data Save Started ===');
    console.log('Container:', containerName);
    console.log('Filename:', filename);

    const containerClient = blobServiceClient.getContainerClient(containerName);
    
    // コンテナが存在しない場合は作成
    const containerExists = await containerClient.exists();
    if (!containerExists) {
      await containerClient.create();
    }

    const blockBlobClient = containerClient.getBlockBlobClient(filename);
    const content = JSON.stringify(data, null, 2);
    
    await blockBlobClient.upload(content, content.length, {
      blobHTTPHeaders: { blobContentType: 'application/json' }
    });

    console.log('JSON data saved successfully');

  } catch (error) {
    console.error('\n=== Error in JSON Data Save ===');
    console.error('Error details:', error);
    throw new Error(`Failed to save JSON data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * JSONデータをAzure Storageから読み込む
 * @param containerName コンテナ名
 * @param filename ファイル名
 * @returns JSONデータ
 */
export async function loadJsonData(
  containerName: string,
  filename: string
): Promise<any> {
  try {
    console.log('\n=== JSON Data Load Started ===');
    console.log('Container:', containerName);
    console.log('Filename:', filename);

    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(filename);

    const exists = await blockBlobClient.exists();
    if (!exists) {
      console.log('File does not exist, returning empty array');
      return [];
    }

    const downloadResponse = await blockBlobClient.download();
    const content = await streamToString(downloadResponse.readableStreamBody!);
    
    console.log('JSON data loaded successfully');
    return JSON.parse(content);

  } catch (error) {
    console.error('\n=== Error in JSON Data Load ===');
    console.error('Error details:', error);
    throw new Error(`Failed to load JSON data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * SASトークンを生成する
 * @param containerName コンテナ名
 * @param blobName BLOBの名前
 * @returns SASトークン
 */
function generateSasToken(containerName: string, blobName: string): string {
  const startsOn = new Date();
  const expiresOn = new Date(startsOn);
  expiresOn.setMinutes(startsOn.getMinutes() + 60); // 1時間有効

  const sasOptions = {
    containerName,
    blobName,
    permissions: BlobSASPermissions.parse("r"), // 読み取り権限のみ
    startsOn,
    expiresOn,
    protocol: SASProtocol.Https
  };

  return generateBlobSASQueryParameters(
    sasOptions,
    sharedKeyCredential
  ).toString();
}

/**
 * ストリームを文字列に変換する
 * @param readableStream 読み取り可能なストリーム
 * @returns 文字列
 */
async function streamToString(readableStream: NodeJS.ReadableStream): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: any[] = [];
    readableStream.on('data', (data) => {
      chunks.push(data.toString());
    });
    readableStream.on('end', () => {
      resolve(chunks.join(''));
    });
    readableStream.on('error', reject);
  });
}

/**
 * ファイルをAzure Storageから削除する
 * @param containerName コンテナ名
 * @param url ファイルのURL
 */
export async function deleteFile(containerName: string, url: string): Promise<void> {
  try {
    console.log('\n=== File Deletion Started ===');
    console.log('Container:', containerName);
    console.log('URL:', url);

    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobName = url.split('/').pop()?.split('?')[0];
    if (!blobName) {
      throw new Error('Invalid blob URL');
    }

    console.log('Blob name:', blobName);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    
    console.log('Deleting blob...');
    await blockBlobClient.delete();
    console.log('Deletion successful');

  } catch (error) {
    console.error('\n=== Error in File Deletion ===');
    console.error('Error details:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    throw new Error(`Failed to delete file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
