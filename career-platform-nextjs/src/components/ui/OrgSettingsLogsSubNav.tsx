'use client';

import Link from 'next/link';
import { GITHUB_ORG_SETTINGS_LOGS_SERIES } from '@/lib/github-enterprise-org-settings-logs-series';

type OrgSettingsLogsSubNavProps = {
  languageId: string;
  currentChapterId: string;
  children: React.ReactNode;
};

export function OrgSettingsLogsSubNav({
  languageId,
  currentChapterId,
  children,
}: OrgSettingsLogsSubNavProps) {
  const currentIndex = GITHUB_ORG_SETTINGS_LOGS_SERIES.findIndex((item) => item.id === currentChapterId);
  const prev = currentIndex > 0 ? GITHUB_ORG_SETTINGS_LOGS_SERIES[currentIndex - 1] : null;
  const next =
    currentIndex >= 0 && currentIndex < GITHUB_ORG_SETTINGS_LOGS_SERIES.length - 1
      ? GITHUB_ORG_SETTINGS_LOGS_SERIES[currentIndex + 1]
      : null;

  return (
    <div className="space-y-6">
      <nav
        className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
        aria-label="Organization Settings — Logs"
      >
        <p className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
          Logs（サブ項目）
        </p>
        <p className="mb-3 text-xs text-gray-600 dark:text-gray-400">
          親チャプター:{' '}
          <Link
            href={`/programming/${languageId}/chapters/github-enterprise-org-settings-logs`}
            className="text-blue-600 underline dark:text-blue-400"
          >
            Logs 概要
          </Link>
        </p>
        <ol className="flex flex-wrap gap-2 text-sm">
          {GITHUB_ORG_SETTINGS_LOGS_SERIES.map((item, index) => {
            const isCurrent = item.id === currentChapterId;
            return (
              <li key={item.id}>
                <Link
                  href={`/programming/${languageId}/chapters/${item.id}`}
                  className={`inline-flex items-center gap-1 rounded-md px-2 py-1 transition-colors ${
                    isCurrent
                      ? 'bg-blue-50 font-semibold text-blue-800 dark:bg-blue-900/30 dark:text-blue-100'
                      : 'text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700/60'
                  }`}
                >
                  <span className="text-xs text-gray-500 dark:text-gray-400">{index + 1}.</span>
                  {item.shortTitle}
                </Link>
              </li>
            );
          })}
        </ol>
      </nav>

      {children}

      <div className="flex flex-col gap-3 border-t border-gray-200 pt-4 text-sm dark:border-gray-700 sm:flex-row sm:items-center sm:justify-between">
        <div>
          {prev ? (
            <Link
              href={`/programming/${languageId}/chapters/${prev.id}`}
              className="inline-flex items-center gap-1 text-blue-600 hover:underline dark:text-blue-400"
            >
              ← {prev.shortTitle}
            </Link>
          ) : (
            <Link
              href={`/programming/${languageId}/chapters/github-enterprise-org-settings-logs`}
              className="inline-flex items-center gap-1 text-blue-600 hover:underline dark:text-blue-400"
            >
              ← Logs 概要
            </Link>
          )}
        </div>
        <div className="text-right">
          {next ? (
            <Link
              href={`/programming/${languageId}/chapters/${next.id}`}
              className="inline-flex items-center gap-1 text-blue-600 hover:underline dark:text-blue-400"
            >
              {next.shortTitle} →
            </Link>
          ) : (
            <span className="text-gray-400">次へ →</span>
          )}
        </div>
      </div>
    </div>
  );
}
