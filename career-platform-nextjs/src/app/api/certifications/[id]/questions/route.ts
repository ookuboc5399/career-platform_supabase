import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_EXPRESS_API_URL || 'http://localhost:4000';

/**
 * 資格別の問題一覧（Express へプロキシ）
 * クライアントのセッション画面 `/certifications/[id]/questions/session` がこのパスを参照する。
 */
export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = context.params instanceof Promise ? await context.params : context.params;
    const certificationId = resolvedParams.id;

    const questionsResponse = await fetch(
      `${API_BASE_URL}/api/certifications/${encodeURIComponent(certificationId)}/questions`,
      { cache: 'no-store' }
    );

    if (!questionsResponse.ok) {
      const errText = await questionsResponse.text().catch(() => '');
      console.error(
        `[api/certifications/.../questions] Express ${questionsResponse.status}:`,
        errText.slice(0, 500)
      );
      return NextResponse.json(
        { error: 'Failed to fetch questions' },
        { status: questionsResponse.status }
      );
    }

    const questions = await questionsResponse.json();
    return NextResponse.json(questions);
  } catch (error) {
    console.error('Error proxying certification questions:', error);
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
  }
}
