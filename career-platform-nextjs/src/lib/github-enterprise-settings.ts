/**
 * GitHub Enterprise Server / Organization / Repository 設定パラメーター
 * GitHub公式ドキュメントのベストプラクティスに基づく
 * @see https://docs.github.com/en/enterprise-server
 * @see https://docs.github.com/en/organizations
 * @see https://docs.github.com/en/repositories
 */

export interface SettingParameter {
  name: string;
  description: string;
  defaultValue: string;
  recommendedValue: string;
  notes: string;
  category: string;
}

export type SettingsScope = 'enterprise' | 'organization' | 'repository';

export const SETTINGS_BY_SCOPE: Record<
  SettingsScope,
  { label: string; categories: Record<string, string>; params: SettingParameter[] }
> = {
  enterprise: {
    label: 'Enterprise',
    categories: {
      authentication: '認証',
      policy: 'ポリシー',
      'audit-log': '監査ログ',
    },
    params: [
      {
        name: 'auth_mode',
        description: '認証方式。Built-in、LDAP、SAML、CASのいずれかを選択。',
        defaultValue: 'Built-in',
        recommendedValue: 'SAML または LDAP',
        notes: 'エンタープライズ環境ではSAML/LDAPによる中央集権的な認証管理を推奨。',
        category: 'authentication',
      },
      {
        name: 'saml_session_timeout',
        description: 'SAMLセッションの有効期限（秒）。',
        defaultValue: '86400',
        recommendedValue: '86400',
        notes: '24時間。セキュリティ要件に応じて短縮可能。',
        category: 'authentication',
      },
      {
        name: 'two_factor_authentication',
        description: '2要素認証の強制。',
        defaultValue: 'optional',
        recommendedValue: 'required',
        notes: 'アカウント乗っ取り防止のため、全メンバーに2FAを必須化することを推奨。',
        category: 'authentication',
      },
      {
        name: 'signup_enabled',
        description: '新規ユーザー登録の許可。',
        defaultValue: 'true',
        recommendedValue: 'false',
        notes: 'エンタープライズでは管理者による招待制を推奨。',
        category: 'authentication',
      },
      {
        name: 'repository_creation',
        description: 'リポジトリ作成の許可範囲。',
        defaultValue: 'all',
        recommendedValue: 'admin',
        notes: 'リポジトリ sprawl を防止。',
        category: 'policy',
      },
      {
        name: 'base_repository_permissions',
        description: 'デフォルトのリポジトリ権限。',
        defaultValue: 'Read',
        recommendedValue: 'Read',
        notes: '最小権限の原則に基づき、必要最小限のReadから開始。',
        category: 'policy',
      },
      {
        name: 'audit_log_retention_days',
        description: '監査ログの保持期間（日）。',
        defaultValue: 'infinite',
        recommendedValue: '90 または 365',
        notes: 'コンプライアンス要件に応じて設定。',
        category: 'audit-log',
      },
      {
        name: 'audit_log_streaming_enabled',
        description: '監査ログのストリーミング送信（SIEM連携）。',
        defaultValue: 'false',
        recommendedValue: 'true',
        notes: 'セキュリティ監視のため外部システムへの送信を推奨。',
        category: 'audit-log',
      },
    ],
  },
  organization: {
    label: 'Organization',
    categories: {
      'member-permissions': 'メンバー権限',
      'repository-settings': 'リポジトリ設定',
      webhooks: 'Webhook',
    },
    params: [
      // メンバー権限
      {
        name: 'base_permission',
        description: '組織のデフォルトリポジトリ権限。Read/Write/Admin/None。',
        defaultValue: 'Read',
        recommendedValue: 'Read',
        notes: '最小権限の原則。個別リポジトリで上書き可能。',
        category: 'member-permissions',
      },
      {
        name: 'members_can_create_repositories',
        description: 'メンバーがリポジトリを作成できるか。',
        defaultValue: 'true',
        recommendedValue: 'false',
        notes: '管理者のみに制限するとリポジトリの乱立を防止。',
        category: 'member-permissions',
      },
      {
        name: 'members_can_create_public_repositories',
        description: 'メンバーがパブリックリポジトリを作成できるか。',
        defaultValue: 'true',
        recommendedValue: 'false',
        notes: '内部利用のみの場合はプライベートに統一を推奨。',
        category: 'member-permissions',
      },
      {
        name: 'members_can_create_private_repositories',
        description: 'メンバーがプライベートリポジトリを作成できるか。',
        defaultValue: 'true',
        recommendedValue: '組織ポリシーに応じて',
        notes: '必要に応じて true。',
        category: 'member-permissions',
      },
      {
        name: 'members_can_invite_collaborators',
        description: 'メンバーが外部コラボレーターを招待できるか。',
        defaultValue: 'true',
        recommendedValue: 'false',
        notes: '招待はオーナー/管理者に限定し、アクセス管理を一元化。',
        category: 'member-permissions',
      },
      {
        name: 'members_can_change_repository_visibility',
        description: 'メンバーがリポジトリの可視性を変更できるか。',
        defaultValue: 'true',
        recommendedValue: 'false',
        notes: '意図しない公開を防ぐため、管理者のみに制限。',
        category: 'member-permissions',
      },
      {
        name: 'members_can_delete_repositories',
        description: 'メンバーがリポジトリを削除できるか。',
        defaultValue: 'false（Admin権限時）',
        recommendedValue: 'false',
        notes: '削除はオーナーのみに限定。',
        category: 'member-permissions',
      },
      {
        name: 'members_can_fork_private_repositories',
        description: 'メンバーがプライベートリポジトリをフォークできるか。',
        defaultValue: 'false',
        recommendedValue: 'false',
        notes: '機密性の高いリポジトリの流出防止。',
        category: 'member-permissions',
      },
      // リポジトリ設定
      {
        name: 'repository_projects_enabled',
        description: 'リポジトリプロジェクト（Projects）の有効化。',
        defaultValue: 'true',
        recommendedValue: 'true',
        notes: 'プロジェクト管理に活用する場合は有効化。',
        category: 'repository-settings',
      },
      {
        name: 'repository_discussions_enabled',
        description: 'リポジトリディスカッションの有効化。',
        defaultValue: 'true',
        recommendedValue: '組織ポリシーに応じて',
        notes: 'Q&A形式の議論に有用。',
        category: 'repository-settings',
      },
      {
        name: 'allow_forking',
        description: '組織内リポジトリのフォークを許可するか。',
        defaultValue: 'true',
        recommendedValue: 'true',
        notes: '内部でのコラボレーションに有用。',
        category: 'repository-settings',
      },
      {
        name: 'web_commit_signoff_required',
        description: 'Web UIからのコミットにSign-offを必須とするか。',
        defaultValue: 'false',
        recommendedValue: 'true',
        notes: 'DCO準拠、トレーサビリティ向上。',
        category: 'repository-settings',
      },
      {
        name: 'require_signed_commits',
        description: '署名付きコミットを必須とするか。',
        defaultValue: 'false',
        recommendedValue: 'true（高セキュリティ環境）',
        notes: 'コミットの真正性保証。',
        category: 'repository-settings',
      },
      // Webhook
      {
        name: 'webhook_secret_required',
        description: 'Webhookにシークレットの設定を必須とするか。',
        defaultValue: 'false',
        recommendedValue: 'true',
        notes: 'ペイロードの改ざん検知のため、必ずシークレットを設定。',
        category: 'webhooks',
      },
      {
        name: 'webhook_ssl_verification',
        description: 'Webhook送信先のSSL証明書検証。',
        defaultValue: 'true',
        recommendedValue: 'true',
        notes: '中間者攻撃防止のため、常に有効を推奨。',
        category: 'webhooks',
      },
      {
        name: 'webhook_content_type',
        description: 'WebhookペイロードのContent-Type。',
        defaultValue: 'application/json',
        recommendedValue: 'application/json',
        notes: '標準的な形式。必要に応じて application/x-www-form-urlencoded。',
        category: 'webhooks',
      },
      {
        name: 'webhook_active',
        description: 'Webhookの有効/無効。',
        defaultValue: 'true',
        recommendedValue: '使用時のみ true',
        notes: '不要なWebhookは無効化してリソース節約。',
        category: 'webhooks',
      },
      {
        name: 'webhook_events',
        description: '購読するイベントの範囲。',
        defaultValue: 'すべて',
        recommendedValue: '必要なイベントのみ',
        notes: 'push, pull_request など、必要なイベントのみ購読して負荷を軽減。',
        category: 'webhooks',
      },
    ],
  },
  repository: {
    label: 'Repository',
    categories: {
      'branch-protection': 'ブランチ保護',
      security: 'セキュリティ',
      general: '一般設定',
    },
    params: [
      // ブランチ保護
      {
        name: 'require_pull_request_reviews',
        description: 'マージ前にプルリクエストの承認を必須とするか。',
        defaultValue: 'false',
        recommendedValue: 'true',
        notes: 'コードレビューの実施を強制。品質・セキュリティ向上。',
        category: 'branch-protection',
      },
      {
        name: 'required_approving_review_count',
        description: 'マージに必要な承認数。',
        defaultValue: '0',
        recommendedValue: '1 以上',
        notes: '重要リポジトリでは2以上を推奨。',
        category: 'branch-protection',
      },
      {
        name: 'require_status_checks',
        description: 'マージ前にステータスチェック（CI）の成功を必須とするか。',
        defaultValue: 'false',
        recommendedValue: 'true',
        notes: 'ビルド・テストの成功を必須化。',
        category: 'branch-protection',
      },
      {
        name: 'require_branch_up_to_date',
        description: 'マージ前にベースブランチとの同期を必須とするか。',
        defaultValue: 'false',
        recommendedValue: 'true',
        notes: 'コンフリクトの早期検出。',
        category: 'branch-protection',
      },
      {
        name: 'require_signed_commits',
        description: '署名付きコミットを必須とするか。',
        defaultValue: 'false',
        recommendedValue: 'true（高セキュリティ）',
        notes: 'コミットの真正性保証。',
        category: 'branch-protection',
      },
      {
        name: 'require_linear_history',
        description: 'リニアな履歴を必須とするか（マージコミット禁止）。',
        defaultValue: 'false',
        recommendedValue: 'true',
        notes: 'Squash merge または Rebase を強制。履歴をクリーンに。',
        category: 'branch-protection',
      },
      {
        name: 'allow_force_pushes',
        description: 'Force push を許可するか。',
        defaultValue: 'false',
        recommendedValue: 'false',
        notes: '履歴の書き換えを防ぐため無効を推奨。',
        category: 'branch-protection',
      },
      {
        name: 'allow_deletions',
        description: '保護ブランチの削除を許可するか。',
        defaultValue: 'false',
        recommendedValue: 'false',
        notes: 'main/master の誤削除を防止。',
        category: 'branch-protection',
      },
      {
        name: 'restrict_pushes',
        description: 'プッシュを特定のチーム/ユーザーに制限するか。',
        defaultValue: 'false',
        recommendedValue: 'true（main等）',
        notes: '重要なブランチへの直接プッシュを制限。',
        category: 'branch-protection',
      },
      // セキュリティ
      {
        name: 'dependency_graph',
        description: '依存関係グラフの有効化。',
        defaultValue: 'false',
        recommendedValue: 'true',
        notes: 'Dependabot アラートの前提。脆弱性検知に必須。',
        category: 'security',
      },
      {
        name: 'dependabot_alerts',
        description: 'Dependabot アラートの有効化。',
        defaultValue: 'false',
        recommendedValue: 'true',
        notes: '依存関係の脆弱性を検知・通知。',
        category: 'security',
      },
      {
        name: 'dependabot_security_updates',
        description: 'Dependabot セキュリティアップデートの有効化。',
        defaultValue: 'false',
        recommendedValue: 'true',
        notes: '脆弱性修正PRの自動作成。',
        category: 'security',
      },
      {
        name: 'secret_scanning',
        description: 'シークレットスキャンの有効化（GHAS）。',
        defaultValue: 'false',
        recommendedValue: 'true',
        notes: 'APIキー・パスワード等の漏洩検知。',
        category: 'security',
      },
      {
        name: 'push_protection',
        description: 'プッシュ保護の有効化。シークレット検出時のプッシュブロック。',
        defaultValue: 'false',
        recommendedValue: 'true',
        notes: 'シークレットの誤コミットを防止。',
        category: 'security',
      },
      {
        name: 'code_scanning',
        description: 'Code scanning（SAST）の有効化。',
        defaultValue: 'false',
        recommendedValue: 'true',
        notes: 'コードの脆弱性を自動検出。',
        category: 'security',
      },
      // 一般設定
      {
        name: 'issues_enabled',
        description: 'Issues の有効化。',
        defaultValue: 'true',
        recommendedValue: 'true',
        notes: '課題管理に活用。',
        category: 'general',
      },
      {
        name: 'wiki_enabled',
        description: 'Wiki の有効化。',
        defaultValue: 'false',
        recommendedValue: '必要に応じて',
        notes: 'ドキュメント管理に使用する場合のみ。',
        category: 'general',
      },
      {
        name: 'projects_enabled',
        description: 'Projects の有効化。',
        defaultValue: 'true',
        recommendedValue: 'true',
        notes: 'プロジェクト管理に有用。',
        category: 'general',
      },
      {
        name: 'merge_commit_allowed',
        description: 'マージコミットを許可するか。',
        defaultValue: 'true',
        recommendedValue: 'false（リニア履歴推奨時）',
        notes: 'Squash/Rebase を推奨する場合は無効。',
        category: 'general',
      },
      {
        name: 'squash_merge_allowed',
        description: 'Squash merge を許可するか。',
        defaultValue: 'true',
        recommendedValue: 'true',
        notes: '履歴をクリーンに保つために推奨。',
        category: 'general',
      },
      {
        name: 'rebase_merge_allowed',
        description: 'Rebase merge を許可するか。',
        defaultValue: 'true',
        recommendedValue: 'true',
        notes: 'リニア履歴の維持に有用。',
        category: 'general',
      },
    ],
  },
};

// 後方互換のため残す
export const GITHUB_ENTERPRISE_SETTINGS = SETTINGS_BY_SCOPE.enterprise.params;
export const SETTINGS_CATEGORIES = SETTINGS_BY_SCOPE.enterprise.categories;
