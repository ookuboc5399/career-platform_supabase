'use client';

import type { ReactNode } from 'react';

function DocLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 underline dark:text-blue-400"
    >
      {children}
    </a>
  );
}

/** GitHub Enterprise Server（GHES）の概要・GHEC との違い・運用上の要点 */
export default function GitHubEnterpriseServerGuide() {
  return (
    <article className="prose prose-gray max-w-none dark:prose-invert">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">GitHub Enterprise Server（GHES）</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm leading-relaxed not-prose rounded-lg border border-gray-200 bg-gray-50/80 p-4 dark:border-gray-600 dark:bg-gray-900/40">
        本チャプターは学習一覧で <strong>GitHub Enterprise Cloud（GHEC）</strong>用の「<strong>GitHub Enterprise</strong>」セクションとは<strong>別のトップレベル</strong>にあります。クラウド上の Enterprise アカウント（github.com）の話題はそちらのチャプターを参照してください。
      </p>
      <p className="text-gray-600 dark:text-gray-300 mb-8 text-sm leading-relaxed not-prose">
        <strong>GitHub Enterprise Server（GHES）</strong>は、自社ネットワークや指定クラウド上に GitHub を<strong>オンプレミス／セルフホスト</strong>で運用する製品です。
        <strong>GitHub Enterprise Cloud（GHEC）</strong>が github.com 上の Enterprise アカウントであるのに対し、GHES は通常{' '}
        <strong>独自のホスト名</strong>（例: <code className="rounded bg-gray-100 px-1 font-mono text-xs dark:bg-gray-800 dark:text-gray-100">github.company.example</code>
        ）で提供され、<strong>アップグレード・バックアップ・可用性</strong>を利用者（またはマネージド提供事業者）側で管理します。
      </p>

      <section className="mb-10 not-prose">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">GHEC と GHES の整理</h3>
        <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
          <table className="min-w-full text-sm text-left text-gray-700 dark:text-gray-300">
            <thead className="bg-gray-50 dark:bg-gray-800/90 font-medium text-gray-900 dark:text-gray-100">
              <tr>
                <th className="px-3 py-2 border-b border-gray-200 dark:border-gray-600">観点</th>
                <th className="px-3 py-2 border-b border-gray-200 dark:border-gray-600">GHEC（クラウド）</th>
                <th className="px-3 py-2 border-b border-gray-200 dark:border-gray-600">GHES（サーバー）</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              <tr>
                <td className="px-3 py-2 font-medium">ホスティング</td>
                <td className="px-3 py-2">GitHub 運用のマルチテナント基盤</td>
                <td className="px-3 py-2">顧客環境へのインストール（VM / K8s 等）</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-medium">URL・認証</td>
                <td className="px-3 py-2">github.com / Enterprise アカウント・IdP 連携</td>
                <td className="px-3 py-2">自社 FQDN・SAML/LDAP 等はインスタンス単位で設計</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-medium">アップデート</td>
                <td className="px-3 py-2">GitHub 側のリリースサイクルに追随</td>
                <td className="px-3 py-2">管理者がホットパッチ／マイナー／メジャーを計画適用</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-medium">GitHub Connect</td>
                <td className="px-3 py-2">GHES との公式連携の「クラウド側」</td>
                <td className="px-3 py-2">インスタンスと GitHub.com を接続する仕組み（設定は GHES 管理）</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-10 not-prose">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">管理者が押さえるとよい領域</h3>
        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 text-sm space-y-2">
          <li>
            <strong>リリースノートとアップグレード経路:</strong> 機能フラグ・破壊的変更・必須の移行手順はバージョンごとに確認する
          </li>
          <li>
            <strong>高可用性・バックアップ・DR:</strong> 要件に応じたトポロジとリストア検証
          </li>
          <li>
            <strong>Actions / Packages:</strong> ランナー、外部ストレージ、ネットワーク出口ポリシー
          </li>
          <li>
            <strong>セキュリティ:</strong> TLS、ファイアウォール、監査ログ、ユーザー・管理者の認証方式
          </li>
          <li>
            <strong>ライセンス・利用規約:</strong> ユーザーライセンスとサーバーライセンスの整理（契約に従う）
          </li>
        </ul>
      </section>

      <section className="mb-8 not-prose rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/35 dark:text-amber-100">
        <strong>本コースとの対応:</strong> 「GitHub Enterprise」配下の多くのチャプターは <strong>GHEC</strong>（github.com 上の Enterprise）の画面を基準にしています。GHES
        ではメニュー名・有無が異なる項目があるため、手元のバージョンの公式ドキュメントと併読してください。
      </section>

      <section className="mb-6 not-prose">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">公式ドキュメント（GHES）</h3>
        <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 space-y-2">
          <li>
            <DocLink href="https://docs.github.com/en/enterprise-server@latest/admin/overview/about-github-enterprise-server">
              About GitHub Enterprise Server
            </DocLink>
          </li>
          <li>
            <DocLink href="https://docs.github.com/en/enterprise-server@latest/admin/overview/github-enterprise-release-improvements">
              GitHub Enterprise Server releases and upgrade improvements
            </DocLink>
          </li>
          <li>
            <DocLink href="https://docs.github.com/en/enterprise-server@latest/admin/configuration/configuring-github-connect/about-github-connect">
              About GitHub Connect（GHES）
            </DocLink>
          </li>
        </ul>
      </section>
    </article>
  );
}
