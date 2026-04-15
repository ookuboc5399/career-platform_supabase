/**
 * GitHub Enterprise 配下を階層化する。
 * - Enterprise 直下に「Settings」ハブ（下書き）を置き、公式の Enterprise Settings に相当するチャプターをまとめる。
 * - 「Billing and licensing」ハブ（下書き）配下に請求・FinOps 系の公開チャプターをまとめる。
 * - 「AI Controls」は Enterprise 直下のセクション。Agents / Copilot / MCP は公開の親チャプターとし、従来のサブチャプター（Agents 概要、Copilot セットアップ・設定系、MCP 配下の MATLAB シリーズ等）をその下にぶら下げる。
 * - GitHub Enterprise Server（GHES）は GHEC（github-enterprise）とは別トラック。GHES 概要チャプターは language 直下のルート（parent なし）。
 * - Enterprise 直下のセクション順: Overview → Organizations → People → AI Controls → Policies → GitHub Connect → Security and quality → Billing and licensing → Compliance → Insights → Settings（あとサポート）。
 * - Organizations 配下に Repositories / Projects / Packages / Teams / Organization Settings。People は Enterprise 直下の People セクションへ。
 * - Policies は Enterprise 直下のセクション（AI Controls と GitHub Connect の間）。配下に Repository / Member privileges / Codespaces 等の公開サブチャプターを置く。GitHub Connect・Compliance・GHAS（Advanced Security ハブ）はそれぞれ Enterprise 直下のセクション配下へ。旧リポジトリ運用・ブランチマージは Repositories に統合。ルートの github-projects は Organization Projects に統合して削除。
 * - Organization の Settings 直下に Repository / Codespaces / Planning / Copilot（ハブ）を置き、Copilot ハブの下に Access / Policies / Models / Custom instructions / Content exclusion / Cloud agent のサブチャプターを置く。
 * - Planning の下に Projects / Issue Types のサブチャプターを置く。
 * - Codespaces の下に General / Policies のサブチャプターを置く。
 * - Insights とサポートは Enterprise 直下（セクション順の末尾付近）。
 *
 * 実行: cd career-platform-nextjs && npx ts-node --transpile-only scripts/restructure-github-enterprise-chapter-tree.ts
 */
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });
config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/** 一覧に出す下書きセクション（親子関係をここで定義） */
const SECTIONS = [
  {
    id: 'github-enterprise-sec-overview',
    parent_id: 'github-enterprise',
    title: 'Overview',
    description: 'Enterprise アカウントの概要・ダッシュボードに関するチャプターです。',
    order: 1,
  },
  {
    id: 'github-enterprise-sec-orgs-and-repos',
    parent_id: 'github-enterprise',
    title: 'Organizations',
    description:
      'Organization の Repositories・Projects・Packages・Teams・Organization Settings を扱うセクションです。',
    order: 2,
  },
  {
    id: 'github-enterprise-sec-people',
    parent_id: 'github-enterprise',
    title: 'People',
    description: 'Organization のメンバー・ロール・招待、ベース権限とメンバー管理を学びます。',
    order: 3,
  },
  {
    id: 'github-enterprise-sec-ai-controls',
    parent_id: 'github-enterprise',
    title: 'AI Controls',
    description: 'Agents・Copilot・MCP など、AI 機能の利用と統制です。',
    order: 4,
  },
  {
    id: 'github-enterprise-sec-policies',
    parent_id: 'github-enterprise',
    title: 'Policies',
    description:
      'Enterprise におけるリポジトリ・Actions・セキュリティなどのポリシー統制と、組織横断での適用を学びます。',
    order: 5,
  },
  {
    id: 'github-enterprise-sec-github-connect',
    parent_id: 'github-enterprise',
    title: 'GitHub Connect',
    description: 'GitHub Connect と関連ポリシー、Enterprise と GitHub.com の連携を学びます。',
    order: 6,
  },
  {
    id: 'github-enterprise-sec-security-and-quality',
    parent_id: 'github-enterprise',
    title: 'Security and quality',
    description:
      'GitHub Advanced Security・コードスキャン・Dependabot など、セキュリティと品質の学習です。',
    order: 7,
  },
  {
    id: 'github-enterprise-billing-hub',
    parent_id: 'github-enterprise',
    title: 'Billing and licensing',
    description:
      'Enterprise の Billing and licensing（利用状況・ライセンス・請求・予算とアラート等）に相当するトピックです。',
    order: 8,
  },
  {
    id: 'github-enterprise-sec-compliance',
    parent_id: 'github-enterprise',
    title: 'Compliance',
    description: 'Enterprise におけるコンプライアンス・監査・規制対応を学びます。',
    order: 9,
  },
  {
    id: 'github-enterprise-sec-insights',
    parent_id: 'github-enterprise',
    title: 'Insights',
    description: 'Enterprise レベルの利用状況・メトリクスです。',
    order: 10,
  },
  {
    id: 'github-enterprise-settings-hub',
    parent_id: 'github-enterprise',
    title: 'Settings',
    description:
      'Enterprise の Settings に対応するチャプターです。認証・Hooks・お知らせ・設定パラメーター等。（AI Controls / Policies / Connect / Compliance / Billing は Enterprise 直下の別セクション）',
    order: 11,
  },
  {
    id: 'github-enterprise-sec-support',
    parent_id: 'github-enterprise',
    title: 'サポート・トラブルシューティング',
    description: 'Enterprise まわりの障害調査・よくある問題です。',
    order: 12,
  },
];

/** Organizations セクション直下の公開チャプター */
const ORGANIZATION_SECTION_CHILDREN: {
  id: string;
  title: string;
  description: string;
  order: number;
}[] = [
  {
    id: 'github-enterprise-org-repositories',
    title: 'Repositories',
    description:
      'リポジトリの命名・可視性・外部コラボレーターなどの運用ルールと、ブランチ戦略・マージ手法をまとめて学びます。',
    order: 1,
  },
  {
    id: 'github-enterprise-org-projects',
    title: 'Projects',
    description:
      'GitHub Projectsの概要、サイドバーで設定できること、プロジェクト作成・タスク追加・ビュー切り替え・カスタムフィールドの手順を学びます。',
    order: 2,
  },
  {
    id: 'github-enterprise-org-packages',
    title: 'Packages',
    description:
      'GitHub Packages の概要、Organization での公開範囲、認証とワークフロー連携の要点を学びます。',
    order: 3,
  },
  {
    id: 'github-enterprise-org-teams',
    title: 'Teams',
    description:
      'Organization の Team 作成、メンバー追加、リポジトリとの紐づけ手順と Maintainer の役割を学びます。',
    order: 4,
  },
  {
    id: 'github-enterprise-org-settings',
    title: 'Organization の Settings',
    description:
      'Organization 設定の主要カテゴリ（Member privileges、Actions、Packages、Security など）の見方と運用上の注意を学びます。',
    order: 5,
  },
];

