import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import { fetchGithubBlogItems, GithubBlogFeedItem } from '@/lib/github-blog-rss';
import { getGithubBlogJaDestRoot } from '@/lib/obsidian-paths';

const SYNC_SUBDIR = '_sync';
const LINKS_FILE = 'saved-links.json';

export type SyncGithubBlogObsidianResult =
  | {
      ok: true;
      destRoot: string;
      newFiles: number;
      skippedAlreadySaved: number;
      skippedTooOld: number;
      candidatesInFeed: number;
      message: string;
    }
  | { ok: false; error: string };

export type SyncGithubBlogObsidianOptions = {
  /** 1 リクエストで新規作成する上限（OpenAI 呼び出し回数） */
  maxItems?: number;
  /** RSS のこの日数より古い記事は「未保存でも」取り込まない */
  maxAgeDays?: number;
};

const DEFAULT_MAX_ITEMS = 8;

function loadSavedLinks(root: string): Set<string> {
  const p = path.join(root, SYNC_SUBDIR, LINKS_FILE);
  if (!fs.existsSync(p)) return new Set();
  try {
    const j = JSON.parse(fs.readFileSync(p, 'utf-8')) as { links?: string[] };
    return new Set(Array.isArray(j.links) ? j.links : []);
  } catch {
    return new Set();
  }
}

function saveSavedLinks(root: string, links: Set<string>) {
  const dir = path.join(root, SYNC_SUBDIR);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, LINKS_FILE), JSON.stringify({ links: [...links].sort() }, null, 2), 'utf-8');
}

function ymdFromPubDate(pubDate: string): string {
  const d = new Date(pubDate);
  if (Number.isNaN(d.getTime())) return 'unknown-date';
  return d.toISOString().slice(0, 10);
}

function fileSlug(item: GithubBlogFeedItem): string {
  const ymd = ymdFromPubDate(item.pubDate);
  const h = crypto.createHash('sha256').update(item.link).digest('hex').slice(0, 10);
  return `${ymd}-${h}`;
}

function ageMs(pubDate: string): number {
  const t = new Date(pubDate).getTime();
  if (Number.isNaN(t)) return Infinity;
  return Date.now() - t;
}

async function translateTitleAndSummary(
  openai: OpenAI,
  title: string,
  excerpt: string
): Promise<{ titleJa: string; summaryJa: string }> {
  const body =
    excerpt.trim().length > 0
      ? `Title:\n${title}\n\nExcerpt:\n${excerpt}`
      : `Title:\n${title}\n\n(No excerpt; derive a one-line Japanese summary from the title.)`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    max_tokens: 800,
    messages: [
      {
        role: 'system',
        content:
          'You translate GitHub engineering blog material into natural Japanese for a technical reader. ' +
          'Respond with JSON only: {"titleJa":"記事の日本語タイトル（伝わりやすく）","summaryJa":"2～4文の要約（日本語・体言止めにしすぎない）"}',
      },
      { role: 'user', content: body },
    ],
    response_format: { type: 'json_object' },
  });

  const raw = completion.choices[0]?.message?.content || '{}';
  try {
    const j = JSON.parse(raw) as { titleJa?: string; summaryJa?: string };
    return {
      titleJa: j.titleJa?.trim() || title,
      summaryJa: j.summaryJa?.trim() || excerpt || title,
    };
  } catch {
    return { titleJa: title, summaryJa: excerpt || title };
  }
}

function writeReadme(destRoot: string) {
  const readme = `# GitHub Blog（日本語メモ）

[The GitHub Blog](https://github.blog/) の RSS 記事を、管理画面 **学習ナレッジ** の「GitHub Blog を翻訳して Vault に保存」で取り込んだノートです。

- 本文は OpenAI による**要約・題名の和訳**です。正式な訳文ではありません。
- 原文は各ノートのリンク先を参照してください。
- 既に保存済みの URL は再スキップされます（\`_sync/saved-links.json\`）。

## 学習ページとの関係

公開用の「GitHub の最新情報」チャプターは **直近 1 週間** に限定して一覧します。Vault には週外の記事も、同期実行時にフィードに載っていれば蓄積できます。
`;
  fs.writeFileSync(path.join(destRoot, 'README.md'), readme, 'utf-8');
}

/**
 * RSS から未取得の記事を OpenAI で日英化し、Obsidian Vault 配下に Markdown で追記保存する。
 */
export async function syncGithubBlogArticlesToObsidian(
  options: SyncGithubBlogObsidianOptions = {}
): Promise<SyncGithubBlogObsidianResult> {
  const maxItems = Math.min(30, Math.max(1, options.maxItems ?? DEFAULT_MAX_ITEMS));
  const maxAgeDays = Math.min(120, Math.max(7, options.maxAgeDays ?? 90));
  const maxAgeMs = maxAgeDays * 24 * 60 * 60 * 1000;

  if (!process.env.OPENAI_API_KEY?.trim()) {
    return { ok: false, error: 'OPENAI_API_KEY が設定されていません。' };
  }

  const destRoot = getGithubBlogJaDestRoot();

  try {
    fs.mkdirSync(destRoot, { recursive: true });
  } catch (e) {
    return {
      ok: false,
      error: `保存先を作成できません: ${destRoot}（${e instanceof Error ? e.message : e}）`,
    };
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  let items: GithubBlogFeedItem[];
  try {
    const fetched = await fetchGithubBlogItems(100, {});
    items = fetched.items;
  } catch (e) {
    return { ok: false, error: `RSS の取得に失敗しました: ${e instanceof Error ? e.message : e}` };
  }

  const saved = loadSavedLinks(destRoot);
  let newFiles = 0;
  let skippedAlreadySaved = 0;
  let skippedTooOld = 0;

  for (const item of items) {
    if (saved.has(item.link)) {
      skippedAlreadySaved += 1;
      continue;
    }
    if (ageMs(item.pubDate) > maxAgeMs) {
      skippedTooOld += 1;
      continue;
    }
    if (newFiles >= maxItems) break;

    const { titleJa, summaryJa } = await translateTitleAndSummary(openai, item.title, item.excerpt);
    const slug = fileSlug(item);
    const filePath = path.join(destRoot, `${slug}.md`);

    if (fs.existsSync(filePath)) {
      saved.add(item.link);
      continue;
    }

    const catsYaml =
      item.categories.length > 0
        ? `\ncategories:\n${item.categories.map((c) => `  - ${JSON.stringify(c)}`).join('\n')}`
        : '';

    const md = `---
source_url: ${JSON.stringify(item.link)}
guid: ${JSON.stringify(item.guid)}
pub_date_rss: ${JSON.stringify(item.pubDate)}
original_title: ${JSON.stringify(item.title)}
synced_at: ${JSON.stringify(new Date().toISOString())}${catsYaml}
---

# ${titleJa}

${summaryJa}

---

**原文（英語）:** [GitHub Blog で開く](${item.link})
`;

    fs.writeFileSync(filePath, md, 'utf-8');
    saved.add(item.link);
    saveSavedLinks(destRoot, saved);
    newFiles += 1;
  }

  writeReadme(destRoot);

  const candidatesInFeed = items.filter((i) => ageMs(i.pubDate) <= maxAgeMs).length;

  return {
    ok: true,
    destRoot,
    newFiles,
    skippedAlreadySaved,
    skippedTooOld,
    candidatesInFeed,
    message: `GitHub Blog から ${newFiles} 件を日本語ノートとして保存しました（未処理の新着は次回の実行で続きを処理できます）。`,
  };
}
