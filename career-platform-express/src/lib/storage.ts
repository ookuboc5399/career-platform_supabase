import { BlobServiceClient, StorageSharedKeyCredential } from '@azure/storage-blob';

// Azure Storage設定
const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;

// コンテナ名の定義
export const CONTAINERS = {
  CERTIFICATION_IMAGES: 'certification-images',
  CERTIFICATION_VIDEOS: 'certification-videos',
  CERTIFICATION_THUMBNAILS: 'certification-thumbnails',
} as const;

// 一時的にダミーの実装を使用
export async function uploadFile(
  containerName: string,
  buffer: Buffer,
  filename: string,
  contentType: string
): Promise<string> {
  console.log('Mock upload file:', { containerName, filename, contentType });
  return 'https://example.com/mock-image.jpg';
}

export async function deleteFile(containerName: string, url: string): Promise<void> {
  console.log('Mock delete file:', { containerName, url });
}
