import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  return NextResponse.json(
    { error: '音声機能はスタブ化されています。後で OpenAI API 等に置換予定です。' },
    { status: 503 }
  );
}
