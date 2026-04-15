/** GitHub コース: よく探すトピックからチャプターへ誘導（静的マップ） */

export type GithubTopicShortcut = {
  label: string;
  chapterId: string;
};

export const GITHUB_TOPIC_SHORTCUTS: GithubTopicShortcut[] = [
  { label: 'Agents（AI Controls）', chapterId: 'github-enterprise-ai-agents' },
  { label: 'Copilot（AI Controls）', chapterId: 'github-enterprise-ai-copilot' },
  { label: 'MCP（Model Context Protocol）', chapterId: 'github-enterprise-ai-mcp' },
  { label: 'Billing and licensing・課金・Copilot・利用枠', chapterId: 'github-enterprise-cost-management' },
  { label: 'GitHub Actions / CI・CD', chapterId: 'github-actions-cicd-pipeline' },
  { label: 'ホステッドランナー', chapterId: 'github-actions-hosted-runner' },
  { label: 'セルフホステッドランナー', chapterId: 'github-actions-self-hosted-runner' },
  { label: 'Advanced Security（GHAS）入門', chapterId: 'github-ghas-intro' },
  { label: 'Dependabot', chapterId: 'github-ghas-dependabot' },
  { label: 'Code Scanning', chapterId: 'github-ghas-code-scanning' },
  { label: 'SIEM 連携', chapterId: 'github-ghas-siem-integration' },
  { label: '監査ログ・ログの種類', chapterId: 'github-audit-logs-overview' },
  { label: 'Enterprise Overview', chapterId: 'github-enterprise-overview' },
  { label: 'GitHub Enterprise Server（GHES）', chapterId: 'github-enterprise-ghes-overview' },
  { label: 'Enterprise Insights', chapterId: 'github-enterprise-insights' },
  { label: 'Enterprise お知らせ（Announcements）', chapterId: 'github-enterprise-announcements' },
  { label: 'Enterprise Hooks / Webhooks', chapterId: 'github-enterprise-hooks' },
  { label: 'Enterprise コンプライアンス（Compliance）', chapterId: 'github-enterprise-compliance' },
  { label: 'GitHub Connect・Policies・AI Controls', chapterId: 'github-enterprise-connect-policies-ai' },
  { label: 'Enterprise 設定・パラメータ', chapterId: 'github-enterprise-settings' },
  { label: 'Repositories（運用・ブランチ・マージ）', chapterId: 'github-enterprise-org-repositories' },
  { label: 'GitHub Projects（Organization）', chapterId: 'github-enterprise-org-projects' },
  { label: 'Organization Packages', chapterId: 'github-enterprise-org-packages' },
  { label: 'Organization Teams', chapterId: 'github-enterprise-org-teams' },
  { label: 'Organization People', chapterId: 'github-enterprise-org-people' },
  { label: 'Organization Settings', chapterId: 'github-enterprise-org-settings' },
  { label: '認証とセキュリティ / SSO（Entra 等）', chapterId: 'github-enterprise-auth-sso' },
  { label: 'GitHub Apps', chapterId: 'github-enterprise-github-apps' },
  { label: 'プルリクエスト・レビュー', chapterId: 'github-pull-requests-review' },
  { label: 'Discussions', chapterId: 'github-discussions' },
  { label: 'Codespaces', chapterId: 'github-codespaces' },
  { label: 'GitHub CLI / API', chapterId: 'github-cli-api' },
  { label: 'GitHub REST API（Enterprise Cloud）', chapterId: 'github-rest-api' },
  { label: '公式ブログ・最新情報', chapterId: 'github-blog-latest' },
];
