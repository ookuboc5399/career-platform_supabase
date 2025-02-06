import { NextRequest, NextResponse } from 'next/server';
import { certificationQuestionsContainer, initializeDatabase } from '@/lib/cosmos-db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!certificationQuestionsContainer) await initializeDatabase();

    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('keyword');
    const year = searchParams.get('year');
    const category = searchParams.get('category');
    const certificationId = params.id;

    // クエリの構築
    let queryParts = ['c.certificationId = @certificationId'];
    const queryParams: { name: string; value: string }[] = [
      { name: '@certificationId', value: certificationId }
    ];

    if (year) {
      queryParts.push('c.year = @year');
      queryParams.push({ name: '@year', value: year });
    }

    if (category) {
      queryParts.push('c.category = @category');
      queryParams.push({ name: '@category', value: category });
    }

    if (keyword) {
      queryParts.push('(CONTAINS(LOWER(c.question), LOWER(@keyword)) OR ' +
        'ARRAY_CONTAINS(c.options, @keyword, true) OR ' +
        'CONTAINS(LOWER(c.explanation), LOWER(@keyword)))');
      queryParams.push({ name: '@keyword', value: keyword.toLowerCase() });
    }

    const queryString = `SELECT * FROM c WHERE ${queryParts.join(' AND ')} ORDER BY c.questionNumber`;
    console.log('実行するクエリ:', queryString);
    console.log('パラメータ:', queryParams);

    const { resources } = await certificationQuestionsContainer.items
      .query({
        query: queryString,
        parameters: queryParams
      })
      .fetchAll();

    console.log('検索結果:', resources.length, '件');
    return NextResponse.json(resources);
  } catch (error) {
    console.error('検索エラー:', error);
    return NextResponse.json({ error: '検索中にエラーが発生しました' }, { status: 500 });
  }
}
