import { NextRequest, NextResponse } from 'next/server';
import { UpdateCertificationDto, Certification } from '@/types/api';
import { CosmosClient } from '@azure/cosmos';
import { generateSasUrl } from '@/lib/storage';

const client = new CosmosClient({
  endpoint: process.env.COSMOS_DB_ENDPOINT || '',
  key: process.env.COSMOS_DB_KEY || ''
});
const database = client.database('career-platform');
const container = database.container('certifications');
const certificationQuestionsContainer = database.container('certification-questions');

export async function GET(request: NextRequest, context: { params: { id: string } }) {
  try {
    const resolvedParams = await Promise.resolve(context.params);
    console.log('GET /api/certifications/[id] - Start');
    console.log('Certification ID:', resolvedParams.id);
    
    // 認定試験と問題を取得
    const certificationResponse = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/api/certifications/${resolvedParams.id}`);
    if (!certificationResponse.ok) {
      console.log('Certification not found');
      return NextResponse.json({ error: 'Certification not found' }, { status: 404 });
    }
    const certification = await certificationResponse.json();
    console.log('Found certification:', certification);

    // 問題を取得
    const questionsResponse = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/api/certifications/${resolvedParams.id}/questions`);
    if (!questionsResponse.ok) {
      console.log('Failed to fetch questions');
      return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
    }
    const questions = await questionsResponse.json();
    console.log('Found questions:', questions);

    return NextResponse.json({
      ...certification,
      questions: questions
    });
  } catch (error) {
    console.error('Error fetching certification:', error);
    return NextResponse.json(
      { error: 'Failed to fetch certification' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    console.log('PUT /api/certifications/[id] - Start');
    console.log('Certification ID:', context.params.id);

    const formData = await request.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const difficulty = formData.get('difficulty') as 'beginner' | 'intermediate' | 'advanced';
    const estimatedStudyTime = formData.get('estimatedStudyTime') as string;
    const imageFile = formData.get('image');

    const { resource: certification } = await container.item(context.params.id, context.params.id).read();
    console.log('Found certification:', certification);
    if (!certification) {
      return NextResponse.json(
        { error: 'Certification not found' },
        { status: 404 }
      );
    }

    // 基本データを設定
    const updatedCertification: Certification = {
      id: certification.id,
      name,
      description,
      category,
      difficulty,
      estimatedStudyTime,
      updatedAt: new Date().toISOString(),
      createdAt: certification.createdAt,
      questions: certification.questions || [],
      imageUrl: certification.imageUrl, // 既存の画像URLを保持
      image: undefined // 明示的にundefinedを設定
    };

    // 画像が選択されていない場合はデフォルト画像を設定
    if (!imageFile) {
      // 既存の画像URLがある場合はそれを保持
      if (certification.imageUrl) {
        updatedCertification.imageUrl = certification.imageUrl;
      } else {
        // デフォルト画像を設定
        const baseUrl = `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net/certification-images/${category}.svg`;
        console.log('Base URL for default image:', baseUrl);
        const defaultImageUrl = await generateSasUrl(baseUrl);
        console.log('Default image URL with SAS:', defaultImageUrl);
        updatedCertification.imageUrl = defaultImageUrl;
      }
    }

    // 新しい画像がアップロードされた場合
    if (imageFile && imageFile instanceof Blob) {
      console.log('Uploading new image to blob storage');
      
      // Express APIを呼び出して画像をアップロード
      const uploadFormData = new FormData();
      uploadFormData.append('file', imageFile);
      uploadFormData.append('type', 'certification-image');

      // FormDataの内容をログ出力
      console.log('FormData entries:');
      for (const [key, value] of uploadFormData.entries()) {
        if (value instanceof File) {
          console.log(`${key}: File(name=${value.name}, type=${value.type}, size=${value.size})`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }

      const uploadUrl = `${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/api/upload`;
      console.log('Upload URL:', uploadUrl);

      try {
        const uploadResponse = await fetch(uploadUrl, {
          method: 'POST',
          body: uploadFormData
        });

        console.log('Upload response status:', uploadResponse.status);
        
        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text();
          console.error('Upload error:', errorText);
          throw new Error(`Failed to upload image: ${errorText}`);
        }

        const responseData = await uploadResponse.json();
        console.log('Upload response:', responseData);
        const { url: imageUrl } = responseData;
        // 新しい画像URLを設定し、古いデータを削除
        updatedCertification.imageUrl = imageUrl;
        updatedCertification.image = undefined;
      } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
      }
    }

    const { resource } = await container.item(context.params.id, context.params.id).replace(updatedCertification);
    return NextResponse.json(resource);
  } catch (error) {
    console.error('Error updating certification:', error);
    return NextResponse.json(
      { error: 'Failed to update certification' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { resource: certification } = await container.item(context.params.id, context.params.id).read();
    if (!certification) {
      return NextResponse.json(
        { error: 'Certification not found' },
        { status: 404 }
      );
    }

    await container.item(context.params.id, context.params.id).delete();
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting certification:', error);
    return NextResponse.json(
      { error: 'Failed to delete certification' },
      { status: 500 }
    );
  }
}
