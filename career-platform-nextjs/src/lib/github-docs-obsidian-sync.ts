import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { getGithubDocsDestRoot } from '@/lib/obsidian-paths';

const REPO_URL = 'https://github.com/github/docs.git';

export type SyncGithubDocsResult = {
  ok: true;
  destRoot: string;
  destContent: string;
  markdownFileCount: number;
  message: string;
};

export type SyncGithubDocsError = {
  ok: false;
  error: string;
};

/**
 * github/docs の content/ を Obsidian Vault 配下の GitHub/GitHub-docs にミラーする。
 * 既定: …/Obsidian Vault/GitHub/GitHub-docs（GITHUB_DOCS_OBSIDIAN_DEST で上書き可）
 */
export function syncGithubDocsToObsidian(): SyncGithubDocsResult | SyncGithubDocsError {
  const destRoot = getGithubDocsDestRoot();
  const destContent = path.join(destRoot, 'content');

  try {
    fs.mkdirSync(path.dirname(destRoot), { recursive: true });
    fs.mkdirSync(destRoot, { recursive: true });
  } catch (e) {
    return {
      ok: false,
      error: `格納先を作成できません: ${getGithubDocsDestRoot()} (${e instanceof Error ? e.message : e})`,
    };
  }
  const tmpDir = path.join(os.tmpdir(), `github-docs-sync-${Date.now()}`);

  try {
    execSync(`git clone --depth 1 "${REPO_URL}" "${tmpDir}"`, {
      stdio: 'pipe',
      encoding: 'utf-8',
      maxBuffer: 1024 * 1024 * 50,
    });

    const srcContent = path.join(tmpDir, 'content');
    if (!fs.existsSync(srcContent)) {
      return { ok: false, error: 'クローン後に content ディレクトリが見つかりません。' };
    }

    fs.mkdirSync(destRoot, { recursive: true });
    fs.rmSync(destContent, { recursive: true, force: true });
    fs.cpSync(srcContent, destContent, { recursive: true });

    const readmePath = path.join(destRoot, 'README.md');
    const readme = `# GitHub 公式ドキュメント（github/docs）

このフォルダはオープンソースの [github/docs](https://github.com/github/docs) リポジトリの \`content/\` を同期したものです。

## 言語について

- **ここに同期される Markdown は英語**です（公開リポジトリのソースに準拠）。
- **日本語の公式ドキュメント**は [docs.github.com/ja](https://docs.github.com/ja) で閲覧できます。内容は同一トピックの日本語版です。

## この Vault の使い方

キャリアプラットフォームの **管理画面 → 学習ナレッジ** で同期し、**AIで自動生成** でトピックを指定すると、
Obsidian Vault 配下の Markdown（本フォルダを含む）からキーワード一致するノートを読み取り、プログラミング用チャプターの下書き生成に利用します。

## 再同期

管理画面の「GitHub Docs を Vault に同期」、または次を実行:

\`\`\`bash
npx ts-node scripts/sync-github-docs-to-obsidian.ts
\`\`\`
`;
    fs.writeFileSync(readmePath, readme, 'utf-8');

    let markdownFileCount = 0;
    function countMd(dir: string) {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const e of entries) {
        const p = path.join(dir, e.name);
        if (e.isDirectory()) countMd(p);
        else if (e.isFile() && e.name.endsWith('.md')) markdownFileCount += 1;
      }
    }
    countMd(destContent);

    return {
      ok: true,
      destRoot,
      destContent,
      markdownFileCount,
      message: `GitHub Docs の content を ${markdownFileCount} 個の .md ファイルとして同期しました。`,
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return {
      ok: false,
      error: `同期に失敗しました（git が必要です）: ${msg}`,
    };
  } finally {
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch {
      // ignore
    }
  }
}
