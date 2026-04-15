import path from 'path';

/** Obsidian の Vault ルート（ナレッジ検索の起点） */
export const DEFAULT_OBSIDIAN_VAULT_ROOT = '/Users/ookubo/Documents/Obsidian Vault';

/** github/docs の同期先（Vault 内の GitHub/GitHub-docs） */
export function getObsidianVaultRoot(): string {
  return process.env.OBSIDIAN_VAULT_PATH?.trim() || DEFAULT_OBSIDIAN_VAULT_ROOT;
}

/**
 * GitHub 公式ドキュメントの格納先（content が入るディレクトリの親＝GitHub-docs フォルダ）
 * GITHUB_DOCS_OBSIDIAN_DEST でフルパス上書き可能
 */
export function getGithubDocsDestRoot(): string {
  const explicit = process.env.GITHUB_DOCS_OBSIDIAN_DEST?.trim();
  if (explicit) return explicit;
  return path.join(getObsidianVaultRoot(), 'GitHub', 'GitHub-docs');
}

export function getGithubDocsContentPath(): string {
  return path.join(getGithubDocsDestRoot(), 'content');
}

/**
 * GitHub Blog 記事（日本語訳ノート）の格納先
 * GITHUB_BLOG_OBSIDIAN_DEST でフルパス上書き可能
 */
export function getGithubBlogJaDestRoot(): string {
  const explicit = process.env.GITHUB_BLOG_OBSIDIAN_DEST?.trim();
  if (explicit) return explicit;
  return path.join(getObsidianVaultRoot(), 'GitHub', 'GitHub-blog-ja');
}
