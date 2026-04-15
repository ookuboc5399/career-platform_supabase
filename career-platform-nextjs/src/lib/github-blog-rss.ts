/** The GitHub Blog RSS（ https://github.blog/feed/ ）を解釈するユーティリティ */

export type GithubBlogFeedItem = {
  title: string;
  link: string;
  pubDate: string;
  guid: string;
  /** description から HTML を除いた抜粋 */
  excerpt: string;
  /** 先頭から最大3件のカテゴリ */
  categories: string[];
};

const FEED_URL = 'https://github.blog/feed/';

function extractFirstTag(block: string, localName: string): string {
  const cdata = new RegExp(
    `<${localName}[^>]*>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*</${localName}>`,
    'i'
  );
  const plain = new RegExp(`<${localName}[^>]*>([\\s\\S]*?)</${localName}>`, 'i');
  const m = block.match(cdata) || block.match(plain);
  if (!m) return '';
  return stripInlineHtml(m[1]).trim();
}

function stripInlineHtml(s: string): string {
  return s
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractGuid(block: string): string {
  const m = block.match(/<guid[^>]*>\s*([^<]+?)\s*<\/guid>/i);
  return m ? m[1].trim() : '';
}

function clampExcerpt(s: string, max = 800): string {
  if (s.length <= max) return s;
  return `${s.slice(0, max - 1)}…`;
}

/** 公開日が直近 `days` 日以内のアイテムのみ（`pubDate` が無効なものは除外） */
export function filterItemsWithinLastDays(items: GithubBlogFeedItem[], days: number): GithubBlogFeedItem[] {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return items.filter((item) => {
    const t = new Date(item.pubDate).getTime();
    return !Number.isNaN(t) && t >= cutoff;
  });
}

export function parseGithubBlogRss(xml: string, limit = 30): GithubBlogFeedItem[] {
  const out: GithubBlogFeedItem[] = [];
  const parts = xml.split(/<item[^>]*>/i);
  for (let i = 1; i < parts.length && out.length < limit; i++) {
    const block = parts[i].split(/<\/item>/i)[0];
    if (!block) continue;

    const title = extractFirstTag(block, 'title');
    const link = extractFirstTag(block, 'link').trim();
    const pubDate = extractFirstTag(block, 'pubDate');
    const rawDesc = (() => {
      const cdata = /<description[^>]*>\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*<\/description>/i.exec(block);
      if (cdata) return stripInlineHtml(cdata[1]);
      const plain = /<description[^>]*>([\s\S]*?)<\/description>/i.exec(block);
      return plain ? stripInlineHtml(plain[1]) : '';
    })();
    const excerpt = clampExcerpt(rawDesc);
    const guid = extractGuid(block) || link;

    const categories: string[] = [];
    const catRe = /<category(?:\s[^>]*)?>\s*(?:<!\[CDATA\[([\s\S]*?)\]\]>|([^<]*))\s*<\/category>/gi;
    let cm: RegExpExecArray | null;
    while ((cm = catRe.exec(block)) !== null && categories.length < 5) {
      const c = (cm[1] ?? cm[2] ?? '').trim();
      if (c) categories.push(c);
    }

    if (title && link.startsWith('http')) {
      out.push({
        title,
        link,
        pubDate,
        guid,
        excerpt,
        categories: [...new Set(categories)].slice(0, 3),
      });
    }
  }
  return out;
}

export async function fetchGithubBlogItems(
  limit = 30,
  init?: RequestInit & { next?: { revalidate?: number } }
): Promise<{ items: GithubBlogFeedItem[]; feedUrl: string }> {
  const res = await fetch(FEED_URL, {
    ...init,
    headers: {
      Accept: 'application/rss+xml, application/xml, text/xml',
      'User-Agent': 'CareerPlatform/1.0 (GitHub Blog reader for learning)',
      ...init?.headers,
    },
  });
  if (!res.ok) {
    throw new Error(`GitHub Blog feed HTTP ${res.status}`);
  }
  const xml = await res.text();
  return {
    items: parseGithubBlogRss(xml, limit),
    feedUrl: FEED_URL,
  };
}
