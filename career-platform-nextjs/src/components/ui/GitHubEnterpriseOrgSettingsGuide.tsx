'use client';

export default function GitHubEnterpriseOrgSettingsGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Organization の Settings</h2>
      <p className="text-gray-600 mb-8">
        Organization の <strong>Settings</strong> では、メンバー規則、認証、Actions、Packages、セキュリティ、監査に関わる組織全体のポリシーをまとめて設定します。Enterprise アカウント配下では、Enterprise 側のポリシーが優先される項目もあります。左のチャプターツリーから <strong>Repository</strong> / <strong>Codespaces</strong> / <strong>Planning</strong> / <strong>Copilot</strong> などのサブチャプターに進むと、設定画面の区分に沿って深掘りできます。
      </p>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">よく触るカテゴリ（例）</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>
            <strong>General</strong> — 組織名、プロフィール、リポジトリ既定の可視性など
          </li>
          <li>
            <strong>Member privileges</strong> — ベース権限、リポジトリ作成・フォークの許可範囲
          </li>
          <li>
            <strong>Authentication security</strong> — SAML、2FA 必須、IP 許可リスト（プランによる）
          </li>
          <li>
            <strong>Actions</strong> — ワークフロー利用、フォークからの実行、Runner など
          </li>
          <li>
            <strong>Secrets and variables</strong> — Organization 共通のシークレット
          </li>
          <li>
            <strong>Code security and analysis</strong> — Dependabot、Code scanning などの既定
          </li>
        </ul>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">運用上の注意</h3>
        <p className="text-gray-600">
          変更は Organization 内の<strong>すべてのリポジトリとメンバー</strong>に影響します。本番適用前に、影響範囲とロールバック手順（設定値の記録）を決めておくと安全です。
        </p>
      </section>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200 not-prose">
        <p className="text-sm text-blue-800 m-0">
          <strong>参考:</strong>{' '}
          <a
            href="https://docs.github.com/ja/organizations/managing-organization-settings"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:no-underline"
          >
            GitHub Docs — Organization 設定の管理
          </a>
        </p>
      </div>
    </article>
  );
}
