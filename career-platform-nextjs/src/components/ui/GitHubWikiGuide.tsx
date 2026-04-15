'use client';

export default function GitHubWikiGuide() {
  return (
    <article className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        📚 GitHub Wiki とは？
      </h2>
      <p className="text-gray-600 mb-8">
        GitHub Wiki は、リポジトリに紐づいたドキュメントを Markdown で作成・編集できる機能です。README では収まりきらない設計書、運用マニュアル、用語集などをチームで共同編集できます。
      </p>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          ✨ 主な機能とメリット
        </h3>
        <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
          <li><strong>Markdown 対応:</strong> 見出し、リスト、コードブロック、画像などを記述可能</li>
          <li><strong>Git ベース:</strong> 編集履歴がコミットとして残り、差分・ロールバックが可能</li>
          <li><strong>サイドバー:</strong> 目次やナビゲーションをカスタマイズ可能</li>
          <li><strong>共同編集:</strong> 複数メンバーが同時に編集し、PR でレビューも可能</li>
        </ul>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          🚀 Wiki の有効化と作成
        </h3>
        <h4 className="text-lg font-medium text-gray-800 mt-6 mb-2">手順</h4>
        <ol className="list-decimal list-inside text-gray-600 space-y-2">
          <li>リポジトリの <strong>Settings</strong> を開く</li>
          <li>左サイドバーの <strong>Features</strong> で <strong>Wikis</strong> にチェックを入れる</li>
          <li>リポジトリトップの <strong>Wiki</strong> タブをクリック</li>
          <li>「Create the first page」で最初のページを作成（例: Home）</li>
        </ol>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          📝 ページの編集とリンク
        </h3>
        <p className="text-gray-600 mb-4">
          各ページは <code className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-800 font-mono text-sm">[[ページ名]]</code> で相互リンクできます。サイドバー用の <code className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-800 font-mono text-sm">_Sidebar.md</code> を編集すると、左側に目次を表示できます。
        </p>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          ⚠️ 注意点
        </h3>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          <li>Wiki はデフォルトでパブリックリポジトリでは誰でも編集可能。プライベートリポジトリでは Write 権限が必要</li>
          <li>大きなファイルやバイナリは Git LFS を検討。画像は外部 URL も利用可能</li>
          <li>複雑なドキュメントは GitHub Pages や外部 Wiki ツール（Notion 等）の方が向く場合もある</li>
        </ul>
      </section>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>参考:</strong>{' '}
          <a href="https://docs.github.com/communities/documenting-your-project-with-wikis" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">
            GitHub Docs - Documenting your project with wikis
          </a>
        </p>
      </div>
    </article>
  );
}