/** Enterprise › People セクション直下の公開チャプター（概要 `github-enterprise-org-people` に続く） */
const PEOPLE_SECTION_CHILDREN: {
  id: string;
  title: string;
  description: string;
  order: number;
}[] = [
  {
    id: 'github-enterprise-sec-people-members',
    title: 'Members',
    description: 'Enterprise / Organization のメンバー一覧・ロール確認・メンバー単位の運用を学びます。',
    order: 2,
  },
  {
    id: 'github-enterprise-sec-people-administrators',
    title: 'Administrators',
    description: 'Enterprise 管理者・Organization Owner など管理者ロールの責務と権限範囲を学びます。',
    order: 3,
  },
  {
    id: 'github-enterprise-sec-people-enterprise-teams',
    title: 'Enterprise teams',
    description: 'Enterprise レベルのチーム構成と、Organization 横断でのメンバー管理の考え方を学びます。',
    order: 4,
  },
  {
    id: 'github-enterprise-sec-people-outside-collaborators',
    title: 'Outside collaborators',
    description: 'Organization メンバーではない外部コラボレーターの招待・権限・監査上の扱いを学びます。',
    order: 5,
  },
  {
    id: 'github-enterprise-sec-people-enterprise-roles',
    title: 'Enterprise roles',
    description: 'Enterprise アカウントにおけるロール種別と、最小権限での割り当てのポイントを学びます。',
    order: 6,
  },
  {
    id: 'github-enterprise-sec-people-organization-roles',
    title: 'Organization roles',
    description: 'Organization の Owner / Member などロールと、Team・リポジトリ権限との関係を学びます。',
    order: 7,
  },
  {
    id: 'github-enterprise-sec-people-invitations',
    title: 'Invitations',
    description: 'メンバー招待の作成・承認フロー・期限と再送の運用を学びます。',
    order: 8,
  },
  {
    id: 'github-enterprise-sec-people-failed-invitations',
    title: 'Failed invitations',
    description: '失敗した招待の確認・原因切り分け・再招待の手順を学びます。',
    order: 9,
  },
];

/** People › Enterprise roles 直下の公開サブチャプター */
const PEOPLE_ENTERPRISE_ROLES_CHILDREN: {
  id: string;
  title: string;
  description: string;
  order: number;
}[] = [
  {
    id: 'github-enterprise-sec-people-enterprise-roles-role-management',
    title: 'Role management',
    description:
      'Enterprise roles におけるロール定義・継承・無効化など、ロールそのものの管理運用を学びます。',
    order: 1,
  },
  {
    id: 'github-enterprise-sec-people-enterprise-roles-role-assignments',
    title: 'Role assignments',
    description: 'Enterprise ロールを誰に割り当てるか、棚卸しと最小権限の見直しを学びます。',
    order: 2,
  },
];

/** Enterprise › Policies セクション直下の公開サブチャプター */
const POLICIES_SECTION_CHILDREN: {
  id: string;
  title: string;
  description: string;
  order: number;
}[] = [
  {
    id: 'github-enterprise-sec-policies-repository',
    title: 'Repository',
    description:
      'Enterprise におけるリポジトリ作成・可視性・フォーク・ベース権限などの横断ポリシーを学びます。',
    order: 1,
  },
  {
    id: 'github-enterprise-sec-policies-member-privileges',
    title: 'Member privileges',
    description: 'メンバー特権・ベース権限・外部コラボレーターに関する Enterprise 既定を学びます。',
    order: 2,
  },
  {
    id: 'github-enterprise-sec-policies-codespaces',
    title: 'Codespaces',
    description:
      'Enterprise 全体での Codespaces 利用範囲・シークレット・既定イメージなどのポリシーを学びます。',
    order: 3,
  },
  {
    id: 'github-enterprise-sec-policies-copilot',
    title: 'Copilot',
    description: 'Enterprise における Copilot のライセンス・機能・データ取り扱いに関するポリシーを学びます。',
    order: 4,
  },
  {
    id: 'github-enterprise-sec-policies-actions',
    title: 'Actions',
    description:
      'GitHub Actions の利用許可・ランナー・ワークフロー権限など Enterprise 横断のポリシーを学びます。',
    order: 5,
  },
  {
    id: 'github-enterprise-sec-policies-hosted-compute-networking',
    title: 'Hosted compute networking',
    description:
      'ホスト型コンピュートとネットワーク境界（許可リスト等）の Enterprise ポリシーを学びます。',
    order: 6,
  },
  {
    id: 'github-enterprise-sec-policies-projects',
    title: 'Projects',
    description: 'GitHub Projects の Organization 横断利用と Enterprise での統制の考え方を学びます。',
    order: 7,
  },
  {
    id: 'github-enterprise-sec-policies-advanced-security',
    title: 'Advanced Security',
    description: 'GHAS の有効化範囲・利用ポリシー・組織への適用を Enterprise 観点で学びます。',
    order: 8,
  },
  {
    id: 'github-enterprise-sec-policies-code-quality',
    title: 'Code Quality',
    description: 'コード品質・レビュー・保護ルール等に関する Enterprise レベルの方針を学びます。',
    order: 9,
  },
  {
    id: 'github-enterprise-sec-policies-personal-access-tokens',
    title: 'Personal access tokens',
    description:
      'Fine-grained / classic PAT の許可・承認・有効期限など Enterprise の PAT ポリシーを学びます。',
    order: 10,
  },
  {
    id: 'github-enterprise-sec-policies-sponsors',
    title: 'Sponsors',
    description: 'スポンサーシップ・公開範囲に関する Enterprise / Organization の取り扱いを学びます。',
    order: 11,
  },
  {
    id: 'github-enterprise-sec-policies-models',
    title: 'Models',
    description: '利用可能モデル・API 利用・ガバナンスに関する Enterprise ポリシーを学びます。',
    order: 12,
  },
];

/** Policies › Repository 直下の公開サブチャプター */
const POLICIES_REPOSITORY_CHILDREN: {
  id: string;
  title: string;
  description: string;
  order: number;
}[] = [
  {
    id: 'github-enterprise-sec-policies-repository-repository',
    title: 'Repository',
    description:
      'Enterprise の Repository ポリシーにおけるリポジトリ作成・可視性・フォーク等の基本設定を学びます。',
    order: 1,
  },
  {
    id: 'github-enterprise-sec-policies-repository-code',
    title: 'Code',
    description:
      'デフォルトブランチ・マージ戦略・リポジトリアーカイブ等、コード運用に関する Enterprise ポリシーを学びます。',
    order: 2,
  },
  {
    id: 'github-enterprise-sec-policies-repository-code-insights',
    title: 'Code insights',
    description:
      'ルール適用状況や拒否イベントなど、コードインサイトに関する Enterprise の見方と運用を学びます。',
    order: 3,
  },
  {
    id: 'github-enterprise-sec-policies-repository-code-ruleset-bypasses',
    title: 'Code ruleset bypasses',
    description: 'ルールセットのバイパス申請・承認フローと Enterprise での統制を学びます。',
    order: 4,
  },
  {
    id: 'github-enterprise-sec-policies-repository-custom-properties',
    title: 'Custom properties',
    description:
      'Organization 横断のカスタムプロパティ定義と、リポジトリメタデータの Enterprise ポリシーを学びます。',
    order: 5,
  },
];

