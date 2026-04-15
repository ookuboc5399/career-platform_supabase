'use client';

export default function GitHubReleasesGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">🏷️ リリースとタグ</h2>
      <p className="text-gray-600 mb-8">
        <strong>タグ</strong> は Git の参照（多くはセマンティックバージョン）で、<strong>Release</strong> はそのタグに人が読める説明や成果物（バイナリ・パッケージ）を付けた「配布の単位」です。利用者や CI がバージョンを固定しやすくなります。
      </p>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">手動リリースの流れ</h3>
        <ol className="list-decimal list-inside text-gray-600 space-y-2">
          <li>
            コミットにタグを付与（例: <code className="px-1.5 py-0.5 rounded bg-gray-100 font-mono text-sm">v1.2.0</code>）
          </li>
          <li>リポジトリの <strong>Releases</strong> から「Draft a new release」</li>
          <li>タグを選び、タイトル・本文（変更点・互換性・移行手順）を記載</li>
          <li>必要ならバイナリやチェックサムを Assets にアップロード</li>
          <li>公開（Publish）</li>
        </ol>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">自動生成リリースノート</h3>
        <p className="text-gray-600">
          GitHub はマージされた PR 一覧から <strong>リリースノートを自動生成</strong> できます。ラベルやタイトル規約を揃えるほど、読みやすいノートになります。
        </p>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">GitHub Actions との連携</h3>
        <p className="text-gray-600">
          タグ push（<code className="px-1.5 py-0.5 rounded bg-gray-100 font-mono text-sm">v*</code>）でワークフローを起動し、ビルド成果物を Release に添付するパターンがよく使われます。トークン権限（<code className="px-1.5 py-0.5 rounded bg-gray-100 font-mono text-sm">contents: write</code> 等）は最小限に。
        </p>
      </section>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>参考:</strong>{' '}
          <a
            href="https://docs.github.com/ja/repositories/releasing-projects-on-github"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:no-underline"
          >
            GitHub Docs — リリースの管理
          </a>
        </p>
      </div>
    </article>
  );
}
