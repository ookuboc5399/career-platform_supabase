import { NextResponse } from 'next/server';
import { CosmosClient } from '@azure/cosmos';
import { createClient } from '@/lib/supabase-server';

const client = new CosmosClient({
  endpoint: process.env.COSMOS_DB_ENDPOINT || '',
  key: process.env.COSMOS_DB_KEY || ''
});

const database = client.database('career-platform');
const container = database.container('english-questions');

export async function POST(request: Request) {
  try {
    const { questionId, answer, isCorrectOrder } = await request.json();

    if (!questionId || !answer) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    console.log('Received submission:', { questionId, answer, isCorrectOrder });

    // ユーザーIDを取得
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;

    // 問題を取得
    const { resource: question } = await container.item(questionId, questionId).read();
    if (!question) {
      console.error('Question not found:', questionId);
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    console.log('Answer check:', {
      expected: question.content.english,
      received: answer,
      isCorrectOrder
    });

    // 単語の順序が正しい場合のみ正解とする
    const isCorrect = isCorrectOrder;

    // ユーザーがログインしている場合、正解した問題を記録
    if (userId && isCorrect) {
      try {
        const now = new Date().toISOString();
        const progressId = `${userId}-${questionId}`;
        
        // 既存のレコードを確認
        const { data: existing } = await supabase
          .from('english_questions_progress')
          .select('*')
          .eq('user_id', userId)
          .eq('question_id', questionId)
          .single();

        if (existing) {
          // 既存のレコードを更新（正解した場合のみ更新）
          await supabase
            .from('english_questions_progress')
            .update({
              is_correct: isCorrect,
              answered_at: now,
              updated_at: now,
            })
            .eq('id', existing.id);
        } else {
          // 新規レコードを作成
          await supabase
            .from('english_questions_progress')
            .insert({
              id: progressId,
              user_id: userId,
              question_id: questionId,
              question_type: question.type || 'writing',
              is_correct: isCorrect,
              answered_at: now,
              created_at: now,
              updated_at: now,
            });
        }
      } catch (progressError) {
        // 進捗の記録に失敗しても回答自体は返す
        console.error('Error recording progress:', progressError);
      }
    }

    return NextResponse.json({
      success: true,
      isCorrect,
      correctAnswer: question.content.english,
      yourAnswer: answer,
      explanation: question.content.explanation
    });
  } catch (error) {
    console.error('Error submitting answer:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
