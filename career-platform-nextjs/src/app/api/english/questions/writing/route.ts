import { NextResponse } from 'next/server';
import { CosmosClient } from '@azure/cosmos';
import { createClient } from '@/lib/supabase-server';

const client = new CosmosClient({
  endpoint: process.env.COSMOS_DB_ENDPOINT || '',
  key: process.env.COSMOS_DB_KEY || ''
});

const database = client.database('career-platform');
const container = database.container('english-questions');

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const level = searchParams.get('level');
    const searchText = searchParams.get('searchText');
    const includeSolved = searchParams.get('includeSolved') === 'true'; // 正解済み問題も含めるかどうか

    if (!category || !level) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const difficulty = searchParams.get('difficulty');
    if (!difficulty) {
      return NextResponse.json({ error: 'Missing difficulty parameter' }, { status: 400 });
    }

    // ユーザーIDを取得
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;

    let query = "SELECT * FROM c WHERE c.type = 'writing' AND c.category = @category AND c.level = @level AND c.difficulty = @difficulty";
    const parameters = [
      { name: '@category', value: category },
      { name: '@level', value: level },
      { name: '@difficulty', value: difficulty }
    ];

    // 検索テキストがある場合、問題文と日本語の内容も検索対象に含める
    if (searchText) {
      query += " AND (CONTAINS(c.content.question, @searchText) OR CONTAINS(c.content.japanese, @searchText))";
      parameters.push({ name: '@searchText', value: searchText });
    }

    const { resources: questions } = await container.items
      .query({
        query,
        parameters
      })
      .fetchAll();

    if (questions.length === 0) {
      return NextResponse.json({ error: 'No questions found' }, { status: 404 });
    }

    // ユーザーがログインしている場合、正解済み問題を除外
    let filteredQuestions = questions;
    if (userId && !includeSolved) {
      try {
        // ユーザーが正解した問題IDを取得
        const { data: progressData } = await supabase
          .from('english_questions_progress')
          .select('question_id')
          .eq('user_id', userId)
          .eq('is_correct', true);

        if (progressData && progressData.length > 0) {
          const solvedQuestionIds = new Set(progressData.map(p => p.question_id));
          filteredQuestions = questions.filter(q => !solvedQuestionIds.has(q.id));
        }
      } catch (progressError) {
        // 進捗の取得に失敗した場合は全問題を返す
        console.error('Error fetching progress:', progressError);
      }
    }

    // フィルタリング後の問題が0件の場合、全問題から選択
    if (filteredQuestions.length === 0) {
      filteredQuestions = questions;
    }

    // ランダムに1問選択
    const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
    return NextResponse.json(filteredQuestions[randomIndex]);
  } catch (error) {
    console.error('Error fetching writing questions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
