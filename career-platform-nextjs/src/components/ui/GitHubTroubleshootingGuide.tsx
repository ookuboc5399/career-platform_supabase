'use client';

/** トラブルシューティング直下のテーマ別サブチャプター（学習ページでガイド表示に使用） */
export const GITHUB_TROUBLESHOOTING_SUB_CHAPTER_IDS = [
  'github-actions-ts-workflow-failure',
  'github-admin-ts-permission-denied',
  'github-cli-api-ts-git-clone-push',
  'github-enterprise-ts-entra-sso-logs',
] as const;

export function isGitHubTroubleshootingSubChapterId(id: string): boolean {
  return (GITHUB_TROUBLESHOOTING_SUB_CHAPTER_IDS as readonly string[]).includes(id);
}

interface TroubleshootingSection {
  title: string;
  symptom: string;
  causes: string[];
  solutions: string[];
}

const TROUBLESHOOTING_BY_CHAPTER: Record<string, TroubleshootingSection[]> = {
  'github-enterprise-troubleshooting': [
    {
      title: '認証エラー（SAML/OIDC）',
      symptom: 'ログインできない、セッションが切れる',
      causes: ['IdPの証明書期限切れ', 'メタデータの不一致', 'ネットワーク設定', 'Entra ID/Okta側の設定ミス'],
      solutions: [
        'IdPの証明書有効期限を確認し、必要に応じて更新',
        'GitHubのSAML/OIDC設定とIdPのメタデータを照合',
        'Management Consoleのログを確認してエラー内容を特定',
        'Entra ID: エンタープライズアプリの属性マッピングを確認',
        'Okta: Single sign-on URL と Audience が正しいか確認',
      ],
    },
    {
      title: '2FA でロックアウトした',
      symptom: '認証アプリを紛失し、ログインできない',
      causes: ['デバイス紛失', 'リカバリコードの未保管'],
      solutions: [
        'リカバリコードをダウンロードしていた場合、それでログイン',
        'Organization の Owner に連絡し、一時的に 2FA 強制を解除してもらう（推奨しない）',
        'GitHub サポートに問い合わせ',
      ],
    },
    {
      title: 'IP 制限でアクセスできない',
      symptom: 'Allowed IP を設定したらログインできなくなった',
      causes: ['自宅・モバイルのIPが許可リストに含まれていない', 'VPN の IP が変わった'],
      solutions: [
        'Settings > Security > IP allow list で許可する CIDR を追加',
        'リモートワーク用に VPN の出口 IP を確認し、許可リストに追加',
        '一時的に IP 制限を無効化して設定を確認',
      ],
    },
    {
      title: 'EMU ユーザーがプロビジョニングされない',
      symptom: 'IdP でユーザーを作成したが GitHub に反映されない',
      causes: ['SCIM の設定ミス', 'グループマッピングの誤り', 'IdP 側の同期遅延'],
      solutions: [
        'Enterprise の Identity provider 設定で SCIM が有効か確認',
        'IdP 側のプロビジョニングログでエラーを確認',
        'グループと Organization のマッピングを確認',
      ],
    },
    {
      title: '監査ログが記録されない',
      symptom: 'Audit logに期待するイベントが表示されない',
      causes: ['保持期間がinfiniteのまま', 'Gitイベントが無効', 'ストリーミング設定の誤り'],
      solutions: [
        '保持期間を90日以上に設定（infiniteだと一部機能が無効）',
        'Settings > Audit log で記録対象イベントを確認',
        'Log streamingの送信先・認証情報を確認',
      ],
    },
  ],
  'github-actions-troubleshooting': [
    {
      title: 'ビルドが失敗する',
      symptom: 'ワークフロー実行が失敗し、ジョブが赤くなる',
      causes: ['依存関係のインストール失敗', 'テストの失敗', '権限不足', 'シークレット未設定'],
      solutions: [
        'Actionsタブの失敗したジョブをクリックし、ログでエラー行を特定',
        'ローカルで同じコマンド（npm install, npm test等）を実行して再現',
        '必要なシークレットがSettings > Secretsに登録されているか確認',
        'permissions: で必要な権限（contents, pull-requests等）を付与',
      ],
    },
    {
      title: 'ワークフローがトリガーされない',
      symptom: 'pushやPRを作成してもActionsが動かない',
      causes: ['on: の設定ミス', 'ブランチ名の不一致', 'ワークフローファイルの構文エラー'],
      solutions: [
        '.github/workflows/*.yml の on: セクションでブランチ名を確認（main vs master）',
        'YAMLのインデント・構文を確認（オンラインLintツールを利用）',
        'リポジトリのActionsが無効になっていないかSettingsで確認',
      ],
    },
    {
      title: 'キャッシュやArtifactのエラー',
      symptom: 'Cache not found、Upload artifact failed',
      causes: ['キャッシュキーの不一致', 'ストレージ容量超過', '権限不足'],
      solutions: [
        'actions/cache の key が一意かつ再現可能か確認',
        'Artifactのサイズ制限（約500MB/ジョブ）を超えていないか確認',
        'actions/upload-artifact の permissions を確認',
      ],
    },
  ],
  'github-ghas-troubleshooting': [
    {
      title: 'Code Scanningでエラーが発生する',
      symptom: 'CodeQLやスキャンが失敗する',
      causes: ['サポート外の言語', 'ビルド失敗', 'メモリ不足', 'CodeQLのバージョン不整合'],
      solutions: [
        'Actionsログで「Error」や「Failed」を検索し、原因を特定',
        'codeql-analysis.yml で言語（language:）が正しいか確認',
        'ビルドステップが成功しているか確認（CodeQLはビルド成果物を解析）',
        'actions/codeql-action のバージョンを最新に更新',
      ],
    },
    {
      title: 'Dependabotアラートが表示されない',
      symptom: '脆弱性があるはずなのにアラートが出ない',
      causes: ['Dependabotが無効', 'マニフェストファイルが未検出', 'プライベートリポジトリでライセンス不足'],
      solutions: [
        'Settings > Code security and analysis で Dependabot alerts が有効か確認',
        'package.json, requirements.txt 等がリポジトリルートにあるか確認',
        'プライベートリポジトリの場合、GHASライセンスを確認',
      ],
    },
    {
      title: 'Secret Scanningで誤検知が多い',
      symptom: '実際はシークレットではないのにブロックされる',
      causes: ['テスト用のダミー値が本物のパターンに一致', 'サンプルコードの誤検知'],
      solutions: [
        'gitleaks.toml 等でカスタムパターンを調整',
        '該当ファイルを .gitleaksignore に追加（慎重に）',
        'Push protection を一時的に無効化し、後からアラートで対応する運用も検討',
      ],
    },
    {
      title: 'GHASが有効化できない',
      symptom: 'Enableボタンがグレーアウト、エラーが出る',
      causes: ['ライセンス不足', '権限不足', 'Organizationポリシーで制限'],
      solutions: [
        'OrganizationのOwner権限があるか確認',
        'GitHub Enterprise + GHASアドオンライセンスを確認',
        'OrganizationのポリシーでGHASが制限されていないか確認',
      ],
    },
  ],
  'github-pages-troubleshooting': [
    {
      title: 'サイトが表示されない・404になる',
      symptom: 'デプロイ完了と表示されているがアクセスできない',
      causes: ['index.htmlがルートにない', 'ブランチ/フォルダの設定ミス', 'デプロイの遅延'],
      solutions: [
        'Settings > Pages で Source のブランチとフォルダ（/root または /docs）を確認',
        'デプロイ完了後、数分〜10分待ってから再アクセス',
        'Actionsタブで Pages のワークフローが成功しているか確認',
      ],
    },
    {
      title: 'GitHub Actionsでビルドが失敗する',
      symptom: '静的サイトのビルド（npm run build等）が失敗',
      causes: ['Nodeのバージョン不一致', '依存関係のエラー', 'ビルドスクリプトのパス誤り'],
      solutions: [
        'actions/checkout の後に actions/setup-node で node-version を指定',
        'package.json の engines と合わせる',
        'npm ci を使用してロックファイルを厳密に適用',
      ],
    },
    {
      title: 'カスタムドメインが反映されない',
      symptom: 'CNAMEを設定したがドメインが繋がらない',
      causes: ['DNSの伝播待ち', '証明書の検証失敗', 'CNAMEレコードの誤り'],
      solutions: [
        'DNSの伝播に最大48時間かかることがある',
        'Settings > Pages の Custom domain で「Enforce HTTPS」を一時オフにして検証',
        'CNAMEが [org].github.io を指しているか確認',
      ],
    },
  ],
  'github-projects-troubleshooting': [
    {
      title: 'プロジェクトが表示されない',
      symptom: '作成したプロジェクトが一覧に出てこない',
      causes: ['リンクされていない', 'フィルタで除外', '権限不足'],
      solutions: [
        '「Link a project」で組織のプロジェクトをこのビューにリンク',
        '検索フィルタ（is:open 等）をクリアして確認',
        'Organizationのメンバーであり、プロジェクトへのアクセス権があるか確認',
      ],
    },
    {
      title: 'Issue/PRが追加できない',
      symptom: '# で検索しても候補が出ない',
      causes: ['リポジトリがプロジェクトに紐づいていない', '権限不足', 'クローズ済みのみ'],
      solutions: [
        'プロジェクトの「Add item」でリポジトリを選択できるか確認',
        'OrganizationのリポジトリへのRead権限があるか確認',
        'オープンなIssue/PRに限定されている場合、該当するものがあるか確認',
      ],
    },
  ],
  'github-copilot-troubleshooting': [
    {
      title: 'Copilotの提案が表示されない',
      symptom: 'コード補完やチャットが反応しない',
      causes: ['Copilotが無効', 'ネットワーク制限', 'ファイル形式が非対応', 'ライセンス期限'],
      solutions: [
        'VS Code / Cursor の Copilot 拡張が有効か確認',
        'プロキシやファイアウォールで GitHub への接続が許可されているか確認',
        'Organization で Copilot が有効化されているか確認',
        'ライセンス（Business/Enterprise）の有効期限を確認',
      ],
    },
    {
      title: '提案の品質が低い・不適切',
      symptom: '誤ったコードやセキュリティリスクのある提案が出る',
      causes: ['コンテキスト不足', 'プライベートコードの学習制限', 'プロンプトの曖昧さ'],
      solutions: [
        '関連するファイルを開いてコンテキストを増やす',
        'プロンプトを具体的に書き直す',
        '不要な提案は「Reject」して学習を改善',
      ],
    },
  ],
  'github-admin-troubleshooting': [
    {
      title: 'ポリシー適用でエラーが出る',
      symptom: 'ルールセットやブランチ保護の適用に失敗',
      causes: ['既存の設定との競合', '権限不足', 'ルールの論理矛盾'],
      solutions: [
        '既存のブランチ保護ルールを確認し、競合を解消',
        'Organization の Owner または Admin 権限があるか確認',
        'ルールセットの条件（target, include/exclude）を確認',
      ],
    },
    {
      title: 'ライセンス・シート数が不足',
      symptom: 'ユーザーを追加できない、GHAS を有効にできない',
      causes: ['購入シート数の超過', '未割り当てライセンス', '契約の更新漏れ'],
      solutions: [
        'GitHub Enterprise のライセンス管理画面で使用状況を確認',
        '未割り当てのシートがあればユーザーに割り当て',
        '必要に応じて営業に連絡してシート追加を依頼',
      ],
    },
  ],
  'github-cli-api-troubleshooting': [
    {
      title: 'gh auth login が失敗する',
      symptom: '認証エラー、ブラウザが開かない',
      causes: ['プロキシ環境', 'SSH vs HTTPSの選択ミス', 'トークンの権限不足'],
      solutions: [
        'HTTPSを選択し、Login with a web browser でワンタイムコード方式を試す',
        'gh auth status で現在の認証状態を確認',
        'gh auth logout 後に再度 gh auth login',
      ],
    },
    {
      title: 'API呼び出しで401/403が返る',
      symptom: 'curl やスクリプトでAPIを叩くと認証エラー',
      causes: ['トークンの有効期限切れ', '権限（scopes）不足', 'OrganizationのSSO未承認'],
      solutions: [
        'Settings > Developer settings > Personal access tokens でトークンを再発行',
        '必要な権限（repo, read:org, admin:org 等）にチェック',
        'OrganizationでSSOを有効にしている場合、トークンで「Configure SSO」を実行',
      ],
    },
    {
      title: 'レート制限（Rate limit）に達した',
      symptom: 'APIが403で「rate limit exceeded」',
      causes: ['未認証は60回/時、認証済みは5000回/時', '短時間に大量リクエスト'],
      solutions: [
        '認証付き（Bearer トークン）でリクエストして制限を緩和',
        '条件付きリクエスト（If-None-Match）でキャッシュを活用',
        '必要に応じて GitHub Enterprise でカスタムレート制限を検討',
      ],
    },
  ],

  /* --- トラブルシューティング直下のテーマ別サブチャプター --- */
  'github-actions-ts-workflow-failure': [
    {
      title: 'GitHub Actions ワークフロー失敗の切り分け',
      symptom: 'ワークフローまたはジョブが失敗し、赤い X になる',
      causes: [
        'ステップ内コマンドの終了コード非ゼロ（テスト失敗・ビルドエラー）',
        'シークレット・環境変数の未設定・誤字',
        'permissions: 不足（GITHUB_TOKEN で書き込みできない等）',
        'ランナーラベル不一致、セルフホストランナーのオフライン',
        'コンテナアクションの権限・マウント・ネットワーク制限',
      ],
      solutions: [
        'Actions タブで失敗ジョブを開き、該当ステップのログ末尾のエラー行を特定',
        '同じコマンドをローカルまたは act 等で再現して原因を絞る',
        'Settings > Secrets and variables で必要なシークレット名とスコープを確認',
        'ワークフローに permissions: を明示（contents: write, pull-requests: write 等）',
        'runs-on: と利用可能なランナー（ホステッド / セルフホスト）を照合',
        '失敗ジョブを Re-run failed jobs / Re-run all jobs で一時障害を切り分け',
      ],
    },
  ],
  'github-admin-ts-permission-denied': [
    {
      title: '権限・アクセス拒否エラー時',
      symptom: '403、Repository not found、HTTP 401、You must be a member 等',
      causes: [
        'Organization / Team のロール不足（read / write / admin）',
        'リポジトリの可視性・ベース権限の制限',
        'ブランチ保護ルール（必須レビュー、ステータスチェック）による push 拒否',
        'Fine-grained PAT のリポジトリ・アクション権限不足',
        'Org で SAML SSO 有効時、トークンの SSO 承認未実施',
        'IP allow list により許可されていないネットワークからのアクセス',
      ],
      solutions: [
        'Organization の People / Teams で対象ユーザーのロールとチーム所属を確認',
        'リポジトリ Settings > Collaborators と Organization の base permission を確認',
        '保護ブランチ設定と比較し、PR 経由・必須チェック充足が必要か判断',
        'PAT なら必要スコープと Fine-grained の Repository access / Permissions を見直し',
        'Settings > Developer settings > PAT で「Configure SSO」し Organization を承認',
        'Org / Enterprise の IP allow list とクライアントの出口 IP を照合',
      ],
    },
  ],
  'github-cli-api-ts-git-clone-push': [
    {
      title: 'Git 操作（Clone / Push）エラー',
      symptom: 'git clone / fetch / push が失敗する',
      causes: [
        'HTTPS: 認証情報の誤り、2FA 利用時にパスワードの代わりに PAT が必要',
        'SSH: 鍵未登録、ssh-agent 未起動、known_hosts・ポート 22 ブロック',
        'リポジトリ URL またはリモート名の誤り',
        'ブランチ保護により直接 push が禁止されている',
        'リポジトリ容量・LFS・大ファイルによる拒否',
      ],
      solutions: [
        'HTTPS なら PAT を使用し、git credential や OS キーチェーンをクリアして再ログイン',
        'SSH なら ssh -T git@github.com で接続確認、公開鍵を GitHub に登録',
        'git remote -v と clone URL（HTTPS/SSH）が意図どおりか確認',
        'push が拒否される場合はブランチ保護を確認し、別ブランチ＋PR に切り替え',
        'Git LFS の有無、.gitignore と大ファイルコミット履歴を確認',
      ],
    },
  ],
  'github-enterprise-ts-entra-sso-logs': [
    {
      title: 'SSO ログインエラー時の Entra ID ログ確認・原因特定',
      symptom: 'GitHub Enterprise への SAML/OIDC ログインが失敗する、または特定ユーザーのみ失敗',
      causes: [
        'Entra ID 側でサインインがブロック（条件付きアクセス、MFA、デバイス準拠）',
        'アプリの SAML 証明書期限切れ、Reply URL / Entity ID の不一致',
        '属性マッピング（NameID、メール）と GitHub 側要求の不一致',
        'ユーザーが GitHub にプロビジョニングされていない、ライセンス不足',
      ],
      solutions: [
        'Microsoft Entra 管理センター > サインインログ で該当ユーザーをフィルタし、失敗理由コードを確認',
        '監査ログでアプリケーションへの割り当て・プロビジョニングイベントを確認',
        'エンタープライズアプリケーション > GitHub の SSO 設定と GitHub Management Console の SAML を突き合わせ',
        'テスト用に別ブラウザ・プライベートウィンドウで再試行しキャッシュ・Cookie を排除',
        'GitHub の監査ログ（可能なら）と Entra の相関時刻で同一リクエストか照合',
        '証明書ローテーション後は IdP メタデータの再アップロードが必要か確認',
      ],
    },
  ],
};

