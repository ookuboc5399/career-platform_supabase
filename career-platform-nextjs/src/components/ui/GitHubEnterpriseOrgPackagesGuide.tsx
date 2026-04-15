'use client';

export default function GitHubEnterpriseOrgPackagesGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Organization の Packages</h2>
      <p className="text-gray-600 mb-8">
        <strong>GitHub Packages</strong> は、npm、Maven、Docker などのレジストリを GitHub 上でホストする機能です。Organization では<strong>誰がどのスコープを publish / pull できるか</strong>をポリシーとロールで揃えます。
      </p>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">押さえるポイント</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>パッケージの可視性（公開 / プライベート）とリポジトリの関係</li>
          <li>CI（GitHub Actions）からの publish には <code className="text-sm bg-gray-100 px-1 rounded">GITHUB_TOKEN</code> や OIDC の権限設計</li>
          <li>Organization の <strong>Packages</strong> 設定でリンクされたリポジトリや削除ポリシーを確認する</li>
        </ul>
      </section>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200 not-prose">
        <p className="text-sm text-blue-800 m-0">
          <strong>参考:</strong>{' '}
          <a
            href="https://docs.github.com/ja/packages/learn-github-packages/introduction-to-github-packages"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:no-underline"
          >
            GitHub Docs — GitHub Packages の概要
          </a>
        </p>
      </div>
    </article>
  );
}
