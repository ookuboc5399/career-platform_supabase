import { NextRequest, NextResponse } from 'next/server';
import { BlobServiceClient, BlobSASPermissions } from '@azure/storage-blob';

if (!process.env.NEXT_PUBLIC_AZURE_STORAGE_CONNECTION_STRING) {
  throw new Error('Azure Storage connection string is not configured');
}

const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.NEXT_PUBLIC_AZURE_STORAGE_CONNECTION_STRING
);

const programmingVideosContainer = blobServiceClient.getContainerClient('programming-videos');

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const blobName = searchParams.get('blobName');

    if (!blobName) {
      return NextResponse.json(
        { error: 'No blob name provided' },
        { status: 400 }
      );
    }

    const blockBlobClient = programmingVideosContainer.getBlockBlobClient(blobName);
    const permissions = new BlobSASPermissions();
    permissions.read = true;

    const sasUrl = await blockBlobClient.generateSasUrl({
      permissions,
      expiresOn: new Date(new Date().valueOf() + 3600 * 1000), // 1時間有効
    });

    return NextResponse.json({ url: sasUrl });
  } catch (error) {
    console.error('SAS generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate SAS token' },
      { status: 500 }
    );
  }
}
