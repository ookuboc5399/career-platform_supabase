import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

const PDF_BUCKET = 'programming-slides';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const formData = await request.formData();
    const file = formData.get('pdf') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'PDFファイルが必要です' }, { status: 400 });
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'PDFファイルのみアップロード可能です' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const fileName = `chapters/${params.id}/material-${Date.now()}.pdf`;

    const { error: uploadError } = await supabaseAdmin!.storage
      .from(PDF_BUCKET)
      .upload(fileName, buffer, {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (uploadError) {
      console.error('PDF upload error:', uploadError);
      return NextResponse.json({ error: 'PDFのアップロードに失敗しました' }, { status: 500 });
    }

    const { data: urlData } = supabaseAdmin!.storage
      .from(PDF_BUCKET)
      .getPublicUrl(fileName);

    const pdfUrl = urlData.publicUrl;

    const { error: updateError } = await supabaseAdmin!
      .from('programming_chapters')
      .update({ pdf_url: pdfUrl, updated_at: new Date().toISOString() })
      .eq('id', params.id);

    if (updateError) {
      console.error('DB update error:', updateError);
      return NextResponse.json({ error: 'チャプターの更新に失敗しました' }, { status: 500 });
    }

    return NextResponse.json({ pdfUrl });
  } catch (error) {
    console.error('Error uploading PDF:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'PDFアップロードに失敗しました' },
      { status: 500 }
    );
  }
}
