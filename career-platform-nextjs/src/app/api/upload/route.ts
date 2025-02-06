import { NextRequest, NextResponse } from 'next/server';
import { uploadFile, CONTAINERS } from '@/lib/storage';

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
      case 'question-option-image':
        containerName = CONTAINERS.CERTIFICATION_IMAGES; // 選択肢の画像も同じコンテナを使用
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid file type' },
          { status: 400 }
        );
    }

    // ファイルをバッファに変換
    const buffer = Buffer.from(await file.arrayBuffer());

    // ファイルをアップロード
    const url = await uploadFile(
      containerName,
      buffer,
      file.name,
      file.type
    );

    return NextResponse.json({ url });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