/** Organization の Settings 直下のサブチャプター */
const ORG_SETTINGS_SUBCHAPTERS: {
  id: string;
  parent_id: string;
  title: string;
  description: string;
  order: number;
}[] = [
  {
    id: 'github-enterprise-org-settings-repository',
    parent_id: 'github-enterprise-org-settings',
    title: 'Repository',
    description:
      'Organization Settings の Repository。リポジトリ作成・可視性・フォーク・デフォルトブランチなど組織横断のリポジトリポリシーを学びます。',
    order: 1,
  },
  {
    id: 'github-enterprise-org-settings-codespaces',
    parent_id: 'github-enterprise-org-settings',
    title: 'Codespaces',
    description:
      'Organization Settings の Codespaces。利用者範囲・シークレット・既定環境など組織レベルの Codespaces 方針を学びます。',
    order: 2,
  },
  {
    id: 'github-enterprise-org-settings-planning',
    parent_id: 'github-enterprise-org-settings',
    title: 'Planning',
    description:
      'Organization Settings の Planning。Issues・Projects など計画系機能に関する組織既定の考え方を学びます。',
    order: 3,
  },
  {
    id: 'github-enterprise-org-settings-copilot',
    parent_id: 'github-enterprise-org-settings',
    title: 'Copilot',
    description:
      'Organization Settings の Copilot 入口。Access / Policies / Models など各サブ項目は子チャプターで学びます。',
    order: 4,
  },
  {
    id: 'github-enterprise-org-settings-actions',
    parent_id: 'github-enterprise-org-settings',
    title: 'Actions',
    description: 'Organization Settings の Actions。ワークフロー実行方針と利用制御を学びます。',
    order: 5,
  },
  {
    id: 'github-enterprise-org-settings-models',
    parent_id: 'github-enterprise-org-settings',
    title: 'Models',
    description: 'Organization Settings の Models。利用可能モデルと統制を学びます。',
    order: 6,
  },
  {
    id: 'github-enterprise-org-settings-webhooks',
    parent_id: 'github-enterprise-org-settings',
    title: 'Webhooks',
    description: 'Organization Settings の Webhooks。組織全体イベント連携を学びます。',
    order: 7,
  },
  {
    id: 'github-enterprise-org-settings-discussions',
    parent_id: 'github-enterprise-org-settings',
    title: 'Discussions',
    description: 'Organization Settings の Discussions。コミュニティ運用と統制を学びます。',
    order: 8,
  },
  {
    id: 'github-enterprise-org-settings-packages',
    parent_id: 'github-enterprise-org-settings',
    title: 'Packages',
    description: 'Organization Settings の Packages。パッケージ公開とアクセス方針を学びます。',
    order: 9,
  },
  {
    id: 'github-enterprise-org-settings-pages',
    parent_id: 'github-enterprise-org-settings',
    title: 'Pages',
    description: 'Organization Settings の Pages。公開サイト運用方針を学びます。',
    order: 10,
  },
  {
    id: 'github-enterprise-org-settings-hosted-compute-networking',
    parent_id: 'github-enterprise-org-settings',
    title: 'Hosted compute networking',
    description: 'Organization Settings の Hosted compute networking。ネットワーク連携と制御を学びます。',
    order: 11,
  },
  {
    id: 'github-enterprise-org-settings-custom-properties',
    parent_id: 'github-enterprise-org-settings',
    title: 'Custom properties',
    description: 'Organization Settings の Custom properties。組織共通メタデータ管理を学びます。',
    order: 12,
  },
  {
    id: 'github-enterprise-org-settings-authentication-security',
    parent_id: 'github-enterprise-org-settings',
    title: 'Authentication security',
    description: 'Organization Settings の Authentication security。認証とアクセス保護の基盤を学びます。',
    order: 13,
  },
  {
    id: 'github-enterprise-org-settings-advanced-security',
    parent_id: 'github-enterprise-org-settings',
    title: 'Advanced Security',
    description: 'Organization Settings の Advanced Security。GHAS 系の統制を学びます。',
    order: 14,
  },
  {
    id: 'github-enterprise-org-settings-deploy-keys',
    parent_id: 'github-enterprise-org-settings',
    title: 'Deploy keys',
    description: 'Organization Settings の Deploy keys。鍵管理ポリシーを学びます。',
    order: 15,
  },
  {
    id: 'github-enterprise-org-settings-compliance',
    parent_id: 'github-enterprise-org-settings',
    title: 'Compliance',
    description: 'Organization Settings の Compliance。監査・規制要件対応を学びます。',
    order: 16,
  },
  {
    id: 'github-enterprise-org-settings-vertified-approved-domains',
    parent_id: 'github-enterprise-org-settings',
    title: 'Vertified and approved domains',
    description: 'Organization Settings の Vertified and approved domains。承認済みドメイン運用を学びます。',
    order: 17,
  },
  {
    id: 'github-enterprise-org-settings-secrets-and-variables',
    parent_id: 'github-enterprise-org-settings',
    title: 'Secrets and variables',
    description: 'Organization Settings の Secrets and variables。シークレット統制を学びます。',
    order: 18,
  },
  {
    id: 'github-enterprise-org-settings-github-apps',
    parent_id: 'github-enterprise-org-settings',
    title: 'GitHub Apps',
    description: 'Organization Settings の GitHub Apps。アプリ権限と承認運用を学びます。',
    order: 19,
  },
  {
    id: 'github-enterprise-org-settings-oauth-app-policy',
    parent_id: 'github-enterprise-org-settings',
    title: 'OAuth app policy',
    description: 'Organization Settings の OAuth app policy。OAuth 連携統制を学びます。',
    order: 20,
  },
  {
    id: 'github-enterprise-org-settings-personal-access-tokens',
    parent_id: 'github-enterprise-org-settings',
    title: 'Personal access tokens',
    description: 'Organization Settings の Personal access tokens。PAT 制御を学びます。',
    order: 21,
  },
  {
    id: 'github-enterprise-org-settings-scheduled-reminders',
    parent_id: 'github-enterprise-org-settings',
    title: 'Scheduled reminders',
    description: 'Organization Settings の Scheduled reminders。定期通知の運用を学びます。',
    order: 22,
  },
  {
    id: 'github-enterprise-org-settings-announcement',
    parent_id: 'github-enterprise-org-settings',
    title: 'Announcement',
    description: 'Organization Settings の Announcement。組織向けアナウンス運用を学びます。',
    order: 23,
  },
  {
    id: 'github-enterprise-org-settings-logs',
    parent_id: 'github-enterprise-org-settings',
    title: 'Logs',
    description: 'Organization Settings の Logs。監査ログ・運用ログ確認を学びます。',
    order: 24,
  },
  {
    id: 'github-enterprise-org-settings-deleted-repositories',
    parent_id: 'github-enterprise-org-settings',
    title: 'Deleted repositories',
    description: 'Organization Settings の Deleted repositories。削除済みリポジトリ管理を学びます。',
    order: 25,
  },
  {
    id: 'github-enterprise-org-settings-developer-settings',
    parent_id: 'github-enterprise-org-settings',
    title: 'Developer settings',
    description: 'Organization Settings の Developer settings。開発者向け設定運用を学びます。',
    order: 26,
  },
  {
    id: 'github-enterprise-org-settings-logs-sponsorship-log',
    parent_id: 'github-enterprise-org-settings-logs',
    title: 'Sponsorship log',
    description: 'Organization Settings › Logs › Sponsorship log。スポンサー関連のログ確認を学びます。',
    order: 1,
  },
  {
    id: 'github-enterprise-org-settings-logs-audit-log',
    parent_id: 'github-enterprise-org-settings-logs',
    title: 'Audit log',
    description: 'Organization Settings › Logs › Audit log。監査ログの確認を学びます。',
    order: 2,
  },
  {
    id: 'github-enterprise-org-settings-personal-access-tokens-settings',
    parent_id: 'github-enterprise-org-settings-personal-access-tokens',
    title: 'settings',
    description:
      'Organization Settings › Personal access tokens › settings。Fine-grained token の許可・承認・有効期限ポリシーを学びます。',
    order: 1,
  },
  {
    id: 'github-enterprise-org-settings-personal-access-tokens-active-tokens',
    parent_id: 'github-enterprise-org-settings-personal-access-tokens',
    title: 'Active tokens',
    description:
      'Organization Settings › Personal access tokens › Active tokens。発行済み token の棚卸しを学びます。',
    order: 2,
  },
  {
    id: 'github-enterprise-org-settings-personal-access-tokens-prnding-requests',
    parent_id: 'github-enterprise-org-settings-personal-access-tokens',
    title: 'Prnding requests',
    description:
      'Organization Settings › Personal access tokens › Prnding requests。承認待ちリクエスト審査を学びます。',
    order: 3,
  },
  {
    id: 'github-enterprise-org-settings-advanced-security-configurations',
    parent_id: 'github-enterprise-org-settings-advanced-security',
    title: 'Configurations',
    description:
      'Organization Settings › Advanced Security › Configurations。セキュリティ構成の定義・適用と保護率を整理します。',
    order: 1,
  },
  {
    id: 'github-enterprise-org-settings-advanced-security-global-settings',
    parent_id: 'github-enterprise-org-settings-advanced-security',
    title: 'Global settings',
    description:
      'Organization Settings › Advanced Security › Global settings。組織全体の既定設定を整理します。',
    order: 2,
  },
  {
    id: 'github-enterprise-org-settings-copilot-access',
    parent_id: 'github-enterprise-org-settings-copilot',
    title: 'Copilot — Access',
    description: 'Organization の Copilot で誰にライセンスを割り当てるか、利用の入口を学びます。',
    order: 1,
  },
  {
    id: 'github-enterprise-org-settings-copilot-policies',
    parent_id: 'github-enterprise-org-settings-copilot',
    title: 'Copilot — Policies',
    description: 'Chat・PR・CLI など Copilot 機能別の Organization ポリシーを学びます。',
    order: 2,
  },
  {
    id: 'github-enterprise-org-settings-copilot-models',
    parent_id: 'github-enterprise-org-settings-copilot',
    title: 'Copilot — Models',
    description: '利用可能モデルと既定モデルを Organization で揃える考え方を学びます。',
    order: 3,
  },
  {
    id: 'github-enterprise-org-settings-copilot-custom-instructions',
    parent_id: 'github-enterprise-org-settings-copilot',
    title: 'Copilot — Custom instructions',
    description: '組織共通のカスタム指示で Copilot の振る舞いを揃える方法を学びます。',
    order: 4,
  },
  {
    id: 'github-enterprise-org-settings-copilot-content-exclusion',
    parent_id: 'github-enterprise-org-settings-copilot',
    title: 'Copilot — Content exclusion',
    description: 'コンテンツ除外で機密コードの扱いリスクを下げる設定を学びます。',
    order: 5,
  },
  {
    id: 'github-enterprise-org-settings-copilot-cloud-agent',
    parent_id: 'github-enterprise-org-settings-copilot',
    title: 'Copilot — Cloud agent',
    description: 'クラウドエージェントの利用と Organization / Enterprise ポリシーとの関係を学びます。',
    order: 6,
  },
  {
    id: 'github-enterprise-org-settings-planning-projects',
    parent_id: 'github-enterprise-org-settings-planning',
    title: 'Projects',
    description:
      'Organization Settings › Planning における Projects。組織レベルのプロジェクト方針と Organization 横断の運用の考え方を学びます。',
    order: 1,
  },
  {
    id: 'github-enterprise-org-settings-planning-issue-types',
    parent_id: 'github-enterprise-org-settings-planning',
    title: 'Issue Types',
    description:
      'Organization Settings › Planning › Issue types。組織共通の issue の種類の作成・編集・無効化を学びます。',
    order: 2,
  },
  {
    id: 'github-enterprise-org-settings-codespaces-general',
    parent_id: 'github-enterprise-org-settings-codespaces',
    title: 'General',
    description:
      'Organization Settings › Codespaces › General。利用対象、既定設定、開発環境の土台を整理します。',
    order: 1,
  },
  {
    id: 'github-enterprise-org-settings-codespaces-policies',
    parent_id: 'github-enterprise-org-settings-codespaces',
    title: 'Policies',
    description:
      'Organization Settings › Codespaces › Policies。アクセス範囲やセキュリティ制御などの利用ポリシーを整理します。',
    order: 2,
  },
  {
    id: 'github-enterprise-org-settings-repository-general',
    parent_id: 'github-enterprise-org-settings-repository',
    title: 'General',
    description:
      'Organization Settings › Repository › General。リポジトリの基本設定・既定値を整理します。',
    order: 1,
  },
  {
    id: 'github-enterprise-org-settings-repository-topics',
    parent_id: 'github-enterprise-org-settings-repository',
    title: 'Topics',
    description: 'Organization Settings › Repository › Topics。分類タグ運用を整理します。',
    order: 2,
  },
  {
    id: 'github-enterprise-org-settings-repository-rulesets',
    parent_id: 'github-enterprise-org-settings-repository',
    title: 'Rulesets',
    description:
      'Organization Settings › Repository › Rulesets。リポジトリルールの標準化を整理します。',
    order: 3,
  },
  {
    id: 'github-enterprise-org-settings-repository-rule-insights',
    parent_id: 'github-enterprise-org-settings-repository',
    title: 'Rule insights',
    description: 'Organization Settings › Repository › Rule insights。ルール適用状況の分析を整理します。',
    order: 4,
  },
  {
    id: 'github-enterprise-org-settings-repository-bypass-requests',
    parent_id: 'github-enterprise-org-settings-repository',
    title: 'Bypass requests',
    description: 'Organization Settings › Repository › Bypass requests。例外申請フローを整理します。',
    order: 5,
  },
  {
    id: 'github-enterprise-org-settings-repository-custom-properties',
    parent_id: 'github-enterprise-org-settings-repository',
    title: 'Custom properties',
    description:
      'Organization Settings › Repository › Custom properties。メタデータ管理と自動化の基盤を整理します。',
    order: 6,
  },
];

