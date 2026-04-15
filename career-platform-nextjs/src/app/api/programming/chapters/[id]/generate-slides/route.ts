import { NextRequest, NextResponse } from 'next/server';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { supabaseAdmin } from '@/lib/supabase';

const NLM_BIN = process.env.NLM_BIN || '/Users/ookubo/.local/bin/nlm';
const SLIDES_BUCKET = 'programming-slides';

function runNlm(args: string): string {
  return execSync(`"${NLM_BIN}" ${args}`, {
    encoding: 'utf-8',
    timeout: 300_000,
    env: { ...process.env, HOME: os.homedir() },
  }).trim();
}

/** スライド生成用に使うノートブックIDを取得（環境変数 or 自動選択） */
function getSlidesNotebookId(): string {
  const configured = process.env.NOTEBOOKLM_SLIDES_NOTEBOOK_ID?.trim();
  if (configured) return configured;

  // 自動選択: 最初のノートブックを使用
  const list = JSON.parse(runNlm('notebook list'));
  if (!list || list.length === 0) throw new Error('利用可能なNotebookLMノートブックがありません');
  return list[0].id;
}

/** ソースIDを付与してテキストソースを追加 */
function addTextSource(notebookId: string, title: string, text: string): string {
  const safeTitle = title.replace(/"/g, '');
  const safeText = text.replace(/"/g, "'").replace(/\n/g, ' ').slice(0, 8000);
  const output = runNlm(
    `source add ${notebookId} --text "${safeText}" --title "${safeTitle}" --wait`
  );
  // "Source ID: xxxxxxxx" を抽出
  const match = output.match(/Source ID:\s*([a-f0-9-]+)/i);
  if (!match) throw new Error('ソースIDが取得できませんでした: ' + output);
  return match[1];
}

/** スライド生成が完了するまでポーリング */
function waitForSlide(notebookId: string, artifactId: string, maxWaitMs = 240_000): void {
  const start = Date.now();
  while (Date.now() - start < maxWaitMs) {
    const status = JSON.parse(runNlm(`studio status ${notebookId}`));
    const artifact = status.find((a: any) => a.id === artifactId);
    if (artifact?.status === 'completed') return;
    if (artifact?.status === 'failed') throw new Error('スライド生成がfailedになりました');
    execSync('sleep 10');
  }
  throw new Error('スライド生成がタイムアウトしました');
}

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const chapterId = params.id;
  let sourceId: string | null = null;
  const tmpPath = path.join(os.tmpdir(), `slide-${chapterId}-${Date.now()}.pdf`);

  try {
    // 1. チャプター情報を取得
    const { data: chapter, error: chapErr } = await supabaseAdmin
      .from('programming_chapters')
      .select('id, language_id, title, description')
      .eq('id', chapterId)
      .single();

    if (chapErr || !chapter) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
    }

    // 2. スライド生成用ノートブックを決定
    const notebookId = getSlidesNotebookId();

    // 3. チャプター内容をソースとして追加
    const sourceText = `タイトル: ${chapter.title}\n\n${chapter.description || ''}`;
    sourceId = addTextSource(notebookId, `chapter-${chapterId}`, sourceText);

    // 4. スライド生成を開始
    const slideRaw = runNlm(`slides create ${notebookId} --language ja --confirm`);
    // "Artifact ID: xxxxxxxx" を抽出
    const artifactMatch = slideRaw.match(/Artifact ID:\s*([a-f0-9-]+)/i);
    if (!artifactMatch) throw new Error('アーティファクトIDが取得できませんでした: ' + slideRaw);
    const artifactId = artifactMatch[1];

    // 5. 完了を待機
    waitForSlide(notebookId, artifactId);

    // 6. PDFをダウンロード
    runNlm(`download slide-deck ${notebookId} --id ${artifactId} --format pdf --output "${tmpPath}" --no-progress`);
    if (!fs.existsSync(tmpPath)) throw new Error('PDFダウンロードに失敗しました');

    // 7. Supabase Storageにアップロード
    const pdfBuffer = fs.readFileSync(tmpPath);
    const storagePath = `${chapter.language_id}/${chapterId}.pdf`;

    const { error: uploadErr } = await supabaseAdmin.storage
      .from(SLIDES_BUCKET)
      .upload(storagePath, pdfBuffer, { contentType: 'application/pdf', upsert: true });

    if (uploadErr) throw new Error(`Storage upload failed: ${uploadErr.message}`);

    // 8. 署名付きURL（1年間有効）を生成
    const { data: signedData, error: signErr } = await supabaseAdmin.storage
      .from(SLIDES_BUCKET)
      .createSignedUrl(storagePath, 60 * 60 * 24 * 365);

    if (signErr || !signedData) throw new Error(`Signed URL failed: ${signErr?.message}`);

    // 9. DBのslide_urlを更新
    const { error: updateErr } = await supabaseAdmin
      .from('programming_chapters')
      .update({ slide_url: signedData.signedUrl, updated_at: new Date().toISOString() })
      .eq('id', chapterId);

    if (updateErr) throw new Error(`DB update failed: ${updateErr.message}`);

    return NextResponse.json({ slideUrl: signedData.signedUrl });
  } catch (error) {
    console.error('generate-slides error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'スライド生成に失敗しました' },
      { status: 500 }
    );
  } finally {
    // 後処理：一時ファイルと追加したソースを削除
    if (fs.existsSync(tmpPath)) {
      try { fs.unlinkSync(tmpPath); } catch { /* ignore */ }
    }
    if (sourceId) {
      try { runNlm(`source delete ${sourceId} --confirm`); } catch { /* ignore */ }
    }
  }
}
