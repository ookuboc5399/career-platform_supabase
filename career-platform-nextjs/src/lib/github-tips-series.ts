/** GitHub Tips チャプター（github-tips）配下のトピック一覧（サイドバー・ルーティング用） */
export const GITHUB_TIPS_SERIES = [
  { id: 'github-tips', shortTitle: '概要' },
  { id: 'github-tips-enterprise-organization', shortTitle: 'Enterprise / Organization' },
  { id: 'github-tips-github-vs-gitlab', shortTitle: 'GitHub / GitLab' },
  { id: 'github-tips-copilot-metrics-viewer', shortTitle: 'Copilot metrics viewer' },
] as const;

export type GitHubTipsSeriesId = (typeof GITHUB_TIPS_SERIES)[number]['id'];

export function isGitHubTipsChapterId(chapterId: string | undefined): boolean {
  if (!chapterId) return false;
  return (GITHUB_TIPS_SERIES as readonly { id: string }[]).some((item) => item.id === chapterId);
}