/**
 * Enterprise › Security and quality 直下のサブチャプター（github-1770333814514-4idy0to と同階層）。
 * order は既存 GHAS ハブを 1 に据えたうえで 2 から採番。
 */
const SECURITY_AND_QUALITY_SIBLINGS: {
  id: string;
  title: string;
  description: string;
  order: number;
}[] = [
  {
    id: 'github-enterprise-sec-security-quality-overview',
    title: 'Overview',
    description:
      'Enterprise におけるセキュリティと品質の概要、ダッシュボードの見方、主要指標の位置づけを整理します。',
    order: 2,
  },
  {
    id: 'github-enterprise-sec-security-quality-risk',
    title: 'Risk',
    description: 'リスクの優先度付け、重大度・露出度の解釈、修復のトリアージを Enterprise 観点で学びます。',
    order: 3,
  },
  {
    id: 'github-enterprise-sec-security-quality-coverage',
    title: 'Coverage',
    description: 'GHAS・スキャン機能の適用範囲、リポジトリカバレッジとギャップの把握を整理します。',
    order: 4,
  },
  {
    id: 'github-enterprise-sec-security-quality-enablement',
    title: 'Enablement',
    description: 'Advanced Security や各スキャンの有効化ロールアウト、段階的導入とブロッカーの扱いを学びます。',
    order: 5,
  },
  {
    id: 'github-enterprise-sec-security-quality-codeql-prs',
    title: 'CodeQL pull requests',
    description: 'PR における CodeQL 分析、チェック結果の解釈とマージゲートの運用を整理します。',
    order: 6,
  },
  {
    id: 'github-enterprise-sec-security-quality-secret-scanning',
    title: 'Secret scanning',
    description: 'シークレットスキャンの検知、プッシュ保護、カスタムパターンの Enterprise 横断の考え方です。',
    order: 7,
  },
  {
    id: 'github-enterprise-sec-security-quality-findings-dependabot',
    title: 'Findings における Dependabot',
    description: 'Dependabot の検知一覧での絞り込み、重大度、グループ化とワークフロー連携の要点です。',
    order: 8,
  },
  {
    id: 'github-enterprise-sec-security-quality-findings-code-scanning',
    title: 'Findings における Code scanning',
    description: 'コードスキャン（CodeQL 等）の検知一覧、ルール別の傾向と優先修復を整理します。',
    order: 9,
  },
  {
    id: 'github-enterprise-sec-security-quality-findings-secret-scanning',
    title: 'Findings における Secret scanning',
    description: 'シークレット検知の一覧、有効性チェックとローテーション要求の扱いを学びます。',
    order: 10,
  },
  {
    id: 'github-enterprise-sec-security-quality-dismissal-dependabot',
    title: 'Dismissal requests における Dependabot',
    description: 'Dependabot アラートの却下申請の承認フローと監査上の注意点を整理します。',
    order: 11,
  },
  {
    id: 'github-enterprise-sec-security-quality-dismissal-code-scanning',
    title: 'Dismissal requests における Code scanning',
    description: 'コードスキャンアラートの却下申請、誤検知と例外の扱いを Enterprise で揃える考え方です。',
    order: 12,
  },
  {
    id: 'github-enterprise-sec-security-quality-dismissal-push-protection-bypass',
    title: 'Dismissal requests における Push protection bypass',
    description: 'プッシュ保護のバイパス申請の承認、緊急時のみに限定する運用と証跡を学びます。',
    order: 13,
  },
];

