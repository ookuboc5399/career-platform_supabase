import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  return NextResponse.json(
    {
      message: 'Azure OpenAI はスタブ化されています。問題生成機能は後で OpenAI API 等に置換予定です。',
      questions: [],
    },
    { status: 200 }
  );
}
