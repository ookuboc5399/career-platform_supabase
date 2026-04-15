import { getChapterSearchBoost } from '@/lib/programming-chapter-search-keywords';

/** 学習一覧のチャプターツリーを検索用にフラット化する */

export type ChapterLike = {
  id: string;
  title: string;
  description: string;
  order: number;
  status: 'draft' | 'published';
  subChapters?: ChapterLike[];
};

export type FlatChapterHit = {
  chapterId: string;
  title: string;
  description: string;
  breadcrumb: string[];
  /** 一覧でこの親を展開すれば到達できるトップレベルチャプター ID */
  topLevelId: string;
};

function collectFromSubs(
  subs: ChapterLike[],
  topLevelId: string,
  breadcrumbPrefix: string[],
  out: FlatChapterHit[]
) {
  const sorted = [...subs].sort((a, b) => a.order - b.order);
  for (const s of sorted) {
    if (s.status === 'published') {
      out.push({
        chapterId: s.id,
        title: s.title,
        description: s.description || '',
        breadcrumb: [...breadcrumbPrefix, s.title],
        topLevelId,
      });
    }
    if (s.subChapters?.length) {
      // 下書きのセクション見出しもパンくずに含め、検索結果で階層が分かるようにする
      collectFromSubs(s.subChapters, topLevelId, [...breadcrumbPrefix, s.title], out);
    }
  }
}

export function flattenPublishedChaptersForSearch(topChapters: ChapterLike[]): FlatChapterHit[] {
  const out: FlatChapterHit[] = [];
  const sortedTop = [...topChapters].sort((a, b) => a.order - b.order);
  for (const ch of sortedTop) {
    if (ch.status !== 'published') continue;
    out.push({
      chapterId: ch.id,
      title: ch.title,
      description: ch.description || '',
      breadcrumb: [ch.title],
      topLevelId: ch.id,
    });
    if (ch.subChapters?.length) {
      collectFromSubs(ch.subChapters, ch.id, [ch.title], out);
    }
  }
  return out;
}

function normalize(s: string): string {
  try {
    return s.normalize('NFKC').toLowerCase().trim();
  } catch {
    return s.toLowerCase().trim();
  }
}

export function filterFlatChaptersByQuery(
  rows: FlatChapterHit[],
  query: string,
  languageId?: string
): FlatChapterHit[] {
  const q = normalize(query);
  if (!q) return rows;
  return rows.filter((row) => {
    const boost =
      languageId && row.chapterId ? getChapterSearchBoost(languageId, row.chapterId) : '';
    const hay = normalize(
      `${row.title} ${row.description} ${row.chapterId} ${row.breadcrumb.join(' ')} ${boost}`
    );
    return hay.includes(q);
  });
}

export function topLevelIdsForHits(hits: FlatChapterHit[]): Set<string> {
  return new Set(hits.map((h) => h.topLevelId));
}
