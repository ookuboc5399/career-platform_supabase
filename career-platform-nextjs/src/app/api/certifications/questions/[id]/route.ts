import { NextRequest, NextResponse } from 'next/server';
import { certificationQuestionsContainer, initializeDatabase } from '@/lib/cosmos-db';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!certificationQuestionsContainer) await initializeDatabase();

    const { id } = params;
    const body = await request.json();
    const { 
      question, 
      questionImage, 
      options, 
      correctAnswers, 
      explanation, 
      explanationImages,
      explanationTable,
      year, 
      category,
      mainCategory 
    } = body;

    // 既存の問題を取得
    // First, get the question to get its certificationId
    const { certificationId } = body;
    console.log('Updating question with ID:', id, 'certificationId:', certificationId);
    const { resources } = await certificationQuestionsContainer.items
      .query({
        query: 'SELECT * FROM c WHERE c.id = @id AND c.certificationId = @certificationId',
        parameters: [
          { name: '@id', value: id },
          { name: '@certificationId', value: certificationId }
        ]
      })
      .fetchAll();
    
    console.log('Query results:', resources);
    const existingQuestion = resources[0];
    if (!existingQuestion) {
      return NextResponse.json({ error: '問題が見つかりません' }, { status: 404 });
    }

    // 問題を更新（certificationIdとquestionNumberを保持）
    const updatedQuestion = {
      ...existingQuestion,
      question,
      questionImage: questionImage || null,
      options: options.map((opt: { text: string; imageUrl: string | null }) => ({
        text: opt.text,
        imageUrl: opt.imageUrl
      })),
      correctAnswers,
      explanation,
      explanationImages,
      ...(explanationTable && { explanationTable }),
      year,
      category,
      mainCategory,
      certificationId: existingQuestion.certificationId,
      questionNumber: existingQuestion.questionNumber,
      updatedAt: new Date().toISOString(),
    };

    // 問題を保存
    console.log('Updating question with certificationId:', existingQuestion.certificationId);
    const { resource: savedQuestion } = await certificationQuestionsContainer
      .item(id, existingQuestion.certificationId)
      .replace(updatedQuestion);

    console.log('Successfully updated question');
    return NextResponse.json(savedQuestion);
  } catch (error) {
    console.error('Error updating question:', error);
    return NextResponse.json({ error: '問題の更新に失敗しました' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!certificationQuestionsContainer) await initializeDatabase();

    const { id } = params;

    // 既存の問題を取得
    // First, get the question to get its certificationId
    // First try to find the question by ID only
    const { resources } = await certificationQuestionsContainer.items
      .query({
        query: 'SELECT * FROM c WHERE c.id = @id',
        parameters: [{ name: '@id', value: id }]
      })
      .fetchAll();
    
    const existingQuestion = resources[0];
    if (!existingQuestion) {
      return NextResponse.json({ error: '問題が見つかりません' }, { status: 404 });
    }

    // 問題を削除
    await certificationQuestionsContainer.item(id, existingQuestion.certificationId).delete();

    return NextResponse.json({ message: '問題を削除しました' });
  } catch (error) {
    console.error('Error deleting question:', error);
    return NextResponse.json({ error: '問題の削除に失敗しました' }, { status: 500 });
  }
}
