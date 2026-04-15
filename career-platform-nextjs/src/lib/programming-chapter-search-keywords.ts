/**
 * チャプター検索の補助語（タイトル・DB説明に無い用語でもヒットさせる）
 * 言語 ID → チャプター ID → スペース区切りのキーワード
 */
const BY_LANGUAGE: Record<string, Record<string, string>> = {
  github: {
    'github-enterprise-cost-management':
      'プレミアムリクエスト Premium Requests PRU Copilot コパイロット 請求 利用量 課金 ライセンス シート Billing Usage Licensing Overview Cost centers Budgets alerts Payment Billing contacts FinOps 従量課金 PayPal クレジットカード Azure Subscription 請求書 invoice Sales 支払い方法 予算 ブロック Organization ベース ユーザー ベース',
    'github-enterprise-compliance':
      'Compliance SOC2 監査 コンプライアンス レポート 法務 DPA サブプロセッサ エビデンス',
    'github-enterprise-connect-policies-ai':
      'GitHub Connect GHES Policies ポリシー AI Controls Copilot Enterprise ガバナンス Actions フォーク',
    'github-enterprise-ai-agents':
      'Agents エージェント コーディングエージェント AI Controls 親チャプター 入口 Copilot cloud agent Copilot coding agent cloud agent バックグラウンド Issue PR',
    'github-enterprise-ai-agents-intro':
      'Agents エージェント 概要 ポリシー AI Controls Enterprise Organization Copilot cloud agent Copilot coding agent cloud agent coding agent バックグラウンドエージェント GitHub Actions 非同期 Agent Mode IDE Copilot Chat Issue PR Azure Boards Jira Linear cost center プレミアムリクエスト',
    'github-enterprise-ai-copilot':
      'Copilot 親チャプター IDE チャット CLI PR',
    'github-copilot-setup-vscode':
      'Copilot VS Code 拡張機能 セットアップ 認証 Premium Requests Chat',
    'github-enterprise-copilot-privacy':
      'Copilot Privacy Features コンテンツ除外 Content exclusion ポリシー',
    'github-enterprise-copilot-billing-settings': 'Copilot Billing シート ライセンス 割当',
    'github-enterprise-copilot-metrics':
      'Copilot Metrics Usage Metrics API enterprise-1-day enterprise-28-day NDJSON copilot-metrics-viewer GHCR manage_billing:copilot read:enterprise',
    'github-enterprise-copilot-clients': 'Copilot Clients IDE JetBrains 許可クライアント',
    'github-enterprise-ai-mcp':
      'MCP Model Context Protocol 親チャプター Copilot CLI ツール連携',
    'github-copilot-cli-matlab-mcp-server': 'MATLAB MCP Copilot CLI シリーズ ハブ',
    'github-copilot-matlab-mcp-01-overview': 'MATLAB MCP 概要 要件 Simulink',
    'github-copilot-matlab-mcp-02-architecture': 'MATLAB MCP 構成 HTTPS stdio',
    'github-copilot-matlab-mcp-03-mcp-tools': 'MATLAB MCP ツール mcp-config',
    'github-copilot-matlab-mcp-04-risks': 'MATLAB MCP リスク 機密 インジェクション',
    'github-copilot-matlab-mcp-05-mitigations': 'MATLAB MCP 対策 Content Exclusion ホワイトリスト',
    'github-copilot-matlab-mcp-06-operations': 'MATLAB MCP 運用 EULA Gateway',
    'github-ghas-intro':
      'Advanced Security GHAS Code Scanning Dependabot Secret scanning セキュリティ',
    'github-actions-cicd-pipeline': 'CI CD ワークフロー Actions 継続的インテグレーション',
    'github-actions-hosted-runner': 'ランナー hosted runner セルフホスト',
    'github-actions-self-hosted-runner':
      'セルフホステッド 自前ランナー Runner group ランナーグループ Default アクセス制御 runs-on group Organization リポジトリ',
    'github-audit-logs-overview':
      '監査ログ Audit log Enterprise Organization Security log Git events プッシュログ Actions ログ API log SIEM ストリーミング Splunk Datadog Sentinel Event Hubs Dependabot コンプライアンス gh api audit-log CSV エクスポート Log streaming ログフォワーディング ACTIONS_STEP_DEBUG gh run view EMU Managed Users',
    'github-enterprise-settings': 'Enterprise 設定 SAML OIDC 監査ログ',
    'github-enterprise-settings-hub': 'Enterprise Settings 設定 サイドバー 認証 Hooks',
    'github-enterprise-sec-people': 'People メンバー 招待 Organization Enterprise',
    'github-enterprise-sec-policies':
      'Enterprise Policies ポリシー Actions リポジトリ セキュリティ rulesets 組織横断 governance',
    'github-enterprise-sec-policies-repository': 'Enterprise Policies Repository リポジトリ 可視性 フォーク',
    'github-enterprise-sec-policies-repository-repository':
      'Enterprise Policies Repository サブ リポジトリ作成 可視性',
    'github-enterprise-sec-policies-repository-code':
      'Enterprise Policies Repository Code デフォルトブランチ マージ',
    'github-enterprise-sec-policies-repository-code-insights':
      'Enterprise Policies Code insights ルール insights',
    'github-enterprise-sec-policies-repository-code-ruleset-bypasses':
      'Enterprise Policies ruleset bypass バイパス申請',
    'github-enterprise-sec-policies-repository-custom-properties':
      'Enterprise Policies Custom properties メタデータ',
    'github-enterprise-sec-policies-member-privileges':
      'Enterprise Policies Member privileges base permissions unaffiliated users repository creation forking outside collaborators default branch deploy keys admin visibility deletion transfer issue deletion',
    'github-enterprise-sec-policies-codespaces':
      'Enterprise Policies Codespaces GitHub Codespaces organization access enable all specific disabled public repositories',
    'github-enterprise-sec-policies-copilot': 'Enterprise Policies Copilot ライセンス',
    'github-enterprise-sec-policies-actions':
      'Enterprise Policies Actions runners reusable workflows OIDC fork pull request GITHUB_TOKEN artifact log retention cache custom images self-hosted',
    'github-enterprise-sec-policies-hosted-compute-networking':
      'Enterprise Policies Hosted compute networking ネットワーク',
    'github-enterprise-sec-policies-projects':
      'Enterprise Policies Projects GitHub Projects organization projects visibility 可視性',
    'github-enterprise-sec-policies-advanced-security':
      'Enterprise Policies Advanced Security GHAS secret scanning Dependabot Copilot Autofix Dependency Insights',
    'github-enterprise-sec-policies-code-quality': 'Enterprise Policies Code Quality ブランチ保護 レビュー',
    'github-enterprise-sec-policies-personal-access-tokens':
      'Enterprise Policies PAT Personal access tokens fine-grained classic approval SCIM 承認 有効期限 exempt',
    'github-enterprise-sec-policies-sponsors': 'Enterprise Policies Sponsors スポンサー',
    'github-enterprise-sec-policies-models':
      'Enterprise Policies Models GitHub Models custom models Azure OpenAI API key プレリリース',
    'github-enterprise-sec-github-connect': 'GitHub Connect 連携 Enterprise cloud',
    'github-enterprise-sec-security-and-quality':
      'Security quality GHAS Advanced Security Code scanning Dependabot Secret scanning SIEM',
    'github-enterprise-sec-security-quality-overview':
      'Security quality Overview セキュリティ 品質 ダッシュボード Enterprise',
    'github-enterprise-sec-security-quality-risk':
      'Security quality Risk リスク triage 重大度 脆弱性',
    'github-enterprise-sec-security-quality-coverage':
      'Security quality Coverage GHAS 適用範囲 カバレッジ',
    'github-enterprise-sec-security-quality-enablement':
      'Security quality Enablement 有効化 ロールアウト Advanced Security',
    'github-enterprise-sec-security-quality-codeql-prs':
      'Security quality CodeQL pull request PR コードスキャン',
    'github-enterprise-sec-security-quality-secret-scanning':
      'Security quality Secret scanning シークレット push protection',
    'github-enterprise-sec-security-quality-findings-dependabot':
      'Security quality Findings Dependabot アラート',
    'github-enterprise-sec-security-quality-findings-dependabot-malware':
      'Dependabot Findings Malware マルウェア サプライチェーン',
    'github-enterprise-sec-security-quality-findings-dependabot-vulnerabilities':
      'Dependabot Findings Vulnerabilities 脆弱性 CVE',
    'github-enterprise-sec-security-quality-findings-code-scanning':
      'Security quality Findings Code scanning CodeQL',
    'github-enterprise-sec-security-quality-findings-secret-scanning':
      'Security quality Findings Secret scanning',
    'github-enterprise-sec-security-quality-dismissal-dependabot':
      'Security quality Dismissal Dependabot 却下 承認',
    'github-enterprise-sec-security-quality-dismissal-code-scanning':
      'Security quality Dismissal Code scanning 却下',
    'github-enterprise-sec-security-quality-dismissal-push-protection-bypass':
      'Security quality Dismissal Push protection bypass バイパス',
    'github-enterprise-sec-compliance': 'Compliance Enterprise 監査 規制 SOC',
    'github-enterprise-billing-hub':
      'Billing licensing 請求 ライセンス Usage Licensing Cost centers Budgets Payment FinOps',
    'github-enterprise-billing-hub-overview':
      'Billing Overview Enterprise 請求 概要 サマリー',
    'github-enterprise-billing-hub-usage':
      'Billing Usage 利用量 Actions storage seats',
    'github-enterprise-billing-hub-usage-metered-usage':
      'Billing Usage Metered usage 従量課金 Actions minutes storage',
    'github-enterprise-billing-hub-usage-premium-request-analytics':
      'Billing Usage Premium request analytics Copilot プレミアムリクエスト',
    'github-enterprise-billing-hub-licensing':
      'Billing Licensing ライセンス Copilot GHAS seats',
    'github-enterprise-billing-hub-cost-centers':
      'Billing Cost centers コストセンター 配賦',
    'github-enterprise-billing-hub-budgets-alerts':
      'Billing Budgets alerts 予算 アラート しきい値',
    'github-enterprise-billing-hub-payment-information':
      'Billing Payment 支払い 請求書 カード',
    'github-enterprise-billing-hub-billing-contacts':
      'Billing contacts 請求先 通知 連絡先',
    'github-enterprise-auth-sso':
      'Authentication security 認証とセキュリティ SSO SAML Entra Okta シングルサインオン 2FA MFA IP allow list Enable IP allow list CIDR 許可リスト マニュアル目次 section セクション切替 Outside collaborator 外部コラボレーター repository collaborator EMU',
    'github-enterprise-org-repositories':
      'Repositories リポジトリ 命名 Internal Private Team CODEOWNERS 外部コラボレーター Outside collaborator ブランチ マージ 戦略 trunk flow release branch 委託先 ベンダー',
    'github-enterprise-org-projects':
      'GitHub Projects Organization Projects プロジェクト ロードマップ スプリント テンプレート サイドバー Templates New project タスク Issue PR ビュー Table Board Roadmap カスタムフィールド ワークフロー',
    'github-enterprise-org-packages': 'Packages GitHub Packages npm Maven Docker レジストリ publish GITHUB_TOKEN',
    'github-enterprise-org-teams': 'Teams New team Maintainer メンバー Add repository Repositories タブ',
    'github-enterprise-org-people': 'People メンバー 招待 Owner Member ベース権限 Base permissions 外部コラボレーター',
    'github-enterprise-sec-people-members': 'People Members メンバー一覧 メンバーシップ',
    'github-enterprise-sec-people-administrators': 'People Administrators Enterprise admin Owner 管理者',
    'github-enterprise-sec-people-enterprise-teams': 'People Enterprise teams エンタープライズチーム',
    'github-enterprise-sec-people-outside-collaborators':
      'People Outside collaborators 外部コラボレーター collaborator',
    'github-enterprise-sec-people-enterprise-roles': 'People Enterprise roles ロール 権限',
    'github-enterprise-sec-people-enterprise-roles-role-management':
      'Enterprise roles Role management ロール管理 定義',
    'github-enterprise-sec-people-enterprise-roles-role-assignments':
      'Enterprise roles Role assignments ロール割当 割当て',
    'github-enterprise-sec-people-organization-roles':
      'People Organization roles Owner Member custom organization roles pre-defined All-repository read write triage maintain admin Apps manager CI/CD Admin Security manager',
    'github-enterprise-sec-people-invitations': 'People Invitations 招待 pending',
    'github-enterprise-sec-people-failed-invitations': 'People Failed invitations 招待失敗',
    'github-enterprise-org-settings':
      'Organization Settings Member privileges Actions SAML 2FA IP allow list Code security Repository Codespaces Planning Copilot サブチャプター',
    'github-enterprise-org-settings-repository':
      'Repository settings Organization リポジトリ 可視性 フォーク デフォルトブランチ base permissions',
    'github-enterprise-org-settings-repository-general':
      'Repository General settings 可視性 フォーク デフォルト 基本設定',
    'github-enterprise-org-settings-repository-topics':
      'Repository Topics トピック 分類 タグ',
    'github-enterprise-org-settings-repository-rulesets':
      'Repository Rulesets ルールセット ブランチ保護 プッシュ制限',
    'github-enterprise-org-settings-repository-rule-insights':
      'Repository Rule insights ルール分析 拒否イベント',
    'github-enterprise-org-settings-repository-bypass-requests':
      'Repository Bypass requests 例外申請 承認',
    'github-enterprise-org-settings-repository-custom-properties':
      'Repository Custom properties カスタムプロパティ メタデータ',
    'github-enterprise-org-settings-codespaces':
      'Codespaces Organization 開発環境 devcontainer prebuild シークレット',
    'github-enterprise-org-settings-codespaces-general':
      'Codespaces General Organization settings 利用対象 既定 設定 devcontainer',
    'github-enterprise-org-settings-codespaces-policies':
      'Codespaces Policies Organization settings アクセス制御 セキュリティ ポリシー',
    'github-enterprise-org-settings-planning':
      'Planning Organization Issues Projects 計画 Issue types サブチャプター',
    'github-enterprise-org-settings-planning-projects':
      'Planning Projects Organization Settings プロジェクト テンプレート ロードマップ',
    'github-enterprise-org-settings-planning-issue-types':
      'Planning Issue types 課題の種類 タスク バグ 機能 Organization issue type',
    'github-enterprise-org-settings-copilot':
      'Copilot Organization Settings Access Policies Models Custom instructions Content exclusion Cloud agent 概要',
    'github-enterprise-org-settings-copilot-access':
      'Copilot Access ライセンス シート 割当 Organization seat',
    'github-enterprise-org-settings-copilot-policies':
      'Copilot Policies Chat PR CLI Suggestions ポリシー Premium request paid usage budget Billing Copilot in GitHub.com feedback preview Editor preview MCP Agent Mode IDE Mobile Desktop web search Bing model native search metrics API usage code review unlicensed Automatic code review cloud agent Memory Spaces Individual Access Sharing commit messages Remote Control Duplicate Detection public code Opt in pre-release',
    'github-enterprise-org-settings-copilot-models':
      'Copilot Models モデル 既定 default model',
    'github-enterprise-org-settings-copilot-custom-instructions':
      'Copilot Custom instructions カスタム指示 組織',
    'github-enterprise-org-settings-copilot-content-exclusion':
      'Copilot Content exclusion コンテンツ除外 機密 パス',
    'github-enterprise-org-settings-copilot-cloud-agent':
      'Copilot Cloud agent coding agent クラウドエージェント AI Controls Repository access Issue assign PR review Internet access firewall Recommended allowlist Organization custom allowlist repository custom rules Runner type Standard GitHub runner copilot-setup-steps.yml Partner agents Claude Codex third-party agent',
    'github-enterprise-org-settings-actions':
      'Organization Settings Actions ワークフロー 実行制御 runner policy',
    'github-enterprise-org-settings-models':
      'Organization Settings Models モデル 統制 default model',
    'github-enterprise-org-settings-webhooks':
      'Organization Settings Webhooks webhook 配信 イベント',
    'github-enterprise-org-settings-discussions':
      'Organization Settings Discussions ディスカッション moderation',
    'github-enterprise-org-settings-packages':
      'Organization Settings Packages パッケージ 公開範囲',
    'github-enterprise-org-settings-pages':
      'Organization Settings Pages 公開サイト カスタムドメイン',
    'github-enterprise-org-settings-hosted-compute-networking':
      'Organization Settings Hosted compute networking ネットワーク private networking',
    'github-enterprise-org-settings-custom-properties':
      'Organization Settings Custom properties カスタムプロパティ メタデータ',
    'github-enterprise-org-settings-authentication-security':
      'Organization Settings Authentication security SSO SAML 2FA',
    'github-enterprise-org-settings-advanced-security':
      'Organization Settings Advanced Security GHAS code scanning secret scanning',
    'github-enterprise-org-settings-advanced-security-configurations':
      'Advanced Security Configurations security configurations Dependabot code scanning secret scanning licenses',
    'github-enterprise-org-settings-advanced-security-global-settings':
      'Advanced Security Global settings organization default settings',
    'github-enterprise-org-settings-deploy-keys':
      'Organization Settings Deploy keys 鍵 管理',
    'github-enterprise-org-settings-compliance':
      'Organization Settings Compliance 監査 規制',
    'github-enterprise-org-settings-vertified-approved-domains':
      'Organization Settings Vertified approved domains verified domains ドメイン承認',
    'github-enterprise-org-settings-secrets-and-variables':
      'Organization Settings Secrets and variables シークレット 変数',
    'github-enterprise-org-settings-github-apps':
      'Organization Settings GitHub Apps アプリ 権限',
    'github-enterprise-org-settings-oauth-app-policy':
      'Organization Settings OAuth app policy OAuth 承認',
    'github-enterprise-org-settings-personal-access-tokens':
      'Organization Settings Personal access tokens PAT トークン',
    'github-enterprise-org-settings-personal-access-tokens-settings':
      'Personal access tokens settings Fine-grained tokens classic approval maximum lifetime',
    'github-enterprise-org-settings-personal-access-tokens-active-tokens':
      'Personal access tokens Active tokens トークン一覧 棚卸し',
    'github-enterprise-org-settings-personal-access-tokens-prnding-requests':
      'Personal access tokens Prnding requests pending requests 承認待ち',
    'github-enterprise-org-settings-scheduled-reminders':
      'Organization Settings Scheduled reminders 定期通知 reminder',
    'github-enterprise-org-settings-announcement':
      'Organization Settings Announcement お知らせ アナウンス',
    'github-enterprise-org-settings-logs':
      'Organization Settings Logs ログ 監査 記録',
    'github-enterprise-org-settings-logs-sponsorship-log':
      'Logs Sponsorship log sponsor sponsorship ログ',
    'github-enterprise-org-settings-logs-audit-log':
      'Logs Audit log 監査ログ audit trail',
    'github-enterprise-org-settings-deleted-repositories':
      'Organization Settings Deleted repositories 削除 リポジトリ 復元',
    'github-enterprise-org-settings-developer-settings':
      'Organization Settings Developer settings 開発者設定 token integration',
    'github-enterprise-overview': 'Enterprise 概要 ダッシュボード organizations 組織一覧',
    'github-enterprise-ghes-overview':
      'GHES GitHub Enterprise Server オンプレ セルフホスト インスタンス アップグレード バックアップ GHEC 違い Connect ルート 別トラック',
    'github-enterprise-insights':
      'Enterprise Insights Copilot usage Code generation Actions usage metrics Actions performance metrics パフォーマンス 分 minutes',
    'github-enterprise-announcements': 'Announcements お知らせ バナー 告知 メンテナンス',
    'github-enterprise-hooks': 'Hooks Webhook Enterprise webhook 配信 イベント',
    'github-blog-latest': 'ブログ RSS 新着 ニュース changelog',
    'github-cli-api':
      'gh CLI curl PAT REST GraphQL SDK API 自動化 GitHub CLI 認証 winget brew',
    'github-rest-api':
      'REST API Enterprise Cloud GHEC api.github.com X-GitHub-Api-Version ページネーション レート制限 公式ドキュメント',
    'github-rest-api-overview':
      'REST About the REST API 認証 PAT fine-grained GitHub App OAuth Accept application/vnd.github+json API versions',
    'github-rest-api-repos':
      'REST repos pulls repositories pull requests リポジトリ プルリクエスト branches commits',
    'github-rest-api-orgs':
      'REST orgs organizations メンバー チーム Enterprise 境界 organization settings',
    'github-tips':
      'GitHub Tips 概要 トピック Enterprise Organization 階層 ポリシー GitLab 比較',
    'github-tips-enterprise-organization':
      'GitHub Tips Enterprise Organization 階層 ポリシー 強制 委任 cost center Audit Log Teams cloud agent',
    'github-tips-github-vs-gitlab':
      'GitHub GitLab 違い 比較 Copilot Duo Actions 無料枠 DevSecOps Ultimate GHAS セルフホスト CE GHES merge trains テンプレート',
    'github-tips-copilot-metrics-viewer':
      'copilot-metrics-viewer Nuxt PostgreSQL Sync Service PAT GitHub App OAuth Deploy to Azure azd Docker ghcr DATABASE_URL NUXT_GITHUB_ENT Usage Metrics ダッシュボード',
    'github-1773730210830-spmg4sd':
      'Copilot ライセンス シート 割当 Organization Owner Access Selected members All members User management Team 自動付与 解除',
  },
  azure: {
    'azure-entra-bulk-user-registration':
      '一括登録 一括作成 CSV バルク bulk invite B2B ゲスト招待 Microsoft Graph PowerShell ユーザー作成 テンプレート',
  },
};

export function getChapterSearchBoost(languageId: string, chapterId: string): string {
  return BY_LANGUAGE[languageId]?.[chapterId] ?? '';
}