/** Findings › Dependabot 直下のサブチャプター */
const SECURITY_QUALITY_FINDINGS_DEPENDABOT_CHILDREN: {
  id: string;
  title: string;
  description: string;
  order: number;
}[] = [
  {
    id: 'github-enterprise-sec-security-quality-findings-dependabot-malware',
    title: 'Malware',
    description:
      'Dependabot におけるマルウェア系の検知の見方、重大度、対応優先度とサプライチェーン上の意味を整理します。',
    order: 1,
  },
  {
    id: 'github-enterprise-sec-security-quality-findings-dependabot-vulnerabilities',
    title: 'Vulnerabilities',
    description:
      'Dependabot による脆弱性アラートの分類、CVE・バージョン範囲、修復 PR とセキュリティアドバイザリの読み方を学びます。',
    order: 2,
  },
];

/** Enterprise › Billing and licensing ハブ直下のサブチャプター */
const BILLING_HUB_CHILDREN: {
  id: string;
  title: string;
  description: string;
  order: number;
}[] = [
  {
    id: 'github-enterprise-billing-hub-overview',
    title: 'Overview',
    description:
      'Enterprise の請求・ライセンス画面の構成、サマリーで押さえるべき指標と他セクションへの導線を整理します。',
    order: 1,
  },
  {
    id: 'github-enterprise-billing-hub-usage',
    title: 'Usage',
    description: 'シート・Actions・ストレージ等の利用量の見方、ピークの読み取りと予算連携の前提を学びます。',
    order: 2,
  },
  {
    id: 'github-enterprise-billing-hub-licensing',
    title: 'Licensing',
    description: 'Copilot・GHAS・ユーザー席などライセンス種別の割当、不足時の挙動と監査の観点を整理します。',
    order: 3,
  },
  {
    id: 'github-enterprise-billing-hub-cost-centers',
    title: 'Cost centers',
    description: 'コストセンターによる利用のタグ付け、組織・チーム単位の配賦とレポートの読み方です。',
    order: 4,
  },
  {
    id: 'github-enterprise-billing-hub-budgets-alerts',
    title: 'Budgets and alerts',
    description: '予算しきい値とアラート通知、しきい値を超えた際の運用（誰が見るか・エスカレーション）を学びます。',
    order: 5,
  },
  {
    id: 'github-enterprise-billing-hub-payment-information',
    title: 'Payment information',
    description: '支払い方法、請求書払い、通貨・住所など請求先情報の管理と更新手順の要点です。',
    order: 6,
  },
  {
    id: 'github-enterprise-billing-hub-billing-contacts',
    title: 'Billing contacts',
    description: '請求関連通知の受信者、請求書メール、FinOps／経理との役割分担を整理します。',
    order: 7,
  },
];

/** Billing › Usage 直下のサブチャプター */
const BILLING_HUB_USAGE_CHILDREN: {
  id: string;
  title: string;
  description: string;
  order: number;
}[] = [
  {
    id: 'github-enterprise-billing-hub-usage-metered-usage',
    title: 'Metered usage',
    description:
      '従量課金メトリクス（Actions 分数、ストレージ、データ転送等）の内訳、請求単位とピーク時の読み方を整理します。',
    order: 1,
  },
  {
    id: 'github-enterprise-billing-hub-usage-premium-request-analytics',
    title: 'Premium request analytics',
    description:
      'Copilot 等のプレミアムリクエスト消費の推移、ユーザー・Organization 別の傾向とコスト試算の前提を学びます。',
    order: 2,
  },
];

