'use client';

import Link from 'next/link';
import { GITHUB_TIPS_SERIES } from '@/lib/github-tips-series';

type GitHubTipsSubNavProps = {
  languageId: string;
  currentChapterId: string;
  children: React.ReactNode;
};

export function GitHubTipsSubNav({ languageId, currentChapterId, children }: GitHubTipsSubNavProps) {
  const currentIndex = GITHUB_TIPS_SERIES.findIndex((item) => item.id === currentChapterId);
  const prev = currentIndex > 0 ? GITHUB_TIPS_SERIES[currentIndex - 1] : null;
  const next =
    currentIndex >= 0 && currentIndex < GITHUB_TIPS_SERIES.length - 1
      ? GITHUB_TIPS_SERIES[currentIndex + 1]
      : null;

  return (
    <div className="flex w-full max-w-6xl flex-col gap-8 lg:flex-row lg:items-start">
      <aside className="shrink-0 lg:sticky lg:top-24 lg:w-56">
        <nav
          className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
          aria-label="GitHub Tips トピック"
        >
          <p className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">トピック</p>
          <ul className="m-0 list-none space-y-1 p-0 text-sm">
            {GITHUB_TIPS_SERIES.map((item) => {
              const isCurrent = item.id === currentChapterId;
              return (
                <li key={item.id}>
                  <Link
                    href={`/programming/${languageId}/chapters/${item.id}`}
                    scroll={false}
                    className={`block rounded-md px-3 py-2 transition-colors ${
                      isCurrent
                        ? 'bg-blue-50 font-semibold text-blue-800 dark:bg-blue-900/30 dark:text-blue-100'
                        : 'text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700/60'
                    }`}
                  >
                    {item.shortTitle}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      <div className="min-w-0 flex-1 space-y-6">
        {children}
        <div className="flex flex-col gap-3 border-t border-gray-200 pt-4 text-sm dark:border-gray-700 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {prev ? (
              <Link
                href={`/programming/${languageId}/chapters/${prev.id}`}
                scroll={false}
                className="inline-flex items-center gap-1 text-blue-600 hover:underline dark:text-blue-400"
              >
                ← {prev.shortTitle}
              </Link>
            ) : null}
          </div>
          <div className="text-right sm:text-right">
            {next ? (
              <Link
                href={`/programming/${languageId}/chapters/${next.id}`}
                scroll={false}
                className="inline-flex items-center gap-1 text-blue-600 hover:underline dark:text-blue-400"
              >
                {next.shortTitle} →
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
