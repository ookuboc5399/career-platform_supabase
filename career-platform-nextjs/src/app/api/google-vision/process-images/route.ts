import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  return NextResponse.json(
    { error: 'Azure Computer Vision はスタブ化されています。画像処理機能は後で置換予定です。' },
    { status: 503 }
  );
}
