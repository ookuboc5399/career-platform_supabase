'use client';

export default function GitHubSecurityGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        🔐 GitHub Security とは？
      </h2>
      <p className="text-gray-600 mb-8">
        GitHub Security は、リポジトリのセキュリティ状況を一元的に把握・管理するための機能です。Security タブから、脆弱性アラート、コードスキャン、シークレット検出、依存関係の更新などを確認・対応できます。
      </p>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          🛡️ Security タブの構成
        </h3>
        <p className="text-gray-600 mb-4">
          リポジトリの <strong>Security</strong> タブでは、以下の機能にアクセスできます。
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
          <li><strong>Security overview:</strong> アラートのサマリー、推奨アクションの一覧</li>
          <li><strong>Dependabot alerts:</strong> 依存関係の既知の脆弱性の通知（要 GHAS または public リポジトリ）</li>
          <li><strong>Code scanning:</strong> CodeQL 等による静的解析結果（要 GHAS）</li>
          <li><strong>Secret scanning:</strong> コミットに含まれるシークレットの検出（要 GHAS）</li>
          <li><strong>Security policy:</strong> SECURITY.md による脆弱性報告の受け付け方針</li>
        </ul>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          📋 SECURITY.md の設定
        </h3>
        <p className="text-gray-600 mb-4">
          リポジトリルートに <code className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-800 font-mono text-sm">SECURITY.md</code> を置くと、脆弱性を発見した人がどのように報告すべきかが分かります。GitHub の Security タブに「Report a vulnerability」リンクが表示されます。
        </p>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          🔗 GitHub Advanced Security（GHAS）との関係
        </h3>
        <p className="text-gray-600 mb-4">
          Code scanning、Secret scanning、Dependabot の詳細機能は GitHub Advanced Security のライセンスが必要です。パブリックリポジトリでは Dependabot alerts と Dependabot security updates が無料で利用できます。
        </p>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          ⚙️ 推奨設定
        </h3>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          <li>Settings &gt; Code security and analysis で Dependabot alerts を有効化</li>
          <li>SECURITY.md を用意して脆弱性報告の窓口を明示</li>
          <li>GHAS 利用時は Code scanning と Secret scanning をワークフローで設定</li>
        </ul>
      </section>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>参考:</strong>{' '}
          <a href="https://docs.github.com/code-security" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">
            GitHub Docs - Code security
          </a>
        </p>
      </div>
    </article>
  );
}
