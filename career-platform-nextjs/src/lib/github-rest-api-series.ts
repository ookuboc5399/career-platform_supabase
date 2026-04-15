/**
 * GitHub REST API（Enterprise Cloud）シリーズ — ナビ順・ルーティング判定用
 *
 * 公式: https://docs.github.com/ja/enterprise-cloud@latest/rest
 *
 * フェーズ1:
 * - github-rest-api … ハブ（目次・他チャプターとの役割分担）
 * - github-rest-api-overview … 概要・認証・バージョン・ページネーション
 * - github-rest-api-repos … repos / pulls
 * - github-rest-api-orgs … orgs
 */
export const GITHUB_REST_API_CHAPTER_SERIES = [
  {
    id: 'github-rest-api',
    shortTitle: 'ハブ',
    navLabel: 'ハブ・目次',
    step: 1,
  },
  {
    id: 'github-rest-api-overview',
    shortTitle: '共通',
    navLabel: '概要・認証・バージョン',
    step: 2,
  },
  {
    id: 'github-rest-api-repos',
    shortTitle: 'Repos / PR',
    navLabel: 'リポジトリ / PR',
    step: 3,
  },
  {
    id: 'github-rest-api-orgs',
    shortTitle: 'Organization',
    navLabel: 'Organization',
    step: 4,
  },
] as const;

export const GITHUB_REST_API_SERIES_TOTAL = GITHUB_REST_API_CHAPTER_SERIES.length;

export type GitHubRestApiSeriesChapterId = (typeof GITHUB_REST_API_CHAPTER_SERIES)[number]['id'];

export function isGitHubRestApiSeriesChapterId(id: string): id is GitHubRestApiSeriesChapterId {
  return GITHUB_REST_API_CHAPTER_SERIES.some((s) => s.id === id);
}

export function getGitHubRestApiSeriesIndex(id: string): number {
  return GITHUB_REST_API_CHAPTER_SERIES.findIndex((s) => s.id === id);
}
