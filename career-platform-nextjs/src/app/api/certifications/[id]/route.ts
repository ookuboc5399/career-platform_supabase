import { NextRequest, NextResponse } from 'next/server';
import { UpdateCertificationDto, Certification } from '@/types/api';
import { CosmosClient } from '@azure/cosmos';

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
    
    // 認定試験を取得
    const { resource: certification } = await container.item(resolvedParams.id, resolvedParams.id).read();
    if (!certification) {
      console.log('Certification not found');
      return NextResponse.json({ error: 'Certification not found' }, { status: 404 });
    }
    console.log('Found certification:', certification);

    // 問題を取得
    const { resources: questions } = await certificationQuestionsContainer.items
      .query({
        query: 'SELECT * FROM c WHERE c.certificationId = @certificationId',
        parameters: [{ name: '@certificationId', value: resolvedParams.id }]
      })
      .fetchAll();
    console.log('Found questions:', questions);

    return NextResponse.json({
      ...certification,
      questions: questions || []
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
    const body = await request.json();
    console.log('Request body:', body);

    const { name, description, category, difficulty, estimatedStudyTime } = body;
    console.log('Parsed data:', { name, description, category, difficulty, estimatedStudyTime });

    const { resource: certification } = await container.item(context.params.id, context.params.id).read();
    console.log('Found certification:', certification);
    if (!certification) {
      return NextResponse.json(
        { error: 'Certification not found' },
        { status: 404 }
      );
    }

    const updatedCertification = {
      ...certification,
      name,
      description,
      category,
      difficulty,
      estimatedStudyTime,
      updatedAt: new Date().toISOString(),
    };

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
