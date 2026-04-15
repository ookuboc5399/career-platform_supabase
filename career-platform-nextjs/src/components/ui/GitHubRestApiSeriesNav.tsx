'use client';

import Link from 'next/link';
import clsx from 'clsx';
import {
  GITHUB_REST_API_CHAPTER_SERIES,
  GITHUB_REST_API_SERIES_TOTAL,
  getGitHubRestApiSeriesIndex,
} from '@/lib/github-rest-api-series';

type Props = {
  languageId: string;
  currentChapterId: string;
  children: React.ReactNode;
};

export default function GitHubRestApiSeriesNav({ languageId, currentChapterId, children }: Props) {
  const idx = getGitHubRestApiSeriesIndex(currentChapterId);
  const prev = idx > 0 ? GITHUB_REST_API_CHAPTER_SERIES[idx - 1] : null;
  const next =
    idx >= 0 && idx < GITHUB_REST_API_CHAPTER_SERIES.length - 1
      ? GITHUB_REST_API_CHAPTER_SERIES[idx + 1]
      : null;

  const current = idx >= 0 ? GITHUB_REST_API_CHAPTER_SERIES[idx] : null;
  const base = `/programming/${languageId}/chapters`;

  return (
    <div className="mb-8 w-full max-w-4xl">
      <nav
        aria-label="GitHub REST API サブチャプター（推奨の読み順）"
        className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-950"
      >
        <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">
            カテゴリ（推奨順）
          </p>
          {current ? (
            <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
              いま{' '}
              <span className="tabular-nums text-blue-600 dark:text-blue-400">
                {current.step}/{GITHUB_REST_API_SERIES_TOTAL}
              </span>
              ：{current.navLabel}
            </p>
          ) : null}
        </div>
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
          <strong className="font-semibold text-gray-800 dark:text-gray-100">ハブ → 共通 → Repos / PR → Organization</strong>
          の順で公式ドキュメントの地図を追いやすくなります。どの項目からでも開けます。
        </p>

        <ol className="flex list-none flex-col gap-2 p-0 sm:flex-row sm:flex-wrap sm:items-center sm:gap-1">
          {GITHUB_REST_API_CHAPTER_SERIES.map((s, i) => {
            const active = s.id === currentChapterId;
            return (
              <li key={s.id} className="flex items-center gap-1 sm:contents">
                <Link
                  href={`${base}/${s.id}`}
                  scroll={false}
                  className={clsx(
                    'inline-flex min-h-[44px] w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors sm:w-auto sm:min-w-0',
                    active
                      ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-400/50 dark:bg-blue-600 dark:text-white dark:ring-blue-400/40'
                      : 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200 hover:bg-blue-50 hover:ring-blue-200 dark:bg-gray-800 dark:text-gray-100 dark:ring-gray-500 dark:hover:bg-gray-700 dark:hover:ring-gray-400'
                  )}
                  aria-current={active ? 'page' : undefined}
                >
                  <span
                    className={clsx(
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold tabular-nums',
                      active
                        ? 'bg-white/25 text-white'
                        : 'bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-50'
                    )}
                    aria-hidden
                  >
                    {s.step}
                  </span>
                  <span className="leading-snug">{s.navLabel}</span>
                </Link>
                {i < GITHUB_REST_API_CHAPTER_SERIES.length - 1 ? (
                  <span
                    className="hidden shrink-0 px-1 text-base font-semibold text-gray-400 dark:text-gray-500 sm:inline"
                    aria-hidden
                  >
                    →
                  </span>
                ) : null}
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="mb-8">{children}</div>

      <div className="flex flex-col gap-3 border-t border-gray-200 pt-6 dark:border-gray-600 sm:flex-row sm:items-center sm:justify-between">
        {prev ? (
          <Link
            href={`${base}/${prev.id}`}
            scroll={false}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-900 shadow-sm transition-colors hover:border-blue-400 hover:bg-blue-50 dark:border-gray-500 dark:bg-gray-900 dark:text-gray-50 dark:hover:border-blue-500 dark:hover:bg-gray-800"
          >
            <span aria-hidden>←</span>
            <span className="flex flex-col items-start gap-0.5">
              <span className="text-xs font-normal text-gray-500 dark:text-gray-400">前のチャプター</span>
              <span>
                <span className="font-semibold">{prev.navLabel}</span>
                <span className="ml-1 tabular-nums text-xs text-gray-500 dark:text-gray-400">
                  （{prev.step}/{GITHUB_REST_API_SERIES_TOTAL}）
                </span>
              </span>
            </span>
          </Link>
        ) : (
          <span className="hidden sm:block sm:min-w-[1px]" />
        )}
        {next ? (
          <Link
            href={`${base}/${next.id}`}
            scroll={false}
            className="inline-flex items-center justify-end gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-900 shadow-sm transition-colors hover:border-blue-400 hover:bg-blue-50 dark:border-gray-500 dark:bg-gray-900 dark:text-gray-50 dark:hover:border-blue-500 dark:hover:bg-gray-800 sm:ml-auto"
          >
            <span className="flex flex-col items-end gap-0.5">
              <span className="text-xs font-normal text-gray-500 dark:text-gray-400">次のチャプター</span>
              <span>
                <span className="font-semibold">{next.navLabel}</span>
                <span className="ml-1 tabular-nums text-xs text-gray-500 dark:text-gray-400">
                  （{next.step}/{GITHUB_REST_API_SERIES_TOTAL}）
                </span>
              </span>
            </span>
            <span aria-hidden>→</span>
          </Link>
        ) : null}
      </div>
    </div>
  );
}