const LEAF_MOVES: { id: string; parent_id: string | null; order: number }[] = [
  { id: 'github-enterprise-overview', parent_id: 'github-enterprise-sec-overview', order: 1 },
  { id: 'github-enterprise-insights', parent_id: 'github-enterprise-sec-insights', order: 1 },
  /** コスト管理は Billing ハブ配下。公式ナビの Overview 等のあとに並ぶよう order 8 */
  { id: 'github-enterprise-cost-management', parent_id: 'github-enterprise-billing-hub', order: 8 },
  /** GHES は GHEC（github-enterprise）と別トラック。GitHub 言語のルート直下 */
  { id: 'github-enterprise-ghes-overview', parent_id: null, order: 15 },
  { id: 'github-enterprise-org-people', parent_id: 'github-enterprise-sec-people', order: 1 },
  { id: 'github-enterprise-connect-policies-ai', parent_id: 'github-enterprise-sec-github-connect', order: 1 },
  { id: 'github-enterprise-compliance', parent_id: 'github-enterprise-sec-compliance', order: 1 },
  /** GHAS シリーズの親（旧: GitHub 言語ルート直下）を Enterprise の Security and quality 配下へ */
  { id: 'github-1770333814514-4idy0to', parent_id: 'github-enterprise-sec-security-and-quality', order: 1 },
  { id: 'github-enterprise-auth-sso', parent_id: 'github-enterprise-settings-hub', order: 1 },
  { id: 'github-enterprise-github-apps', parent_id: 'github-enterprise-settings-hub', order: 2 },
  { id: 'github-enterprise-hooks', parent_id: 'github-enterprise-settings-hub', order: 3 },
  { id: 'github-enterprise-announcements', parent_id: 'github-enterprise-settings-hub', order: 4 },
  { id: 'github-enterprise-settings', parent_id: 'github-enterprise-settings-hub', order: 5 },
  { id: 'github-enterprise-best-practices', parent_id: 'github-enterprise-settings-hub', order: 6 },
  { id: 'github-enterprise-troubleshooting', parent_id: 'github-enterprise-sec-support', order: 1 },
];

/** AI Controls 配下の公開親チャプター（各親の下にサブチャプターを持つ） */
const AGENTS_CHAPTER = {
  id: 'github-enterprise-ai-agents',
  language_id: 'github',
  parent_id: 'github-enterprise-sec-ai-controls',
  title: 'Agents',
  description: 'Agents チャプターの入口です。概要とポリシーはサブチャプターで学びます。',
  order: 1,
  status: 'published' as const,
};

const AGENTS_INTRO_CHAPTER = {
  id: 'github-enterprise-ai-agents-intro',
  language_id: 'github',
  parent_id: 'github-enterprise-ai-agents',
  title: 'エージェントの概要とポリシー',
  description:
    'コーディングエージェントの位置づけと、AI Controls・Enterprise / Organization ポリシーとの関係を整理します。',
  order: 1,
  status: 'published' as const,
};

const COPILOT_CHAPTER = {
  id: 'github-enterprise-ai-copilot',
  language_id: 'github',
  parent_id: 'github-enterprise-sec-ai-controls',
  title: 'Copilot',
  description:
    'エディタ・チャット・CLI など GitHub Copilot の利用チャプターです。初期セットアップや Settings 内の各項目はサブチャプターで学びます。',
  order: 2,
  status: 'published' as const,
};

const MCP_CHAPTER = {
  id: 'github-enterprise-ai-mcp',
  language_id: 'github',
  parent_id: 'github-enterprise-sec-ai-controls',
  title: 'MCP',
  description: 'Model Context Protocol とツール連携（例: Copilot CLI × MCP）です。シリーズ詳細はサブチャプターで学びます。',
  order: 3,
  status: 'published' as const,
};

const COPILOT_SUBCHAPTERS: {
  id: string;
  title: string;
  description: string;
  order: number;
}[] = [
  {
    id: 'github-copilot-setup-vscode',
    title: '初期セットアップ（VS Code編）',
    description:
      'VS Code で GitHub Copilot を利用するための初期セットアップ（拡張機能・認証・稼働確認）。プレミアムリクエスト（Premium Requests）や Copilot Chat の利用枠の考え方へのリンクも含みます。',
    order: 1,
  },
  {
    id: 'github-enterprise-copilot-privacy',
    title: 'Copilot — Privacy & Features',
    description:
      'Organization / Enterprise の Copilot における Privacy（コンテンツ除外・データの扱い）と Features（Chat・PR・CLI 等の機能有効化）をまとめて学びます。',
    order: 2,
  },
  {
    id: 'github-enterprise-copilot-billing-settings',
    title: 'Copilot — Billing',
    description:
      'Copilot 設定画面の Billing。シート割当・利用状況の見方（Enterprise 全体の請求とは役割が異なる点も整理）を学びます。',
    order: 3,
  },
  {
    id: 'github-enterprise-copilot-metrics',
    title: 'Copilot — Metrics',
    description: '利用状況・採用メトリクスの見方。Enterprise Insights との関係と運用上の読み方を学びます。',
    order: 4,
  },
  {
    id: 'github-enterprise-copilot-clients',
    title: 'Copilot — Copilot Clients',
    description: '利用を許可するエディタ・IDE クライアントの制限。標準化とセキュリティの両立を学びます。',
    order: 5,
  },
];

const MATLAB_MCP_HUB = {
  id: 'github-copilot-cli-matlab-mcp-server',
  language_id: 'github',
  parent_id: 'github-enterprise-ai-mcp',
  title: 'Copilot CLI × MATLAB MCP Server',
  description:
    'GitHub Copilot CLI と MathWorks 公式 MATLAB MCP Core Server を組み合わせた利用の概要・構成・リスク・対策・運用を、セキュリティの観点から6章で学びます。',
  order: 1,
  status: 'published' as const,
};

const MATLAB_MCP_LEAVES: { id: string; title: string; description: string; order: number }[] = [
  {
    id: 'github-copilot-matlab-mcp-01-overview',
    title: 'Copilot×MATLAB MCP — 概要と要件',
    description:
      '利用シナリオ（設計仕様から Simulink 等）、想定環境、押さえるべき制約（Org ポリシー・情報区分・ライセンス）を学びます。',
    order: 1,
  },
  {
    id: 'github-copilot-matlab-mcp-02-architecture',
    title: 'Copilot×MATLAB MCP — システム構成',
    description:
      'Copilot CLI・MCP Server・MATLAB・GitHub API の役割と、通信経路（HTTPS / stdio / ローカル）のセキュリティ上の意味を学びます。',
    order: 2,
  },
  {
    id: 'github-copilot-matlab-mcp-03-mcp-tools',
    title: 'Copilot×MATLAB MCP — MCP ツールと接続',
    description:
      'MATLAB MCP Core Server の概要、提供ツールのリスク感、mcp-config.json、GitHub Organization の MCP ポリシーを学びます。',
    order: 3,
  },
  {
    id: 'github-copilot-matlab-mcp-04-risks',
    title: 'Copilot×MATLAB MCP — セキュリティリスク',
    description:
      '機密の外部送信、モデル改変・インジェクション、MATLAB の権限、テレメトリなど代表リスクを整理します。',
    order: 4,
  },
  {
    id: 'github-copilot-matlab-mcp-05-mitigations',
    title: 'Copilot×MATLAB MCP — 対策',
    description:
      'Content Exclusion、ツールのホワイトリスト、段階的許可、ファイアウォール・OS 制御、テレメトリ無効化を学びます。',
    order: 5,
  },
  {
    id: 'github-copilot-matlab-mcp-06-operations',
    title: 'Copilot×MATLAB MCP — 運用と展開',
    description:
      'ライセンス・EULA、GitHub Apps の限界、導入ロードマップ、全社展開・Gateway の視点、チェックリストの要点を学びます。',
    order: 6,
  },
];

