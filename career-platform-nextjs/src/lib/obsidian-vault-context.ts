import fs from 'fs';
import path from 'path';

const MAX_DEPTH_DEFAULT = 8;
const MAX_FILES = 5;
const MAX_CHARS_PER_FILE = 4000;
const MAX_TOTAL_CONTEXT = 12000;

/**
 * Obsidian Vault 内の .md から、トピック・言語に関連する抜粋を集める。
 * ファイル名に加え、本文にもキーワードが含まれる場合にマッチ（GitHub-docs の英語ノート向け）。
 */
export function buildObsidianContextForTopic(
  vaultPath: string,
  keywords: string[],
  options?: { maxDepth?: number }
): string {
  if (!vaultPath || !fs.existsSync(vaultPath) || keywords.length === 0) return '';

  const normalized = keywords
    .map((k) => k.trim().toLowerCase())
    .filter((k) => k.length > 1);
  if (normalized.length === 0) return '';

  const maxDepth = options?.maxDepth ?? MAX_DEPTH_DEFAULT;
  const matched: { score: number; text: string }[] = [];

  function matchesKeyword(haystack: string): boolean {
    const h = haystack.toLowerCase();
    return normalized.some((kw) => h.includes(kw));
  }

  function walkDir(dir: string, depth: number) {
    if (depth > maxDepth || matched.length >= MAX_FILES * 2) return;
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.name.startsWith('.')) continue;
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          walkDir(fullPath, depth + 1);
        } else if (entry.name.endsWith('.md')) {
          try {
            const content = fs.readFileSync(fullPath, 'utf-8');
            const lowerName = entry.name.toLowerCase();
            const nameMatch = matchesKeyword(lowerName);
            const bodyMatch = matchesKeyword(content.slice(0, 8000));
            if (!nameMatch && !bodyMatch) continue;

            const rel = path.relative(vaultPath, fullPath);
            const header = `## ${rel.replace(/\\/g, '/')}`;
            const trimmed = content.slice(0, MAX_CHARS_PER_FILE);
            const score = (nameMatch ? 2 : 0) + (bodyMatch ? 1 : 0);
            matched.push({ score, text: `${header}\n${trimmed}` });
          } catch {
            // skip
          }
        }
      }
    } catch {
      // skip
    }
  }

  walkDir(vaultPath, 0);

  matched.sort((a, b) => b.score - a.score);
  const selected = matched.slice(0, MAX_FILES);
  if (selected.length === 0) return '';

  const combined = selected.map((m) => m.text).join('\n\n---\n\n');
  return combined.slice(0, MAX_TOTAL_CONTEXT);
}
