import { NextRequest, NextResponse } from 'next/server';
import { ContactFormData } from '@/types/contact';

export async function POST(request: NextRequest) {
  try {
    const data: ContactFormData = await request.json();
    
    // ここでメール送信やデータベースへの保存などを実装
    // 現時点ではコンソールに出力するだけ
    console.log('Contact form submission:', data);

    return NextResponse.json({ message: 'お問い合わせを受け付けました' });
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { error: 'お問い合わせの処理中にエラーが発生しました' },
      { status: 500 }
    );
  }
}