/** 旧スキームの下書きセクション（子を移したあと削除） */
const OBSOLETE_SECTION_IDS = [
  'github-enterprise-sec-governance',
  'github-enterprise-sec-billing',
  'github-enterprise-sec-reference',
  /** 旧: GHEC ツリー内の GHES セクション（GHES はルート直下へ移動済み） */
  'github-enterprise-sec-ghes',
];

async function main() {
  if (!supabaseUrl || !supabaseKey) {
    console.error('NEXT_PUBLIC_SUPABASE_URL と SUPABASE_SERVICE_ROLE_KEY を設定してください');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const now = new Date().toISOString();

  for (const s of SECTIONS) {
    const { error } = await supabase.from('programming_chapters').upsert(
      {
        id: s.id,
        language_id: 'github',
        parent_id: s.parent_id,
        title: s.title,
        description: s.description,
        order: s.order,
        status: 'draft',
        exercises: [],
        video_url: '',
        thumbnail_url: '',
        duration: '',
        created_at: now,
        updated_at: now,
      },
      { onConflict: 'id' }
    );
    if (error) {
      console.error(`セクション upsert エラー (${s.id}):`, error);
      process.exit(1);
    }
    console.log(`✓ セクション ${s.id}`);
  }

  for (const ch of ORGANIZATION_SECTION_CHILDREN) {
    const { error } = await supabase.from('programming_chapters').upsert(
      {
        id: ch.id,
        language_id: 'github',
        parent_id: 'github-enterprise-sec-orgs-and-repos',
        title: ch.title,
        description: ch.description,
        order: ch.order,
        status: 'published',
        exercises: [],
        video_url: '',
        thumbnail_url: '',
        duration: '',
        created_at: now,
        updated_at: now,
      },
      { onConflict: 'id' }
    );
    if (error) {
      console.error(`Organizations 子 upsert エラー (${ch.id}):`, error);
      process.exit(1);
    }
    console.log(`✓ ${ch.id}`);
  }

  for (const ch of PEOPLE_SECTION_CHILDREN) {
    const { error } = await supabase.from('programming_chapters').upsert(
      {
        id: ch.id,
        language_id: 'github',
        parent_id: 'github-enterprise-sec-people',
        title: ch.title,
        description: ch.description,
        order: ch.order,
        status: 'published',
        exercises: [],
        video_url: '',
        thumbnail_url: '',
        duration: '',
        created_at: now,
        updated_at: now,
      },
      { onConflict: 'id' }
    );
    if (error) {
      console.error(`People 子 upsert エラー (${ch.id}):`, error);
      process.exit(1);
    }
    console.log(`✓ ${ch.id}（People 配下）`);
  }

  for (const ch of PEOPLE_ENTERPRISE_ROLES_CHILDREN) {
    const { error } = await supabase.from('programming_chapters').upsert(
      {
        id: ch.id,
        language_id: 'github',
        parent_id: 'github-enterprise-sec-people-enterprise-roles',
        title: ch.title,
        description: ch.description,
        order: ch.order,
        status: 'published',
        exercises: [],
        video_url: '',
        thumbnail_url: '',
        duration: '',
        created_at: now,
        updated_at: now,
      },
      { onConflict: 'id' }
    );
    if (error) {
      console.error(`Enterprise roles 子 upsert エラー (${ch.id}):`, error);
      process.exit(1);
    }
    console.log(`✓ ${ch.id}（Enterprise roles 配下）`);
  }

  for (const ch of POLICIES_SECTION_CHILDREN) {
    const { error } = await supabase.from('programming_chapters').upsert(
      {
        id: ch.id,
        language_id: 'github',
        parent_id: 'github-enterprise-sec-policies',
        title: ch.title,
        description: ch.description,
        order: ch.order,
        status: 'published',
        exercises: [],
        video_url: '',
        thumbnail_url: '',
        duration: '',
        created_at: now,
        updated_at: now,
      },
      { onConflict: 'id' }
    );
    if (error) {
      console.error(`Policies 子 upsert エラー (${ch.id}):`, error);
      process.exit(1);
    }
    console.log(`✓ ${ch.id}（Policies 配下）`);
  }

  for (const ch of POLICIES_REPOSITORY_CHILDREN) {
    const { error } = await supabase.from('programming_chapters').upsert(
      {
        id: ch.id,
        language_id: 'github',
        parent_id: 'github-enterprise-sec-policies-repository',
        title: ch.title,
        description: ch.description,
        order: ch.order,
        status: 'published',
        exercises: [],
        video_url: '',
        thumbnail_url: '',
        duration: '',
        created_at: now,
        updated_at: now,
      },
      { onConflict: 'id' }
    );
    if (error) {
      console.error(`Policies › Repository 子 upsert エラー (${ch.id}):`, error);
      process.exit(1);
    }
    console.log(`✓ ${ch.id}（Policies › Repository 配下）`);
  }

  for (const sub of ORG_SETTINGS_SUBCHAPTERS) {
    const { error } = await supabase.from('programming_chapters').upsert(
      {
        id: sub.id,
        language_id: 'github',
        parent_id: sub.parent_id,
        title: sub.title,
        description: sub.description,
        order: sub.order,
        status: 'published',
        exercises: [],
        video_url: '',
        thumbnail_url: '',
        duration: '',
        created_at: now,
        updated_at: now,
      },
      { onConflict: 'id' }
    );
    if (error) {
      console.error(`Organization Settings 子 upsert エラー (${sub.id}):`, error);
      process.exit(1);
    }
    console.log(`✓ ${sub.id}（Organization Settings 配下）`);
  }

  await supabase
    .from('programming_progress')
    .update({ chapter_id: 'github-enterprise-org-repositories', updated_at: now })
    .in('chapter_id', ['github-enterprise-repository', 'github-enterprise-branch-merge']);

  for (const legacyId of ['github-enterprise-repository', 'github-enterprise-branch-merge']) {
    const { error } = await supabase.from('programming_chapters').delete().eq('id', legacyId);
    if (error) {
      console.warn(`旧チャプター削除 (${legacyId}):`, error.message);
    } else {
      console.log(`✓ 旧チャプター削除試行 ${legacyId}`);
    }
  }

  /** ルートの github-projects を Organization Projects に統合（存在すれば移行して削除） */
  await supabase
    .from('programming_chapters')
    .update({ parent_id: 'github-enterprise-org-projects', updated_at: now })
    .eq('id', 'github-projects-troubleshooting');
  await supabase
    .from('programming_progress')
    .update({ chapter_id: 'github-enterprise-org-projects', updated_at: now })
    .eq('chapter_id', 'github-projects');
  {
    const { error } = await supabase.from('programming_chapters').delete().eq('id', 'github-projects');
    if (error) {
      console.warn('旧 github-projects 削除:', error.message);
    } else {
      console.log('✓ 旧 github-projects 削除試行');
    }
  }

  const { error: agentsChapterError } = await supabase.from('programming_chapters').upsert(
    {
      ...AGENTS_CHAPTER,
      exercises: [],
      video_url: '',
      thumbnail_url: '',
      duration: '',
      created_at: now,
      updated_at: now,
    },
    { onConflict: 'id' }
  );
  if (agentsChapterError) {
    console.error('Agents 親チャプター upsert エラー:', agentsChapterError);
    process.exit(1);
  }
  console.log('✓ github-enterprise-ai-agents（公開・親チャプター）');

  const { error: agentsIntroError } = await supabase.from('programming_chapters').upsert(
    {
      ...AGENTS_INTRO_CHAPTER,
      exercises: [],
      video_url: '',
      thumbnail_url: '',
      duration: '',
      created_at: now,
      updated_at: now,
    },
    { onConflict: 'id' }
  );
  if (agentsIntroError) {
    console.error('Agents サブチャプター upsert エラー:', agentsIntroError);
    process.exit(1);
  }
  console.log('✓ github-enterprise-ai-agents-intro（Agents 配下）');

  for (const ch of [COPILOT_CHAPTER, MCP_CHAPTER]) {
    const { error } = await supabase.from('programming_chapters').upsert(
      {
        ...ch,
        exercises: [],
        video_url: '',
        thumbnail_url: '',
        duration: '',
        created_at: now,
        updated_at: now,
      },
      { onConflict: 'id' }
    );
    if (error) {
      console.error(`Copilot/MCP チャプター upsert エラー (${ch.id}):`, error);
      process.exit(1);
    }
    console.log(`✓ ${ch.id}（公開・親チャプター）`);
  }

  for (const sub of COPILOT_SUBCHAPTERS) {
    const { error } = await supabase.from('programming_chapters').upsert(
      {
        id: sub.id,
        language_id: 'github',
        parent_id: 'github-enterprise-ai-copilot',
        title: sub.title,
        description: sub.description,
        order: sub.order,
        status: 'published',
        exercises: [],
        video_url: '',
        thumbnail_url: '',
        duration: '',
        created_at: now,
        updated_at: now,
      },
      { onConflict: 'id' }
    );
    if (error) {
      console.error(`Copilot サブ upsert エラー (${sub.id}):`, error);
      process.exit(1);
    }
    console.log(`✓ ${sub.id}（Copilot 配下）`);
  }

  const { error: matlabHubErr } = await supabase.from('programming_chapters').upsert(
    {
      ...MATLAB_MCP_HUB,
      exercises: [],
      video_url: '',
      thumbnail_url: '',
      duration: '',
      created_at: now,
      updated_at: now,
    },
    { onConflict: 'id' }
  );
  if (matlabHubErr) {
    console.error('MATLAB MCP ハブ upsert エラー:', matlabHubErr);
    process.exit(1);
  }
  console.log('✓ github-copilot-cli-matlab-mcp-server（MCP 配下）');

  for (const leaf of MATLAB_MCP_LEAVES) {
    const { error } = await supabase.from('programming_chapters').upsert(
      {
        id: leaf.id,
        language_id: 'github',
        parent_id: MATLAB_MCP_HUB.id,
        title: leaf.title,
        description: leaf.description,
        order: leaf.order,
        status: 'published',
        exercises: [],
        video_url: '',
        thumbnail_url: '',
        duration: '',
        created_at: now,
        updated_at: now,
      },
      { onConflict: 'id' }
    );
    if (error) {
      console.error(`MATLAB MCP 孫 upsert エラー (${leaf.id}):`, error);
      process.exit(1);
    }
    console.log(`✓ ${leaf.id}`);
  }

  for (const ch of SECURITY_AND_QUALITY_SIBLINGS) {
    const { error } = await supabase.from('programming_chapters').upsert(
      {
        id: ch.id,
        language_id: 'github',
        parent_id: 'github-enterprise-sec-security-and-quality',
        title: ch.title,
        description: ch.description,
        order: ch.order,
        status: 'published',
        exercises: [],
        video_url: '',
        thumbnail_url: '',
        duration: '',
        created_at: now,
        updated_at: now,
      },
      { onConflict: 'id' }
    );
    if (error) {
      console.error(`Security and quality 子 upsert エラー (${ch.id}):`, error);
      process.exit(1);
    }
    console.log(`✓ ${ch.id}（Security and quality 配下）`);
  }

  for (const ch of SECURITY_QUALITY_FINDINGS_DEPENDABOT_CHILDREN) {
    const { error } = await supabase.from('programming_chapters').upsert(
      {
        id: ch.id,
        language_id: 'github',
        parent_id: 'github-enterprise-sec-security-quality-findings-dependabot',
        title: ch.title,
        description: ch.description,
        order: ch.order,
        status: 'published',
        exercises: [],
        video_url: '',
        thumbnail_url: '',
        duration: '',
        created_at: now,
        updated_at: now,
      },
      { onConflict: 'id' }
    );
    if (error) {
      console.error(`Findings Dependabot 子 upsert エラー (${ch.id}):`, error);
      process.exit(1);
    }
    console.log(`✓ ${ch.id}（Findings › Dependabot 配下）`);
  }

  for (const ch of BILLING_HUB_CHILDREN) {
    const { error } = await supabase.from('programming_chapters').upsert(
      {
        id: ch.id,
        language_id: 'github',
        parent_id: 'github-enterprise-billing-hub',
        title: ch.title,
        description: ch.description,
        order: ch.order,
        status: 'published',
        exercises: [],
        video_url: '',
        thumbnail_url: '',
        duration: '',
        created_at: now,
        updated_at: now,
      },
      { onConflict: 'id' }
    );
    if (error) {
      console.error(`Billing ハブ子 upsert エラー (${ch.id}):`, error);
      process.exit(1);
    }
    console.log(`✓ ${ch.id}（Billing and licensing 配下）`);
  }

  for (const ch of BILLING_HUB_USAGE_CHILDREN) {
    const { error } = await supabase.from('programming_chapters').upsert(
      {
        id: ch.id,
        language_id: 'github',
        parent_id: 'github-enterprise-billing-hub-usage',
        title: ch.title,
        description: ch.description,
        order: ch.order,
        status: 'published',
        exercises: [],
        video_url: '',
        thumbnail_url: '',
        duration: '',
        created_at: now,
        updated_at: now,
      },
      { onConflict: 'id' }
    );
    if (error) {
      console.error(`Billing › Usage 子 upsert エラー (${ch.id}):`, error);
      process.exit(1);
    }
    console.log(`✓ ${ch.id}（Billing › Usage 配下）`);
  }

  for (const row of LEAF_MOVES) {
    const { error } = await supabase
      .from('programming_chapters')
      .update({ parent_id: row.parent_id, order: row.order, updated_at: now })
      .eq('id', row.id);
    if (error) {
      console.warn(`更新スキップまたは失敗 (${row.id}):`, error.message);
      continue;
    }
    console.log(`✓ 移動 ${row.id} → ${row.parent_id ?? '(ルート)'}`);
  }

  for (const oid of OBSOLETE_SECTION_IDS) {
    const { error } = await supabase.from('programming_chapters').delete().eq('id', oid);
    if (error) {
      console.warn(`旧セクション削除スキップ (${oid}):`, error.message);
    } else {
      console.log(`✓ 削除 旧セクション ${oid}`);
    }
  }

  console.log('\nGitHub Enterprise チャプターツリーの再編が完了しました。');
}

main();
