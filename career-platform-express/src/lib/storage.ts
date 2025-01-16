import { BlobServiceClient, StorageSharedKeyCredential, generateBlobSASQueryParameters, BlobSASPermissions, SASProtocol } from '@azure/storage-blob';

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
  CERTIFICATION_VIDEOS: 'certification-videos',
  CERTIFICATION_THUMBNAILS: 'certification-thumbnails',
} as const;

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
    console.log('Filename:', filename);
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

    const blobName = `${Date.now()}-${filename}`;
    console.log('Generated blob name:', blobName);

    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    console.log('Uploading blob...');

    await blockBlobClient.uploadData(buffer, {
      blobHTTPHeaders: { blobContentType: contentType }
    });

    // SASトークンを生成して、一時的なアクセス可能なURLを作成
    const sasToken = generateSasToken(containerName, blobName);
    const url = `${blockBlobClient.url}?${sasToken}`;
    
    console.log('Upload successful. URL:', url);
    return url;

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
