/** GitHub Apps ハブ配下の学習順（一覧・前後ナビ用）。step は画面上の「1/4」表示用（1 始まり） */
export const GITHUB_APPS_CHAPTER_SERIES = [
  {
    id: 'github-enterprise-github-apps',
    shortTitle: '概要',
    navLabel: '概要',
    step: 1,
  },
  {
    id: 'github-enterprise-github-apps-create',
    shortTitle: '作成',
    navLabel: '作成手順',
    step: 2,
  },
  {
    id: 'github-enterprise-github-apps-install',
    shortTitle: 'インストール',
    navLabel: 'インストール',
    step: 3,
  },
  {
    id: 'github-enterprise-github-apps-webhook',
    shortTitle: 'Webhook',
    navLabel: 'Webhook',
    step: 4,
  },
] as const;

export const GITHUB_APPS_SERIES_TOTAL = GITHUB_APPS_CHAPTER_SERIES.length;

export type GitHubAppsSeriesChapterId = (typeof GITHUB_APPS_CHAPTER_SERIES)[number]['id'];

export function isGitHubAppsSeriesChapterId(id: string): id is GitHubAppsSeriesChapterId {
  return GITHUB_APPS_CHAPTER_SERIES.some((s) => s.id === id);
}

export function getGitHubAppsSeriesIndex(id: string): number {
  return GITHUB_APPS_CHAPTER_SERIES.findIndex((s) => s.id === id);
}
