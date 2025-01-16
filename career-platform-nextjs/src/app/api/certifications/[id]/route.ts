import { NextRequest, NextResponse } from 'next/server';
import { UpdateCertificationDto, Certification } from '@/types/api';
import { mockCertifications } from '../route';

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // 仮の実装（開発用）
    const resolvedParams = await Promise.resolve(context.params);
    const certification = mockCertifications.find(c => c.id === resolvedParams.id);
    if (!certification) {
      return NextResponse.json(
        { error: 'Certification not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(certification);

    // 本番用のコード（Cosmos DB接続が確認できたら切り替え）
    /*
    const certification = await getCertification(params.id);
    if (!certification) {
      return NextResponse.json(
        { error: 'Certification not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(certification);
    */
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
    const body = await request.json();
    const { name, description, imageUrl, category, difficulty, provider, estimatedStudyTime, price } = body as UpdateCertificationDto;

    // 仮の実装（開発用）
    const certification = mockCertifications.find(c => c.id === context.params.id);
    if (!certification) {
      return NextResponse.json(
        { error: 'Certification not found' },
        { status: 404 }
      );
    }

    const updatedCertification: Certification = {
      ...certification,
      name: name || certification.name,
      description: description || certification.description,
      imageUrl: imageUrl || certification.imageUrl,
      category: category || certification.category,
      difficulty: difficulty || certification.difficulty,
      provider: provider || certification.provider,
      estimatedStudyTime: estimatedStudyTime || certification.estimatedStudyTime,
      price: price || certification.price,
      updatedAt: new Date().toISOString(),
    };

    const index = mockCertifications.findIndex(c => c.id === context.params.id);
    mockCertifications[index] = updatedCertification;
    return NextResponse.json(updatedCertification);

    // 本番用のコード（Cosmos DB接続が確認できたら切り替え）
    /*
    const updatedCertification = await updateCertification(params.id, {
      name,
      description,
      imageUrl,
      category,
      difficulty,
      provider,
      estimatedStudyTime,
      price,
    });
    return NextResponse.json(updatedCertification);
    */
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
    // 仮の実装（開発用）
    const certification = mockCertifications.find(c => c.id === context.params.id);
    if (!certification) {
      return NextResponse.json(
        { error: 'Certification not found' },
        { status: 404 }
      );
    }

    const index = mockCertifications.findIndex(c => c.id === context.params.id);
    mockCertifications.splice(index, 1);
    return new NextResponse(null, { status: 204 });

    // 本番用のコード（Cosmos DB接続が確認できたら切り替え）
    /*
    await deleteCertification(params.id);
    return new NextResponse(null, { status: 204 });
    */
  } catch (error) {
    console.error('Error deleting certification:', error);
    return NextResponse.json(
      { error: 'Failed to delete certification' },
      { status: 500 }
    );
  }
}
