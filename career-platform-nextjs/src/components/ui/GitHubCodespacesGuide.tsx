'use client';

export default function GitHubCodespacesGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">☁️ GitHub Codespaces とは？</h2>
      <p className="text-gray-600 mb-8">
        Codespaces は、リポジトリ用に用意された <strong>クラウド上の開発コンテナ</strong> です。ブラウザの VS Code、またはローカルの VS Code / JetBrains から接続し、すぐにビルド・デバッグできます。オンボーディングや「環境依存のトラブル削減」に向きます。
      </p>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">主な特徴</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>リポジトリごとに CPU・メモリ・ストレージのスペックを選べる（プランによる）</li>
          <li>
            <code className="px-1.5 py-0.5 rounded bg-gray-100 font-mono text-sm">devcontainer.json</code>{' '}
            で拡張機能・ポート・起動コマンドをチームで共有可能
          </li>
          <li>プライベートリポジトリでは権限に応じて利用可否が決まる</li>
        </ul>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">始め方（概要）</h3>
        <ol className="list-decimal list-inside text-gray-600 space-y-2">
          <li>リポジトリの <strong>Code</strong> ボタン → <strong>Codespaces</strong> タブ → 新規作成</li>
          <li>初回はイメージのビルドに時間がかかることがある</li>
          <li>終了すると計算リソースは解放され、次回は再開または新規作成</li>
        </ol>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Organization での運用</h3>
        <p className="text-gray-600">
          利用ポリシー・スペック上限・シークレットの扱いは Organization / Enterprise の設定で制御できます。コスト意識が高いチームでは、使うリポジトリだけ有効化するなどのガバナンスが一般的です。
        </p>
      </section>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>参考:</strong>{' '}
          <a
            href="https://docs.github.com/ja/codespaces"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:no-underline"
          >
            GitHub Docs — Codespaces
          </a>
        </p>
      </div>
    </article>
  );
}
