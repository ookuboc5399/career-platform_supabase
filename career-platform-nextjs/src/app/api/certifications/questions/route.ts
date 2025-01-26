import { NextRequest, NextResponse } from 'next/server';
import { certificationQuestionsContainer, initializeDatabase } from '@/lib/cosmos-db';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    if (!certificationQuestionsContainer) await initializeDatabase();
    
    const body = await request.json();
    const { certificationId, question, questionImage, options, correctAnswers, explanation, explanationImage, year, category } = body;

    // 既存の問題をカウント
    const { resources: existingQuestions } = await certificationQuestionsContainer.items
      .query({
        query: "SELECT * FROM c WHERE c.certificationId = @certificationId",
        parameters: [{ name: "@certificationId", value: certificationId }]
      })
      .fetchAll();

    // 新しい問題番号を生成
    const questionNumber = existingQuestions.length + 1;

    // 新しい問題を作成
    const newQuestion = {
      id: uuidv4(),
      certificationId,
      questionNumber,
      question,
      options,
      correctAnswers,
      explanation,
      explanationImages: explanationImage ? [explanationImage] : [],
      year,
      category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 問題を保存
    const { resource: createdQuestion } = await certificationQuestionsContainer.items.create(newQuestion);

    return NextResponse.json(createdQuestion);
  } catch (error) {
    console.error('Error creating question:', error);
    return NextResponse.json({ error: 'Failed to create question' }, { status: 500 });
  }
}
