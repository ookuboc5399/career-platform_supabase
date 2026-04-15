'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function GitHubCliApiGuide() {
  const params = useParams();
  const lang = typeof params?.id === 'string' ? params.id : 'github';

  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        GitHub CLI と API と SDK の使い分け
      </h2>

      <div className="not-prose mb-8 rounded-lg border border-blue-200 bg-blue-50/90 p-4 text-sm text-gray-800 dark:border-blue-800 dark:bg-blue-950/40 dark:text-gray-100">
        <p className="m-0 leading-relaxed">
          REST の<strong>公式ドキュメントの読み方・カテゴリ別の地図</strong>は、シリーズ{' '}
          <Link
            href={`/programming/${lang}/chapters/github-rest-api`}
            className="font-semibold text-blue-700 underline dark:text-blue-300"
            scroll={false}
          >
            GitHub REST API（Enterprise Cloud）
          </Link>
          で整理しています（本チャプターは CLI / curl の実務入門に重点を置きます）。
        </p>
      </div>

      {/* 使い分けの概要 */}
      <section className="mb-10">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="p-4 rounded-lg border border-gray-200 bg-gray-50/50">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              GitHub CLI (gh コマンド)
            </h3>
            <p className="text-sm font-medium text-gray-600 mb-1">対象: 人間（開発者や管理者）</p>
            <p className="text-gray-600 text-sm">
              ターミナル（黒い画面）から、人間が手打ちで短いコマンドを実行するためのツール。PRの作成やActionsの確認など、日々の開発業務のショートカットに最適です。
            </p>
          </div>
          <div className="p-4 rounded-lg border border-gray-200 bg-gray-50/50">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              GitHub API (REST / GraphQL)
            </h3>
            <p className="text-sm font-medium text-gray-600 mb-1">対象: プログラム（スクリプトや別システム）</p>
            <p className="text-gray-600 text-sm">
              PythonやBashスクリプトから自動でデータを取得・更新するためのインターフェース。「全リポジトリの脆弱性アラートを週1回CSVに出力する」「社内ポータルからボタン1つで標準リポジトリを作成する」といった高度な自動化に不可欠です。
            </p>
          </div>
        </div>
      </section>

      {/* 1. GitHub CLI */}
      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          💻 1. GitHub CLI (gh) の利用手順
        </h3>
        <p className="text-gray-600 mb-6">
          ターミナルから直接GitHubを操作できる公式ツールです。
        </p>

        <h4 className="text-lg font-medium text-gray-800 mt-6 mb-2">
          準備: インストールと認証
        </h4>
        <p className="text-gray-600 mb-2 font-medium">インストール:</p>
        <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
          <li>macOS (Homebrew): <code className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-800 font-mono text-sm">brew install gh</code></li>
          <li>Windows (Winget): <code className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-800 font-mono text-sm">winget install --id GitHub.cli</code></li>
        </ul>

        <p className="text-gray-600 mb-2 font-medium">認証（ログイン）:</p>
        <p className="text-gray-600 mb-2">
          ターミナルを開き、以下のコマンドを入力します。
        </p>
        <div className="rounded-lg overflow-hidden border border-gray-200 bg-gray-900 my-4">
          <div className="px-4 py-2 bg-gray-800 border-b border-gray-700 text-xs font-medium text-gray-400">
            Bash
          </div>
          <pre className="p-4 overflow-x-auto text-sm text-gray-100 font-mono">
            <code>gh auth login</code>
          </pre>
        </div>
        <p className="text-gray-600 mb-4">
          画面の指示に従い、GitHub.com ＞ HTTPS ＞ Login with a web browser を選択するとブラウザが開き、ワンタイムコードを入力するだけで安全に認証が完了します。
        </p>

        <h4 className="text-lg font-medium text-gray-800 mt-6 mb-2">
          CLIでできること（よく使うコマンド例）
        </h4>
        <p className="text-gray-600 mb-4">
          日常のブラウザ操作の8割はCLIで完結できます。
        </p>

        <div className="space-y-4">
          <div>
            <p className="text-gray-600 mb-1 font-medium">リポジトリの新規作成とCloneを同時に行う:</p>
            <div className="rounded-lg overflow-hidden border border-gray-200 bg-gray-900">
              <pre className="p-4 overflow-x-auto text-sm text-gray-100 font-mono">
                <code>gh repo create my-new-project --private --clone</code>
              </pre>
            </div>
          </div>
          <div>
            <p className="text-gray-600 mb-1 font-medium">現在のリポジトリのPull Request一覧を見る:</p>
            <div className="rounded-lg overflow-hidden border border-gray-200 bg-gray-900">
              <pre className="p-4 overflow-x-auto text-sm text-gray-100 font-mono">
                <code>gh pr list</code>
              </pre>
            </div>
          </div>
          <div>
            <p className="text-gray-600 mb-1 font-medium">GitHub Actionsの実行状況を確認し、失敗したものを再実行する:</p>
            <div className="rounded-lg overflow-hidden border border-gray-200 bg-gray-900">
              <pre className="p-4 overflow-x-auto text-sm text-gray-100 font-mono">
                <code>{`gh run list
gh run watch [RUN-ID]  # リアルタイムでログを見る`}</code>
              </pre>
            </div>
          </div>
          <div>
            <p className="text-gray-600 mb-1 font-medium">（管理者向け）特定のシークレットをターミナルから登録する:</p>
            <div className="rounded-lg overflow-hidden border border-gray-200 bg-gray-900">
              <pre className="p-4 overflow-x-auto text-sm text-gray-100 font-mono">
                <code>gh secret set API_KEY --body &quot;my-secret-value&quot;</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* 2. GitHub API */}
      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          🔌 2. GitHub API (REST) の利用手順
        </h3>
        <p className="text-gray-600 mb-6">
          スクリプトや外部ツールからGitHubのデータを操作・抽出するための手順です。
        </p>

        <h4 className="text-lg font-medium text-gray-800 mt-6 mb-2">
          準備: アクセストークン (PAT) の発行
        </h4>
        <p className="text-gray-600 mb-4">
          APIを叩くには、パスワードの代わりに「トークン」と呼ばれる専用の鍵が必要です。
        </p>
        <ol className="list-decimal list-inside text-gray-600 space-y-2">
          <li>GitHub画面右上のプロフィールアイコンから <strong>Settings</strong> をクリックします。</li>
          <li>左側のサイドバーを一番下までスクロールし、<strong>Developer settings</strong> をクリックします。</li>
          <li>左側メニューから <strong>Personal access tokens</strong> ＞ <strong>Fine-grained tokens</strong> を選択します。</li>
          <li><strong>Generate new token</strong> をクリックし、以下の設定を行います。</li>
        </ol>
        <ul className="list-disc list-inside text-gray-600 mt-2 ml-4 space-y-1">
          <li><strong>Token name:</strong> （例：api-test-token）</li>
          <li><strong>Expiration:</strong> 有効期限（短めに設定するのがベストプラクティスです）</li>
          <li><strong>Repository access:</strong> 対象とするリポジトリを選択</li>
          <li><strong>Permissions:</strong> APIで操作したい権限（例：リポジトリの情報を読むだけなら Metadata: Read-only、コードを読むなら Contents: Read-only など）を選択します。</li>
        </ul>
        <p className="text-gray-600 mt-4">
          一番下の <strong>Generate token</strong> をクリックし、表示された文字列（<code className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-800 font-mono text-sm">github_pat_...</code>から始まるもの）を必ずコピーして安全な場所にメモします。（※この画面を閉じると二度と表示されません）
        </p>

        <h4 className="text-lg font-medium text-gray-800 mt-6 mb-2">
          APIでできること（curlコマンドを使った実行例）
        </h4>
        <p className="text-gray-600 mb-4">
          取得したトークンを使って、ターミナルからAPIを呼び出してみます。
        </p>

        <div className="space-y-4">
          <div>
            <p className="text-gray-600 mb-1 font-medium">特定のリポジトリの基本情報をJSONで取得する:</p>
            <div className="rounded-lg overflow-hidden border border-gray-200 bg-gray-900">
              <pre className="p-4 overflow-x-auto text-sm text-gray-100 font-mono whitespace-pre-wrap">
                <code>{`curl -H "Accept: application/vnd.github+json" \\
     -H "Authorization: Bearer 【ここにコピーしたトークンを貼る】" \\
     https://api.github.com/repos/[組織名]/[リポジトリ名]`}</code>
              </pre>
            </div>
          </div>
          <div>
            <p className="text-gray-600 mb-1 font-medium">（管理者向け）組織内のすべてのアクティブなDependabotアラート一覧を取得する:</p>
            <div className="rounded-lg overflow-hidden border border-gray-200 bg-gray-900">
              <pre className="p-4 overflow-x-auto text-sm text-gray-100 font-mono whitespace-pre-wrap">
                <code>{`curl -H "Accept: application/vnd.github+json" \\
     -H "Authorization: Bearer 【トークン】" \\
     https://api.github.com/orgs/[組織名]/dependabot/alerts`}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* 裏技: CLIからAPIを叩く */}
      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          💡 さらに便利な裏技: CLIからAPIを叩く
        </h3>
        <p className="text-gray-600 mb-4">
          実は、GitHub CLI (gh) はAPIのラッパー（包み紙）としても優秀です。トークン管理の面倒な curl コマンドを使わなくても、以下のように打つだけで自動的に認証付きでAPIを実行できます。
        </p>
        <div className="rounded-lg overflow-hidden border border-gray-200 bg-gray-900">
          <pre className="p-4 overflow-x-auto text-sm text-gray-100 font-mono">
            <code>gh api orgs/[組織名]/dependabot/alerts</code>
          </pre>
        </div>
      </section>
    </article>
  );
}
