import { NextResponse } from 'next/server';
import { getObsidianVaultStatus } from '@/lib/admin-obsidian-status';
import { DEFAULT_OBSIDIAN_VAULT_ROOT } from '@/lib/obsidian-paths';

/** GET: Obsidian Vault / GitHub-docs 同期状況（パスはマスク可能） */
export async function GET() {
  const s = getObsidianVaultStatus();
  return NextResponse.json({
    defaultVaultRoot: DEFAULT_OBSIDIAN_VAULT_ROOT,
    usingDefaultVault: !process.env.OBSIDIAN_VAULT_PATH?.trim(),
    vaultPathConfigured: s.vaultPathConfigured,
    vaultExists: s.vaultExists,
    githubDocsContentExists: s.githubDocsContentExists,
    markdownFileCount: s.markdownFileCount,
    githubDocsDestHint:
      s.githubDocsDestRoot.length > 0
        ? `…${s.githubDocsDestRoot.slice(-Math.min(64, s.githubDocsDestRoot.length))}`
        : null,
    vaultPathHint:
      s.vaultPath && s.vaultPath.length > 0
        ? `…${s.vaultPath.slice(-Math.min(48, s.vaultPath.length))}`
        : null,
    githubBlogJaDestHint:
      s.githubBlogJaDestRoot.length > 0
        ? `…${s.githubBlogJaDestRoot.slice(-Math.min(64, s.githubBlogJaDestRoot.length))}`
        : null,
    githubBlogJaExists: s.githubBlogJaExists,
    githubBlogJaMarkdownCount: s.githubBlogJaMarkdownCount,
  });
}
