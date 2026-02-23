import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  return NextResponse.json(
    { error: 'OCR 機能はスタブ化されています。後で置換予定です。' },
    { status: 503 }
  );
}
