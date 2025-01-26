import { NextRequest, NextResponse } from 'next/server';
import { CosmosClient } from '@azure/cosmos';
import { createCertificationQuestionProgress, getCertificationQuestionProgress } from '@/lib/cosmos-db';

export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/certifications/questions/progress - Start');
    const body = await request.json();
    console.log('Request body:', body);

    const { certificationId, questionId, selectedAnswer } = body;

    // 問題データを取得して正解を確認
    const client = new CosmosClient({
      endpoint: process.env.COSMOS_DB_ENDPOINT || '',
      key: process.env.COSMOS_DB_KEY || ''
    });
    const database = client.database('career-platform');
    const questionsContainer = database.container('certification-questions');
    const { resource: question } = await questionsContainer.item(questionId, questionId).read();
    
    if (!question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    const isCorrect = question.correctAnswers.includes(selectedAnswer);

    // 進捗を記録
    const progress = await createCertificationQuestionProgress({
      certificationId,
      questionId,
      selectedAnswer,
      isCorrect,
      timestamp: new Date().toISOString(),
    });

    console.log('Created progress:', progress);
    return NextResponse.json(progress);
  } catch (error) {
    console.error('Error creating progress:', error);
    return NextResponse.json(
      { error: 'Failed to create progress' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('GET /api/certifications/questions/progress - Start');
    const url = new URL(request.url);
    const certificationId = url.searchParams.get('certificationId');
    console.log('Certification ID:', certificationId);

    if (!certificationId) {
      return NextResponse.json(
        { error: 'Certification ID is required' },
        { status: 400 }
      );
    }

    const progress = await getCertificationQuestionProgress(certificationId);
    console.log('Found progress:', progress);
    return NextResponse.json(progress);
  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    );
  }
}
