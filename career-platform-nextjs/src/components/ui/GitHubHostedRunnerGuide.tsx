'use client';

export default function GitHubHostedRunnerGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        ☁️ ホステッドランナー
      </h2>
      <p className="text-gray-600 mb-8">
        GitHub が管理するランナー環境で、Actions のワークフローを実行するためのデフォルト環境です。設定不要で簡単に利用できます。
      </p>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          概要
        </h3>
        <p className="text-gray-600 mb-4">
          GitHub が提供するランナー環境。設定不要で簡単に利用可能です。
        </p>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          環境
        </h3>
        <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
          <li><strong>OS:</strong> Ubuntu, Windows, macOS</li>
          <li><strong>制限:</strong> ランナーのリソースおよび実行時間に制限あり</li>
        </ul>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          適用ケース
        </h3>
        <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
          <li>短時間のビルド・テストジョブ</li>
          <li>環境構築の手間を省きたい場合</li>
        </ul>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          利用料金
        </h3>
        <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
          <li><strong>無料枠:</strong> 月に 50,000 分の実行時間が無料</li>
          <li>GitHub Enterprise のデフォルト設定では、無料枠を超えたホステッドランナーの利用を制限している場合があります</li>
          <li>セルフホステッドランナーを利用する場合、GitHub Actions 実行に関する GitHub 側の料金は発生しません</li>
        </ul>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          ワークフローでの指定例
        </h3>
        <p className="text-gray-600 mb-4">
          ホステッドランナーを使用する場合は、<code className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-800 font-mono text-sm">runs-on</code> に以下を指定します。
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          <li><code className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-800 font-mono text-sm">ubuntu-latest</code> — 最新の Ubuntu 環境</li>
          <li><code className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-800 font-mono text-sm">windows-latest</code> — 最新の Windows Server 環境</li>
          <li><code className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-800 font-mono text-sm">macos-latest</code> — 最新の macOS 環境</li>
        </ul>
      </section>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>参考:</strong>{' '}
          <a href="https://docs.github.com/ja/actions/using-github-hosted-runners" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">
            GitHub Docs - GitHub ホストランナーを使用する
          </a>
        </p>
      </div>
    </article>
  );
}
