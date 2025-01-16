import { NextRequest, NextResponse } from 'next/server';
import type { Certification } from '@/types/api';
import { uploadFile, CONTAINERS } from '@/lib/storage';

// 仮のデータストア（開発用）
export const mockCertifications: Certification[] = [
  {
    id: '1',
    name: 'AWS Solutions Architect Associate',
    description: 'AWSのソリューションアーキテクトアソシエイト試験の対策講座',
    imageUrl: 'https://example.com/images/aws-saa.jpg',
    difficulty: 'intermediate',
    category: 'it',
    estimatedStudyTime: '40時間',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-14T00:00:00Z',
    chapters: [
      {
        id: '1',
        certificationId: '1',
        title: 'Chapter 1: AWS IAM',
        description: 'AWSのIDおよびアクセス管理について学びます',
        videoUrl: 'https://example.com/videos/aws-iam.mp4',
        thumbnailUrl: 'https://example.com/thumbnails/aws-iam.jpg',
        duration: '30:00',
        order: 1,
        status: 'published',
        content: 'AWS IAMの基本概念と設定方法について解説します',
        questions: [
          {
            id: '1',
            question: 'IAMユーザーとIAMロールの違いは何ですか？',
            choices: [
              { id: '1', text: 'IAMユーザーは永続的な認証情報、IAMロールは一時的な認証情報を提供する' },
              { id: '2', text: 'IAMユーザーはAWSコンソールにログインできない' },
              { id: '3', text: 'IAMロールはプログラムからのみ使用できる' },
              { id: '4', text: 'IAMユーザーは一時的な認証情報のみを使用する' }
            ],
            correctAnswer: 0,
            explanation: 'IAMユーザーは永続的な認証情報（ユーザー名とパスワード、またはアクセスキー）を持ちますが、IAMロールは一時的な認証情報を提供します。'
          }
        ],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-14T00:00:00Z'
      }
    ]
  }
];

export async function GET() {
  try {
    return NextResponse.json(mockCertifications);
  } catch (error) {
    console.error('Error fetching certifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch certifications' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as 'finance' | 'it' | 'business';
    const difficulty = formData.get('difficulty') as 'beginner' | 'intermediate' | 'advanced';
    const estimatedStudyTime = formData.get('estimatedStudyTime') as string;
    const imageFile = formData.get('image') as File | null;

    // バリデーション
    if (!name || !description || !category || !difficulty || !estimatedStudyTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    let imageUrl: string;
    if (imageFile) {
      // 画像ファイルがある場合はアップロード
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      imageUrl = await uploadFile(CONTAINERS.CERTIFICATION_IMAGES, buffer, imageFile.name, imageFile.type);
    } else {
      // 画像ファイルがない場合はExpress APIを使用してAIで生成
      const generateResponse = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/api/images/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: description }),
      });

      if (!generateResponse.ok) {
        const errorData = await generateResponse.json();
        throw new Error(errorData.details || errorData.message || 'Failed to generate image');
      }

      const { url: generatedImageUrl } = await generateResponse.json();
      if (!generatedImageUrl) {
        throw new Error('No image URL received from image generation API');
      }

      const response = await fetch(generatedImageUrl);
      const blob = await response.blob();
      const file = new File([blob], 'generated-image.png', { type: 'image/png' });
      const buffer = Buffer.from(await file.arrayBuffer());
      imageUrl = await uploadFile(CONTAINERS.CERTIFICATION_IMAGES, buffer, file.name, file.type);
    }

    // 仮の実装（開発用）
    const newCertification: Certification = {
      id: (mockCertifications.length + 1).toString(),
      name,
      description,
      imageUrl,
      category,
      difficulty,
      estimatedStudyTime,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      chapters: []
    };

    mockCertifications.push(newCertification);
    return NextResponse.json(newCertification);
  } catch (error) {
    console.error('Error creating certification:', error);
    return NextResponse.json(
      { error: 'Failed to create certification' },
      { status: 500 }
    );
  }
}
