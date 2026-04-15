'use client';

export default function GitHubModelsGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        🤖 GitHub Models とは？
      </h2>
      <p className="text-gray-600 mb-8">
        GitHub Models は、GitHub Copilot や GitHub の AI 機能で利用される機械学習モデルを指します。コード補完、チャット、コードレビュー支援など、開発者の生産性を高める AI 機能の基盤となっています。
      </p>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          ✨ 主な AI モデルと用途
        </h3>
        <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
          <li><strong>Copilot コード補完:</strong> コンテキストに応じたコードの自動補完・生成</li>
          <li><strong>Copilot Chat:</strong> コードの説明、リファクタリング提案、デバッグ支援</li>
          <li><strong>Copilot for Pull Requests:</strong> PR の説明文の自動生成、変更内容のサマリー</li>
          <li><strong>Copilot for CLI:</strong> コマンドの提案と説明</li>
        </ul>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          🔒 プライバシーとデータ利用
        </h3>
        <p className="text-gray-600 mb-4">
          GitHub Copilot は、コードのコンテキストをモデル推論に使用します。GitHub のプライバシー方針に従い、パブリックコードで学習したモデルを使用しますが、ユーザーのプライベートコードをモデル学習に使用しないオプション（GitHub Copilot for Business 等）も提供されています。
        </p>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          📦 API とデータモデル
        </h3>
        <p className="text-gray-600 mb-4">
          GitHub REST API や GraphQL API では、リポジトリ、Issue、PR、ユーザーなどの「データモデル」が JSON で返されます。これらは API のレスポンススキーマとして定義されており、アプリケーション開発時に型定義やドキュメントとして参照できます。
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          <li><strong>REST API:</strong> エンドポイントごとにレスポンスの構造がドキュメント化されている</li>
          <li><strong>GraphQL API:</strong> スキーマで型とフィールドが定義されている</li>
        </ul>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          🛠️ 活用のヒント
        </h3>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          <li>Copilot の提案品質を上げるには、関連ファイルを開いてコンテキストを増やす</li>
          <li>API 連携時は公式ドキュメントのスキーマを確認して型安全に実装</li>
          <li>Enterprise では Copilot の利用ポリシーを Organization で管理可能</li>
        </ul>
      </section>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>参考:</strong>{' '}
          <a href="https://docs.github.com/copilot" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">
            GitHub Docs - Copilot
          </a>
          、
          <a href="https://docs.github.com/rest" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">
            GitHub REST API
          </a>
        </p>
      </div>
    </article>
  );
}