// GitHub Copilot, GitHub Admin 用の汎用トラブルシューティング
const DEFAULT_TROUBLESHOOTING: TroubleshootingSection[] = [
  {
    title: '一般的なエラーの確認手順',
    symptom: '想定外のエラーが発生した',
    causes: ['設定ミス', '権限不足', 'ネットワーク・サービス障害'],
    solutions: [
      'GitHub Status (https://www.githubstatus.com/) で障害情報を確認',
      'エラーメッセージをそのまま検索し、公式ドキュメントやGitHub Communityを参照',
      'Organization/リポジトリの権限設定を確認',
      '必要に応じてサポートに問い合わせ',
    ],
  },
];

function TroubleshootingCard({ section }: { section: TroubleshootingSection }) {
  return (
    <div className="p-4 rounded-lg border border-gray-200 bg-white mb-6">
      <h4 className="text-lg font-semibold text-gray-900 mb-2">{section.title}</h4>
      <p className="text-gray-600 mb-2">
        <strong>症状:</strong> {section.symptom}
      </p>
      <div className="mb-2">
        <p className="text-sm font-medium text-gray-700 mb-1">考えられる原因:</p>
        <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
          {section.causes.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-700 mb-1">対処法:</p>
        <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
          {section.solutions.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function GitHubTroubleshootingGuide({
  chapterId,
}: {
  chapterId: string;
}) {
  const sections =
    TROUBLESHOOTING_BY_CHAPTER[chapterId] || DEFAULT_TROUBLESHOOTING;

  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        🔧 トラブルシューティング
      </h2>
      <p className="text-gray-600 mb-8">
        よくあるエラーとその対処法をまとめています。問題が発生した際は、症状に近い項目を参照してください。
      </p>

      {sections.map((section, i) => (
        <TroubleshootingCard key={i} section={section} />
      ))}

      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>参考:</strong>{' '}
          <a
            href="https://docs.github.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:no-underline"
          >
            GitHub 公式ドキュメント
          </a>
          、
          <a
            href="https://github.community/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:no-underline"
          >
            GitHub Community
          </a>
        </p>
      </div>
    </article>
  );
}
