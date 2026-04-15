'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  GITHUB_BLOG_CURATED_BY_DATE,
  listCuratedDateKeysSorted,
  parseYmd,
  type GitHubBlogCuratedDay,
} from '@/lib/github-blog-curated-dates';

type FeedItem = {
  title: string;
  link: string;
  pubDate: string;
  categories: string[];
};

type FeedResponse = {
  source: string;
  sourceLabel: string;
  sourcePage: string;
  fetchedAt: string;
  windowDays?: number;
  filterNote?: string;
  items: FeedItem[];
  error?: string;
};

const WEEKDAYS_JA = ['日', '月', '火', '水', '木', '金', '土'] as const;

function formatPubDate(raw: string): string {
  if (!raw) return '';
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return raw;
  return new Intl.DateTimeFormat('ja-JP', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(d);
}

function daysInMonth(year: number, month0: number): number {
  return new Date(year, month0 + 1, 0).getDate();
}

function startWeekdaySunday(year: number, month0: number): number {
  return new Date(year, month0, 1).getDay();
}

function BlogCuratedCalendar({
  viewYear,
  viewMonth0,
  onPrevMonth,
  onNextMonth,
  selectedYmd,
  onSelectYmd,
  datesWithContent,
}: {
  viewYear: number;
  viewMonth0: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  selectedYmd: string | null;
  onSelectYmd: (ymd: string) => void;
  datesWithContent: Set<string>;
}) {
  const dim = daysInMonth(viewYear, viewMonth0);
  const start = startWeekdaySunday(viewYear, viewMonth0);
  const cells: { day: number | null; ymd: string | null }[] = [];
  for (let i = 0; i < start; i++) cells.push({ day: null, ymd: null });
  for (let d = 1; d <= dim; d++) {
    const m = String(viewMonth0 + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    cells.push({ day: d, ymd: `${viewYear}-${m}-${dd}` });
  }
  while (cells.length % 7 !== 0) {
    cells.push({ day: null, ymd: null });
  }

  const title = new Intl.DateTimeFormat('ja-JP', { year: 'numeric', month: 'long' }).format(
    new Date(viewYear, viewMonth0, 1)
  );

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm not-prose">
      <div className="flex items-center justify-between gap-2 mb-3">
        <button
          type="button"
          onClick={onPrevMonth}
          className="rounded-lg border border-gray-200 px-2.5 py-1 text-sm text-gray-700 hover:bg-gray-50"
          aria-label="前の月"
        >
          ‹
        </button>
        <span className="text-sm font-semibold text-gray-900">{title}</span>
        <button
          type="button"
          onClick={onNextMonth}
          className="rounded-lg border border-gray-200 px-2.5 py-1 text-sm text-gray-700 hover:bg-gray-50"
          aria-label="次の月"
        >
          ›
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 mb-1">
        {WEEKDAYS_JA.map((w) => (
          <div key={w} className="py-1 font-medium">
            {w}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((c, idx) => {
          if (c.day === null || c.ymd === null) {
            return <div key={`e-${idx}`} className="aspect-square rounded-md bg-gray-50/50" />;
          }
          const has = datesWithContent.has(c.ymd);
          const selected = selectedYmd === c.ymd;
          return (
            <button
              key={c.ymd}
              type="button"
              onClick={() => onSelectYmd(c.ymd!)}
              className={[
                'aspect-square rounded-md text-sm font-medium transition-colors flex flex-col items-center justify-center gap-0.5',
                selected
                  ? 'bg-blue-600 text-white shadow'
                  : has
                    ? 'bg-blue-50 text-blue-900 ring-1 ring-blue-200 hover:bg-blue-100'
                    : 'text-gray-800 hover:bg-gray-100 border border-transparent',
              ].join(' ')}
            >
              <span>{c.day}</span>
              {has ? <span className="h-1 w-1 rounded-full bg-blue-500 shrink-0" aria-hidden /> : null}
            </button>
          );
        })}
      </div>
      <p className="text-xs text-gray-500 mt-3">
        青い丸付きの日に教材まとめがあります。日付を選ぶと下に表示されます。
      </p>
    </div>
  );
}

function CuratedDayPanel({ ymd, day }: { ymd: string; day: GitHubBlogCuratedDay }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-slate-50/80 p-5 not-prose">
      <h3 className="text-lg font-bold text-gray-900 mb-1">この日のまとめ</h3>
      <p className="text-sm text-gray-600 mb-4">
        <time dateTime={ymd}>{day.displayLabel}</time> 登録分（教材用。公式ブログの個別記事とは一致しない場合があります）
      </p>
      <ul className="space-y-6 list-none p-0 m-0">
        {day.items.map((item) => (
          <li key={item.title} className="rounded-lg border border-white bg-white p-4 shadow-sm">
            <h4 className="text-base font-semibold text-gray-900 mb-2">{item.title}</h4>
            <div className="text-sm text-gray-700 leading-relaxed space-y-3">
              {item.body.split(/\n\n+/).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function GitHubBlogLatestGuide() {
  const [data, setData] = useState<FeedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const sortedCuratedKeys = useMemo(() => listCuratedDateKeysSorted(), []);
  const datesWithContent = useMemo(
    () => new Set(Object.keys(GITHUB_BLOG_CURATED_BY_DATE)),
    []
  );

  const defaultYmd = sortedCuratedKeys[0] ?? null;
  const [selectedYmd, setSelectedYmd] = useState<string | null>(defaultYmd);

  const initialView = useMemo(() => {
    const ymd = defaultYmd;
    if (!ymd) {
      const t = new Date();
      return { y: t.getFullYear(), m: t.getMonth() };
    }
    const d = parseYmd(ymd);
    return d ? { y: d.getFullYear(), m: d.getMonth() } : { y: new Date().getFullYear(), m: new Date().getMonth() };
  }, [defaultYmd]);

  const [viewYear, setViewYear] = useState(initialView.y);
  const [viewMonth0, setViewMonth0] = useState(initialView.m);

  useEffect(() => {
    setViewYear(initialView.y);
    setViewMonth0(initialView.m);
  }, [initialView.y, initialView.m]);

  const selectedDay = selectedYmd ? GITHUB_BLOG_CURATED_BY_DATE[selectedYmd] : undefined;

  const onPrevMonth = useCallback(() => {
    setViewMonth0((m) => {
      if (m === 0) {
        setViewYear((y) => y - 1);
        return 11;
      }
      return m - 1;
    });
  }, []);

  const onNextMonth = useCallback(() => {
    setViewMonth0((m) => {
      if (m === 11) {
        setViewYear((y) => y + 1);
        return 0;
      }
      return m + 1;
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const res = await fetch('/api/programming/github-blog/feed?limit=30');
        const json = await res.json();
        if (!res.ok) {
          throw new Error(json.error || `HTTP ${res.status}`);
        }
        if (!cancelled) setData(json);
      } catch (e) {
        if (!cancelled) setErr(e instanceof Error ? e.message : '読み込みに失敗しました');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">GitHub の最新情報（The GitHub Blog）</h2>
      <p className="text-gray-600 mb-4">
        公開元は公式ブログ{' '}
        <a
          href="https://github.blog/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline hover:text-blue-800"
        >
          github.blog
        </a>
        です。この一覧は{' '}
        <a
          href="https://github.blog/feed/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline hover:text-blue-800"
        >
          RSS
        </a>
        から取得し、
        <strong>直近 {data?.windowDays ?? 7} 日以内に公開された記事だけ</strong>
        を表示しています（サーバー側で約 1 時間キャッシュ）。
      </p>
      <p className="text-sm text-gray-600 mb-6">
        記事を日本語の要約付きで Obsidian Vault に蓄積するには、管理者向け{' '}
        <a href="/admin/knowledge" className="text-blue-600 underline hover:text-blue-800">
          学習ナレッジ
        </a>
        の「GitHub Blog を翻訳して Vault に保存」を実行してください（OpenAI API とローカル Vault パスが必要です）。
      </p>

      {sortedCuratedKeys.length > 0 ? (
        <section className="mb-12 not-prose">
          <h3 className="text-xl font-bold text-gray-900 mb-2">教材: 日付別まとめ（カレンダー）</h3>
          <p className="text-sm text-gray-600 mb-4 max-w-3xl">
            カレンダーから日付を選ぶと、その日に登録した教材用のまとめが表示されます（公式 RSS とは別データです）。
          </p>
          <div className="flex flex-col lg:flex-row gap-6 max-w-5xl">
            <div className="w-full max-w-sm shrink-0">
              <BlogCuratedCalendar
                viewYear={viewYear}
                viewMonth0={viewMonth0}
                onPrevMonth={onPrevMonth}
                onNextMonth={onNextMonth}
                selectedYmd={selectedYmd}
                onSelectYmd={setSelectedYmd}
                datesWithContent={datesWithContent}
              />
            </div>
            <div className="min-w-0 flex-1">
              {selectedYmd && selectedDay ? (
                <CuratedDayPanel ymd={selectedYmd} day={selectedDay} />
              ) : selectedYmd ? (
                <div className="rounded-xl border border-dashed border-amber-200 bg-amber-50/60 px-4 py-8 text-sm text-amber-900">
                  <time dateTime={selectedYmd}>{selectedYmd}</time> の教材まとめはまだ登録されていません。別の日付を選ぶか、
                  <code className="rounded bg-white/80 px-1">src/lib/github-blog-curated-dates.ts</code> に追記してください。
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-sm text-gray-600">
                  表示する日付をカレンダーから選択してください。
                </div>
              )}
            </div>
          </div>
        </section>
      ) : null}

      {loading && (
        <div className="flex items-center gap-3 text-gray-600 py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-blue-600" />
          フィードを読み込み中…
        </div>
      )}

      {err && (
        <div className="rounded-lg border border-red-200 bg-red-50 text-red-800 px-4 py-3 text-sm">{err}</div>
      )}

      {!loading && !err && data && (
        <>
          <h3 className="text-xl font-bold text-gray-900 mb-3 not-prose">RSS: 直近の新着記事</h3>
          <p className="text-sm text-gray-500 mb-4 not-prose">
            取得日時: {formatPubDate(data.fetchedAt)}（ローカル時刻） / 表示件数: {data.items.length}
            {data.filterNote ? ` — ${data.filterNote}` : null}
          </p>
          {data.items.length === 0 ? (
            <p className="text-gray-600 py-6 rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4">
              直近 {data.windowDays ?? 7} 日以内に公開された記事は、現在の RSS には含まれていませんでした。翌日以降に再度開いてください。
            </p>
          ) : null}
          <ul className="list-none p-0 m-0 space-y-4 not-prose">
            {data.items.map((item) => (
              <li
                key={`${item.link}-${item.pubDate}`}
                className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:border-gray-300 transition-colors"
              >
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-semibold text-gray-900 hover:text-blue-700"
                >
                  {item.title}
                </a>
                {item.pubDate ? (
                  <p className="text-sm text-gray-500 mt-1">{formatPubDate(item.pubDate)}</p>
                ) : null}
                {item.categories.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {item.categories.map((c) => (
                      <span
                        key={c}
                        className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-700"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </>
      )}
    </article>
  );
}
