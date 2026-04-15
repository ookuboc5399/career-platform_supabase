import { NextRequest, NextResponse } from 'next/server';
import { syncGithubBlogArticlesToObsidian } from '@/lib/github-blog-obsidian-sync';

/**
 * POST: GitHub Blog RSS の新着を OpenAI で日本語化し Obsidian Vault に Markdown 保存
 * 認証: middleware で管理者のみ
 */
export async function POST(request: NextRequest) {
  let maxItems: number | undefined;
  let maxAgeDays: number | undefined;
  try {
    const body = await request.json().catch(() => ({}));
    if (body && typeof body.maxItems === 'number') maxItems = body.maxItems;
    if (body && typeof body.maxAgeDays === 'number') maxAgeDays = body.maxAgeDays;
  } catch {
    /* 空ボディ */
  }

  const result = await syncGithubBlogArticlesToObsidian({ maxItems, maxAgeDays });
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({
    message: result.message,
    destRoot: result.destRoot,
    newFiles: result.newFiles,
    skippedAlreadySaved: result.skippedAlreadySaved,
    skippedTooOld: result.skippedTooOld,
    candidatesInFeed: result.candidatesInFeed,
  });
}
