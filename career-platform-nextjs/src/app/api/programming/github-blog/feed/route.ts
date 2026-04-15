import { NextResponse } from 'next/server';
import { fetchGithubBlogItems, filterItemsWithinLastDays } from '@/lib/github-blog-rss';

/** GitHub Blog RSS を取得。既定 1 時間キャッシュ（新着は最大1時間遅れ） */
export const revalidate = 3600;

const FEED_FETCH_CAP = 100;
/** 公開用一覧は直近この日数のみ */
const PUBLIC_WINDOW_DAYS = 7;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Math.min(50, Math.max(5, parseInt(searchParams.get('limit') ?? '25', 10) || 25));

  try {
    const { items: raw, feedUrl } = await fetchGithubBlogItems(FEED_FETCH_CAP, {
      next: { revalidate: 3600 },
    });

    const withinWeek = filterItemsWithinLastDays(raw, PUBLIC_WINDOW_DAYS);
    const items = withinWeek.slice(0, limit);

    return NextResponse.json({
      source: feedUrl,
      sourceLabel: 'The GitHub Blog',
      sourcePage: 'https://github.blog/',
      fetchedAt: new Date().toISOString(),
      windowDays: PUBLIC_WINDOW_DAYS,
      filterNote: `直近 ${PUBLIC_WINDOW_DAYS} 日以内に RSS 上で公開された記事のみ表示しています。`,
      items,
    });
  } catch (e) {
    console.error('[github-blog/feed]', e);
    return NextResponse.json(
      { error: 'GitHub Blog フィードの取得に失敗しました', detail: String(e) },
      { status: 502 }
    );
  }
}
