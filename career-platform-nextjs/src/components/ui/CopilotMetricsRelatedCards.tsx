'use client';

import Link from 'next/link';

type CopilotMetricsRelatedCardsProps = {
  languageId: string;
};

/**
 * Copilot Metrics チャプター用の関連リンク（カード）。Tips の viewer 手順へ誘導する。
 */
export function CopilotMetricsRelatedCards({ languageId }: CopilotMetricsRelatedCardsProps) {
  const base = `/programming/${languageId}/chapters`;
  const cards: { href: string; title: string; description: string; badge?: string }[] = [
    {
      href: `${base}/github-tips-copilot-metrics-viewer`,
      title: 'copilot-metrics-viewer のセットアップ',
      description:
        '3 コンポーネント構成、PAT / GitHub App 認証、Azure ワンクリック・azd・Docker、環境変数、ダッシュボードで見える指標を Tips で整理しています。',
      badge: 'Tips',
    },
    {
      href: `${base}/github-tips`,
      title: 'GitHub Tips 一覧',
      description: 'Enterprise / Organization、GitHub と GitLab、本トピックなど、短いノウハウに戻る入口です。',
    },
    {
      href: 'https://docs.github.com/en/rest/copilot/copilot-metrics',
      title: 'REST API — Copilot metrics',
      description: 'Usage Metrics API の正式なパス・バージョン・認可は公式 REST ドキュメントを参照してください。',
    },
  ];

  return (
    <aside className="w-full shrink-0 lg:sticky lg:top-24 lg:w-80">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        関連コンテンツ
      </p>
      <ul className="m-0 flex list-none flex-col gap-3 p-0">
        {cards.map((card) => (
          <li key={card.href}>
            <Link
              href={card.href}
              scroll={false}
              {...(card.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="block rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-colors hover:border-blue-300 hover:bg-blue-50/40 dark:border-gray-700 dark:bg-gray-800/80 dark:hover:border-blue-700 dark:hover:bg-blue-950/30"
            >
              {card.badge ? (
                <span className="mb-1 inline-block rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/50 dark:text-blue-100">
                  {card.badge}
                </span>
              ) : null}
              <span className="block font-semibold text-gray-900 dark:text-gray-100">{card.title}</span>
              <span className="mt-1 block text-sm leading-snug text-gray-600 dark:text-gray-300">
                {card.description}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
