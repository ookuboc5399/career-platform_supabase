import { NextResponse } from 'next/server';
import { syncGithubDocsToObsidian } from '@/lib/github-docs-obsidian-sync';

/**
 * POST: github/docs の content を Vault/GitHub/GitHub-docs に同期
 * 認証: middleware で管理者のみ
 */
export async function POST() {
  const result = syncGithubDocsToObsidian();
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({
    markdownFileCount: result.markdownFileCount,
    destRoot: result.destRoot,
    destContent: result.destContent,
    message: result.message,
  });
}
