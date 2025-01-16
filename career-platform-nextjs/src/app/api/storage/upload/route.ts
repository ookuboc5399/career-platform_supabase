import { NextRequest, NextResponse } from 'next/server';
import { BlobServiceClient } from '@azure/storage-blob';

if (!process.env.NEXT_PUBLIC_AZURE_STORAGE_CONNECTION_STRING) {
  throw new Error('Azure Storage connection string is not configured');
}

const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.NEXT_PUBLIC_AZURE_STORAGE_CONNECTION_STRING
);

const universityImagesContainer = blobServiceClient.getContainerClient('university-images');
const programmingVideosContainer = blobServiceClient.getContainerClient('programming-videos');
const programmingThumbnailsContainer = blobServiceClient.getContainerClient('programming-thumbnails');

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const buffer = await file.arrayBuffer();
    const blobName = `${Date.now()}-${file.name}`;

    let containerClient;
    switch (type) {
      case 'university-image':
        containerClient = universityImagesContainer;
        break;
      case 'programming-video':
        containerClient = programmingVideosContainer;
        break;
      case 'programming-thumbnail':
        containerClient = programmingThumbnailsContainer;
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid file type' },
          { status: 400 }
        );
    }

    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.uploadData(buffer, {
      blobHTTPHeaders: { blobContentType: file.type }
    });

    return NextResponse.json({ url: blockBlobClient.url });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}
